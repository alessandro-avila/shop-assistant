# 0001. Order Number Format: Sequential Date-Based

Date: 2026-01-28

## Status

Accepted

## Context and Problem Statement

The shop assistant application needs a consistent, traceable order numbering system that is:
- Human-readable
- Sortable by date
- Unique across all orders
- Easy to reference for customer support
- Thread-safe for concurrent order creation

The original implementation used random 5-digit numbers with collision detection (`ORD-YYYY-XXXXX`), which:
- Required retry logic for uniqueness
- Was difficult to troubleshoot (random numbers)
- Had no clear relationship to order creation date
- Could hit performance issues with high order volumes

## Decision Drivers

* Customer support needs to quickly identify orders by date
* Business analytics require easy date-based filtering
* System performance must handle concurrent order creation
* Order numbers should be predictable and sequential
* Implementation should be simple and maintainable

## Considered Options

### Option 1: Keep Random Number Format (ORD-YYYY-XXXXX)
**Description:** Continue using current implementation with random 5-digit numbers

**Pros:**
- No change required
- Already implemented and working
- Truly random, hard to guess

**Cons:**
- Requires retry logic and collision detection
- No date visibility in order number
- Difficult for customer support to locate orders
- Performance concerns with database lookups on collisions
- Not sortable by date without separate column

### Option 2: GUID/UUID Based (ORD-{GUID})
**Description:** Use globally unique identifiers for order numbers

**Pros:**
- Guaranteed uniqueness
- No collision detection needed
- Industry standard approach

**Cons:**
- Very long order numbers (not human-friendly)
- Not sortable
- Difficult for customers to remember/reference
- No date visibility
- Overkill for single-database application

### Option 3: Sequential Date-Based (ORD-YYYYMMDD-###) **[CHOSEN]**
**Description:** Use date-based prefix with daily sequential numbering

**Pros:**
- ✅ Human-readable and easy to remember
- ✅ Sortable by date (lexicographical sort works)
- ✅ No collision detection retry logic needed
- ✅ Date visible in order number for customer support
- ✅ Efficient database query using LIKE pattern
- ✅ Simple to implement and maintain
- ✅ Automatically resets sequence daily (natural partitioning)
- ✅ Thread-safe through database transaction isolation

**Cons:**
- Sequential numbers could reveal daily order volume
- Potential for gaps if orders fail after number generation
- Sequence counter could exceed 999 on high-volume days

## Decision Outcome

Chosen option: **Option 3 - Sequential Date-Based (ORD-YYYYMMDD-###)**, because:

1. **Traceability**: Date is immediately visible in order number, making customer support queries faster
2. **Performance**: Single database query with index-backed LIKE pattern is faster than collision detection loops
3. **Simplicity**: No retry logic needed, cleaner codebase
4. **Scalability**: Can handle 999+ orders per day (expands to 4+ digits automatically)
5. **Predictability**: Sequential numbering aligns with business operations (daily batches, reporting)

### Implementation Details

**Format:** `ORD-YYYYMMDD-###`
- **ORD**: Fixed prefix
- **YYYYMMDD**: UTC date (e.g., 20260128 for January 28, 2026)
- **###**: Daily sequential number, 3-digit zero-padded (001-999), expands as needed

**Algorithm:**
1. Get current UTC date formatted as `yyyyMMdd`
2. Query database for max order number matching `ORD-{date}-%` pattern
3. Extract sequence number from result, default to 0 if no orders today
4. Increment sequence by 1
5. Format as `ORD-{date}-{sequence:D3}`
6. Database transaction isolation prevents duplicate sequences

**Database Support:**
- Uses existing unique index on `OrderNumber` column
- LIKE pattern query is efficient with index
- EF Core `EF.Functions.Like()` generates optimal SQL

### Consequences

**Positive:**
* ✅ Faster order creation (no retry loops)
* ✅ Better customer support experience (date in order number)
* ✅ Easier business analytics and reporting
* ✅ More maintainable code (simpler logic)
* ✅ Natural daily partitioning for archival/reporting

**Negative:**
* ⚠️ Daily order volume is somewhat visible (could be mitigated with random starting offset if needed)
* ⚠️ Sequence numbers have small gaps if orders fail after generation (acceptable trade-off)
* ⚠️ Requires logging/monitoring when sequence exceeds 999 (rare edge case)

### Mitigation Strategies

1. **High Volume Days**: Sequence automatically expands beyond 3 digits (1000, 1001, etc.) with warning logged
2. **Sequence Gaps**: Acceptable - maintaining perfect sequential numbering would require complex locking
3. **Date Rollover**: Handled automatically - new date = new sequence starting at 001
4. **Invalid Formats**: Code gracefully handles corrupted order numbers in database

## Code Changes

**File Modified:** `backend/Controllers/OrdersController.cs`

**Method:** `GenerateUniqueOrderNumberAsync()`

**Key Changes:**
- Removed random number generation and retry loop
- Added date-based pattern matching with LIKE query
- Added sequence extraction and increment logic
- Added warning logging for sequences > 999
- Improved error handling with better context

**Database:** No schema changes required - existing unique index on `OrderNumber` supports new format

## Testing Strategy

**Unit Tests Required:**
- First order of day generates 001
- Sequential orders increment correctly (001, 002, 003, etc.)
- Date rollover resets sequence to 001
- Sequence > 999 generates 4-digit numbers with warning
- Invalid order number formats handled gracefully
- Concurrent order creation generates unique sequential numbers

**Integration Tests Required:**
- Transaction rollback doesn't consume sequence number
- Database index performance with 10,000+ orders
- Concurrent order creation (10+ simultaneous requests)

**Manual Testing:**
- Create 5 orders in sequence, verify format
- Check logs for proper sequence generation
- Verify order numbers sortable by date

## Monitoring and Alerts

**Metrics to Track:**
- Daily max sequence number (alert if > 900)
- Order number generation time (p95 < 100ms)
- Database query performance on order number LIKE queries

**Logging:**
- Debug: Generated order number with sequence
- Warning: Sequence exceeds 999
- Error: Database query failures with correlation ID

## Rollback Plan

If issues arise:
1. Revert code changes to `GenerateUniqueOrderNumberAsync()`
2. New orders will use old format (`ORD-YYYY-XXXXX`)
3. Existing new-format orders remain unchanged (both formats coexist)
4. No data migration required

## References

- Task Specification: `specs/tasks/001-task-backend-order-number-generation.md`
- Feature Requirements: `specs/features/order-confirmation.md`
- Code: `backend/Controllers/OrdersController.cs` (lines 295-354)

## Future Enhancements

- Add random offset to starting sequence (e.g., start at 100 instead of 001) to obscure daily volume
- Implement database sequence for even better performance
- Consider multi-region deployment strategy (prefix with region code: `ORD-US-YYYYMMDD-###`)
- Add order number format validation to prevent corrupted entries

---

**Decision Made By:** Development Agent  
**Approved By:** [Pending Review]  
**Implementation Date:** 2026-01-28
