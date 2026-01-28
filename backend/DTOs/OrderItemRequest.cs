using System.ComponentModel.DataAnnotations;

namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for an order item in the order creation request.
/// </summary>
public class OrderItemRequest
{
    /// <summary>
    /// ID of the product being ordered.
    /// </summary>
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Product ID must be greater than 0")]
    public int ProductId { get; set; }

    /// <summary>
    /// Quantity of the product being ordered.
    /// </summary>
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    /// <summary>
    /// Unit price of the product at time of order.
    /// </summary>
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
    public decimal UnitPrice { get; set; }
}
