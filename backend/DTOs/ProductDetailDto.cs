namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Detailed product information for product detail views
/// </summary>
public class ProductDetailDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string? Brand { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool InStock { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public CategoryDto? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Calculated discount percentage if original price exists
    /// </summary>
    public int? DiscountPercentage =>
        OriginalPrice.HasValue && OriginalPrice.Value > Price
            ? (int)Math.Round((1 - Price / OriginalPrice.Value) * 100)
            : null;
}
