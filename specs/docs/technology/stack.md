# Technology Stack Documentation

## Overview

Shop Assistant is a full-stack e-commerce application built with modern technologies, featuring a **Next.js frontend** and a **.NET backend API**. The application follows a clean separation between presentation (frontend) and business logic (backend), communicating via RESTful APIs.

---

## Backend Technology Stack

### Runtime & Framework
- **.NET 10.0** (Latest LTS)
  - Target Framework: `net10.0`
  - Runtime: ASP.NET Core 10.x
  - SDK Required: .NET 10 SDK or later
  - Language: **C# 12** with nullable reference types enabled
  - Implicit Usings: Enabled for cleaner code

### Web Framework
- **ASP.NET Core Web API**
  - REST API architecture
  - Controller-based routing
  - Minimal API pattern not used (traditional MVC controller pattern)
  - Built-in dependency injection
  - Middleware pipeline for request processing

### Data Access & ORM
- **Entity Framework Core 10.x** (`Microsoft.EntityFrameworkCore.SqlServer` v10.*)
  - Code-First approach with migrations
  - DbContext: `ShopDbContext`
  - Database provider: SQL Server
  - Features used:
    - Fluent API for entity configuration
    - Navigation properties for relationships
    - Eager loading with `.Include()`
    - AsNoTracking for read-only queries
    - Change tracking for updates
  - **Entity Framework Core Tools** (`Microsoft.EntityFrameworkCore.Tools` v10.*)
    - CLI support for migrations
    - Package Manager Console support

### Database
- **Microsoft SQL Server**
  - Three supported configurations:
    1. **SQL Server LocalDB** (default) - `(localdb)\\mssqllocaldb`
    2. **Docker SQL Server** - `localhost,1433`
    3. **SQL Server Developer Edition** - `localhost` with integrated security
  - Connection features:
    - Connection timeout: 30 seconds
    - Retry on failure: Up to 3 attempts with 5-second delay
    - Multiple active result sets enabled
    - Trust server certificate enabled (Docker/Developer)
  - Database name: `ShopAssistantDb` (production), `ShopAssistantDb_Dev` (development)

### API Documentation
- **Swashbuckle.AspNetCore** v10.1.0
  - OpenAPI/Swagger specification generation
  - Swagger UI for interactive API testing
  - Enabled only in Development environment
  - Route: `/swagger`
- **Swashbuckle.AspNetCore.Annotations** v10.1.0
  - `[Tags]` attribute for grouping endpoints
  - `[ProducesResponseType]` for status code documentation
  - XML documentation comments support
  - Example values for DTOs

### API Capabilities
- **Microsoft.AspNetCore.OpenApi** v10.*
  - OpenAPI 3.0 specification support
  - Automatic schema generation from C# models
  - Integration with Swagger UI

### Logging & Diagnostics
- **Built-in ASP.NET Core Logging**
  - ILogger<T> dependency injection
  - Structured logging with semantic logging
  - Log levels: Debug, Information, Warning, Error
  - Different log levels for Development vs Production
  - EF Core query logging enabled in Development

### Configuration
- **appsettings.json** - Base configuration
- **appsettings.Development.json** - Development overrides
- Connection strings management
- Environment-based configuration
- Settings validation at startup

---

## Frontend Technology Stack

### Runtime & Framework
- **Node.js** >= 20.0.0 (Required)
  - Modern JavaScript runtime
  - ES modules support
  - Native fetch API support

### Web Framework
- **Next.js 14.2.18**
  - React framework for production
  - App Router (latest routing paradigm)
  - Server Components and Client Components
  - File-based routing in `app/` directory
  - API routes not used (backend API handles all data)
  - Features:
    - Server-side rendering (SSR)
    - Static site generation (SSG) where possible
    - Automatic code splitting
    - Image optimization
    - Font optimization (Google Fonts)

### UI Library
- **React 18.3.1**
  - Latest stable version
  - Hooks-based components
  - Functional components (no class components)
  - Features used:
    - `useState`, `useEffect`, `useReducer`, `useContext`
    - Context API for global state
    - Suspense for async rendering
    - Error boundaries

### Language
- **TypeScript 5.7.2**
  - Strict mode enabled
  - Path aliases configured (`@/*` → `./`)
  - Type safety across entire codebase
  - TSConfig: Bundler module resolution
  - Incremental compilation
  - ES2023+ features

