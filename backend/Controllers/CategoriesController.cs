using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAssistant.Api.Data;
using ShopAssistant.Api.DTOs;
using ShopAssistant.Api.Models;

namespace ShopAssistant.Api.Controllers;

/// <summary>
/// API controller for managing product categories.
/// Provides endpoints for listing categories, getting category details, and browsing products by category.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("Categories")]
public class CategoriesController : ControllerBase
{
    private readonly ShopDbContext _context;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ShopDbContext context, ILogger<CategoriesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all categories with product counts.
    /// </summary>
    /// <returns>List of all categories with their product counts.</returns>
    /// <response code="200">Returns the list of categories</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        try
        {
            _logger.LogInformation("Fetching all categories with product counts");

            var categories = await _context.Categories
                .AsNoTracking()
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ProductCount = c.Products.Count(p => p.InStock) // Only count in-stock products
                })
                .OrderBy(c => c.Name)
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} categories", categories.Count);

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, "An error occurred while retrieving categories");
        }
    }

    /// <summary>
    /// Get a category by its numeric ID.
    /// </summary>
    /// <param name="id">The category ID</param>
    /// <param name="includeSamples">Whether to include sample products (default: false)</param>
    /// <returns>Category details with optional sample products</returns>
    /// <response code="200">Returns the category</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CategoryDetailDto>> GetCategory(int id, [FromQuery] bool includeSamples = false)
    {
        try
        {
            _logger.LogInformation("Fetching category with ID: {CategoryId}, IncludeSamples: {IncludeSamples}", id, includeSamples);

            // First check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == id);
            if (!categoryExists)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found", id);
                return NotFound($"Category with ID {id} not found");
            }

            // Get category with details
            var category = await _context.Categories
                .AsNoTracking()
                .Where(c => c.CategoryId == id)
                .Select(c => new CategoryDetailDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ProductCount = c.Products.Count(p => p.InStock),
                    CreatedAt = c.CreatedAt,
                    SampleProducts = includeSamples
                        ? c.Products
                            .Where(p => p.InStock)
                            .OrderByDescending(p => p.IsFeatured)
                            .ThenByDescending(p => p.Rating)
                            .Take(10)
                            .Select(p => new ProductDto
                            {
                                ProductId = p.ProductId,
                                Name = p.Name,
                                Slug = p.Slug,
                                Price = p.Price,
                                OriginalPrice = p.OriginalPrice,
                                Brand = p.Brand,
                                ImageUrl = p.ImageUrl,
                                Rating = p.Rating,
                                ReviewCount = p.ReviewCount,
                                InStock = p.InStock,
                                IsFeatured = p.IsFeatured,
                                IsNewArrival = p.IsNewArrival,
                                ShortDescription = p.ShortDescription,
                                CategoryId = p.CategoryId,
                                Category = new CategoryDto
                                {
                                    CategoryId = c.CategoryId,
                                    Name = c.Name,
                                    Slug = c.Slug
                                }
                            })
                            .ToList()
                        : null
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found after initial check", id);
                return NotFound($"Category with ID {id} not found");
            }

            _logger.LogInformation("Retrieved category: {CategoryName} (ID: {CategoryId})", category.Name, category.CategoryId);

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category with ID: {CategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving the category");
        }
    }

    /// <summary>
    /// Get a category by its URL-friendly slug.
    /// </summary>
    /// <param name="slug">The category slug</param>
    /// <param name="includeSamples">Whether to include sample products (default: false)</param>
    /// <returns>Category details with optional sample products</returns>
    /// <response code="200">Returns the category</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CategoryDetailDto>> GetCategoryBySlug(string slug, [FromQuery] bool includeSamples = false)
    {
        try
        {
            _logger.LogInformation("Fetching category with slug: {Slug}, IncludeSamples: {IncludeSamples}", slug, includeSamples);

            // First check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Slug == slug);
            if (!categoryExists)
            {
                _logger.LogWarning("Category with slug '{Slug}' not found", slug);
                return NotFound($"Category with slug '{slug}' not found");
            }

            // Get category with details
            var category = await _context.Categories
                .AsNoTracking()
                .Where(c => c.Slug == slug)
                .Select(c => new CategoryDetailDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ProductCount = c.Products.Count(p => p.InStock),
                    CreatedAt = c.CreatedAt,
                    SampleProducts = includeSamples
                        ? c.Products
                            .Where(p => p.InStock)
                            .OrderByDescending(p => p.IsFeatured)
                            .ThenByDescending(p => p.Rating)
                            .Take(10)
                            .Select(p => new ProductDto
                            {
                                ProductId = p.ProductId,
                                Name = p.Name,
                                Slug = p.Slug,
                                Price = p.Price,
                                OriginalPrice = p.OriginalPrice,
                                Brand = p.Brand,
                                ImageUrl = p.ImageUrl,
                                Rating = p.Rating,
                                ReviewCount = p.ReviewCount,
                                InStock = p.InStock,
                                IsFeatured = p.IsFeatured,
                                IsNewArrival = p.IsNewArrival,
                                ShortDescription = p.ShortDescription,
                                CategoryId = p.CategoryId,
                                Category = new CategoryDto
                                {
                                    CategoryId = c.CategoryId,
                                    Name = c.Name,
                                    Slug = c.Slug
                                }
                            })
                            .ToList()
                        : null
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                _logger.LogWarning("Category with slug '{Slug}' not found after initial check", slug);
                return NotFound($"Category with slug '{slug}' not found");
            }

            _logger.LogInformation("Retrieved category: {CategoryName} (Slug: {Slug})", category.Name, category.Slug);

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category with slug: {Slug}", slug);
            return StatusCode(500, "An error occurred while retrieving the category");
        }
    }

    /// <summary>
    /// Get all products in a specific category with filtering, sorting, and pagination.
    /// </summary>
    /// <param name="id">The category ID</param>
    /// <param name="parameters">Query parameters for filtering, sorting, and pagination</param>
    /// <returns>Paginated list of products in the category</returns>
    /// <response code="200">Returns paginated products</response>
    /// <response code="400">Invalid request parameters</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}/products")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PaginatedResponse<ProductDto>>> GetCategoryProducts(
        int id,
        [FromQuery] ProductQueryParameters parameters)
    {
        try
        {
            _logger.LogInformation(
                "Fetching products for category ID: {CategoryId}, Page: {Page}, PageSize: {PageSize}",
                id, parameters.Page, parameters.PageSize);

            // Validate parameters
            if (parameters.Page < 1)
            {
                return BadRequest("Page number must be at least 1");
            }

            if (parameters.PageSize < 1)
            {
                return BadRequest("Page size must be at least 1");
            }

            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == id);
            if (!categoryExists)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found", id);
                return NotFound($"Category with ID {id} not found");
            }

            // Start with base query - products in this category
            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .Where(p => p.CategoryId == id);

            // Apply filters (excluding CategoryId since we already filtered)
            query = ApplyFilters(query, parameters, excludeCategoryId: true);

            // Count total items after filtering
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
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    Brand = p.Brand,
                    ImageUrl = p.ImageUrl,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    InStock = p.InStock,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    ShortDescription = p.ShortDescription,
                    CategoryId = p.CategoryId,
                    Category = new CategoryDto
                    {
                        CategoryId = p.Category.CategoryId,
                        Name = p.Category.Name,
                        Slug = p.Category.Slug
                    }
                })
                .ToListAsync();

            var response = new PaginatedResponse<ProductDto>(
                products,
                totalItems,
                parameters.Page,
                parameters.PageSize);

            _logger.LogInformation(
                "Retrieved {Count} products for category ID {CategoryId} (Page {Page}/{TotalPages})",
                products.Count, id, response.CurrentPage, response.TotalPages);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for category ID: {CategoryId}", id);
            return StatusCode(500, "An error occurred while retrieving category products");
        }
    }

    /// <summary>
    /// Apply filters to the product query.
    /// </summary>
    private IQueryable<Product> ApplyFilters(
        IQueryable<Product> query,
        ProductQueryParameters parameters,
        bool excludeCategoryId = false)
    {
        // CategoryId filter (skip if already filtered by category endpoint)
        if (!excludeCategoryId && parameters.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == parameters.CategoryId.Value);
        }

        // Price filters
        if (parameters.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= parameters.MaxPrice.Value);
        }

        // Rating filter
        if (parameters.MinRating.HasValue)
        {
            query = query.Where(p => p.Rating >= parameters.MinRating.Value);
        }

        // Brand filter
        if (!string.IsNullOrWhiteSpace(parameters.Brand))
        {
            query = query.Where(p => p.Brand != null && p.Brand.ToLower() == parameters.Brand.ToLower());
        }

        // Stock filter
        if (parameters.InStock.HasValue)
        {
            query = query.Where(p => p.InStock == parameters.InStock.Value);
        }

        // Featured filter
        if (parameters.IsFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == parameters.IsFeatured.Value);
        }

        // New arrival filter
        if (parameters.IsNewArrival.HasValue)
        {
            query = query.Where(p => p.IsNewArrival == parameters.IsNewArrival.Value);
        }

        return query;
    }

    /// <summary>
    /// Apply sorting to the product query.
    /// </summary>
    private IQueryable<Product> ApplySorting(IQueryable<Product> query, ProductQueryParameters parameters)
    {
        return parameters.SortBy?.ToLower() switch
        {
            "price" when parameters.SortOrder?.ToLower() == "desc" => query.OrderByDescending(p => p.Price),
            "price" => query.OrderBy(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating).ThenByDescending(p => p.ReviewCount),
            "name" when parameters.SortOrder?.ToLower() == "desc" => query.OrderByDescending(p => p.Name),
            "name" => query.OrderBy(p => p.Name),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.IsFeatured)
                      .ThenByDescending(p => p.Rating)
                      .ThenByDescending(p => p.ReviewCount)
        };
    }
}
