# Feature: Backend API Setup & Configuration

**Feature ID**: FRD-001  
**Version**: 1.0  
**Status**: Not Started  
**Owner**: Backend Team  
**Created**: January 27, 2026  
**Last Updated**: January 27, 2026

---

## 1. Feature Overview

### 1.1 Description
Set up the .NET 10 Web API project with essential configuration including CORS, error handling middleware, Entity Framework Core integration, and Swagger documentation. This is the foundational infrastructure for all backend functionality.

### 1.2 Business Context
The Shop Assistant demo currently uses mocked frontend data. To demonstrate full-stack capabilities and showcase modern .NET development, we need a backend API that serves data from a real database while maintaining simplicity for demo and learning purposes.

### 1.3 Goals
- Provide working .NET 10 Web API running on localhost
- Enable frontend to make HTTP requests to backend
- Support local development workflow
- Serve as foundation for all API endpoints
- Demonstrate modern .NET best practices

### 1.4 Related PRD Sections
- Section 5.1.2: Backend API
- Section 5.2: Architecture Overview
- Section 5.4: Backend API Project Structure
- Section 5.6: CORS Configuration

---

## 2. User Stories

```gherkin
As a frontend developer,
I want a running .NET API on localhost:5000,
So that I can make API calls from my Next.js application.

As a developer,
I want CORS properly configured,
So that my frontend on port 3000 can communicate with the backend on port 5000.

As a developer,
I want Swagger UI available,
So that I can test API endpoints interactively without writing code.

As a developer,
I want consistent error responses,
So that I can handle errors predictably in the frontend.

As a new team member,
I want clear setup instructions,
So that I can get the backend running in under 5 minutes.
```

---

## 3. Functional Requirements

### 3.1 Core Requirements

**[REQ-001.1] .NET 10 Web API Project**
- Create new .NET 10 Web API project
- Use minimal API or controller-based approach
- Configure for development environment
- Support both HTTP (5000) and HTTPS (5001) ports

**[REQ-001.2] CORS Configuration**
- Enable CORS for frontend origin (http://localhost:3000)
- Allow all HTTP methods (GET, POST, PUT, DELETE)
- Allow all headers
- Support credentials if needed for future sessions

**[REQ-001.3] Error Handling Middleware**
- Global exception handler middleware
- Catch unhandled exceptions
- Return consistent error response format:
  ```json
  {
    "success": false,
    "data": null,
    "message": "Error description",
    "error": {
      "code": "ERROR_CODE",
      "details": "Detailed message"
    }
  }
  ```
- Log errors to console (development)
- Return generic messages (hide internal details)

**[REQ-001.4] API Response Format**
- Define standard success response wrapper:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful"
  }
  ```
- All endpoints must use this format
- Include helper methods for consistent responses

**[REQ-001.5] Swagger/OpenAPI Integration**
- Install and configure Swashbuckle
- Swagger UI available at `/swagger`
- Document all endpoints with descriptions
- Include request/response examples
- Group endpoints by feature (Products, Categories, etc.)

**[REQ-001.6] Environment Configuration**
- `appsettings.json` for default settings
- `appsettings.Development.json` for local overrides
- Database connection string configuration
- CORS origins configuration
- Logging level configuration

**[REQ-001.7] Dependency Injection Setup**
- Configure DI container
- Register DbContext
- Register services and repositories
- Use scoped lifetime for DbContext

### 3.2 Optional Enhancements
- Health check endpoint (`/health`)
- API versioning setup (if needed later)
- Request logging middleware
- Rate limiting (future)

---

## 4. Technical Specifications

### 4.1 Technology Stack
- **.NET 10 SDK** (latest LTS)
- **ASP.NET Core Web API**
- **Entity Framework Core** 8.x
- **Swashbuckle.AspNetCore** for Swagger
- **Microsoft.EntityFrameworkCore.SqlServer**
- **Microsoft.EntityFrameworkCore.Tools** for migrations

### 4.2 Project Structure
```
ShopAssistant.Api/
├── Controllers/           # API controllers (or Endpoints/)
├── Data/
│   └── ShopDbContext.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
├── Models/               # Entity models
├── DTOs/                 # Data transfer objects
├── Services/             # Business logic (if needed)
├── Extensions/
│   └── ServiceExtensions.cs
├── Program.cs            # Entry point
├── appsettings.json
├── appsettings.Development.json
└── ShopAssistant.Api.csproj
```

### 4.3 Program.cs Configuration Flow
1. Create WebApplicationBuilder
2. Configure services:
   - Add controllers/minimal APIs
   - Add DbContext with SQL Server
   - Add CORS policy
   - Add Swagger
3. Build application
4. Configure middleware pipeline:
   - Use error handling middleware (first)
   - Use CORS
   - Use Swagger (development only)
   - Use HTTPS redirection
   - Map controllers/endpoints
5. Run application

### 4.4 CORS Policy Configuration
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 4.5 Error Handling Middleware Example
```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response = new
        {
            success = false,
            data = (object)null,
            message = "An error occurred processing your request",
            error = new
            {
                code = "INTERNAL_ERROR",
                details = ex.Message // In production, use generic message
            }
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}
```

### 4.6 Port Configuration
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- Configure in `launchSettings.json`

### 4.7 Dependencies (NuGet Packages)
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.*" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.*" />
```

