namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for detailed category information.
/// Includes all basic category data plus optional sample products.
/// </summary>
public class CategoryDetailDto
{
    /// <summary>
    /// Unique identifier for the category.
    /// </summary>
    public int CategoryId { get; set; }

    /// <summary>
    /// Category name.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// URL-friendly slug for SEO.
    /// </summary>
    public required string Slug { get; set; }

    /// <summary>
    /// Category description (optional).
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// URL to category image (optional).
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Total number of products in this category.
    /// </summary>
    public int ProductCount { get; set; }

    /// <summary>
    /// Sample products from this category (up to 10).
    /// Optional - only included when explicitly requested.
    /// </summary>
    public List<ProductDto>? SampleProducts { get; set; }

    /// <summary>
    /// Timestamp when category was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
