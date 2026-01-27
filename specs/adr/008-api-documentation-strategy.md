# ADR 008: API Documentation Strategy with Swagger/OpenAPI

**Date**: January 27, 2026  
**Status**: Accepted  
**Deciders**: Development Team

---

## Context and Problem Statement

The Shop Assistant API needs comprehensive, interactive documentation for developers to understand and consume the endpoints effectively. Key requirements include:

- **Developer Experience**: Easy to understand and test API endpoints
- **Interactive Testing**: Ability to execute requests directly from documentation
- **Schema Visibility**: Clear request/response formats with examples
- **Maintenance**: Documentation should stay synchronized with code
- **Production Safety**: Documentation should not expose sensitive information in production

Key decisions needed:
1. What documentation format and tooling to use?
2. How to keep documentation synchronized with code?
3. How to provide examples and schema information?
4. How to organize and present the documentation?

---

## Decision Drivers

* **Developer Productivity**: Easy to understand and test APIs
* **Code Synchronization**: Documentation must stay up-to-date with implementation
* **Standards Compliance**: Follow OpenAPI/Swagger standards
* **Interactive Experience**: Developers should be able to test endpoints
* **Low Maintenance**: Minimal manual effort to maintain documentation
* **Security**: Don't expose documentation in production environments

---

## Considered Options

### Option 1: Manual Markdown Documentation
Maintain API documentation as separate Markdown files in `/docs/api/`.

**Pros**:
- Full control over documentation format
- Can include custom examples and tutorials
- No additional dependencies

**Cons**:
- **High maintenance burden**: Requires manual updates on every change
- **No interactive testing**: Developers must use separate tools (curl, Postman)
- **Easy to get out of sync**: Documentation often lags behind code changes
- **No automatic schema generation**: Must manually document all DTOs

### Option 2: Swagger/OpenAPI with XML Comments
Use Swashbuckle.AspNetCore to generate OpenAPI documentation from XML comments in code.

**Pros**:
- **Automatic generation**: Documentation generated from code at build time
- **Always synchronized**: Documentation reflects actual code
- **Interactive UI**: Swagger UI provides "Try it out" functionality
- **Standards-based**: OpenAPI/Swagger is industry standard
- **XML comments**: Documentation lives alongside code (easier to maintain)
- **Schema generation**: DTOs automatically documented with examples

**Cons**:
- Additional package dependency
- Requires XML comment discipline from developers
- Limited customization compared to manual documentation

### Option 3: API Blueprint or RAML
Use alternative API documentation specifications like API Blueprint or RAML.

**Pros**:
- Powerful documentation specifications
- Can generate mock servers

**Cons**:
- **Less popular than OpenAPI**: Smaller ecosystem
- **Manual specification**: Still requires writing separate specification files
- **Less .NET support**: Fewer mature tools for .NET
- **Synchronization issues**: Specification can drift from implementation

---

## Decision Outcome

**Chosen option**: **Option 2 - Swagger/OpenAPI with XML Comments**

### Rationale

1. **Automatic Synchronization**: XML comments are part of the source code, ensuring documentation stays current
2. **Interactive Testing**: Swagger UI enables immediate endpoint testing without external tools
3. **Industry Standard**: OpenAPI is the de facto standard for REST API documentation
4. **Developer Experience**: Comprehensive, searchable, and explorable API documentation
5. **Low Maintenance**: Documentation is generated automatically from code annotations
6. **Rich Ecosystem**: Excellent tooling support (.NET, JavaScript, Python clients can be generated)

### Implementation Decisions

**XML Documentation Generation**:
```xml
<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

**Swagger Configuration**:
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Version = "v1",
        Title = "Shop Assistant API",
        Description = "E-commerce demo API...",
        Contact = new() { ... },
        License = new() { ... }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Enable Swagger Annotations
    options.EnableAnnotations();

    // Group by controller
    options.TagActionsBy(api => new[] { 
        api.GroupName ?? api.ActionDescriptor.RouteValues["controller"] ?? "API" 
    });
});
```

