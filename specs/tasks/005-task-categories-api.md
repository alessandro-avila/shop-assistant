# Task: Categories API Implementation

**Task ID**: TASK-005  
**Priority**: P1 (High - Core Feature)  
**Estimated Effort**: 3-4 hours  
**Dependencies**: TASK-001, TASK-002, TASK-003  
**Status**: Not Started

---

## Description

Implement RESTful API endpoints for category operations including listing all categories with product counts, retrieving single category details, and getting products within a specific category. This API supports the category navigation and filtering functionality in the frontend.

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

Implement the following endpoints in `CategoriesController`:

**GET /api/categories**
- List all categories with product counts
- No pagination required (only 6 categories)
- Include product count for each category
- Returns array of categories

**GET /api/categories/{id}**
- Get single category by ID
- Include category details and metadata
- Optionally include sample products (top 10)
- Returns 404 if category not found

**GET /api/categories/{id}/products**
- Get all products in a specific category
- Support filtering, sorting, pagination (reuse Products API logic)
- Query parameters: same as Products API (minPrice, maxPrice, sortBy, etc.)
- Returns paginated product list

**GET /api/categories/slug/{slug}**
- Get single category by URL-friendly slug
- Returns category details
- Returns 404 if category not found

### 2. Data Transfer Objects (DTOs)

Create DTOs in `DTOs/` directory:

**CategoryDto** (list view):
- CategoryId
- Name
- Slug
- Description
- ImageUrl
- ProductCount (computed field)

**CategoryDetailDto** (detail view):
- All fields from CategoryDto
- SampleProducts (top 10 products, optional)
- CreatedAt

### 3. Product Count Calculation

Compute product counts efficiently:
- Use `.Select()` with `.Count()` to avoid loading all products
- Example: `ProductCount = c.Products.Count(p => p.InStock)` (only in-stock products)
- Or count all products regardless of stock status (design decision)

### 4. Category Products Endpoint

For GET /api/categories/{id}/products:
- Verify category exists (return 404 if not)
- Filter products by CategoryId
- Reuse filtering/sorting/pagination logic from Products API
- Return same paginated response format as Products API
- Support all product query parameters

### 5. Response Format

Use consistent API response wrapper:
```json
{
  "success": true,
  "data": [...],
  "message": "Categories retrieved successfully"
}
```

### 6. Error Handling

Handle specific error scenarios:
- Invalid category ID: Return 404 Not Found with message
- Invalid slug: Return 404 Not Found
- No products in category: Return 200 OK with empty array (not 404)
- Database errors: Return 500 Internal Server Error (logged)

### 7. Performance Optimization

Implement performance best practices:
- Use `AsNoTracking()` for read-only queries
- Project directly to DTOs to avoid unnecessary data loading
- Compute ProductCount in query (don't load all products)
- Consider caching category list (rarely changes)

### 8. API Documentation

Add XML comments for Swagger documentation:
- Controller-level summary
- Endpoint-level summaries and remarks
- Parameter descriptions
- Response code documentation (200, 404, 500)
- Example responses

---

## Acceptance Criteria

- [ ] CategoriesController created with all 4 endpoints
- [ ] CategoryDto and CategoryDetailDto created
- [ ] GET /api/categories returns all 6 categories with product counts
- [ ] Product counts are accurate
- [ ] GET /api/categories/{id} returns single category or 404
- [ ] GET /api/categories/slug/{slug} returns category by slug or 404
- [ ] GET /api/categories/{id}/products returns paginated products
- [ ] Category products endpoint supports filtering and sorting
- [ ] All endpoints return consistent API response format
- [ ] Error handling implemented for all scenarios
- [ ] XML comments added for Swagger documentation
- [ ] Performance optimizations applied

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `CategoriesControllerTests`
- [ ] Test GET /api/categories returns all categories
- [ ] Test product count calculation is correct
- [ ] Test GET /api/categories/{id} returns category
- [ ] Test GET /api/categories/{id} returns 404 for invalid ID
- [ ] Test GET /api/categories/slug/{slug} returns category
- [ ] Test GET /api/categories/slug/{slug} returns 404 for invalid slug
- [ ] Test GET /api/categories/{id}/products returns products
- [ ] Test GET /api/categories/{id}/products returns 404 for invalid category
- [ ] Test filtering works on category products endpoint
- [ ] Test pagination works on category products endpoint

### Integration Tests

**Test Class**: `CategoriesApiIntegrationTests`
- [ ] Test full request/response cycle for all endpoints
- [ ] Test API returns correct HTTP status codes
- [ ] Test CORS headers present in responses
- [ ] Test response format matches specification
- [ ] Test performance (response time < 200ms for category list)

### Manual Testing Checklist
- [ ] Test GET /api/categories in browser
- [ ] Verify product counts match database
- [ ] Test GET category by ID (valid and invalid)
- [ ] Test GET category by slug
- [ ] Test GET products by category with filters
- [ ] Verify Swagger documentation displays correctly

---

## Implementation Notes

### Product Count Strategy
- Option 1: Count all products (simpler)
- Option 2: Count only in-stock products (more accurate)
- Recommendation: Count all products, filter in-stock on category products endpoint

### Sample Products Feature
- Optional enhancement for CategoryDetailDto
- Include top 10 products by rating or featured status
- Provides richer detail view for frontend

### Caching Opportunity
- Category list changes rarely (only when adding/removing categories)
- Good candidate for in-memory caching
- Cache invalidation on category updates

### Code Reuse
- Reuse ProductQueryParameters and filtering logic from ProductsController
- Extract shared filtering/sorting/pagination into helper service (optional)
- Avoid duplicating code between Products and Categories endpoints

---

## Definition of Done

- [ ] CategoriesController fully implemented with all endpoints
- [ ] All DTOs created and properly structured
- [ ] Product counts calculated correctly
- [ ] Category products endpoint working with filters
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests written and passing
- [ ] Manual testing completed via Swagger UI
- [ ] Performance requirements met (< 200ms)
- [ ] XML comments complete for Swagger documentation
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] PR created and approved

---

## Related Documents

- [FRD-005: Categories API](../features/categories-api.md)
- [PRD: Section 3.6.1 RESTful API Endpoints](../prd.md#361-restful-api-endpoints)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
