# Task: Backend Project Scaffolding

**Task ID**: TASK-001  
**Priority**: P0 (Critical - Must Complete First)  
**Estimated Effort**: 2-3 hours  
**Dependencies**: None  
**Status**: Not Started

---

## Description

Create the foundational .NET 10 Web API project structure with all necessary infrastructure components including CORS configuration, error handling middleware, database context setup, and Swagger documentation. This task establishes the backend architecture that all subsequent API development will build upon.

---

## Dependencies

**Blocking Tasks**: None (this is the first backend task)

**Blocked Tasks**: All other backend tasks depend on this scaffolding:
- TASK-002 (Database Schema)
- TASK-003 (Data Seeding)
- TASK-004 (Products API)
- TASK-005 (Categories API)
- TASK-006 (Orders API)
- TASK-007 (API Documentation)

---

## Technical Requirements

### 1. Project Structure

Create a .NET 10 Web API project with the following structure:
```
ShopAssistant.Api/
├── Controllers/
│   └── (API controllers to be added)
├── Data/
│   ├── ShopDbContext.cs
│   └── Migrations/ (empty, migrations added in TASK-002)
├── Models/
│   └── (entity models added in TASK-002)
├── DTOs/
│   └── (data transfer objects added later)
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── ShopAssistant.Api.csproj
```

### 2. Required NuGet Packages

Install the following packages with latest stable versions:
- `Microsoft.AspNetCore.OpenApi` (for Swagger/OpenAPI)
- `Swashbuckle.AspNetCore` (Swagger UI)
- `Microsoft.EntityFrameworkCore.SqlServer` (SQL Server provider)
- `Microsoft.EntityFrameworkCore.Tools` (EF Core CLI tools)
- `Microsoft.EntityFrameworkCore.Design` (design-time support)

### 3. CORS Configuration

Configure CORS to allow frontend requests:
- Allow origin: `http://localhost:3000`
- Allow all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- Allow all headers
- Support credentials if needed for future session-based features
- Apply CORS policy globally to all controllers

### 4. Error Handling Middleware

Implement global error handling middleware that:
- Catches unhandled exceptions
- Returns consistent JSON error responses
- Logs errors to console (development) with stack traces
- Sanitizes error messages for production (hide internal details)
- Uses consistent error response format:
  ```json
  {
    "success": false,
    "data": null,
    "message": "Error description",
    "error": {
      "code": "ERROR_CODE",
      "details": "Additional details"
    }
  }
  ```

### 5. Database Context Setup

Create `ShopDbContext` class inheriting from `DbContext`:
- Configure for SQL Server
- Support three connection string options:
  - LocalDB: `Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb;Trusted_Connection=true;`
  - SQL Server Developer: `Server=localhost;Database=ShopAssistantDb;Trusted_Connection=true;`
  - Docker: `Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password={password};TrustServerCertificate=true;`
- Read connection string from `appsettings.json` or environment variable
- Enable detailed error messages in development
- Configure command timeout (30 seconds default)

### 6. Configuration Files

**appsettings.json**:
- Database connection string (placeholder)
- Logging configuration (Information level default)
- CORS allowed origins
- Application settings

**appsettings.Development.json**:
- Development database connection string
- Detailed logging (Debug level)
- Swagger enabled
- Developer-friendly error messages

### 7. Swagger/OpenAPI Configuration

Configure Swagger for API documentation:
- Enable Swagger in development only
- Swagger UI available at `/swagger`
- Configure API metadata (title, version, description)
- Enable XML comments (configured but XML file generated later)
- Enable annotations support

### 8. Program.cs Configuration

Configure the application pipeline:
- Add services: DbContext, CORS, Controllers, Swagger, Error Handling
- Configure middleware order:
  1. Error Handling Middleware
  2. HTTPS Redirection
  3. CORS
  4. Authorization
  5. Swagger (development only)
  6. Controllers

### 9. Health Check Endpoint

Implement a basic health check endpoint:
- Route: `GET /health` or `GET /api/health`
- Returns 200 OK with basic status
- Response format:
  ```json
  {
    "status": "Healthy",
    "timestamp": "2026-01-27T12:00:00Z",
    "version": "1.0.0"
  }
  ```

### 10. Development Environment Setup

Ensure the following are configured for local development:
- HTTPS certificate (use `dotnet dev-certs https --trust`)
- Ports: 5000 (HTTP), 5001 (HTTPS)
- Hot reload enabled
- Detailed logging to console
- Developer exception page enabled

---

## Acceptance Criteria

- [ ] .NET 10 Web API project created and compiles successfully
- [ ] All required NuGet packages installed (latest stable versions)
- [ ] CORS configured to allow `http://localhost:3000`
- [ ] Global error handling middleware implemented and registered
- [ ] ShopDbContext created with connection string configuration
- [ ] appsettings.json and appsettings.Development.json configured
- [ ] Swagger enabled and accessible at `/swagger` in development
- [ ] Health check endpoint responds with 200 OK
- [ ] Application runs on ports 5000 (HTTP) and 5001 (HTTPS)
- [ ] HTTPS certificate trusted for local development
- [ ] No console errors or warnings on startup
- [ ] Project follows .NET naming conventions and best practices
- [ ] README.md includes backend setup instructions

---

## Testing Requirements

### Unit Tests (Not Required for Scaffolding)
Scaffolding tasks typically don't require unit tests, but subsequent tasks must include tests.

### Integration Tests
- [ ] Application starts successfully without errors
- [ ] Health endpoint returns 200 OK
- [ ] Swagger UI loads without errors (development)
- [ ] CORS preflight requests succeed from localhost:3000
- [ ] Error middleware catches exceptions and returns proper JSON

### Manual Testing Checklist
- [ ] Run `dotnet run` and verify application starts
- [ ] Navigate to `https://localhost:5001/swagger` and verify Swagger UI loads
- [ ] Navigate to `https://localhost:5001/health` and verify health response
- [ ] Make a CORS request from frontend and verify no CORS errors
- [ ] Trigger an error and verify error middleware returns JSON response

---

## Implementation Notes

### Connection String Management
- Use user secrets for development: `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."`
- Never commit connection strings with passwords to source control
- Provide clear instructions for all three SQL Server options in README

### Error Handling Best Practices
- Log full exception details internally (server logs)
- Return generic error messages to clients (don't expose stack traces)
- Use proper HTTP status codes (400, 404, 500, etc.)
- Include correlation IDs for error tracking (optional but recommended)

### CORS Security
- Only allow specific origins in production (not wildcard)
- Document which origins are allowed
- Consider using environment-based CORS configuration

### Swagger Configuration
- Disable Swagger in production (security best practice)
- Use conditional middleware registration based on environment
- Configure proper API versioning support for future scalability

---

## Definition of Done

- [ ] Code compiles and runs without errors
- [ ] All acceptance criteria met and checked off
- [ ] Integration tests pass
- [ ] README.md updated with backend setup instructions
- [ ] Code follows .NET conventions and AGENTS.md standards
- [ ] PR created and ready for review
- [ ] No secrets or sensitive data committed to repository

---

## Related Documents

- [FRD-001: Backend API Setup](../features/backend-api-setup.md)
- [PRD: Section 5.1.2 Backend API](../prd.md#512-backend-api)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
