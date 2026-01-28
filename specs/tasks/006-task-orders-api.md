# Task: Orders API Implementation

**Task ID**: TASK-006  
**Priority**: P1 (High - Required for Checkout)  
**Estimated Effort**: 4-5 hours  
**Dependencies**: TASK-001, TASK-002, TASK-004  
**Status**: Not Started

---

## Description

Implement RESTful API endpoints for order management including creating orders from cart data, retrieving order details for confirmation pages, and looking up orders by order number. This API completes the checkout flow by persisting order data to the database.

---

## Dependencies

**Blocking Tasks**:
- TASK-001: Backend Project Scaffolding
- TASK-002: Database Schema & Entity Models
- TASK-004: Products API (orders reference products)

**Blocked Tasks**:
- TASK-008: Frontend API Integration (checkout flow)

---

## Technical Requirements

### 1. API Endpoints

Implement the following endpoints in `OrdersController`:

**POST /api/orders**
- Create new order from cart items
- Accepts order data including items, shipping address, customer info
- Returns created order with generated order number
- Returns 201 Created with Location header

**GET /api/orders/{id}**
- Get order details by order ID
- Returns full order information including order items
- Returns 404 if order not found

**GET /api/orders/number/{orderNumber}**
- Get order details by order number (e.g., "ORD-2026-00042")
- Returns full order information
- Returns 404 if order not found
- Use case: Customer order lookup

### 2. Request/Response DTOs

Create DTOs in `DTOs/` directory:

**CreateOrderRequest**:
- Items (List<OrderItemRequest>)
- TotalAmount (decimal)
- ShippingAddress (AddressDto)
- CustomerEmail (string)
- CustomerName (string)

**OrderItemRequest**:
- ProductId (int)
- Quantity (int)
- UnitPrice (decimal)

**AddressDto**:
- Name (string)
- Address (string)
- City (string)
- State (string)
- ZipCode (string)
- Country (string)

**OrderDto** (response):
- OrderId
- OrderNumber
- TotalAmount
- Status
- ShippingAddress (AddressDto deserialized from JSON)
- CustomerEmail
- CustomerName
- Items (List<OrderItemDto>)
- CreatedAt
- EstimatedDelivery (calculated: CreatedAt + 7 days)

**OrderItemDto**:
- OrderItemId
- ProductId
- ProductName
- Quantity
- UnitPrice
- Subtotal (calculated: Quantity * UnitPrice)

### 3. Order Creation Logic

Implement order creation process:
1. Validate request (items not empty, valid product IDs, positive quantities/prices)
2. Generate unique order number: `ORD-{year}-{random5digits}` (e.g., ORD-2026-12345)
3. Create Order entity with status "Pending"
4. Serialize shipping address to JSON and store
5. Save Order to database
6. For each item:
   - Verify product exists
   - Capture product name as snapshot (for order history)
   - Create OrderItem entity
   - Save OrderItem to database
7. Return created order with 201 Created status

### 4. Order Number Generation

Implement unique order number generator:
- Format: `ORD-{YYYY}-{XXXXX}` where XXXXX is random 5-digit number
- Ensure uniqueness (check database, retry if collision)
- Alternative: Use sequential numbers or GUID-based approach
- Store order number in Orders.OrderNumber field

### 5. Product Name Snapshot

Capture product information at time of order:
- Store `ProductName` in OrderItem (snapshot)
- Preserves order history even if product renamed or deleted
- Fetch from Products table during order creation
- Return 400 Bad Request if product doesn't exist

### 6. Shipping Address Storage

Store address as JSON string:
- Serialize AddressDto to JSON
- Store in Orders.ShippingAddress column (nvarchar)
- Deserialize back to AddressDto when retrieving order
- Allows flexible address structure without dedicated tables

### 7. Validation Rules

Implement comprehensive validation:
- Order must have at least 1 item
- ProductId must exist in database
- Quantity must be positive integer (> 0)
- UnitPrice must be positive decimal (> 0)
- TotalAmount should match sum of (Quantity * UnitPrice)
- Email must be valid format (optional validation)
- Required fields: CustomerName, ShippingAddress

### 8. Transaction Handling

Use database transactions for atomicity:
- Create Order and OrderItems in single transaction
- Rollback if any step fails
- Ensure data consistency (no orphaned orders or items)
- Use `using var transaction = await _context.Database.BeginTransactionAsync()`

### 9. Response Format

