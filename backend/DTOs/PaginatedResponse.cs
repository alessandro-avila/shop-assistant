namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Generic paginated response wrapper
/// </summary>
/// <typeparam name="T">Type of items in the collection</typeparam>
public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;
    
    public PaginatedResponse()
    {
    }
    
    public PaginatedResponse(List<T> items, int count, int page, int pageSize)
    {
        Items = items;
        TotalItems = count;
        CurrentPage = page;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }
}
