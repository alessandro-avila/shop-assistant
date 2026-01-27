using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAssistant.Api.Data;
using ShopAssistant.Api.DTOs;

namespace ShopAssistant.Api.Controllers;

/// <summary>
/// API controller for managing products.
/// Provides endpoints for product catalog browsing, searching, and filtering.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("Products")]
public class ProductsController : ControllerBase
{
    private readonly ShopDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ShopDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with optional filtering, sorting, and pagination
    /// </summary>
    /// <param name="parameters">Query parameters for filtering and pagination</param>
    /// <returns>Paginated list of products</returns>
    /// <response code="200">Returns the paginated product list</response>
    /// <response code="400">Invalid query parameters</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedResponse<ProductDto>>> GetProducts([FromQuery] ProductQueryParameters parameters)
    {
        try
        {
            // Validate parameters
            if (parameters.Page < 1)
                return BadRequest("Page number must be at least 1");
            
            if (parameters.PageSize < 1)
                return BadRequest("Page size must be at least 1");

            // Start with base query
            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking();

            // Apply filters
            query = ApplyFilters(query, parameters);

            // Get total count before pagination
            var totalItems = await query.CountAsync();

            // Apply sorting
            query = ApplySorting(query, parameters);

            // Apply pagination
            var products = await query
                .Skip((parameters.Page - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    ShortDescription = p.ShortDescription,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .ToListAsync();

            var response = new PaginatedResponse<ProductDto>(
                products,
                totalItems,
                parameters.Page,
                parameters.PageSize
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    /// <summary>
    /// Get a single product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    /// <response code="200">Returns the product details</response>
    /// <response code="404">Product not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDetailDto>> GetProduct(int id)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDetailDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Description = p.Description,
                    ShortDescription = p.ShortDescription,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    /// <summary>
    /// Get a single product by slug
    /// </summary>
    /// <param name="slug">Product URL slug</param>
    /// <returns>Product details</returns>
    /// <response code="200">Returns the product details</response>
    /// <response code="404">Product not found</response>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(typeof(ProductDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDetailDto>> GetProductBySlug(string slug)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p => p.Slug == slug)
                .Select(p => new ProductDetailDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Description = p.Description,
                    ShortDescription = p.ShortDescription,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound($"Product with slug '{slug}' not found");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product by slug {Slug}", slug);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    /// <summary>
    /// Search products by keyword
    /// </summary>
    /// <param name="q">Search query</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 12)</param>
    /// <returns>Paginated search results</returns>
    /// <response code="200">Returns matching products</response>
    /// <response code="400">Invalid search query</response>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PaginatedResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedResponse<ProductDto>>> SearchProducts(
        [FromQuery] string? q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Search query cannot be empty");

            if (q.Length < 2)
                return BadRequest("Search query must be at least 2 characters");

            if (page < 1)
                return BadRequest("Page number must be at least 1");

            pageSize = Math.Min(pageSize, 100); // Max 100 items per page

            var searchTerm = q.Trim().ToLower();

            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p =>
                    p.Name.ToLower().Contains(searchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                    (p.ShortDescription != null && p.ShortDescription.ToLower().Contains(searchTerm)) ||
                    (p.Brand != null && p.Brand.ToLower().Contains(searchTerm))
                );

            var totalItems = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.Rating)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    ShortDescription = p.ShortDescription,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .ToListAsync();

            var response = new PaginatedResponse<ProductDto>(
                products,
                totalItems,
                page,
                pageSize
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products with query {Query}", q);
            return StatusCode(500, "An error occurred while searching products");
        }
    }

    /// <summary>
    /// Get featured products
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 12)</param>
    /// <returns>Paginated list of featured products</returns>
    /// <response code="200">Returns featured products</response>
    [HttpGet("featured")]
    [ProducesResponseType(typeof(PaginatedResponse<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse<ProductDto>>> GetFeaturedProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        try
        {
            pageSize = Math.Min(pageSize, 100);

            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p => p.IsFeatured);

            var totalItems = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.Rating)
                .ThenByDescending(p => p.ReviewCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    ShortDescription = p.ShortDescription,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .ToListAsync();

            var response = new PaginatedResponse<ProductDto>(
                products,
                totalItems,
                page,
                pageSize
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured products");
            return StatusCode(500, "An error occurred while retrieving featured products");
        }
    }

    /// <summary>
    /// Get new arrival products
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 12)</param>
    /// <returns>Paginated list of new arrival products</returns>
    /// <response code="200">Returns new arrival products</response>
    [HttpGet("new-arrivals")]
    [ProducesResponseType(typeof(PaginatedResponse<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse<ProductDto>>> GetNewArrivals(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        try
        {
            pageSize = Math.Min(pageSize, 100);

            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p => p.IsNewArrival);

            var totalItems = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Slug = p.Slug,
                    Brand = p.Brand,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    ShortDescription = p.ShortDescription,
                    Category = p.Category != null ? new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    } : null
                })
                .ToListAsync();

            var response = new PaginatedResponse<ProductDto>(
                products,
                totalItems,
                page,
                pageSize
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving new arrival products");
            return StatusCode(500, "An error occurred while retrieving new arrival products");
        }
    }

    // Private helper methods for filtering and sorting
    private IQueryable<Models.Product> ApplyFilters(
        IQueryable<Models.Product> query,
        ProductQueryParameters parameters)
    {
        if (parameters.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == parameters.CategoryId.Value);

        if (parameters.MinPrice.HasValue)
            query = query.Where(p => p.Price >= parameters.MinPrice.Value);

        if (parameters.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= parameters.MaxPrice.Value);

        if (parameters.MinRating.HasValue)
            query = query.Where(p => p.Rating >= parameters.MinRating.Value);

        if (!string.IsNullOrWhiteSpace(parameters.Brand))
            query = query.Where(p => p.Brand != null && p.Brand.ToLower() == parameters.Brand.ToLower());

        if (parameters.InStock.HasValue)
            query = query.Where(p => p.InStock == parameters.InStock.Value);

        if (parameters.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == parameters.IsFeatured.Value);

        if (parameters.IsNewArrival.HasValue)
            query = query.Where(p => p.IsNewArrival == parameters.IsNewArrival.Value);

        return query;
    }

    private IQueryable<Models.Product> ApplySorting(
        IQueryable<Models.Product> query,
        ProductQueryParameters parameters)
    {
        var sortBy = parameters.SortBy?.ToLower() ?? "featured";
        var sortOrder = parameters.SortOrder?.ToLower() ?? "desc";

        query = sortBy switch
        {
            "price" => sortOrder == "asc"
                ? query.OrderBy(p => p.Price)
                : query.OrderByDescending(p => p.Price),
            
            "rating" => query.OrderByDescending(p => p.Rating)
                              .ThenByDescending(p => p.ReviewCount),
            
            "name" => sortOrder == "asc"
                ? query.OrderBy(p => p.Name)
                : query.OrderByDescending(p => p.Name),
            
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            
            "featured" or _ => query.OrderByDescending(p => p.IsFeatured)
                                    .ThenByDescending(p => p.Rating)
                                    .ThenByDescending(p => p.ReviewCount)
        };

        return query;
    }
}
