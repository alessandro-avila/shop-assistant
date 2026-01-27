# Feature: Orders API

**Feature ID**: FRD-007  
**Version**: 1.0  
**Status**: Not Started  
**Created**: January 27, 2026

---

## 1. Feature Overview

Implement API endpoints for creating orders from cart and retrieving order details for confirmation page.

---

## 2. User Stories

```gherkin
As a user,
I want to place an order,
So that I can complete my purchase.

As a frontend developer,
I want to POST order data,
So that I can create order records.

As a user,
I want to see my order confirmation,
So that I know my order was successful.
```

---

## 3. API Endpoints

### POST /api/orders
Create new order from cart items.

**Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 299.99
    }
  ],
  "totalAmount": 599.98,
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "customerEmail": "john@example.com",
  "customerName": "John Doe"
}
```

**Response**: 201 Created
```json
{
  "success": true,
  "data": {
    "orderId": 42,
    "orderNumber": "ORD-2026-00042",
    "totalAmount": 599.98,
    "status": "Pending",
    "createdAt": "2026-01-27T10:30:00Z",
    "estimatedDelivery": "2026-02-03"
  },
  "message": "Order created successfully"
}
```

### GET /api/orders/{id}
Get order details by ID.

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "orderId": 42,
    "orderNumber": "ORD-2026-00042",
    "status": "Pending",
    "totalAmount": 599.98,
    "shippingAddress": { ... },
    "customerEmail": "john@example.com",
    "items": [
      {
        "productId": 1,
        "productName": "Premium Wireless Headphones",
        "quantity": 2,
        "unitPrice": 299.99,
        "subtotal": 599.98
      }
    ],
    "createdAt": "2026-01-27T10:30:00Z"
  }
}
```

### GET /api/orders/number/{orderNumber}
Get order by order number (for lookup).

---

## 4. Technical Implementation

```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ShopDbContext _context;

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // Validate request
        if (!request.Items.Any())
            return BadRequest(new { success = false, message = "Order must contain at least one item" });

        // Create order
        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            TotalAmount = request.TotalAmount,
            Status = "Pending",
            ShippingAddress = JsonSerializer.Serialize(request.ShippingAddress),
            CustomerEmail = request.CustomerEmail,
            CustomerName = request.CustomerName,
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Create order items
        foreach (var item in request.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            
            var orderItem = new OrderItem
            {
                OrderId = order.OrderId,
                ProductId = item.ProductId,
                ProductName = product.Name, // Snapshot
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            };

            _context.OrderItems.Add(orderItem);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, new
        {
            success = true,
            data = new
            {
                order.OrderId,
                order.OrderNumber,
                order.TotalAmount,
                order.Status,
                order.CreatedAt,
                EstimatedDelivery = order.CreatedAt.AddDays(7)
            },
            message = "Order created successfully"
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
            return NotFound(new { success = false, message = "Order not found" });

        return Ok(new { success = true, data = order });
    }

    private string GenerateOrderNumber()
    {
        // Generate unique order number: ORD-YYYY-XXXXX
        return $"ORD-{DateTime.UtcNow.Year}-{new Random().Next(10000, 99999)}";
    }
}
```

---

## 5. Acceptance Criteria

- [ ] POST /api/orders creates order and order items
- [ ] Order number generated uniquely
- [ ] Shipping address stored as JSON
- [ ] Product names captured as snapshot
- [ ] GET /api/orders/{id} returns order with items
- [ ] 400 for invalid order requests
- [ ] 404 for non-existent orders
- [ ] Order creation atomic (transaction)
- [ ] Swagger documentation complete

---

**Status**: Ready for Implementation  
**Priority**: P1  
**Estimated Effort**: 4-5 hours  
**Dependencies**: FRD-001, FRD-002, FRD-004
