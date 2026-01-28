# Feature: API Documentation with Swagger

**Feature ID**: FRD-009  
**Version**: 1.0  
**Status**: Not Started  
**Created**: January 27, 2026

---

## 1. Feature Overview

Configure comprehensive Swagger/OpenAPI documentation for all API endpoints with descriptions, examples, and interactive testing capability.

---

## 2. User Stories

```gherkin
As a frontend developer,
I want interactive API documentation,
So that I can test endpoints without writing code.

As a new team member,
I want to see all available endpoints,
So that I can understand the API quickly.

As a presenter,
I want to demonstrate the API visually,
So that stakeholders can see the backend capabilities.
```

---

## 3. Functional Requirements

**[REQ-009.1] Swagger UI Configuration**
- Available at `/swagger` endpoint
- Only enabled in Development environment
- Shows all API endpoints grouped by controller
- Interactive "Try it out" functionality

**[REQ-009.2] Endpoint Documentation**
Each endpoint must include:
- HTTP method and route
- Description of what it does
- Request parameters with types and descriptions
- Request body schema (for POST/PUT)
- Response schema with example
- Possible status codes (200, 400, 404, 500)
- Example request/response

**[REQ-009.3] Schema Documentation**
- All DTOs documented with XML comments
- Property descriptions
- Required vs optional fields
- Data types and formats
- Example values

---

## 4. Technical Implementation

### 4.1 Install Swashbuckle

```xml
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.*" />
```

### 4.2 Configure in Program.cs

```csharp
// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Shop Assistant API",
        Description = "E-commerce demo API for products, categories, and orders",
        Contact = new OpenApiContact
        {
            Name = "Shop Assistant Team",
            Email = "support@shopassistant.demo"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Add response examples
    options.EnableAnnotations();
});

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Shop Assistant API v1");
        options.RoutePrefix = "swagger"; // Access at /swagger
        options.DocumentTitle = "Shop Assistant API Documentation";
    });
}
```

### 4.3 Enable XML Documentation

```xml
<!-- .csproj -->
<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

### 4.4 Document Endpoints with XML Comments

```csharp
/// <summary>
/// Get all products with optional filtering and pagination
/// </summary>
/// <param name="parameters">Query parameters for filtering, sorting, and pagination</param>
/// <returns>Paginated list of products</returns>
/// <response code="200">Returns the list of products</response>
/// <response code="400">If the request parameters are invalid</response>
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<ProductListResponse>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> GetProducts([FromQuery] ProductQueryParameters parameters)
{
    // Implementation
}

/// <summary>
/// Get a specific product by ID
/// </summary>
/// <param name="id">The product ID</param>
/// <returns>Product details</returns>
/// <response code="200">Returns the product</response>
/// <response code="404">If the product is not found</response>
[HttpGet("{id}")]
[ProducesResponseType(typeof(ApiResponse<Product>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> GetProduct(int id)
{
    // Implementation
}
```

### 4.5 Document DTOs

```csharp
/// <summary>
/// Product data transfer object
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Unique product identifier
    /// </summary>
    /// <example>42</example>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    /// <example>Premium Wireless Headphones</example>
    public string Name { get; set; }

    /// <summary>
    /// Current price in USD
    /// </summary>
    /// <example>299.99</example>
    public decimal Price { get; set; }

    /// <summary>
    /// Average rating (0-5)
    /// </summary>
    /// <example>4.7</example>
    public decimal Rating { get; set; }
}
```

---

## 5. Swagger UI Customization

### 5.1 Group Endpoints by Tags

```csharp
[ApiController]
[Route("api/[controller]")]
[Tags("Products")]
public class ProductsController : ControllerBase
{
    // Endpoints grouped under "Products" in Swagger UI
}
```

### 5.2 Add Operation Descriptions

```csharp
[HttpGet]
[SwaggerOperation(
    Summary = "Get all products",
    Description = "Retrieves a paginated list of products with optional filtering by category, price range, rating, and more.",
    OperationId = "GetProducts",
    Tags = new[] { "Products" }
)]
public async Task<IActionResult> GetProducts([FromQuery] ProductQueryParameters parameters)
{
    // Implementation
}
```

---

## 6. Acceptance Criteria

- [ ] Swagger UI accessible at /swagger
- [ ] All endpoints visible and documented
- [ ] Endpoints grouped by controller
- [ ] Request/response schemas shown
- [ ] Example values provided
- [ ] "Try it out" functionality works
- [ ] CORS allows Swagger to make requests
- [ ] XML comments generate proper documentation
- [ ] Status codes documented for each endpoint
- [ ] Only enabled in Development (not Production)

---

## 7. Documentation Quality Checklist

For each endpoint, verify:
- [ ] Summary describes what it does
- [ ] Parameters documented with types
- [ ] Response types specified
- [ ] Example values provided
- [ ] Error responses documented
- [ ] Authentication requirements noted (if applicable)

---

**Status**: Ready for Implementation  
**Priority**: P2 (Nice to have, helps development)  
**Estimated Effort**: 2-3 hours  
**Dependencies**: FRD-001 (Backend Setup)  
**Notes**: Can be done incrementally as APIs are built
