# Task: Products API Implementation

**Task ID**: TASK-004  
**Priority**: P1 (High - Core Feature)  
**Estimated Effort**: 6-8 hours  
**Dependencies**: TASK-001, TASK-002, TASK-003  
**Status**: Not Started

---

## Description

Implement RESTful API endpoints for product operations including listing with filters/sorting/pagination, single product retrieval, search functionality, and featured/new arrivals endpoints. This is the primary API that the frontend will consume for product browsing functionality.

---

## Dependencies

**Blocking Tasks**:
- TASK-001: Backend Project Scaffolding
- TASK-002: Database Schema & Entity Models
- TASK-003: Data Seeding System (provides test data)

**Blocked Tasks**:
- TASK-008: Frontend API Integration (consumes these endpoints)

---

## Technical Requirements

### 1. API Endpoints

Implement the following endpoints in `ProductsController`:

**GET /api/products**
- List all products with optional filtering, sorting, and pagination
- Query parameters: categoryId, minPrice, maxPrice, minRating, brand, inStock, sortBy, sortOrder, page, pageSize
- Returns paginated product list with metadata

**GET /api/products/{id}**
- Get single product by ID
- Returns full product details with category information
- Returns 404 if product not found

**GET /api/products/slug/{slug}**
- Get single product by URL-friendly slug
- Returns full product details
- Returns 404 if product not found

**GET /api/products/search**
- Search products by keyword
- Query parameter: `q` (search query)
- Searches in: product name, description, brand
- Returns paginated results

**GET /api/products/featured**
- Get featured products only
- Optional pagination
- Returns products where `IsFeatured = true`

**GET /api/products/new-arrivals**
- Get new arrival products
- Optional pagination
- Returns products where `IsNewArrival = true`

### 2. Data Transfer Objects (DTOs)

Create DTOs in `DTOs/` directory:

**ProductDto** (list view):
- ProductId
- Name
- Slug
- Brand
- Price
- OriginalPrice (if discount)
- ImageUrl
- Rating
- ReviewCount
- InStock
- IsFeatured
- IsNewArrival
- Category (basic info: CategoryId, Name, Slug)

**ProductDetailDto** (detail view):
- All fields from ProductDto
- Description (full)
- ShortDescription
- CreatedAt
- UpdatedAt

**ProductQueryParameters**:
- CategoryId (int?)
- MinPrice (decimal?)
- MaxPrice (decimal?)
- MinRating (decimal?)
- Brand (string?)
- InStock (bool?)
- SortBy (string: "price", "rating", "name", "newest")
- SortOrder (string: "asc", "desc")
- Page (int, default 1)
- PageSize (int, default 12, max 100)

**PaginatedResponse<T>**:
- Data (List<T>)
- CurrentPage
- PageSize
- TotalItems
- TotalPages
- HasPreviousPage
- HasNextPage

### 3. Filtering Logic

Implement comprehensive filtering:
- **Category filter**: `WHERE CategoryId = @categoryId`
- **Price range**: `WHERE Price >= @minPrice AND Price <= @maxPrice`
- **Rating filter**: `WHERE Rating >= @minRating`
- **Brand filter**: `WHERE Brand = @brand` (case-insensitive)
- **Stock filter**: `WHERE InStock = @inStock`
- **Combine filters with AND logic**

### 4. Sorting Logic

Implement multi-field sorting:
- **price-asc**: Order by Price ascending
- **price-desc**: Order by Price descending
- **rating-desc**: Order by Rating descending, then ReviewCount descending
- **name-asc**: Order by Name ascending (alphabetical)
- **newest**: Order by CreatedAt descending
- **featured**: Order by IsFeatured descending, then Rating descending
- **Default**: featured sorting

### 5. Pagination Logic

Implement server-side pagination:
- Validate page number (must be ≥ 1)
- Validate page size (1-100 range)
- Calculate skip: `(page - 1) * pageSize`
- Calculate total pages: `Math.Ceiling((double)totalItems / pageSize)`
- Include pagination metadata in response

### 6. Search Functionality

Implement keyword search:
- Search in: Name, Description, ShortDescription, Brand
- Case-insensitive search
- Use `LIKE '%keyword%'` or EF Core `.Contains()`
- Option: Use Full-Text Search for better performance (advanced)
- Trim and validate search query
- Minimum query length: 2 characters

### 7. Response Format

