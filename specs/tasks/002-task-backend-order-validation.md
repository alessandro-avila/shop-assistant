# Task 002: Backend Order API Validation Enhancement

**Task ID:** TASK-002  
**Feature:** FEAT-CHECKOUT-001 (Checkout Process)  
**Priority:** High  
**Complexity:** Medium  
**Estimated Effort:** 4-5 hours

---

## Description

Enhance the existing `POST /api/orders` endpoint with comprehensive server-side validation to ensure data integrity, prevent price tampering, and validate product existence. This is critical for security as client-side data cannot be trusted.

---

## Dependencies

**Prerequisite Tasks:** None (can start immediately)

**Blocks:**
- TASK-006 (Frontend Checkout Form)
- TASK-007 (Frontend Order Confirmation Page)

---

## Technical Requirements

### Current Implementation
- Location: `backend/Controllers/OrdersController.cs`
- Endpoint: `POST /api/orders`
- Current validation:
  - ✅ Empty items check
  - ✅ Product existence check
  - ✅ Total amount calculation validation
  - ⚠️ No price validation against database
  - ⚠️ No quantity limits
  - ⚠️ Limited shipping address validation

### Required Enhancements

1. **Price Validation (Critical for Security)**
   - Fetch current prices from `Products` table
   - Compare client-sent `UnitPrice` with database price
   - Reject order if ANY price mismatch (no tolerance)
   - Log price tampering attempts with client IP and request details
   - Return 400 Bad Request with message: "Price validation failed. Please refresh your cart."

2. **Quantity Validation**
   - Minimum quantity per item: 1
   - Maximum quantity per item: 100 (configurable)
   - Maximum total items in order: 100 (configurable)
   - Return 400 Bad Request with specific quantity violations

3. **Shipping Address Validation**
   - All fields required (except country - defaults to "USA")
   - Email format validation (regex or `MailAddress` class)
   - Phone number: minimum 10 digits (flexible format)
   - Postal code: 3-10 alphanumeric characters
   - Maximum field lengths enforced:
     - FullName: 200 chars
     - Email: 200 chars
     - Phone: 50 chars
     - StreetAddress: 500 chars
     - City: 100 chars
     - State: 100 chars
     - PostalCode: 20 chars
     - Country: 100 chars

