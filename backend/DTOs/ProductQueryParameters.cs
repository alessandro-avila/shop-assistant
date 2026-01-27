namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Query parameters for filtering, sorting, and paginating product listings
/// </summary>
public class ProductQueryParameters
{
    private int _pageSize = 12;
    private const int MaxPageSize = 100;
    
    /// <summary>
    /// Filter by category ID
    /// </summary>
    public int? CategoryId { get; set; }
    
    /// <summary>
    /// Minimum price filter
    /// </summary>
    public decimal? MinPrice { get; set; }
    
    /// <summary>
    /// Maximum price filter
    /// </summary>
    public decimal? MaxPrice { get; set; }
    
    /// <summary>
    /// Minimum rating filter (0-5)
    /// </summary>
    public decimal? MinRating { get; set; }
    
    /// <summary>
    /// Filter by brand name (case-insensitive)
    /// </summary>
    public string? Brand { get; set; }
    
    /// <summary>
    /// Filter by stock status (true = in stock only)
    /// </summary>
    public bool? InStock { get; set; }
    
    /// <summary>
    /// Filter featured products only
    /// </summary>
    public bool? IsFeatured { get; set; }
    
    /// <summary>
    /// Filter new arrival products only
    /// </summary>
    public bool? IsNewArrival { get; set; }
    
    /// <summary>
    /// Sort field: price, rating, name, newest, featured (default: featured)
    /// </summary>
    public string SortBy { get; set; } = "featured";
    
    /// <summary>
    /// Sort order: asc or desc (default: asc for name, desc for others)
    /// </summary>
    public string SortOrder { get; set; } = "desc";
    
    /// <summary>
    /// Page number (1-based)
    /// </summary>
    public int Page { get; set; } = 1;
    
    /// <summary>
    /// Items per page (max 100)
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