### Styling & Design
- **Tailwind CSS 3.4.17**
  - Utility-first CSS framework
  - JIT (Just-In-Time) compiler
  - Custom color palette (primary, neutral)
  - Custom animations (fade-in, slide-in, bounce)
  - Responsive design utilities
  - Dark mode support prepared (not implemented)
- **PostCSS 8.4.49**
  - CSS processing pipeline
  - Autoprefixer 10.4.20 for vendor prefixes
- **@tailwindcss/forms 0.5.9**
  - Form styling plugin
  - Better default form element styles

### Typography
- **Inter Font Family** (Google Fonts via next/font)
  - Variable font for optimal loading
  - Subsetting for performance
  - System fallbacks defined

### Animation
- **Framer Motion 11.11.11**
  - Production-ready animation library
  - Declarative animations
  - Gesture detection
  - Layout animations
  - Page transitions
  - Scroll-based animations

### State Management
- **React Context API + useReducer**
  - Global cart state management
  - No external state library (Redux, Zustand, etc.)
  - Reducer pattern for predictable state updates
  - Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, LOAD_CART

### Data Persistence
- **localStorage**
  - Cart state persistence
  - Key: `shop-assistant:cart`
  - JSON serialization
  - Automatic sync on state changes
  - Loaded on mount

### Package Manager
- **pnpm 10.20.0**
  - Fast, disk-efficient package manager
  - Workspace support prepared (monorepo-ready)
  - Strict peer dependencies

### Code Quality
- **ESLint 8.57.1**
  - Next.js recommended configuration
  - Linting for TypeScript + React
  - Auto-fix support
- **eslint-config-next 14.2.18**
  - Next.js-specific rules
  - React Hooks rules
  - Accessibility warnings

### Build Tools
- **Next.js Built-in Bundler** (Turbopack in future)
  - Webpack 5 (current)
  - Tree shaking
  - Code splitting
  - Minification
  - CSS optimization

---

## API Integration Layer

### HTTP Client
- **Native Fetch API** (Node.js 18+ / Browser)
  - Modern, promise-based HTTP client
  - No external dependencies (axios, etc.)
  - Custom wrapper in `lib/api/client.ts`
  - Features:
    - Timeout management (30s default)
    - Error handling with custom `ApiError` class
    - Automatic JSON parsing
    - Type-safe generic functions
    - Query string builder utility

### Configuration
- **Environment Variables**
  - `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:5250/api`)
  - `NEXT_PUBLIC_USE_API` - Toggle API vs mocked data (default: `true`)
  - Prefix `NEXT_PUBLIC_*` for client-side access

### API Modules
- **Feature-based API clients:**
  - `lib/api/products.ts` - Product operations
  - `lib/api/categories.ts` - Category operations
  - `lib/api/orders.ts` - Order operations
  - Type-safe with TypeScript interfaces matching backend DTOs

### Fallback Mode
- **Mock data support**
  - Static JSON files in `data/` folder
  - Simulated API delays (300ms)
  - Graceful degradation when backend unavailable
  - Development without backend API

---

## Development Tools

### Backend Development
- **Visual Studio Code** (Primary IDE)
  - C# Dev Kit extension recommended
  - OmniSharp for IntelliSense
- **.NET CLI**
  - `dotnet build` - Build project
  - `dotnet run` - Run application
  - `dotnet ef` - Entity Framework tools
  - `dotnet watch` - Hot reload during development

### Frontend Development
- **Visual Studio Code** (Primary IDE)
  - ESLint extension
  - Prettier extension (not configured in project)
  - Tailwind CSS IntelliSense
- **Next.js Development Server**
  - Hot Module Replacement (HMR)
  - Fast Refresh for React components
  - Error overlay for development
  - Port: 3000 (default)

### Database Tools
- **Entity Framework Core CLI**
  - `dotnet ef migrations add` - Create migration
  - `dotnet ef database update` - Apply migrations
  - `dotnet ef database drop` - Reset database
  - `dotnet ef migrations list` - View migrations
- **SQL Server Management Studio** (Optional)
  - GUI for database management
  - Query execution
  - Schema visualization

### Testing
- **Status: NOT IMPLEMENTED**
  - No test frameworks configured
  - No unit tests present
  - No integration tests present
  - No E2E tests present
  - Frontend has placeholder scripts (`pnpm test`, `pnpm test:e2e`) but no actual tests

### Version Control
- **Git**
  - .gitignore configured for .NET and Node.js
  - Ignores: bin/, obj/, node_modules/, .next/, .env*.local

---

## Cross-Cutting Concerns

