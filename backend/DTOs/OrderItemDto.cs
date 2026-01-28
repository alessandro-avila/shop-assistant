namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for an order item in order responses.
/// </summary>
public class OrderItemDto
{
    /// <summary>
    /// Unique identifier for the order item.
    /// </summary>
    public int OrderItemId { get; set; }

    /// <summary>
    /// ID of the product.
    /// </summary>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name at the time of order (snapshot for historical accuracy).
    /// </summary>
    public required string ProductName { get; set; }

    /// <summary>
    /// Quantity ordered.
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Unit price at the time of order.
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Line total for this item (Quantity × UnitPrice).
    /// </summary>
    public decimal LineTotal => Quantity * UnitPrice;
}
