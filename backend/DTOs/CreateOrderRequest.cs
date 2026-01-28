using System.ComponentModel.DataAnnotations;

namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for creating a new order.
/// </summary>
public class CreateOrderRequest
{
    /// <summary>
    /// List of items in the order. Must contain at least one item.
    /// </summary>
    /// <example>
    /// [
    ///   {
    ///     "productId": 1,
    ///     "quantity": 2,
    ///     "unitPrice": 299.99
    ///   }
    /// ]
    /// </example>
    [Required]
    [MinLength(1, ErrorMessage = "Order must contain at least one item")]
    public required List<OrderItemRequest> Items { get; set; }

    /// <summary>
    /// Total amount for the order. Should match sum of (Quantity * UnitPrice) for all items.
    /// </summary>
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than 0")]
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Shipping address for the order.
    /// Contains customer contact info (name, email, phone) and shipping address.
    /// </summary>
    [Required]
    public required AddressDto ShippingAddress { get; set; }
}