**Controller Organization**:
- `[Tags("Products")]` attribute groups endpoints
- XML `<summary>` describes controller purpose
- Each endpoint fully documented with `<param>`, `<returns>`, `<response>` tags

**DTO Documentation**:
- XML comments on all properties
- `<example>` tags provide sample values
- Calculated properties documented (e.g., DiscountPercentage, EstimatedDelivery)

**Environment Restriction**:
```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

---

## Consequences

### Positive

- **Always Current**: Documentation automatically reflects code changes
- **Interactive**: Developers can test endpoints without writing code
- **Discoverable**: All endpoints visible and searchable in one place
- **Standards-Based**: OpenAPI spec can generate client SDKs
- **Developer-Friendly**: Lower barrier to API adoption
- **Type-Safe**: Documentation reflects actual .NET types and validation rules

### Negative

- **XML Comment Discipline**: Developers must write comprehensive XML comments
- **Build Warnings**: Missing XML comments generate warnings (suppressed with NoWarn 1591)
- **Limited Customization**: Swagger UI customization is constrained compared to custom documentation
- **Development Only**: Production environments don't have interactive documentation (by design for security)

---

## Documentation Standards Established

### XML Comment Requirements

**Controllers:**
```csharp
/// <summary>
/// API controller for managing products.
/// Provides endpoints for product catalog browsing, searching, and filtering.
/// </summary>
[Tags("Products")]
public class ProductsController : ControllerBase
```

**Endpoints:**
```csharp
/// <summary>
/// Get all products with optional filtering, sorting, and pagination
/// </summary>
/// <param name="parameters">Query parameters for filtering and pagination</param>
/// <returns>Paginated list of products</returns>
/// <response code="200">Returns the paginated product list</response>
/// <response code="400">Invalid query parameters</response>
/// <response code="500">Internal server error</response>
```

**DTOs:**
```csharp
/// <summary>
/// Product data transfer object for list views.
/// Contains core product information without full details.
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Unique product identifier.
    /// </summary>
    /// <example>1</example>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name.
    /// </summary>
    /// <example>Premium Wireless Headphones</example>
    public string Name { get; set; }
}
```

### Quality Gates

- All public controllers must have XML summaries
- All endpoints must document all possible status codes
- All DTO properties must have descriptions
- All DTOs should include example values
- No XML comment warnings (CS1591) in build output

---

## Implementation Evidence

### TASK-007: Swagger/OpenAPI Documentation
- XML documentation generation enabled in .csproj
- Swagger configuration enhanced with metadata (title, description, contact, license)
- Swashbuckle.AspNetCore.Annotations package added (10.1.0)
- All controllers tagged with `[Tags]` attribute
- ProductDto enhanced with comprehensive XML comments and examples
- OrderDto and AddressDto enhanced with example values
- CreateOrderRequest enhanced with example JSON
- Build: 0 errors, 0 warnings
- Swagger UI accessible at http://localhost:5250/swagger

### Verified Features
- ✅ Interactive "Try it out" functionality works
- ✅ All 13 endpoints visible and grouped by controller
- ✅ Request/response schemas display correctly
- ✅ Example values appear in Swagger UI
- ✅ Status codes documented for all endpoints
- ✅ XML comments render properly in documentation
- ✅ Environment-restricted (Development only)

---

## Related Decisions

- [ADR 006: Backend API Architecture](006-backend-api-architecture.md) - DTO patterns and API design
- Future: Consider generating TypeScript client from OpenAPI spec for frontend

---

## References

- [Swashbuckle Documentation](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)
- [OpenAPI Specification](https://swagger.io/specification/)
- [ASP.NET Core API Documentation with Swagger](https://learn.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger)
- Backend README: Swagger/OpenAPI Documentation section
