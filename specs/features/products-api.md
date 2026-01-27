# Feature: Products API

**Feature ID**: FRD-004  
**Version**: 1.0  
**Status**: Not Started  
**Owner**: Backend Team  
**Created**: January 27, 2026  
**Last Updated**: January 27, 2026

---

## 1. Feature Overview

### 1.1 Description
Implement RESTful API endpoints for product operations including listing all products with filtering/sorting/pagination, retrieving single products by ID or slug, and searching products by keywords.

### 1.2 Business Context
Products are the core of the e-commerce experience. The frontend needs to display product listings, detail pages, search results, and filtered views. The API must support all these use cases with optimal performance.

### 1.3 Goals
- Provide fast, reliable product data access
- Support filtering by category, price, rating, stock status
- Enable product search functionality
- Support sorting by various criteria
- Return data in consistent JSON format
- Demonstrate RESTful API design patterns

### 1.4 Related PRD Sections
- Section 3.1: Product Catalog & Discovery
- Section 3.6.1: RESTful API Endpoints (Products API)
- Section 5.2.2: API Contract

---

## 2. User Stories

```gherkin
As a frontend developer,
I want to GET /api/products with filter parameters,
So that I can display filtered product listings.

As a user,
I want to see products sorted by price or rating,
So that I can find products that match my preferences.

As a user,
I want to search for products by name,
So that I can quickly find what I'm looking for.

As a frontend developer,
I want to GET /api/products/{slug} to get product details,
So that I can display the product detail page.

As a frontend developer,
I want consistent response formats,
So that I can handle all API responses uniformly.
```

---

## 3. Functional Requirements

### 3.1 API Endpoints

**[REQ-004.1] GET /api/products**
List all products with optional filtering, sorting, and pagination.

**Query Parameters**:
- `categoryId` (int, optional): Filter by category
- `minPrice` (decimal, optional): Minimum price
- `maxPrice` (decimal, optional): Maximum price
- `minRating` (decimal, optional): Minimum rating (e.g., 4.0)
- `inStockOnly` (bool, optional): Show only in-stock products
- `isFeatured` (bool, optional): Show only featured products
- `isNewArrival` (bool, optional): Show only new arrivals
- `brand` (string, optional): Filter by brand name
- `sortBy` (string, optional): Sort criteria (price, rating, name, newest)
- `sortOrder` (string, optional): asc or desc
- `page` (int, optional, default: 1): Page number
- `pageSize` (int, optional, default: 12): Items per page

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": 1,
        "name": "Premium Wireless Headphones",
        "slug": "premium-wireless-headphones",
        "shortDescription": "High-fidelity audio...",
        "price": 299.99,
        "originalPrice": 399.99,
        "discount": 25,
        "categoryId": 1,
        "categoryName": "Electronics",
        "brand": "AudioTech",
        "imageUrl": "/images/products/headphones.jpg",
        "rating": 4.7,
        "reviewCount": 1234,
        "inStock": true,
        "isFeatured": true,
        "isNewArrival": false,
        "sku": "ELEC-HP-001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 12,
      "totalItems": 87,
      "totalPages": 8
    }
  },
  "message": "Products retrieved successfully"
}
```

**[REQ-004.2] GET /api/products/{id}**
Get single product by ID.

**Path Parameters**:
- `id` (int, required): Product ID

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "productId": 1,
    "name": "Premium Wireless Headphones",
    "slug": "premium-wireless-headphones",
    "description": "Full detailed description...",
    "shortDescription": "High-fidelity audio...",
    "price": 299.99,
    "originalPrice": 399.99,
    "categoryId": 1,
    "categoryName": "Electronics",
    "brand": "AudioTech",
    "imageUrl": "/images/products/headphones.jpg",
    "images": [
      "/images/products/headphones-1.jpg",
      "/images/products/headphones-2.jpg"
    ],
    "rating": 4.7,
    "reviewCount": 1234,
    "inStock": true,
    "sku": "ELEC-HP-001",
    "isFeatured": true,
    "isNewArrival": false,
    "createdAt": "2025-12-28T10:00:00Z"
  },
  "message": "Product retrieved successfully"
}
```

