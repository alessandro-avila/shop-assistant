# Task 003: Backend Order Retrieval API Enhancement

**Task ID:** TASK-003  
**Feature:** FEAT-ORDER-001 (Order Confirmation)  
**Priority:** Medium  
**Complexity:** Low  
**Estimated Effort:** 2-3 hours

---

## Description

Enhance the existing `GET /api/orders/{id}` endpoint with improved error handling, response optimization, and ensure it meets the requirements for the order confirmation page. The endpoint exists but needs enhancements for production readiness.

---

## Dependencies

**Prerequisite Tasks:**
- TASK-001 (Backend Order Number Generation) - Required for consistent order number format

**Blocks:**
- TASK-007 (Frontend Order Confirmation Page)

---

## Technical Requirements

### Current Implementation
- Location: `backend/Controllers/OrdersController.cs`
- Endpoints:
  - `GET /api/orders/{id}` - Get order by ID ✅ Exists
  - `GET /api/orders/number/{orderNumber}` - Get order by order number ✅ Exists
- Current features:
  - Loads order with items (Include/eager loading)
  - Returns 404 if not found
  - Deserializes shipping address JSON

### Required Enhancements

1. **Response Optimization**
   - Use `.AsNoTracking()` for read-only queries (already implemented ✅)
   - Ensure all related entities loaded in single query (no N+1 issues)
   - Project to DTO efficiently

2. **Enhanced Error Responses**
   - 404 Not Found: Include helpful message
   - 500 Internal Server Error: Log error but return generic message
   - Add request correlation ID to logs

3. **Caching Headers (Optional)**
   - Add cache control headers for client-side caching
   - `Cache-Control: private, max-age=300` (5 minutes)
   - `ETag` support for conditional requests (optional)

4. **Performance Optimization**
   - Ensure database query completes in < 200ms
   - Add database index on `OrderId` (likely exists as primary key)
   - Consider adding index on `OrderNumber` if query by number is frequent

5. **API Documentation**
   - Enhance XML documentation comments
   - Document all response codes (200, 404, 500)
   - Include example responses in comments

6. **Response DTO Validation**
   - Ensure `OrderDto` includes all fields required by frontend:
     - OrderId
     - OrderNumber
     - Status
     - TotalAmount
     - CreatedAt
     - Items[] (with ProductName, Quantity, UnitPrice, LineTotal)
     - ShippingAddress (all fields)
     - CustomerEmail
     - CustomerName

### Additional Features (Nice-to-Have)

1. **Order Status Badge Helper**
   - Add computed property or method to suggest badge color:
     - Pending → "warning" (yellow)
     - Processing → "info" (blue)
     - Shipped → "primary" (purple)
     - Delivered → "success" (green)
     - Cancelled → "error" (red)

2. **Line Total Calculation**
   - Add `LineTotal` property to `OrderItemDto` (calculated: Quantity × UnitPrice)
   - Ensures frontend doesn't need to calculate

---

## Acceptance Criteria

### Functional Requirements

1. **GET /api/orders/{id} - Success Case**
   - ✅ Returns 200 OK with complete order details
   - ✅ Includes all order items with product names
   - ✅ Includes deserialized shipping address
   - ✅ Response matches `OrderDto` schema exactly

2. **GET /api/orders/{id} - Not Found Case**
   - ✅ Returns 404 Not Found with clear message
   - ✅ Message: "Order with ID {id} not found"
   - ✅ Logs warning with order ID

3. **GET /api/orders/number/{orderNumber} - Success Case**
   - ✅ Returns 200 OK with complete order details
   - ✅ Order number format: `ORD-YYYYMMDD-###`

4. **GET /api/orders/number/{orderNumber} - Not Found Case**
   - ✅ Returns 404 Not Found
   - ✅ Message: "Order with number '{orderNumber}' not found"

5. **Performance**
   - ✅ Query completes in < 200ms (including database round-trip)
   - ✅ Single database query (no N+1 problem)
   - ✅ Uses `.AsNoTracking()` for read-only query

6. **Error Handling**
   - ✅ Database errors return 500 with generic message
   - ✅ Detailed error logged server-side
   - ✅ No sensitive data exposed in error responses

### Non-Functional Requirements
- ✅ API endpoint is idempotent (multiple calls return same result)
- ✅ Supports CORS for frontend access
- ✅ Response time < 200ms (p95)
- ✅ Proper HTTP status codes

### Code Quality
- ✅ XML documentation comments complete
- ✅ Logging at appropriate levels
- ✅ Consistent with existing controller style
- ✅ No code duplication between GET by ID and GET by number

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: Get Order by ID - Success**
   - Given: Order with ID 12345 exists in database
   - When: GET /api/orders/12345
   - Then: 200 OK, returns OrderDto with all fields populated

2. **Test: Get Order by ID - Not Found**
   - Given: Order with ID 99999 does not exist
   - When: GET /api/orders/99999
   - Then: 404 Not Found, error message included

3. **Test: Get Order by Number - Success**
   - Given: Order with number "ORD-20260128-001" exists
   - When: GET /api/orders/number/ORD-20260128-001
   - Then: 200 OK, returns OrderDto

