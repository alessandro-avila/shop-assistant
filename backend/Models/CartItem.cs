using System.ComponentModel.DataAnnotations;

namespace ShopAssistant.Api.Models;

/// <summary>
/// Represents an item in a shopping cart (optional - can use localStorage in frontend)
/// </summary>
public class CartItem
{
    [Key]
    public int CartItemId { get; set; }

    [Required]
    [MaxLength(100)]
    public string SessionId { get; set; } = string.Empty;

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
}