### CORS (Cross-Origin Resource Sharing)
- **Configured in backend:**
  - Policy name: `AllowFrontend`
  - Allowed origins: `http://localhost:3000`, `http://localhost:3001`
  - All methods allowed
  - All headers allowed
  - Credentials allowed

### Error Handling
- **Backend:**
  - Global error middleware: `ErrorHandlingMiddleware`
  - Consistent error response format (JSON)
  - Different error details for Development vs Production
  - Structured logging of exceptions
- **Frontend:**
  - `ApiError` class for typed errors
  - HTTP status code handling (404, 500, etc.)
  - Network error detection
  - Timeout handling
  - Error boundaries for React component errors

### Security
- **HTTPS:** Supported via `UseHttpsRedirection()`
- **Authorization:** Placeholder added but NOT implemented
- **Input Validation:** Data annotations on models
- **SQL Injection Prevention:** Parameterized queries via EF Core
- **XSS Prevention:** React's built-in escaping
- **CORS:** Restricted to specific origins

### Performance Optimizations
- **Backend:**
  - `AsNoTracking()` for read-only queries
  - Connection pooling (automatic via EF Core)
  - Response caching not configured
  - Compression not configured
- **Frontend:**
  - Next.js Image optimization
  - Code splitting per route
  - Tree shaking
  - Font optimization
  - Static generation where possible

---

## Deployment Considerations

### Backend Deployment
- **Potential targets:**
  - Azure App Service
  - Azure Container Instances
  - Docker containers
  - IIS on Windows Server
  - Self-hosted Kestrel
- **Current configuration:**
  - Kestrel web server (built-in)
  - HTTP: Port 5250
  - HTTPS: Port 7199
  - Production-ready middleware pipeline

### Frontend Deployment
- **Potential targets:**
  - Vercel (recommended for Next.js)
  - Netlify
  - Azure Static Web Apps
  - Azure App Service
  - Docker containers
  - Self-hosted Node.js
- **Current configuration:**
  - Static export not configured
  - Server-side rendering enabled
  - API calls to backend (requires backend URL configuration)

### Environment Variables (Production)
- **Backend:**
  - `ASPNETCORE_ENVIRONMENT` - Set to `Production`
  - Connection string in secure configuration (Azure Key Vault, etc.)
- **Frontend:**
  - `NEXT_PUBLIC_API_URL` - Production backend API URL
  - `NEXT_PUBLIC_USE_API` - Set to `true`

---

## Dependencies Summary

### Backend NuGet Packages
```xml
Microsoft.AspNetCore.OpenApi (10.*)
Microsoft.EntityFrameworkCore.SqlServer (10.*)
Microsoft.EntityFrameworkCore.Tools (10.*)
Swashbuckle.AspNetCore (10.1.0)
Swashbuckle.AspNetCore.Annotations (10.1.0)
```

### Frontend npm Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.11.11",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@types/node": "^22.10.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.7.2",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.18",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "@tailwindcss/forms": "^0.5.9"
  }
}
```

---

## Technology Decisions & Rationale

### Why .NET 10?
- Latest LTS version with long-term support
- Cutting-edge performance improvements
- Best-in-class for enterprise APIs
- Strong typing and tooling

### Why Next.js 14?
- React framework with production-grade features
- Excellent developer experience
- Built-in performance optimizations
- Server-side rendering for SEO
- Large ecosystem and community

### Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and IntelliSense
- Improved maintainability
- Self-documenting code

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Small bundle size with JIT
- No context switching between files

### Why Entity Framework Core?
- Productive ORM for .NET
- Type-safe LINQ queries
- Migration management
- Change tracking and validation

### Why SQL Server?
- Enterprise-grade relational database
- Excellent .NET integration
- Strong transaction support
- Familiar for .NET developers

---

## Version Information

- **Last Updated:** January 28, 2026
- **Backend Version:** 1.0.0
- **Frontend Version:** 1.0.0
- **API Version:** v1
- **Minimum .NET SDK:** 10.0
- **Minimum Node.js:** 20.0.0

---

## Future Technology Considerations

**NOT YET IMPLEMENTED** (potential future additions):

- Authentication/Authorization (JWT, OAuth, Azure AD)
- Caching (Redis, in-memory)
- Message queuing (RabbitMQ, Azure Service Bus)
- CDN integration
- Database read replicas
- API versioning
- Rate limiting
- GraphQL support
- WebSockets for real-time features
- Progressive Web App (PWA) features
- Automated testing infrastructure
- CI/CD pipelines
- Monitoring and observability (Application Insights, Sentry)
- Container orchestration (Kubernetes)