4. **Test: Get Order by Number - Not Found**
   - Given: Order number "ORD-99999999-999" does not exist
   - When: GET /api/orders/number/ORD-99999999-999
   - Then: 404 Not Found

5. **Test: Order DTO Mapping**
   - Given: Order entity with items and shipping address
   - When: Mapping to OrderDto
   - Then: All fields correctly mapped, shipping address deserialized

6. **Test: Line Total Calculation**
   - Given: OrderItem with Quantity=2, UnitPrice=100.00
   - When: Mapped to OrderItemDto
   - Then: LineTotal = 200.00

### Integration Tests (Required)

1. **Test: End-to-End Order Retrieval**
   - Seed database with order containing 3 items
   - GET /api/orders/{id}
   - Verify: Response includes all 3 items with correct details

2. **Test: Performance - Large Order**
   - Create order with 50 items
   - GET /api/orders/{id}
   - Verify: Completes in < 200ms, single database query

3. **Test: Concurrent Requests**
   - Send 10 simultaneous GET requests for same order
   - Verify: All return same data, no errors

### Manual Testing Scenarios

1. Use Postman to GET order by ID
2. Use Postman to GET order by order number
3. Use browser to access endpoint and verify JSON response
4. Check response headers for cache control
5. Verify logging output in console

---

## API Contract

### Endpoint: GET /api/orders/{id}

**Request:**
```
GET /api/orders/12345
```

**Success Response (200 OK):**
```json
{
  "orderId": 12345,
  "orderNumber": "ORD-20260128-001",
  "status": "Pending",
  "totalAmount": 599.98,
  "createdAt": "2026-01-28T10:30:00Z",
  "customerEmail": "john@example.com",
  "customerName": "John Doe",
  "items": [
    {
      "orderItemId": 1,
      "productId": 1,
      "productName": "Premium Wireless Headphones",
      "quantity": 2,
      "unitPrice": 299.99,
      "lineTotal": 599.98
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "streetAddress": "123 Main St",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "country": "USA"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "title": "Order not found",
  "status": 404,
  "detail": "Order with ID 12345 not found"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "title": "An error occurred",
  "status": 500,
  "detail": "An unexpected error occurred while retrieving the order"
}
```

### Endpoint: GET /api/orders/number/{orderNumber}

**Request:**
```
GET /api/orders/number/ORD-20260128-001
```

**Response:** Same as GET by ID

---

## Implementation Notes

### Files to Modify

1. **backend/Controllers/OrdersController.cs**
   - Enhance `GetOrder(int id)` method
   - Enhance `GetOrderByNumber(string orderNumber)` method
   - Add caching headers (optional)
   - Improve error responses

2. **backend/DTOs/OrderItemDto.cs**
   - Add `LineTotal` property (calculated or explicit)

### Query Optimization

Ensure EF Core query is optimal:
```
.Include(o => o.OrderItems)
.AsNoTracking()
.FirstOrDefaultAsync(o => o.OrderId == id)
```

This generates a single SQL query with JOIN, avoiding N+1.

### Logging Enhancements
- **Info**: Order retrieved successfully (include order number)
- **Warning**: Order not found (include requested ID/number)
- **Error**: Database error (include exception, correlation ID)

### Cache Control (Optional)
Add response headers:
```
Cache-Control: private, max-age=300
```
This allows browser/client to cache order details for 5 minutes.

---

## Performance Considerations

### Database Query Optimization
- Ensure `OrderId` is indexed (primary key, likely already indexed)
- Consider adding index on `OrderNumber` if frequently queried:
  ```sql
  CREATE INDEX IX_Orders_OrderNumber ON Orders(OrderNumber);
  ```

### Response Size
- Typical order with 5 items: ~2KB response
- Large order with 50 items: ~15KB response
- Acceptable for REST API, no compression needed

### Concurrent Access
- Read-only queries are safe for concurrency
- No locking or transaction needed
- `.AsNoTracking()` improves performance for reads

---

## Related Features

- **FEAT-ORDER-001**: Order Confirmation (primary feature)
- **FEAT-CHECKOUT-001**: Checkout Process (creates orders)

---

## Open Questions

1. **Q:** Should we implement pagination for order items?  
   **A:** No - orders typically have < 20 items, full list acceptable

2. **Q:** Should we cache order responses?  
   **A:** Optional - add cache headers but no server-side caching needed for MVP

3. **Q:** Should we support filtering/searching orders?  
   **A:** Out of scope - this task focuses on single order retrieval

---

## Definition of Done

- ✅ Code enhancements implemented
- ✅ XML documentation comments complete
- ✅ All unit tests passing (≥85% coverage)
- ✅ All integration tests passing
- ✅ Performance tested (< 200ms response time)
- ✅ Manual testing with Postman completed
- ✅ Code peer-reviewed
- ✅ Error handling tested (404, 500)
- ✅ Logging verified
- ✅ PR approved and merged

---

## Success Metrics

- API response time < 150ms (p95)
- Zero N+1 query issues
- 100% test coverage for order retrieval logic
- Clear, helpful error messages
