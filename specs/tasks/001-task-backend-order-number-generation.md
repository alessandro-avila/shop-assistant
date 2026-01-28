# Task 001: Backend Order Number Generation Enhancement

**Task ID:** TASK-001  
**Feature:** FEAT-ORDER-001 (Order Confirmation)  
**Priority:** High  
**Complexity:** Low  
**Estimated Effort:** 2-3 hours

---

## Description

Enhance the existing order number generation logic to follow the format `ORD-YYYYMMDD-###` with daily sequential numbering instead of the current `ORD-YYYY-XXXXX` random format. This provides better traceability and eliminates the need for collision detection retries.

---

## Dependencies

**Prerequisite Tasks:** None (can start immediately)

**Blocks:**
- TASK-003 (Backend Order Retrieval API enhancement)
- TASK-007 (Frontend Order Confirmation Page)

---

## Technical Requirements

### Current Implementation
- Location: `backend/Controllers/OrdersController.cs`
- Method: `GenerateUniqueOrderNumberAsync()`
- Format: `ORD-YYYY-XXXXX` (random 5-digit number with collision detection)

### Required Changes

1. **New Format Specification**
   - Pattern: `ORD-YYYYMMDD-###`
   - Example: `ORD-20260128-001` (first order on January 28, 2026)
   - Daily counter: 3-digit zero-padded sequential number (001-999)
   - Counter resets at midnight UTC

2. **Database Query Pattern**
   ```
   SELECT MAX(OrderNumber) 
   FROM Orders 
   WHERE OrderNumber LIKE 'ORD-{YYYYMMDD}-%'
   ```
   - Extract the sequence number from the max order number for today
   - Increment by 1
   - Format as 3-digit zero-padded string

3. **Edge Cases to Handle**
   - No orders today: Start sequence at 001
   - Concurrent order creation: Use database transaction isolation to prevent duplicates
   - More than 999 orders in a day: Log warning and use 4+ digits
   - Date rollover: Automatically reset sequence for new date

4. **Algorithm Outline**
   - Get current UTC date as `YYYYMMDD`
   - Query for max order number matching `ORD-{YYYYMMDD}-%` pattern
   - If no match, sequence = 1
   - Else, extract sequence from order number, increment by 1
   - Generate: `$"ORD-{date:yyyyMMdd}-{sequence:D3}"`
   - Insert order within transaction to prevent race conditions

5. **Performance Considerations**
   - Add database index on `OrderNumber` column (if not exists)
   - Query should complete in < 50ms
   - Consider using database sequence or IDENTITY column for future scalability

---

## Acceptance Criteria

### Functional Requirements
- ✅ Order numbers follow format `ORD-YYYYMMDD-###`
- ✅ First order of the day receives sequence number 001
- ✅ Subsequent orders increment sequence correctly (002, 003, etc.)
- ✅ Sequence resets at midnight UTC for new day
- ✅ Order numbers are unique across all orders
- ✅ No collision detection retries needed (sequential generation)
- ✅ Concurrent order creation handled safely (no duplicate sequences)

### Non-Functional Requirements
- ✅ Order number generation completes in < 100ms
- ✅ Thread-safe implementation (safe for concurrent requests)
- ✅ Logging includes order number and sequence for troubleshooting
- ✅ Error handling for edge cases (999+ orders, invalid patterns)

### Code Quality
- ✅ Method remains private in `OrdersController`
- ✅ Clear XML documentation comments
- ✅ Proper error logging with correlation IDs
- ✅ Follow existing code style and conventions

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: First Order of the Day**
   - Given: No orders exist for today
   - When: Generate order number
   - Then: Returns `ORD-{today}-001`

2. **Test: Sequential Orders**
   - Given: Order `ORD-20260128-001` exists
   - When: Generate next order number
   - Then: Returns `ORD-20260128-002`

3. **Test: Date Rollover**
   - Given: Order `ORD-20260128-999` exists (previous day)
   - When: Generate order number for new day (2026-01-29)
   - Then: Returns `ORD-20260129-001`