Use consistent API response wrapper:
```json
{
  "success": true,
  "data": {
    "orderId": 42,
    "orderNumber": "ORD-2026-00042",
    "totalAmount": 599.98,
    "status": "Pending",
    "createdAt": "2026-01-27T10:30:00Z",
    "estimatedDelivery": "2026-02-03T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

### 10. Error Handling

Handle specific error scenarios:
- Empty order items: Return 400 Bad Request
- Invalid product ID: Return 400 Bad Request with specific message
- Invalid quantities/prices: Return 400 Bad Request with validation errors
- Database errors: Return 500 Internal Server Error (logged)
- Order not found (GET): Return 404 Not Found

---

## Acceptance Criteria

- [ ] OrdersController created with all 3 endpoints
- [ ] All DTOs created (CreateOrderRequest, OrderDto, OrderItemDto, AddressDto)
- [ ] POST /api/orders creates order and order items
- [ ] Order number generated uniquely (ORD-YYYY-XXXXX format)
- [ ] Product names captured as snapshot at order creation
- [ ] Shipping address stored as JSON string
- [ ] GET /api/orders/{id} returns full order details
- [ ] GET /api/orders/number/{orderNumber} returns order by number
- [ ] Validation implemented for all request fields
- [ ] Transaction handling ensures atomic order creation
- [ ] 201 Created returned with Location header
- [ ] 404 returned for non-existent orders
- [ ] 400 returned for invalid requests with clear error messages
- [ ] XML comments added for Swagger documentation

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `OrdersControllerTests`
- [ ] Test POST /api/orders creates order successfully
- [ ] Test order number generation is unique
- [ ] Test product name snapshot captured correctly
- [ ] Test order creation with multiple items
- [ ] Test validation: empty items list returns 400
- [ ] Test validation: invalid product ID returns 400
- [ ] Test validation: negative quantity returns 400
- [ ] Test validation: negative unit price returns 400
- [ ] Test GET /api/orders/{id} returns order
- [ ] Test GET /api/orders/{id} returns 404 for invalid ID
- [ ] Test GET /api/orders/number/{orderNumber} returns order
- [ ] Test shipping address serialization/deserialization
- [ ] Test estimated delivery calculation

**Test Class**: `OrderCreationServiceTests`
- [ ] Test transaction rollback on failure
- [ ] Test order total calculation matches items
- [ ] Test product existence validation

### Integration Tests

**Test Class**: `OrdersApiIntegrationTests`
- [ ] Test full order creation flow end-to-end
- [ ] Test created order can be retrieved by ID
- [ ] Test created order can be retrieved by order number
- [ ] Test order items properly linked to order
- [ ] Test product snapshot preserved after product update
- [ ] Test transaction rollback when product doesn't exist
- [ ] Test API returns correct HTTP status codes
- [ ] Test CORS headers present in responses

### Manual Testing Checklist
- [ ] Test POST /api/orders via Swagger UI with sample data
- [ ] Verify order created in database with correct data
- [ ] Verify order items created with correct quantities/prices
- [ ] Test GET order by ID
- [ ] Test GET order by order number
- [ ] Test order creation with invalid product ID (should fail)
- [ ] Test order creation with empty items (should fail)
- [ ] Verify Swagger documentation displays correctly

---

## Implementation Notes

### Order Number Generation Strategy
```csharp
private string GenerateOrderNumber()
{
    var year = DateTime.UtcNow.Year;
    var random = new Random().Next(10000, 99999);
    var orderNumber = $"ORD-{year}-{random}";
    
    // Check uniqueness and retry if collision (rare)
    while (_context.Orders.Any(o => o.OrderNumber == orderNumber))
    {
        random = new Random().Next(10000, 99999);
        orderNumber = $"ORD-{year}-{random}";
    }
    
    return orderNumber;
}
```

### Transaction Pattern
```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    // Create order
    // Create order items
    await _context.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

### Address JSON Serialization
```csharp
using System.Text.Json;

// Serialize
order.ShippingAddress = JsonSerializer.Serialize(request.ShippingAddress);

// Deserialize
var address = JsonSerializer.Deserialize<AddressDto>(order.ShippingAddress);
```

### Product Name Snapshot
- Always capture product name at order creation
- Don't rely on Product navigation property (may change)
- Provides historical accuracy for order history

---

## Definition of Done

- [ ] OrdersController fully implemented with all endpoints
- [ ] All DTOs created and properly structured
- [ ] Order creation with transaction handling working
- [ ] Order number generation unique and collision-safe
- [ ] Product name snapshot captured correctly
- [ ] Shipping address JSON serialization working
- [ ] All validation rules implemented
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests written and passing
- [ ] Manual testing completed via Swagger UI
- [ ] XML comments complete for Swagger documentation
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] PR created and approved

---

## Related Documents

- [FRD-007: Orders API](../features/orders-api.md)
- [PRD: Section 3.6.1 RESTful API Endpoints](../prd.md#361-restful-api-endpoints)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
