# ADR 006: Backend API Architecture and Patterns

**Date**: January 27, 2026  
**Status**: Accepted  
**Deciders**: Development Team

---

## Context and Problem Statement

The Shop Assistant backend API needs a consistent architecture for implementing RESTful endpoints with filtering, pagination, search, and sorting capabilities. Key decisions include:

- **DTO Pattern**: How to structure data transfer objects for different views
- **Query Parameters**: How to handle complex filtering and sorting
- **Pagination**: How to implement efficient server-side pagination
- **Performance**: How to optimize database queries
- **Error Handling**: How to provide consistent error responses
- **Code Reuse**: How to avoid duplication across similar endpoints

The implementation needs to support both list views (lightweight) and detail views (comprehensive) while maintaining performance and code maintainability.

---

## Decision Drivers

* **Performance**: Database queries must be efficient (< 200ms response time)
* **Consistency**: All endpoints should follow the same patterns and conventions
* **Type Safety**: Strong typing throughout the API layer
* **Maintainability**: Code should be modular and reusable
* **Developer Experience**: Easy to add new endpoints following established patterns
* **API Usability**: Intuitive query parameters and response formats

---

## Considered Options

### Option 1: Thin DTOs with Automatic Mapping (AutoMapper)
Use AutoMapper to automatically map entities to DTOs with minimal manual configuration.

**Pros**:
- Less boilerplate code
- Automatic property mapping
- Convention-based approach

**Cons**:
- Hidden complexity and "magic" behavior
- Performance overhead from reflection
- Difficult to debug mapping issues
- Extra dependency to maintain
- Less explicit control over projections

### Option 2: Manual DTO Projections with LINQ Select
Manually project entities to DTOs using LINQ `.Select()` expressions in queries.

**Pros**:
- **Explicit and transparent**: Clear what data is being fetched
- **Best performance**: EF Core translates to optimal SQL SELECT
- **No extra dependencies**: Uses built-in EF Core capabilities
- **Type-safe**: Compile-time checking of all mappings
- **Debuggable**: Easy to trace and understand data flow

**Cons**:
- More verbose code (but more maintainable)
- Manual mapping for each query

### Option 3: Repository Pattern with Service Layer
Create repository classes for each entity with a service layer for business logic.

**Pros**:
- Clear separation of concerns
- Testable through interface abstraction
- Centralized data access logic

**Cons**:
- **Over-engineering for simple CRUD**: Adds unnecessary abstraction layers
- **EF Core DbContext is already a repository**: Double abstraction
- More files and complexity
- DbContext and Unit of Work already provide repository benefits

---

## Decision Outcome

**Chosen option**: **Option 2 - Manual DTO Projections with LINQ Select**

### Rationale

1. **Performance First**: Manual projections with `.Select()` generate optimal SQL that fetches only needed columns
2. **Explicit > Implicit**: Code is clear and maintainable - no hidden mapping logic
3. **EF Core Native**: Leverages EF Core's query capabilities without additional dependencies
4. **Type Safety**: Full compile-time type checking prevents runtime errors
5. **Simple Architecture**: DbContext injection into controllers is sufficient for this application's complexity

### Implementation Patterns Established

**DTO Organization**:
- `CategoryDto`: Basic category info for nested objects (3 properties)
- `ProductDto`: List view with calculated fields (14 properties + DiscountPercentage)
- `ProductDetailDto`: Detail view extending ProductDto (adds Description, timestamps)
- `CategoryDetailDto`: Detail view with optional sample products
- `ProductQueryParameters`: Typed query parameter object (8 filters, 2 sort options, pagination)
- `PaginatedResponse<T>`: Generic pagination wrapper with metadata

**Query Optimization**:
- `.AsNoTracking()` for all read-only queries
- `.Include()` for eager loading relationships
- `.Select()` for direct DTO projection
- Computed fields (ProductCount, DiscountPercentage) calculated in projections

**Filtering & Sorting**:
- Dedicated helper methods: `ApplyFilters()`, `ApplySorting()`
- Reusable across Controllers (Products, Categories)
- Chainable LINQ queries for composability

**Pagination Pattern**:
```csharp
var totalItems = await query.CountAsync();
var items = await query
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
return new PaginatedResponse<T>(items, totalItems, page, pageSize);
```

**Error Handling**:
- Try-catch blocks in all controller actions
- Specific status codes: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error
- Structured error messages with context
- Logging at info, warning, and error levels

### Consequences

**Positive**:
- **Fast Queries**: Optimal SQL generation, minimal data transfer
- **Clear Code**: Developers can understand data flow at a glance
- **No Magic**: Explicit control over all mappings
- **Easy Debugging**: Stack traces point to exact mapping code
- **Maintainable**: Easy to modify projections as requirements change
- **Consistent**: All endpoints follow same patterns

**Negative**:
- **Verbosity**: More code to write per endpoint (but worth it for clarity)
- **Repetition**: Similar Select() projections across endpoints (mitigated by helper methods)
- **Manual Updates**: Changes to entities require updating projections (but this makes changes explicit)

---

## Implementation Evidence

### Products API (TASK-004)
- 6 endpoints implemented following these patterns
- DTOs: CategoryDto, ProductDto, ProductDetailDto, ProductQueryParameters, PaginatedResponse<T>
- Helper methods for filtering and sorting
- Build: 0 errors, 0 warnings
- Performance: AsNoTracking + Include + Select optimizations

### Categories API (TASK-005)
- 4 endpoints reusing established patterns
- DTOs: CategoryDetailDto extending the DTO pattern
- Reused ProductQueryParameters and helper methods
- Consistent error handling and response formats
- Build: 0 errors, 0 warnings

### Metrics
- **Response Format**: 100% consistent across all endpoints
- **Performance**: All queries use AsNoTracking() and Select projections
- **Type Safety**: Strong typing throughout, no runtime mapping errors
- **Code Reuse**: Filtering/sorting logic shared between Products and Categories
- **Maintainability**: Clear separation between list views and detail views

---

## Related Decisions

- [ADR 001: Framework Selection](001-framework-selection.md) - .NET chosen as backend framework
- Future: Consider extracting shared filtering/sorting logic into a shared service if more controllers are added

---

## References

- [EF Core Query Performance Best Practices](https://learn.microsoft.com/en-us/ef/core/performance/)
- [ASP.NET Core RESTful API Best Practices](https://learn.microsoft.com/en-us/aspnet/core/web-api/)
- Backend README: Implementation details and API documentation
