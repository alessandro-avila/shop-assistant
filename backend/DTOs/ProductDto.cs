namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Product data transfer object for list views.
/// Contains core product information without full details.
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Unique product identifier.
    /// </summary>
    /// <example>1</example>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name.
    /// </summary>
    /// <example>Premium Wireless Headphones</example>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug for SEO.
    /// </summary>
    /// <example>premium-wireless-headphones</example>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Brand name (optional).
    /// </summary>
    /// <example>AudioTech</example>
    public string? Brand { get; set; }

    /// <summary>
    /// Category ID the product belongs to.
    /// </summary>
    /// <example>1</example>
    public int CategoryId { get; set; }

    /// <summary>
    /// Current price in USD.
    /// </summary>
    /// <example>299.99</example>
    public decimal Price { get; set; }

    /// <summary>
    /// Original price before discount (optional).
    /// </summary>
    /// <example>349.99</example>
    public decimal? OriginalPrice { get; set; }

    /// <summary>
    /// URL to product image.
    /// </summary>
    /// <example>https://images.unsplash.com/photo-headphones</example>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Average customer rating (0-5).
    /// </summary>
    /// <example>4.7</example>
    public decimal Rating { get; set; }

    /// <summary>
    /// Number of customer reviews.
    /// </summary>
    /// <example>1523</example>
    public int ReviewCount { get; set; }

    /// <summary>
    /// Whether product is currently in stock.
    /// </summary>
    /// <example>true</example>
    public bool InStock { get; set; }

    /// <summary>
    /// Whether product is featured on homepage.
    /// </summary>
    /// <example>true</example>
    public bool IsFeatured { get; set; }

    /// <summary>
    /// Whether product is a new arrival.
    /// </summary>
    /// <example>false</example>
    public bool IsNewArrival { get; set; }

    /// <summary>
    /// Short product description (1-2 sentences).
    /// </summary>
    /// <example>Premium over-ear headphones with active noise cancellation and 30-hour battery life.</example>
    public string? ShortDescription { get; set; }

    /// <summary>
    /// Category information (nested object).
    /// </summary>
    public CategoryDto? Category { get; set; }
    
    /// <summary>
    /// Calculated discount percentage if original price exists.
    /// </summary>
    /// <example>14</example>
    public int? DiscountPercentage =>
        OriginalPrice.HasValue && OriginalPrice.Value > Price
            ? (int)Math.Round((1 - Price / OriginalPrice.Value) * 100)
            : null;
}