Use consistent API response wrapper:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "pageSize": 12,
      "totalItems": 100,
      "totalPages": 9,
      "hasPreviousPage": false,
      "hasNextPage": true
    }
  },
  "message": "Products retrieved successfully"
}
```

### 8. Error Handling

Handle specific error scenarios:
- Invalid product ID: Return 404 Not Found
- Invalid query parameters: Return 400 Bad Request with validation errors
- Database errors: Return 500 Internal Server Error (logged)
- Empty results: Return 200 OK with empty array (not 404)

### 9. Performance Optimization

Implement performance best practices:
- Use `AsNoTracking()` for read-only queries
- Project to DTOs to avoid loading unnecessary data
- Include category data with `.Include(p => p.Category)`
- Add appropriate database indexes (CategoryId, Price, Rating, Slug)
- Consider response caching for featured/new arrivals (optional)

### 10. API Documentation

Add XML comments for Swagger documentation:
- Controller-level summary
- Endpoint-level summaries and remarks
- Parameter descriptions
- Response code documentation (200, 400, 404, 500)
- Example requests and responses

---

## Acceptance Criteria

- [ ] ProductsController created with all 6 endpoints
- [ ] All DTOs created (ProductDto, ProductDetailDto, ProductQueryParameters, PaginatedResponse)
- [ ] GET /api/products returns paginated product list
- [ ] Filtering works for all parameters (category, price, rating, brand, stock)
- [ ] Sorting works for all sort options
- [ ] Pagination works correctly with metadata
- [ ] GET /api/products/{id} returns single product or 404
- [ ] GET /api/products/slug/{slug} returns product by slug or 404
- [ ] GET /api/products/search returns matching products
- [ ] GET /api/products/featured returns only featured products
- [ ] GET /api/products/new-arrivals returns only new arrivals
- [ ] All endpoints return consistent API response format
- [ ] Error handling implemented for all scenarios
- [ ] XML comments added for Swagger documentation
- [ ] Performance optimizations applied (AsNoTracking, projections)

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `ProductsControllerTests`
- [ ] Test GET /api/products returns products
- [ ] Test filtering by category
- [ ] Test filtering by price range
- [ ] Test filtering by rating
- [ ] Test filtering by brand
- [ ] Test filtering by stock status
- [ ] Test sorting by price (asc/desc)
- [ ] Test sorting by rating
- [ ] Test sorting by name
- [ ] Test pagination logic
- [ ] Test GET /api/products/{id} returns product
- [ ] Test GET /api/products/{id} returns 404 for invalid ID
- [ ] Test GET /api/products/slug/{slug} returns product
- [ ] Test GET /api/products/search returns matching products
- [ ] Test search with empty query
- [ ] Test GET /api/products/featured returns only featured
- [ ] Test GET /api/products/new-arrivals returns only new arrivals

**Test Class**: `ProductDtoMappingTests`
- [ ] Test mapping from Product entity to ProductDto
- [ ] Test mapping from Product entity to ProductDetailDto
- [ ] Test category information included in DTO

### Integration Tests

**Test Class**: `ProductsApiIntegrationTests`
- [ ] Test full request/response cycle for GET /api/products
- [ ] Test API returns correct HTTP status codes
- [ ] Test CORS headers present in responses
- [ ] Test API response format matches specification
- [ ] Test pagination metadata accuracy
- [ ] Test performance (response time < 500ms for listing)
- [ ] Test performance (response time < 200ms for single product)

### Manual Testing Checklist
- [ ] Test GET /api/products in browser
- [ ] Test filtering combinations in Swagger UI
- [ ] Test sorting options
- [ ] Test pagination navigation (page 1, 2, 3, last)
- [ ] Test search with various keywords
- [ ] Test featured products endpoint
- [ ] Test new arrivals endpoint
- [ ] Test GET product by ID (valid and invalid)
- [ ] Test GET product by slug
- [ ] Verify Swagger documentation displays correctly

---

## Implementation Notes

### Query Optimization Tips
- Always use `AsNoTracking()` for read operations
- Use `Select()` to project directly to DTOs (avoid loading full entities)
- Eager load Category with `.Include()` to avoid N+1 queries
- Consider using compiled queries for frequently used filters

### DTO Mapping Strategy
- Manual mapping for simple cases (fast, explicit)
- Consider AutoMapper if many DTOs (reduces boilerplate)
- Ensure DTOs don't expose internal IDs unnecessarily

### Pagination Best Practices
- Limit maximum page size to prevent abuse (100 max)
- Return pagination metadata even when no results
- Consider cursor-based pagination for large datasets (future enhancement)

### Search Implementation Options
1. **Basic**: Use `.Contains()` - simple, works for small datasets
2. **Advanced**: Use SQL Server Full-Text Search - better performance for large catalogs
3. **Premium**: Use Azure Cognitive Search - best for production

### Caching Considerations
- Featured products rarely change - good candidate for caching
- Product details change more often - cache carefully or don't cache
- Use cache invalidation strategy when products update

---

## Definition of Done

- [ ] ProductsController fully implemented with all endpoints
- [ ] All DTOs created and properly structured
- [ ] Filtering, sorting, and pagination working correctly
- [ ] Search functionality implemented
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests written and passing
- [ ] Manual testing completed via Swagger UI
- [ ] Performance requirements met (< 500ms listing, < 200ms detail)
- [ ] XML comments complete for Swagger documentation
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] API documentation updated in README or docs
- [ ] PR created and approved

---

## Related Documents

- [FRD-004: Products API](../features/products-api.md)
- [PRD: Section 3.6.1 RESTful API Endpoints](../prd.md#361-restful-api-endpoints)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
