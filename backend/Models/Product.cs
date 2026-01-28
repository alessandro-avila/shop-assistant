using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopAssistant.Api.Models;

/// <summary>
/// Represents a product in the shop catalog
/// </summary>
public class Product
{
    [Key]
    public int ProductId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ShortDescription { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OriginalPrice { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [MaxLength(100)]
    public string? Brand { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Column(TypeName = "decimal(3,2)")]
    [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
    public decimal Rating { get; set; } = 0;

    public int ReviewCount { get; set; } = 0;

    public bool InStock { get; set; } = true;

    public bool IsFeatured { get; set; } = false;

    public bool IsNewArrival { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
