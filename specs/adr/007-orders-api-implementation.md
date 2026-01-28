# ADR 007: Orders API Implementation Strategy

**Date**: January 27, 2026  
**Status**: Accepted  
**Deciders**: Development Team

---

## Context and Problem Statement

The Orders API needs to handle order creation from cart items with complex requirements:

- **Atomic Operations**: Order and order items must be created together or not at all
- **Data Integrity**: Product information must be captured at order time for historical accuracy
- **Unique Identifiers**: Human-readable order numbers for customer lookup
- **Flexible Storage**: Shipping address structure may evolve over time
- **Validation**: Comprehensive validation before committing data
- **Error Recovery**: Graceful rollback on failures

Key decisions needed:
1. How to ensure atomic order creation (order + items)?
2. How to store shipping addresses without rigid schema?
3. How to generate unique, readable order numbers?
4. How to preserve product information for order history?

---

## Decision Drivers

* **Data Consistency**: Orders and items must be created atomically
* **Historical Accuracy**: Order details must remain unchanged even if products are updated/deleted
* **User Experience**: Order numbers should be human-readable and easy to reference
* **Flexibility**: Address structure should accommodate future changes without migrations
* **Performance**: Order creation should complete quickly (< 500ms)
* **Reliability**: Transaction failures should rollback completely

---

## Considered Options

### Option 1: Separate Order and OrderItems Creation (No Transaction)
Create order first, then create order items in separate database operations.

**Pros**:
- Simple implementation
- No transaction overhead

**Cons**:
- **Data integrity risk**: Orphaned orders if items fail
- **No rollback**: Partial failures leave incomplete data
- **Production risk**: Could create orders without items
- Not suitable for financial operations

### Option 2: Database Transactions with Explicit Control
Use `BeginTransactionAsync()` / `CommitAsync()` / `RollbackAsync()` for atomic operations.

**Pros**:
- **Guaranteed atomicity**: All-or-nothing operation
- **Explicit control**: Clear transaction boundaries
- **Rollback on failure**: Complete recovery from errors
- **Standard pattern**: Well-documented approach
- **Testable**: Can verify rollback behavior

**Cons**:
- More verbose code
- Requires careful exception handling

### Option 3: Unit of Work Pattern with Repository
Create abstraction layer with Unit of Work managing transactions.

**Pros**:
- Clean separation of concerns
- Testable through interfaces

**Cons**:
- **Over-engineering**: EF Core DbContext is already a Unit of Work
- More files and complexity
- Adds unnecessary abstraction layer

---

## Decision Outcome

**Chosen option**: **Option 2 - Database Transactions with Explicit Control**

### Rationale

1. **Data Integrity is Critical**: Orders involve financial data - cannot risk partial creation
2. **EF Core Transaction Support**: Built-in, well-tested transaction management
3. **Explicit > Implicit**: Transaction boundaries are clear in code
4. **Error Recovery**: Rollback ensures clean state on any failure
5. **Industry Standard**: Common pattern for order processing systems

### Implementation Patterns Established

**Transaction Pattern**:
```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    // Create order
    _context.Orders.Add(order);
    await _context.SaveChangesAsync();
    
    // Create order items
    foreach (var item in items)
    {
        _context.OrderItems.Add(item);
    }
    await _context.SaveChangesAsync();
    
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

**Order Number Generation**:
- Format: `ORD-YYYY-XXXXX` (e.g., ORD-2026-12345)
- 5-digit random number with uniqueness check
- Retry loop with max attempts to handle collisions
- Human-readable for customer support

**Product Name Snapshot**:
```csharp
// Capture product name at order time
var product = await _context.Products.FindAsync(productId);
orderItem.ProductName = product.Name; // Snapshot for history
```

**Address JSON Storage**:
```csharp
using System.Text.Json;

// Serialize address to JSON string
order.ShippingAddress = JsonSerializer.Serialize(addressDto);

// Deserialize when retrieving
var address = JsonSerializer.Deserialize<AddressDto>(order.ShippingAddress);
```

**Validation Strategy**:
- Pre-validate all products exist before transaction
- Validate total amount matches items sum
- Use DataAnnotations for request validation
- Return 400 Bad Request with specific error messages

---

## Consequences

### Positive

- **Data Consistency**: Zero risk of orphaned orders or items
- **Reliable**: Transaction rollback handles all failure scenarios
- **Historical Accuracy**: Product snapshots preserve order history
- **Flexibility**: JSON address storage allows schema evolution
- **User-Friendly**: Readable order numbers for support and lookup
- **Production-Ready**: Industry-standard transaction handling

### Negative

- **Verbosity**: Transaction code is more explicit than auto-commit
- **Performance**: Small overhead from transaction management (acceptable for order operations)
- **JSON Deserialization**: Requires manual serialization (but provides flexibility)

---

## Alternative Decisions Made

### Address Storage: JSON vs. Dedicated Table

**Chosen**: JSON serialization in Orders.ShippingAddress column

**Rationale**:
- Address structure may evolve (add delivery instructions, phone, etc.)
- No need to query addresses independently
- Simpler schema without OrderAddresses table
- Easy to migrate if needed later

### Order Number Format

**Chosen**: `ORD-YYYY-XXXXX` with random 5-digit number

**Alternatives Considered**:
- Sequential numbers: Reveals order volume to competitors
- GUID: Not user-friendly, hard to communicate
- Sequential with offset: Still reveals growth rate

**Rationale**:
- Human-readable and easy to reference
- Hides order volume (competitive advantage)
- Year prefix helps with organization and archival

### Product Snapshot Strategy

**Chosen**: Copy product name to OrderItem.ProductName at order time

**Rationale**:
- Order history remains accurate even if product renamed or deleted
- No need to maintain historical product versions
- Simple and effective for demo application
- Could extend to snapshot price, description, etc. if needed

---

## Implementation Evidence

### TASK-006: Orders API
- 3 endpoints implemented with transaction pattern
- DTOs: AddressDto, OrderItemRequest, CreateOrderRequest, OrderItemDto, OrderDto
- Validation: Product existence, total amount, positive values
- Order number generation with uniqueness check
- Product name snapshot captured
- Address JSON serialization
- Build: 0 errors, 0 warnings
- Transaction rollback tested via invalid product IDs

### Key Features
- **Atomic Order Creation**: Transaction ensures order + items created together
- **Validation Before Transaction**: All products validated before starting transaction (performance)
- **Unique Order Numbers**: Format ORD-2026-XXXXX with collision detection
- **Error Recovery**: Rollback on any failure, clean error messages
- **Type Safety**: Strong typing with DataAnnotations validation

---

## Related Decisions

- [ADR 006: Backend API Architecture](006-backend-api-architecture.md) - DTO patterns and query optimization
- Future: Consider event-driven order processing (order placed → inventory check → payment → fulfillment)

---

## References

- [EF Core Transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions)
- [ASP.NET Core Model Validation](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation)
- Backend README: Orders API documentation
