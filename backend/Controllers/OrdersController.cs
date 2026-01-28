using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAssistant.Api.Data;
using ShopAssistant.Api.DTOs;
using ShopAssistant.Api.Models;
using System.Text.Json;

namespace ShopAssistant.Api.Controllers;

/// <summary>
/// API controller for managing orders.
/// Provides endpoints for creating orders from cart and retrieving order details for confirmation.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("Orders")]
public class OrdersController : ControllerBase
{
    private readonly ShopDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(ShopDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Create a new order from cart items.
    /// </summary>
    /// <param name="request">Order creation request containing items, shipping address, and customer info</param>
    /// <returns>Created order with generated order number and details</returns>
    /// <response code="201">Order created successfully</response>
    /// <response code="400">Invalid request (empty items, invalid product IDs, etc.)</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            _logger.LogInformation("Creating new order for customer: {CustomerEmail}", request.ShippingAddress.Email);

            // Validate request
            if (request.Items == null || !request.Items.Any())
            {
                _logger.LogWarning("Order creation failed: No items in order");
                return BadRequest("Order must contain at least one item");
            }

            // Validate total items limit (max 100 items across all products)
            var totalItemCount = request.Items.Sum(i => i.Quantity);
            if (totalItemCount > 100)
            {
                _logger.LogWarning("Order creation failed: Total items {TotalItems} exceeds limit of 100", totalItemCount);
                return BadRequest($"Cart cannot exceed 100 items. Current total: {totalItemCount}");
            }

            // Validate all products exist and fetch current prices
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToDictionaryAsync(p => p.ProductId);

            // Check for non-existent products
            var missingProductIds = productIds.Where(id => !products.ContainsKey(id)).ToList();
            if (missingProductIds.Any())
            {
                _logger.LogWarning("Order creation failed: Products not found: {ProductIds}", 
                    string.Join(", ", missingProductIds));
                
                if (missingProductIds.Count == 1)
                    return BadRequest($"Product with ID {missingProductIds[0]} not found");
                else
                    return BadRequest($"Products not found: {string.Join(", ", missingProductIds)}");
            }

            // CRITICAL: Validate prices against database to prevent tampering
            var priceValidationErrors = new List<string>();
            foreach (var item in request.Items)
            {
                var product = products[item.ProductId];
                if (item.UnitPrice != product.Price)
                {
                    _logger.LogWarning(
                        "Price tampering detected: Product {ProductId} ({ProductName}) - Database: {DbPrice}, Client: {ClientPrice}, Client IP: {ClientIP}",
                        product.ProductId, product.Name, product.Price, item.UnitPrice,
                        HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown");
                    
                    priceValidationErrors.Add(
                        $"Product '{product.Name}': expected {product.Price:C}, received {item.UnitPrice:C}");
                }

                // TODO: Add product availability/stock check when inventory system is implemented
                // if (!product.InStock) { return BadRequest($"Product '{product.Name}' is out of stock"); }
            }

            if (priceValidationErrors.Any())
            {
                _logger.LogWarning("Order creation failed: Price validation errors - {Errors}", 
                    string.Join("; ", priceValidationErrors));
                return BadRequest("Price validation failed. Please refresh your cart and try again.");
            }

            // Validate total amount matches items (with small tolerance for rounding)
            var calculatedTotal = request.Items.Sum(i => i.Quantity * i.UnitPrice);
            if (Math.Abs(calculatedTotal - request.TotalAmount) > 0.01m)
            {
                _logger.LogWarning(
                    "Order creation failed: Total amount mismatch. Expected: {Calculated}, Received: {Received}",
                    calculatedTotal, request.TotalAmount);
                return BadRequest($"Total amount mismatch. Expected: {calculatedTotal:F2}, Received: {request.TotalAmount:F2}");
            }

            // Use execution strategy for atomic order creation with retry support
            var strategy = _context.Database.CreateExecutionStrategy();
            
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Generate unique order number
                    var orderNumber = await GenerateUniqueOrderNumberAsync();

                // Create order entity
                var order = new Order
                {
                    OrderNumber = orderNumber,
                    TotalAmount = request.TotalAmount,
                    Status = "Pending",
                    ShippingAddress = JsonSerializer.Serialize(request.ShippingAddress),
                    CustomerEmail = request.ShippingAddress.Email,
                    CustomerName = request.ShippingAddress.FullName,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Order created with ID: {OrderId}, Number: {OrderNumber}", 
                    order.OrderId, order.OrderNumber);

                // Create order items
                var orderItems = new List<OrderItem>();
                foreach (var itemRequest in request.Items)
                {
                    var product = products[itemRequest.ProductId];
                    var orderItem = new OrderItem
                    {
                        OrderId = order.OrderId,
                        ProductId = itemRequest.ProductId,
                        ProductName = product.Name, // Snapshot product name
                        Quantity = itemRequest.Quantity,
                        UnitPrice = itemRequest.UnitPrice
                    };

                    orderItems.Add(orderItem);
                    _context.OrderItems.Add(orderItem);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Order {OrderNumber} created successfully with {ItemCount} items, Total: {TotalAmount:C}",
                    order.OrderNumber, orderItems.Count, order.TotalAmount);

                // Build response DTO
                var orderDto = new OrderDto
                {
                    OrderId = order.OrderId,
                    OrderNumber = order.OrderNumber,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    ShippingAddress = JsonSerializer.Deserialize<AddressDto>(order.ShippingAddress)!,
                    Items = orderItems.Select(oi => new OrderItemDto
                    {
                        OrderItemId = oi.OrderItemId,
                        ProductId = oi.ProductId,
                        ProductName = oi.ProductName,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList(),
                    CreatedAt = order.CreatedAt
                };

                // Return 201 Created with Location header
                return CreatedAtAction(
                    nameof(GetOrder),
                    new { id = order.OrderId },
                    orderDto);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error creating order, transaction rolled back");
                    throw;
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating order");
            return StatusCode(500, "An error occurred while creating the order");
        }
    }

    /// <summary>
    /// Get order details by order ID.
    /// Retrieves complete order information including all items and shipping details.
    /// </summary>
    /// <param name="id">The order ID</param>
    /// <returns>Order details including all items</returns>
    /// <response code="200">Returns the order with complete details</response>
    /// <response code="404">Order not found</response>
    /// <response code="500">Internal server error</response>
    /// <example>
    /// GET /api/orders/12345
    /// </example>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Client)]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        try
        {
            _logger.LogInformation("Retrieving order with ID: {OrderId}", id);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", id);
                return NotFound(new ProblemDetails
                {
                    Title = "Order not found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = $"Order with ID {id} not found",
                    Instance = HttpContext.Request.Path
                });
            }

            var orderDto = MapToOrderDto(order);

            _logger.LogInformation("Successfully retrieved order {OrderNumber} (ID: {OrderId})", 
                order.OrderNumber, order.OrderId);

            // Set cache headers for client-side caching (5 minutes)
            Response.Headers.Append("Cache-Control", "private, max-age=300");

            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving order with ID: {OrderId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "An error occurred",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred while retrieving the order",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Get order details by order number.
    /// Retrieves complete order information using the order number (e.g., ORD-20260128-001).
    /// </summary>
    /// <param name="orderNumber">The order number in format ORD-YYYYMMDD-###</param>
    /// <returns>Order details including all items</returns>
    /// <response code="200">Returns the order with complete details</response>
    /// <response code="404">Order not found</response>
    /// <response code="500">Internal server error</response>
    /// <example>
    /// GET /api/orders/number/ORD-20260128-001
    /// </example>
    [HttpGet("number/{orderNumber}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Client)]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        try
        {
            _logger.LogInformation("Retrieving order with number: {OrderNumber}", orderNumber);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

            if (order == null)
            {
                _logger.LogWarning("Order with number {OrderNumber} not found", orderNumber);
                return NotFound(new ProblemDetails
                {
                    Title = "Order not found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = $"Order with number '{orderNumber}' not found",
                    Instance = HttpContext.Request.Path
                });
            }

            var orderDto = MapToOrderDto(order);

            _logger.LogInformation("Successfully retrieved order {OrderNumber} (ID: {OrderId})", 
                order.OrderNumber, order.OrderId);

            // Set cache headers for client-side caching (5 minutes)
            Response.Headers.Append("Cache-Control", "private, max-age=300");

            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving order with number: {OrderNumber}", orderNumber);
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "An error occurred",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred while retrieving the order",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Maps an Order entity to an OrderDto with all related data.
    /// </summary>
    private OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            OrderNumber = order.OrderNumber,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = JsonSerializer.Deserialize<AddressDto>(order.ShippingAddress)!,
            CustomerEmail = order.CustomerEmail,
            CustomerName = order.CustomerName,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                OrderItemId = oi.OrderItemId,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList(),
            CreatedAt = order.CreatedAt
        };
    }

    /// <summary>
    /// Generate a unique order number in the format ORD-YYYYMMDD-###.
    /// Uses daily sequential numbering that resets at midnight UTC.
    /// Thread-safe through database transaction isolation.
    /// </summary>
    /// <returns>Unique order number string (e.g., ORD-20260128-001)</returns>
    /// <remarks>
    /// The sequence number is 3-digit zero-padded (001-999) but will expand to 4+ digits
    /// if more than 999 orders are placed in a single day (with warning logged).
    /// </remarks>
    private async Task<string> GenerateUniqueOrderNumberAsync()
    {
        try
        {
            // Get current UTC date formatted as YYYYMMDD
            var currentDate = DateTime.UtcNow;
            var dateString = currentDate.ToString("yyyyMMdd");
            var pattern = $"ORD-{dateString}-%";

            _logger.LogDebug("Generating order number for date: {Date}", dateString);

            // Query for the maximum order number for today
            // The index on OrderNumber makes this query efficient
            var maxOrderNumber = await _context.Orders
                .Where(o => EF.Functions.Like(o.OrderNumber, pattern))
                .Select(o => o.OrderNumber)
                .OrderByDescending(o => o)
                .FirstOrDefaultAsync();

            int sequence = 1; // Default for first order of the day

            if (maxOrderNumber != null)
            {
                // Extract sequence number from order number format: ORD-YYYYMMDD-###
                // Split by dash and take the last part
                var parts = maxOrderNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int lastSequence))
                {
                    sequence = lastSequence + 1;
                    _logger.LogDebug("Found existing orders for date {Date}. Last sequence: {LastSequence}, Next: {NextSequence}", 
                        dateString, lastSequence, sequence);
                }
                else
                {
                    // Invalid order number format found - log warning but continue
                    _logger.LogWarning("Found order with invalid format: {OrderNumber}. Starting sequence at 001.", maxOrderNumber);
                }
            }
            else
            {
                _logger.LogDebug("No existing orders for date {Date}. Starting sequence at 001.", dateString);
            }

            // Log warning if sequence exceeds typical 3-digit range
            if (sequence > 999)
            {
                _logger.LogWarning(
                    "Order sequence for date {Date} exceeds 999 (current: {Sequence}). Using expanded sequence number.",
                    dateString, sequence);
            }

            // Generate order number with zero-padded sequence (minimum 3 digits)
            var orderNumber = $"ORD-{dateString}-{sequence:D3}";

            _logger.LogInformation("Generated order number: {OrderNumber} (sequence: {Sequence})", 
                orderNumber, sequence);

            return orderNumber;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate unique order number");
            throw new InvalidOperationException("Unable to generate unique order number", ex);
        }
    }
}
