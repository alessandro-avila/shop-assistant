namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for order details in responses.
/// </summary>
public class OrderDto
{
    /// <summary>
    /// Unique identifier for the order.
    /// </summary>
    /// <example>1</example>
    public int OrderId { get; set; }

    /// <summary>
    /// Human-readable order number (e.g., ORD-2026-12345).
    /// </summary>
    /// <example>ORD-2026-12345</example>
    public required string OrderNumber { get; set; }

    /// <summary>
    /// Total amount for the order.
    /// </summary>
    /// <example>599.98</example>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Order status (Pending, Processing, Shipped, Delivered, Cancelled).
    /// </summary>
    public required string Status { get; set; }

    /// <summary>
    /// Shipping address for the order.
    /// </summary>
    public required AddressDto ShippingAddress { get; set; }

    /// <summary>
    /// Customer email address.
    /// </summary>
    public string? CustomerEmail { get; set; }

    /// <summary>
    /// Customer full name.
    /// </summary>
    public string? CustomerName { get; set; }

    /// <summary>
    /// List of items in the order.
    /// </summary>
    public required List<OrderItemDto> Items { get; set; }

    /// <summary>
    /// Timestamp when the order was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Estimated delivery date (CreatedAt + 7 days).
    /// </summary>
    public DateTime EstimatedDelivery => CreatedAt.AddDays(7);
}