---

## 5. Dependencies

### 5.1 Prerequisites
- .NET 10 SDK installed
- Visual Studio 2022 or VS Code with C# extension
- SQL Server (LocalDB, Developer, or Docker) - will be used in FRD-002

### 5.2 Blocks
None - this is foundational work

### 5.3 Blocked By
None - can start immediately

### 5.4 Related Features
- **FRD-002**: Database Schema & Migrations (DbContext integration)
- **FRD-004**: Products API (first endpoints will use this setup)
- **FRD-009**: API Documentation (Swagger configuration)

---

## 6. Acceptance Criteria

### 6.1 Must Have
- [ ] .NET 10 Web API project created and compiles successfully
- [ ] API starts and runs on `http://localhost:5000` and `https://localhost:5001`
- [ ] CORS configured to allow requests from `http://localhost:3000`
- [ ] Swagger UI accessible at `/swagger` showing API documentation
- [ ] Error handling middleware catches exceptions and returns consistent format
- [ ] Sample health/status endpoint returns 200 OK
- [ ] Can make successful API call from frontend (even if just health check)
- [ ] `appsettings.json` contains database connection string placeholder
- [ ] Setup instructions documented in README
- [ ] No errors or warnings on startup

### 6.2 Should Have
- [ ] Request logging shows incoming requests in console
- [ ] HTTPS redirect configured
- [ ] Environment-specific configuration working
- [ ] Response compression enabled
- [ ] Development certificate trusted (HTTPS works without warnings)

### 6.3 Nice to Have
- [ ] Health check endpoint with detailed status
- [ ] API versioning structure prepared
- [ ] XML comments for Swagger documentation
- [ ] Custom Swagger UI theme matching Shop Assistant branding

---

## 7. Out of Scope

### 7.1 Explicitly Excluded
- ❌ Authentication/authorization setup (future, if needed)
- ❌ Production deployment configuration
- ❌ Docker containerization
- ❌ CI/CD pipeline setup
- ❌ Performance monitoring/APM
- ❌ Real logging infrastructure (Serilog, etc.)
- ❌ Caching layer
- ❌ Rate limiting
- ❌ API gateway
- ❌ Multiple environments (prod, staging)

---

## 8. Testing Strategy

### 8.1 Manual Testing
- Start API with `dotnet run`
- Verify Swagger UI loads at `/swagger`
- Test health endpoint returns 200
- Make request from browser or Postman
- Test CORS by making request from frontend on port 3000
- Trigger error and verify error response format
- Test with both HTTP and HTTPS

### 8.2 Integration Testing (Optional)
- API starts successfully
- Middleware pipeline processes requests correctly
- CORS headers present in responses
- Error handling returns proper status codes

---

## 9. Success Metrics

### 9.1 Technical Metrics
- **Startup time**: < 3 seconds
- **Response time (health check)**: < 50ms
- **Build time**: < 10 seconds
- **Zero startup errors**: Clean console output

### 9.2 Developer Experience
- **Setup time**: < 5 minutes from clone to running
- **CORS issues**: Zero (properly configured)
- **Documentation clarity**: New developer can set up without help

### 9.3 Quality Metrics
- **Code coverage**: N/A for configuration
- **Swagger completeness**: All configured endpoints documented
- **Error handling**: All unhandled exceptions caught

---

## 10. Implementation Notes

### 10.1 Implementation Order
1. Create .NET 10 Web API project
2. Add NuGet packages
3. Create project structure (folders)
4. Configure Program.cs (services and middleware)
5. Create error handling middleware
6. Configure CORS
7. Add Swagger configuration
8. Create sample health endpoint
9. Test locally
10. Document setup in README

### 10.2 Development Tips
- Use `dotnet new webapi -n ShopAssistant.Api` to scaffold
- Remove default WeatherForecast example
- Test CORS early to avoid frontend issues
- Keep Program.cs clean - extract configurations to extension methods
- Use `dotnet watch` for hot reload during development

### 10.3 Common Issues
- **CORS blocked**: Ensure origin matches exactly (no trailing slash)
- **HTTPS certificate**: Run `dotnet dev-certs https --trust`
- **Port in use**: Kill existing process or change port
- **Swagger not showing**: Ensure only enabled in Development

---

## 11. Documentation Requirements

### 11.1 README Updates
- Backend setup instructions
- Prerequisites list
- Commands to run the API
- How to access Swagger UI
- Troubleshooting common issues

### 11.2 Code Comments
- Document middleware purpose
- Explain CORS configuration
- Comment complex service registrations

### 11.3 API Documentation
- Swagger descriptions for all endpoints
- Example requests/responses
- Error response formats

---

## 12. Review Checklist

Before marking this feature complete:
- [ ] Code review completed
- [ ] API starts without errors
- [ ] CORS tested from frontend
- [ ] Swagger UI accessible and functional
- [ ] Error handling tested with deliberate exception
- [ ] README updated with setup instructions
- [ ] All acceptance criteria met
- [ ] No console errors or warnings
- [ ] Configuration values externalized (not hardcoded)

---

**Status**: Ready for Implementation  
**Priority**: P0 (Foundational - must complete first)  
**Estimated Effort**: 4-6 hours