4. **Test: Large Sequence Numbers**
   - Given: Order `ORD-20260128-999` exists
   - When: Generate next order number
   - Then: Returns `ORD-20260128-1000` (4 digits, warning logged)

5. **Test: Invalid Order Number Pattern**
   - Given: Corrupted order number `ORD-BAD-FORMAT` in database
   - When: Generate order number
   - Then: Skips invalid order, generates correct sequence

### Integration Tests (Required)

1. **Test: Concurrent Order Creation**
   - Given: Multiple simultaneous order requests
   - When: Creating 10 orders concurrently
   - Then: All order numbers unique, no duplicates, all sequential

2. **Test: Transaction Rollback**
   - Given: Order creation fails after number generation
   - When: Transaction rolls back
   - Then: Order number not consumed, next order uses expected sequence

3. **Test: Database Index Performance**
   - Given: 10,000+ orders in database
   - When: Generate order number
   - Then: Completes in < 100ms

### Manual Testing Scenarios

1. Create 5 orders in sequence, verify:
   - `ORD-20260128-001`
   - `ORD-20260128-002`
   - `ORD-20260128-003`
   - `ORD-20260128-004`
   - `ORD-20260128-005`

2. Change system date to next day, create order, verify:
   - `ORD-20260129-001` (sequence reset)

3. Check database `Orders` table for index on `OrderNumber`

---

## Database Considerations

### Index Requirements
- Ensure index exists on `Orders.OrderNumber` column
- Index type: Non-clustered (covers WHERE and MAX operations)
- Creation script:
  ```sql
  CREATE NONCLUSTERED INDEX IX_Orders_OrderNumber 
  ON Orders(OrderNumber);
  ```
- Add via Entity Framework migration if not exists

### Migration (Optional)
- Not required unless creating index
- No schema changes to `Order` model
- No data migration needed (existing orders unaffected)

---

## Implementation Notes

### Files to Modify
- `backend/Controllers/OrdersController.cs`
  - Method: `GenerateUniqueOrderNumberAsync()`

### Code Structure (Conceptual - Not Implementation)
The implementation should:
1. Get current UTC date formatted as `yyyyMMdd`
2. Build pattern: `ORD-{date}-%`
3. Query database for max order number matching pattern
4. Parse sequence from result (or default to 0)
5. Increment sequence by 1
6. Format as `ORD-{date}-{sequence:D3}`
7. Return order number string
8. Handle errors: log and throw

### Error Handling
- Log warnings if sequence exceeds 999
- Throw `InvalidOperationException` if database query fails
- Include correlation ID in logs for tracing

### Logging
- Debug: Generated order number and sequence
- Warning: Sequence > 999
- Error: Database query failures

---

## Related Features

- **FEAT-ORDER-001**: Order Confirmation (primary feature)
- **FEAT-CHECKOUT-001**: Checkout Process (calls order creation)

---

## Open Questions

1. **Q:** Should we support multiple timezones for date rollover?  
   **A:** Use UTC consistently for all order timestamps and sequences

2. **Q:** What happens if we exceed 999 orders in a single day?  
   **A:** Allow 4+ digit sequences, log warning (acceptable edge case)

3. **Q:** Should old order number format be migrated?  
   **A:** No - existing orders keep their numbers, new format applies to new orders only

---

## Definition of Done

- ✅ Code implemented and peer-reviewed
- ✅ All unit tests passing (≥85% coverage)
- ✅ All integration tests passing
- ✅ Manual testing completed and documented
- ✅ Code follows project conventions (see AGENTS.md)
- ✅ Logging statements added at appropriate levels
- ✅ Performance benchmarked (< 100ms generation time)
- ✅ Database index verified/created
- ✅ PR approved and merged
- ✅ MADR created documenting the order number format decision

---

## Success Metrics

- Order number generation time: < 50ms (p95)
- Zero duplicate order numbers in production
- 100% test coverage for order number generation logic
- Zero collision detection retries (sequential eliminates need)
