# Feature: Categories API

**Feature ID**: FRD-005  
**Version**: 1.0  
**Status**: Not Started  
**Created**: January 27, 2026

---

## 1. Feature Overview

Implement RESTful API endpoints for category operations: listing all categories, getting single category details, and retrieving products within a category.

---

## 2. User Stories

```gherkin
As a frontend developer,
I want to GET /api/categories,
So that I can display category navigation.

As a user,
I want to browse products by category,
So that I can find relevant items easily.
```

---

## 3. API Endpoints

### GET /api/categories
List all categories with product counts.

**Response**: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Latest gadgets and devices",
      "imageUrl": "/images/categories/electronics.jpg",
      "productCount": 20
    }
  ],
  "message": "Categories retrieved successfully"
}
```

### GET /api/categories/{id}
Get single category with details.

### GET /api/categories/{id}/products
Get all products in a category (with pagination/filtering).

**Query Parameters**: Same as Products API

---

## 4. Technical Implementation

```csharp
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ShopDbContext _context;

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Select(c => new
            {
                c.CategoryId,
                c.Name,
                c.Slug,
                c.Description,
                c.ImageUrl,
                ProductCount = c.Products.Count
            })
            .ToListAsync();

        return Ok(new { success = true, data = categories });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products.Take(10)) // Include sample products
            .FirstOrDefaultAsync(c => c.CategoryId == id);

        if (category == null)
            return NotFound(new { success = false, message = "Category not found" });

        return Ok(new { success = true, data = category });
    }

    [HttpGet("{id}/products")]
    public async Task<IActionResult> GetCategoryProducts(int id, [FromQuery] ProductQueryParameters parameters)
    {
        // Verify category exists
        if (!await _context.Categories.AnyAsync(c => c.CategoryId == id))
            return NotFound(new { success = false, message = "Category not found" });

        // Use same logic as ProductsController but filter by categoryId
        // ... (similar to Products API)
    }
}
```

---

## 5. Acceptance Criteria

- [ ] GET /api/categories returns all categories
- [ ] Product counts accurate for each category
- [ ] GET /api/categories/{id} returns single category
- [ ] GET /api/categories/{id}/products returns filtered products
- [ ] 404 for non-existent categories
- [ ] Response times < 200ms
- [ ] Swagger documentation complete

---

**Status**: Ready for Implementation  
**Priority**: P1  
**Estimated Effort**: 3-4 hours  
**Dependencies**: FRD-001, FRD-002, FRD-003
