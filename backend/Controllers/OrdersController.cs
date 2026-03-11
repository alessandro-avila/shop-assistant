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
            _logger.LogInformation("Creating new order for customer: {CustomerEmail}", request.CustomerEmail);

            // Validate request
            if (request.Items == null || !request.Items.Any())
            {
                _logger.LogWarning("Order creation failed: No items in order");
                return BadRequest("Order must contain at least one item");
            }

            // Validate all products exist before starting transaction
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var existingProducts = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToDictionaryAsync(p => p.ProductId, p => p.Name);

            foreach (var item in request.Items)
            {
                if (!existingProducts.ContainsKey(item.ProductId))
                {
                    _logger.LogWarning("Order creation failed: Product ID {ProductId} not found", item.ProductId);
                    return BadRequest($"Product with ID {item.ProductId} not found");
                }
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

            // Use execution strategy to wrap the transaction (required by SqlServerRetryingExecutionStrategy)
            var strategy = _context.Database.CreateExecutionStrategy();

            var orderDto = await strategy.ExecuteAsync(async () =>
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
                        CustomerEmail = request.CustomerEmail,
                        CustomerName = request.CustomerName,
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
                        var orderItem = new OrderItem
                        {
                            OrderId = order.OrderId,
                            ProductId = itemRequest.ProductId,
                            ProductName = existingProducts[itemRequest.ProductId], // Snapshot product name
                            Quantity = itemRequest.Quantity,
                            UnitPrice = itemRequest.UnitPrice
                        };

                        orderItems.Add(orderItem);
                        _context.OrderItems.Add(orderItem);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation(
                        "Order {OrderNumber} created successfully with {ItemCount} items",
                        order.OrderNumber, orderItems.Count);

                    // Build response DTO
                    return new OrderDto
                    {
                        OrderId = order.OrderId,
                        OrderNumber = order.OrderNumber,
                        TotalAmount = order.TotalAmount,
                        Status = order.Status,
                        ShippingAddress = JsonSerializer.Deserialize<AddressDto>(order.ShippingAddress)!,
                        CustomerEmail = order.CustomerEmail,
                        CustomerName = order.CustomerName,
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
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error creating order, transaction rolled back");
                    throw;
                }
            });

            // Return 201 Created with Location header
            return CreatedAtAction(
                nameof(GetOrder),
                new { id = orderDto.OrderId },
                orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating order");
            return StatusCode(500, "An error occurred while creating the order");
        }
    }

    /// <summary>
    /// Get order details by order ID.
    /// </summary>
    /// <param name="id">The order ID</param>
    /// <returns>Order details including all items</returns>
    /// <response code="200">Returns the order</response>
    /// <response code="404">Order not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        try
        {
            _logger.LogInformation("Fetching order with ID: {OrderId}", id);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found", id);
                return NotFound($"Order with ID {id} not found");
            }

            // Deserialize shipping address and build DTO
            var orderDto = new OrderDto
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

            _logger.LogInformation("Retrieved order: {OrderNumber}", order.OrderNumber);

            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order with ID: {OrderId}", id);
            return StatusCode(500, "An error occurred while retrieving the order");
        }
    }

    /// <summary>
    /// Get order details by order number.
    /// </summary>
    /// <param name="orderNumber">The order number (e.g., ORD-2026-12345)</param>
    /// <returns>Order details including all items</returns>
    /// <response code="200">Returns the order</response>
    /// <response code="404">Order not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("number/{orderNumber}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        try
        {
            _logger.LogInformation("Fetching order with number: {OrderNumber}", orderNumber);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

            if (order == null)
            {
                _logger.LogWarning("Order with number {OrderNumber} not found", orderNumber);
                return NotFound($"Order with number '{orderNumber}' not found");
            }

            // Deserialize shipping address and build DTO
            var orderDto = new OrderDto
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

            _logger.LogInformation("Retrieved order: {OrderNumber} (ID: {OrderId})", 
                order.OrderNumber, order.OrderId);

            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order with number: {OrderNumber}", orderNumber);
            return StatusCode(500, "An error occurred while retrieving the order");
        }
    }

    /// <summary>
    /// Generate a unique order number in the format ORD-YYYY-XXXXX.
    /// Ensures uniqueness by checking existing order numbers and retrying on collision.
    /// </summary>
    /// <returns>Unique order number string</returns>
    private async Task<string> GenerateUniqueOrderNumberAsync()
    {
        var year = DateTime.UtcNow.Year;
        var random = new Random();
        string orderNumber;
        int attempts = 0;
        const int maxAttempts = 10;

        do
        {
            var randomNumber = random.Next(10000, 99999);
            orderNumber = $"ORD-{year}-{randomNumber:D5}";
            attempts++;

            if (attempts > maxAttempts)
            {
                _logger.LogError("Failed to generate unique order number after {Attempts} attempts", attempts);
                throw new InvalidOperationException("Unable to generate unique order number");
            }

        } while (await _context.Orders.AnyAsync(o => o.OrderNumber == orderNumber));

        _logger.LogDebug("Generated unique order number: {OrderNumber} (attempts: {Attempts})", 
            orderNumber, attempts);

        return orderNumber;
    }
}