4. **Product Availability Validation (Future-Ready)**
   - Check if product is marked as "active" or "available" (field doesn't exist yet)
   - Placeholder comment in code: `// TODO: Add product availability check when inventory system implemented`
   - Structure code to easily add this check later

5. **Request Validation Model Enhancements**
   - Add data annotations to `CreateOrderRequest` DTO
   - Add data annotations to `AddressDto`
   - Leverage ASP.NET Core model validation (`[ApiController]` attribute)
   - Return structured validation errors (ProblemDetails format)

6. **Duplicate Order Detection (Optional Enhancement)**
   - Check for duplicate orders in last 5 minutes:
     - Same customer email
     - Same total amount
     - Same number of items
   - Log warning (don't reject - allow legitimate duplicates)

### Data Transfer Objects to Enhance

**CreateOrderRequest.cs**
```
- Add [Required] to Items, ShippingAddress
- Add [Range(0.01, double.MaxValue)] to TotalAmount
- Add [MinLength(1)] to Items collection
```

**AddressDto.cs**
```
- Add [Required] to all fields except Country
- Add [EmailAddress] to Email
- Add [Phone] or [RegularExpression] to Phone
- Add [StringLength(max)] to all string fields
```

**OrderItemRequest.cs**
```
- Add [Required] to ProductId, Quantity, UnitPrice
- Add [Range(1, 100)] to Quantity
- Add [Range(0.01, double.MaxValue)] to UnitPrice
```

---

## Acceptance Criteria

### Functional Requirements

1. **Price Validation**
   - ✅ Order with correct prices: Accepted
   - ✅ Order with tampered price: Rejected with 400
   - ✅ Error message: "Price validation failed. Please refresh your cart."
   - ✅ Price tampering logged with severity: Warning

2. **Quantity Validation**
   - ✅ Quantity 0 or negative: Rejected with 400
   - ✅ Quantity > 100: Rejected with 400
   - ✅ Total items > 100: Rejected with 400
   - ✅ Error message specifies which validation failed

3. **Shipping Address Validation**
   - ✅ Missing required field: Rejected with 400
   - ✅ Invalid email format: Rejected with 400
   - ✅ Phone too short (< 10 digits): Rejected with 400
   - ✅ Field exceeds max length: Rejected with 400
   - ✅ Validation errors returned in ProblemDetails format

4. **Product Validation**
   - ✅ Non-existent product ID: Rejected with 400
   - ✅ Multiple invalid products: All listed in error response

5. **Response Format**
   - ✅ Success: 201 Created with `OrderDto`
   - ✅ Validation error: 400 Bad Request with `ValidationProblemDetails`
   - ✅ Server error: 500 with generic error message (no sensitive data)

### Non-Functional Requirements
- ✅ Validation completes in < 200ms
- ✅ All validation errors logged appropriately
- ✅ No sensitive data (DB connection strings, stack traces) exposed in errors
- ✅ Thread-safe validation (safe for concurrent requests)

### Code Quality
- ✅ Validation logic separate from controller action (use private methods or validation service)
- ✅ Clear XML documentation on validation rules
- ✅ Proper use of ASP.NET Core validation features
- ✅ Consistent error message format

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: Valid Order Creation**
   - Given: Order with correct prices, quantities, and address
   - When: POST /api/orders
   - Then: 201 Created, order in database

2. **Test: Price Tampering Detection**
   - Given: Product database price = $299.99, client sends $1.00
   - When: POST /api/orders
   - Then: 400 Bad Request, error message about price validation

3. **Test: Quantity Validation - Zero**
   - Given: Order item with quantity = 0
   - When: POST /api/orders
   - Then: 400 Bad Request, "Quantity must be at least 1"

4. **Test: Quantity Validation - Exceeds Max**
   - Given: Order item with quantity = 101
   - When: POST /api/orders
   - Then: 400 Bad Request, "Quantity cannot exceed 100"

5. **Test: Total Items Exceeds Limit**
   - Given: Order with 101 total items (multiple products)
   - When: POST /api/orders
   - Then: 400 Bad Request, "Cart cannot exceed 100 items"

6. **Test: Invalid Email Format**
   - Given: Shipping address email = "not-an-email"
   - When: POST /api/orders
   - Then: 400 Bad Request, "Invalid email format"

7. **Test: Missing Required Address Field**
   - Given: Shipping address missing "City" field
   - When: POST /api/orders
   - Then: 400 Bad Request, "City is required"

8. **Test: Phone Number Too Short**
   - Given: Phone = "123"
   - When: POST /api/orders
   - Then: 400 Bad Request, "Phone number must be at least 10 digits"

9. **Test: Non-Existent Product ID**
   - Given: Order includes ProductId = 99999 (doesn't exist)
   - When: POST /api/orders
   - Then: 400 Bad Request, "Product with ID 99999 not found"

10. **Test: String Length Violations**
    - Given: FullName with 201 characters
    - When: POST /api/orders
    - Then: 400 Bad Request, field length error

### Integration Tests (Required)

1. **Test: End-to-End Order Creation with Validation**
   - Seed database with products
   - Create valid order request
   - POST to /api/orders
   - Verify: 201 response, order in database, prices validated

2. **Test: Price Validation Against Real Database**
   - Seed product with price $100.00
   - Send order with price $50.00
   - Verify: Rejected with price validation error

3. **Test: Multiple Validation Errors**
   - Send order with:
     - Invalid price
     - Quantity = 0
     - Invalid email
   - Verify: All validation errors returned in single response

### Manual Testing Scenarios

1. Use Postman/REST Client to send order with tampered price
2. Send order with invalid email format
3. Send order with missing address fields
4. Send order with quantity = 150
5. Verify error responses are clear and actionable

---

## API Contract

### Request Schema (Enhanced)
```json
{
  "items": [
    {
      "productId": 1,           // Required, must exist in database
      "quantity": 2,            // Required, 1-100
      "unitPrice": 299.99       // Required, must match database price
    }
  ],
  "totalAmount": 599.98,       // Required, must equal sum of items
  "shippingAddress": {
    "fullName": "John Doe",     // Required, max 200 chars
    "email": "john@example.com", // Required, valid email, max 200 chars
    "phone": "555-123-4567",    // Required, min 10 digits, max 50 chars
    "streetAddress": "123 Main St", // Required, max 500 chars
    "city": "Seattle",          // Required, max 100 chars
    "state": "WA",              // Required, max 100 chars
    "postalCode": "98101",      // Required, 3-20 alphanumeric
    "country": "USA"            // Optional, defaults to "USA", max 100 chars
  },
  "customerEmail": "john@example.com", // Required, valid email
  "customerName": "John Doe"   // Required, max 200 chars
}
```

### Error Response (ProblemDetails)
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Items[0].UnitPrice": ["Price validation failed. Please refresh your cart."],
    "ShippingAddress.Email": ["The Email field is not a valid e-mail address."],
    "Items[1].Quantity": ["Quantity must be between 1 and 100."]
  }
}
```

---

## Implementation Notes

### Files to Modify

1. **backend/DTOs/CreateOrderRequest.cs**
   - Add validation attributes

2. **backend/DTOs/AddressDto.cs**
   - Add validation attributes

3. **backend/DTOs/OrderItemRequest.cs**
   - Add validation attributes

4. **backend/Controllers/OrdersController.cs**
   - Enhance `CreateOrder` method with price validation
   - Add private validation methods
   - Improve error logging

### Validation Logic Structure

The implementation should include:
1. ASP.NET Core model validation (runs automatically via `[ApiController]`)
2. Custom validation method for price checking
3. Custom validation method for total items limit
4. Error response formatting using `ValidationProblemDetails`

### Configuration Values
Add to `appsettings.json`:
```json
{
  "OrderValidation": {
    "MaxQuantityPerItem": 100,
    "MaxTotalItems": 100,
    "PriceToleranceCents": 0
  }
}
```

### Logging Enhancements
- **Info**: Valid order created
- **Warning**: Price tampering detected (include client IP if available)
- **Warning**: Unusual quantity (> 50 items)
- **Error**: Validation error preventing order creation

---

## Security Considerations

### CRITICAL: Price Validation
- **Risk**: User manipulates cart prices in localStorage to pay less
- **Mitigation**: ALWAYS validate prices against database
- **Impact**: Prevents revenue loss from price tampering

### Data Validation
- **Risk**: Malicious input (SQL injection, XSS)
- **Mitigation**: Entity Framework parameterized queries, HTML encoding
- **Status**: ✅ EF protects against SQL injection

### Rate Limiting (Future)
- **Risk**: API abuse (thousands of order creation attempts)
- **Mitigation**: Add rate limiting middleware (future task)
- **Note**: Out of scope for this task, add comment in code

---

## Related Features

- **FEAT-CHECKOUT-001**: Checkout Process (primary feature)
- **FEAT-CART-001**: Shopping Cart Management (provides cart data)

---

## Open Questions

1. **Q:** Should we validate product stock/inventory?  
   **A:** Add placeholder comment - inventory system not implemented yet

2. **Q:** Should we prevent duplicate orders?  
   **A:** Log warning for suspicious duplicates but don't reject (customer may legitimately order again)

3. **Q:** What price tolerance should we allow for rounding?  
   **A:** Zero tolerance - prices must match exactly

4. **Q:** Should postal code validation be country-specific?  
   **A:** No - use simple alphanumeric validation for MVP

---

## Definition of Done

- ✅ All DTOs have validation attributes
- ✅ Price validation implemented and tested
- ✅ Quantity validation implemented and tested
- ✅ Address validation implemented and tested
- ✅ Error responses follow ProblemDetails format
- ✅ All unit tests passing (≥85% coverage)
- ✅ All integration tests passing
- ✅ Manual testing completed with Postman/REST client
- ✅ Code peer-reviewed
- ✅ Logging enhanced for validation failures
- ✅ Configuration values added to appsettings.json
- ✅ PR approved and merged

---

## Success Metrics

- Zero orders created with tampered prices
- Validation time < 100ms (p95)
- Clear, actionable error messages for all validation failures
- 100% test coverage for validation logic