**Response**: 404 Not Found (if product doesn't exist)
```json
{
  "success": false,
  "data": null,
  "message": "Product not found",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "details": "Product with ID 999 does not exist"
  }
}
```

**[REQ-004.3] GET /api/products/slug/{slug}**
Get single product by URL-friendly slug.

**Path Parameters**:
- `slug` (string, required): Product slug

**Response**: Same as GET by ID

**[REQ-004.4] GET /api/products/search**
Search products by keyword.

**Query Parameters**:
- `q` (string, required): Search query
- `page` (int, optional): Page number
- `pageSize` (int, optional): Items per page

**Response**: Same structure as GET /api/products

**Search Logic**:
- Search in product name (case-insensitive)
- Search in description
- Search in brand name
- Rank by relevance (name matches > description matches)

**[REQ-004.5] GET /api/products/featured**
Get featured products only.

**Query Parameters**:
- `limit` (int, optional, default: 10): Max number to return

**Response**: Array of products (simplified structure)

**[REQ-004.6] GET /api/products/new-arrivals**
Get new arrival products only.

**Query Parameters**:
- `limit` (int, optional, default: 10): Max number to return

**Response**: Array of products (simplified structure)

### 3.2 Business Logic

**[REQ-004.7] Filtering Logic**
- Combine multiple filters with AND logic
- Category filter: Exact match
- Price filter: Inclusive range (minPrice <= price <= maxPrice)
- Rating filter: Greater than or equal to minRating
- Brand filter: Case-insensitive exact match
- Stock filter: InStock = true

**[REQ-004.8] Sorting Logic**
- `sortBy=price`: Sort by price (default ascending)
- `sortBy=rating`: Sort by rating (default descending)
- `sortBy=name`: Sort by name alphabetically (default ascending)
- `sortBy=newest`: Sort by CreatedAt (default descending)
- Default (no sortBy): Featured first, then by creation date

**[REQ-004.9] Pagination**
- Default page size: 12 products
- Max page size: 100 products
- Return pagination metadata with every response
- Handle out-of-range page numbers gracefully

### 3.3 Error Handling

**[REQ-004.10] Validation Errors**
- Invalid ID format: 400 Bad Request
- Invalid price range (minPrice > maxPrice): 400 Bad Request
- Invalid page number (< 1): 400 Bad Request
- Invalid sortBy value: 400 Bad Request

---

## 4. Technical Specifications

### 4.1 Controller Implementation

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ShopDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ShopDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryParameters parameters)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        // Apply filters
        if (parameters.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == parameters.CategoryId);

        if (parameters.MinPrice.HasValue)
            query = query.Where(p => p.Price >= parameters.MinPrice);

        if (parameters.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= parameters.MaxPrice);

        if (parameters.MinRating.HasValue)
            query = query.Where(p => p.Rating >= parameters.MinRating);

        if (parameters.InStockOnly)
            query = query.Where(p => p.InStock);

        if (parameters.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == parameters.IsFeatured);

        if (!string.IsNullOrEmpty(parameters.Brand))
            query = query.Where(p => p.Brand.ToLower() == parameters.Brand.ToLower());

        // Apply sorting
        query = parameters.SortBy?.ToLower() switch
        {
            "price" => parameters.SortOrder == "desc" 
                ? query.OrderByDescending(p => p.Price) 
                : query.OrderBy(p => p.Price),
            "rating" => parameters.SortOrder == "asc" 
                ? query.OrderBy(p => p.Rating) 
                : query.OrderByDescending(p => p.Rating),
            "name" => parameters.SortOrder == "desc" 
                ? query.OrderByDescending(p => p.Name) 
                : query.OrderBy(p => p.Name),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt)
        };

        // Get total count before pagination
        var totalItems = await query.CountAsync();

        // Apply pagination
        var products = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Slug = p.Slug,
                ShortDescription = p.ShortDescription,
                Price = p.Price,
                OriginalPrice = p.OriginalPrice,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                Brand = p.Brand,
                ImageUrl = p.ImageUrl,
                Rating = p.Rating,
                ReviewCount = p.ReviewCount,
                InStock = p.InStock,
                IsFeatured = p.IsFeatured,
                IsNewArrival = p.IsNewArrival,
                Sku = p.Sku
            })
            .ToListAsync();

        var response = new
        {
            success = true,
            data = new
            {
                products,
                pagination = new
                {
                    currentPage = parameters.Page,
                    pageSize = parameters.PageSize,
                    totalItems,
                    totalPages = (int)Math.Ceiling(totalItems / (double)parameters.PageSize)
                }
            },
            message = "Products retrieved successfully"
        };

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.ProductId == id);

        if (product == null)
        {
            return NotFound(new
            {
                success = false,
                data = (object)null,
                message = "Product not found",
                error = new
                {
                    code = "PRODUCT_NOT_FOUND",
                    details = $"Product with ID {id} does not exist"
                }
            });
        }

        return Ok(new
        {
            success = true,
            data = new ProductDetailDto
            {
                // Map all product properties
            },
            message = "Product retrieved successfully"
        });
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetProductBySlug(string slug)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (product == null)
        {
            return NotFound(new
            {
                success = false,
                data = (object)null,
                message = "Product not found",
                error = new
                {
                    code = "PRODUCT_NOT_FOUND",
                    details = $"Product with slug '{slug}' does not exist"
                }
            });
        }

        return Ok(new { success = true, data = product, message = "Product retrieved successfully" });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return BadRequest(new
            {
                success = false,
                data = (object)null,
                message = "Search query is required",
                error = new { code = "INVALID_QUERY", details = "Parameter 'q' cannot be empty" }
            });
        }

        var searchTerm = q.ToLower();

        var query = _context.Products
            .Include(p => p.Category)
            .Where(p => 
                p.Name.ToLower().Contains(searchTerm) ||
                p.Description.ToLower().Contains(searchTerm) ||
                p.Brand.ToLower().Contains(searchTerm))
            .OrderByDescending(p => p.Name.ToLower().Contains(searchTerm)) // Name matches first
            .ThenByDescending(p => p.Rating);

        var totalItems = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto { /* ... */ })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = new { products, pagination = new { currentPage = page, pageSize, totalItems, totalPages = (int)Math.Ceiling(totalItems / (double)pageSize) } },
            message = $"Found {totalItems} products matching '{q}'"
        });
    }
}
```

### 4.2 DTOs

```csharp
public class ProductDto
{
    public int ProductId { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int? Discount => OriginalPrice.HasValue 
        ? (int)((OriginalPrice.Value - Price) / OriginalPrice.Value * 100) 
        : null;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Brand { get; set; }
    public string ImageUrl { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool InStock { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public string Sku { get; set; }
}

public class ProductDetailDto : ProductDto
{
    public string Description { get; set; }
    public List<string> Images { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductQueryParameters
{
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public decimal? MinRating { get; set; }
    public bool InStockOnly { get; set; } = false;
    public bool? IsFeatured { get; set; }
    public bool? IsNewArrival { get; set; }
    public string Brand { get; set; }
    public string SortBy { get; set; }
    public string SortOrder { get; set; } = "asc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
```

---

## 5. Dependencies

- **FRD-001**: Backend API Setup
- **FRD-002**: Database Schema
- **FRD-003**: Data Seeding (for test data)

---

## 6. Acceptance Criteria

- [ ] GET /api/products returns paginated product list
- [ ] Filtering by category, price, rating works
- [ ] Sorting by price, rating, name, newest works
- [ ] GET /api/products/{id} returns single product
- [ ] GET /api/products/slug/{slug} returns product by slug
- [ ] GET /api/products/search finds products by keyword
- [ ] 404 returned for non-existent products
- [ ] 400 returned for invalid parameters
- [ ] Response times < 500ms for listing, < 200ms for single product
- [ ] All endpoints documented in Swagger
- [ ] CORS allows frontend access
- [ ] Consistent response format used

---

**Status**: Ready for Implementation  
**Priority**: P1 (Core functionality)  
**Estimated Effort**: 6-8 hours  
**Dependencies**: FRD-001, FRD-002, FRD-003
