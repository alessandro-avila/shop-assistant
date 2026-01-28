namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Basic category information for product listings and category navigation.
/// Includes product count for displaying category sizes.
/// </summary>
public class CategoryDto
{
    /// <summary>
    /// Unique identifier for the category.
    /// </summary>
    public int CategoryId { get; set; }

    /// <summary>
    /// Category name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug for SEO.
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Category description (optional).
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// URL to category image (optional).
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Total number of in-stock products in this category.
    /// Calculated field, not stored in database.
    /// </summary>
    public int ProductCount { get; set; }
}
