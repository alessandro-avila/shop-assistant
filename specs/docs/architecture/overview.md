# System Architecture Overview

## Executive Summary

Shop Assistant is a **full-stack e-commerce demonstration application** built with a modern **client-server architecture**. The system separates concerns between a **Next.js frontend** (presentation layer) and a **.NET Web API backend** (business logic and data access layer), communicating via RESTful HTTP APIs.

---

## Architecture Pattern

### Primary Pattern: **3-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                        │
│  Next.js 14 Frontend (TypeScript + React + Tailwind CSS)    │
│  - Server Components (SSR)                                   │
│  - Client Components (Interactive UI)                        │
│  - Context API (State Management)                            │
│  - localStorage (Cart Persistence)                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST API
                   │ JSON over HTTP(S)
┌──────────────────┴──────────────────────────────────────────┐
│                     APPLICATION TIER                         │
│      ASP.NET Core Web API (.NET 10 + C#)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Controllers Layer                                    │   │
│  │ - ProductsController                                 │   │
│  │ - CategoriesController                               │   │
│  │ - OrdersController                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Middleware Pipeline                                  │   │
│  │ - Error Handling                                     │   │
│  │ - CORS                                               │   │
│  │ - Authorization (placeholder)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Data Transfer Objects (DTOs)                         │   │
│  │ - Request/Response models                            │   │
│  │ - Validation attributes                              │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ Entity Framework Core
                   │ ADO.NET (underlying)
┌──────────────────┴──────────────────────────────────────────┐
│                      DATA TIER                               │
│              Microsoft SQL Server                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Database: ShopAssistantDb                            │   │
│  │ Tables: Products, Categories, Orders,                │   │
│  │         OrderItems, CartItems                        │   │
│  │ Relationships, Indexes, Constraints                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. Frontend Application (Presentation Tier)

**Technology:** Next.js 14 + React 18 + TypeScript  
**Location:** `/frontend` directory  
**Entry Point:** `frontend/app/layout.tsx`

#### Responsibilities
- Render user interface (product catalog, cart, checkout)
- Handle user interactions and navigation
- Manage client-side state (cart, UI state)
- Make HTTP requests to backend API
- Provide responsive, accessible UI
- Optimize images and assets
- Implement animations and transitions

#### Key Architectural Decisions
- **App Router Pattern:** File-based routing in `app/` directory
- **Server-First Approach:** Leverage Server Components for initial render
- **Client Components:** Interactive features (cart, search, filters)
- **No BFF (Backend for Frontend):** Direct API calls to backend
- **Local State Management:** React Context + useReducer (no Redux)
- **Type Safety:** Full TypeScript coverage with strict mode

#### Component Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Homepage
│   ├── products/           # Product listing and details
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   └── search/             # Search results
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives
│   ├── product/            # Product-specific components
│   ├── layout/             # Header, footer, navigation
│   └── common/             # Error boundaries, loading states
├── context/                # React Context providers
│   └── cart-context.tsx    # Global cart state
├── lib/                    # Utilities and helpers
│   ├── api/                # API client modules
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
└── data/                   # Mock data (fallback mode)
```

---

### 2. Backend API (Application Tier)

**Technology:** ASP.NET Core 10 Web API + C#  
**Location:** `/backend` directory  
**Entry Point:** `backend/Program.cs`

#### Responsibilities
- Expose RESTful API endpoints
- Implement business logic and validation
- Manage database transactions
- Handle authentication/authorization (placeholder)
- Process and transform data
- Log operations and errors
- Generate API documentation (Swagger)

#### Key Architectural Decisions
- **Controller-Based API:** Traditional MVC pattern (not Minimal API)
- **Dependency Injection:** Built-in DI container for services
- **Middleware Pipeline:** Ordered request processing
- **DTO Pattern:** Separate DTOs from domain models
- **Repository Pattern:** NOT USED - Controllers access DbContext directly
- **Service Layer:** NOT USED - Business logic in controllers
- **Unit of Work:** NOT USED - DbContext acts as unit of work

#### Component Structure
```
backend/
├── Controllers/            # API endpoint handlers
│   ├── ProductsController.cs      # Product operations
│   ├── CategoriesController.cs    # Category operations
│   └── OrdersController.cs        # Order operations
├── Models/                 # Domain entities (EF Core models)
│   ├── Product.cs
│   ├── Category.cs
│   ├── Order.cs
│   ├── OrderItem.cs
│   └── CartItem.cs
├── DTOs/                   # Data Transfer Objects
│   ├── ProductDto.cs
│   ├── CategoryDto.cs
│   ├── OrderDto.cs
│   ├── CreateOrderRequest.cs
│   └── PaginatedResponse.cs
├── Data/                   # Database context and seeding
│   ├── ShopDbContext.cs           # EF Core DbContext
│   └── SeedData.cs                # Demo data seeding
├── Middleware/             # Custom middleware
│   └── ErrorHandlingMiddleware.cs # Global error handler
├── Migrations/             # EF Core database migrations
│   └── 20260127161612_InitialCreate.cs
└── Program.cs              # Application entry point and configuration
```

---

### 3. Database (Data Tier)

**Technology:** Microsoft SQL Server  
**Database Name:** `ShopAssistantDb` (prod), `ShopAssistantDb_Dev` (dev)

#### Responsibilities
- Store product catalog data
- Manage customer orders and order history
- Maintain referential integrity
- Provide transactional consistency
- Support efficient querying via indexes

#### Schema Overview (5 Tables)
1. **Categories** - Product categories
2. **Products** - Product catalog
3. **Orders** - Customer orders
4. **OrderItems** - Line items in orders
5. **CartItems** - Shopping cart sessions (optional, not used by frontend)

*See [Database Schema Documentation](../integration/databases.md) for full details.*

---

## Communication Patterns

### Frontend ↔ Backend Communication

#### Protocol: HTTP/REST
- **Request Format:** JSON
- **Response Format:** JSON
- **Authentication:** NONE (not implemented)
- **CORS:** Enabled for `http://localhost:3000` and `http://localhost:3001`

#### API Request Flow
```
1. User action in UI (e.g., click "Add to Cart")
2. React component calls API function (e.g., getProducts())
3. API client wraps fetch() with error handling
4. HTTP request sent to backend API endpoint
5. Backend controller processes request
6. Controller queries database via EF Core
7. Data transformed to DTOs
8. JSON response returned
9. Frontend updates UI with response data
```

#### Error Handling Pattern
```
Backend Error → HTTP Status Code (404, 500, etc.)
             ↓
Frontend catches ApiError
             ↓
User-friendly error message displayed in UI
```

---

### Backend ↔ Database Communication

#### Protocol: ADO.NET (via Entity Framework Core)
- **Query Language:** LINQ (translated to SQL)
- **Connection Pooling:** Automatic via EF Core
- **Transaction Management:** Explicit transactions for multi-step operations
- **Retry Logic:** 3 retries with 5-second delay on transient failures

#### Data Access Pattern
```
1. Controller method called (e.g., GetProducts())
2. LINQ query built on DbSet<Product>
3. EF Core translates LINQ to SQL
4. SQL executed against SQL Server
5. Results materialized as C# objects
6. Data transformed to DTOs
7. DTOs returned in HTTP response
```

---

## Data Flow Patterns

### Read Operations (Query Pattern)
```
User Request
    ↓
Frontend Component (Server Component for initial load)
    ↓
API Client (lib/api/*.ts)
    ↓
HTTP GET Request
    ↓
Backend Controller (e.g., ProductsController)
    ↓
LINQ Query with Include() for related data
    ↓
SQL Server (via EF Core)
    ↓
Entity Models → DTOs (Select projection)
    ↓
JSON Response
    ↓
Frontend updates UI
```

### Write Operations (Command Pattern)
```
User Action (e.g., Place Order)
    ↓
Frontend Form Submission
    ↓
API Client (lib/api/orders.ts)
    ↓
HTTP POST Request with JSON body
    ↓
Backend Controller (OrdersController)
    ↓
Validation (ModelState, business rules)
    ↓
Begin Transaction
    ↓
Create Order entity
    ↓
Create OrderItem entities
    ↓
SaveChanges() → SQL INSERT statements
    ↓
Commit Transaction
    ↓
Generate unique order number
    ↓
201 Created Response with Location header
    ↓
Frontend redirects to success page
```

---

## Key Architectural Patterns

### 1. **Separation of Concerns**
- **Frontend:** Presentation and user interaction only
- **Backend:** Business logic, validation, data access
- **Database:** Data persistence and integrity

### 2. **DTO Pattern**
- Domain models (`Models/`) never exposed directly to clients
- Separate DTOs (`DTOs/`) for API requests/responses
- Prevents over-posting and data leakage
- Example: `Product` entity → `ProductDto` for listing, `ProductDetailDto` for details

### 3. **Repository Pattern: NOT USED**
- Controllers access `DbContext` directly
- No repository abstraction layer
- Simpler for small/medium applications
- Trade-off: Less testable, more coupling

### 4. **Service Layer: NOT USED**
- Business logic resides in controllers
- No separate service classes
- Simpler architecture for demo purposes
- Trade-off: Fat controllers, harder to reuse logic

### 5. **Dependency Injection**
- All dependencies injected via constructor
- ASP.NET Core built-in DI container
- Services registered in `Program.cs`
- Example: `ILogger<T>`, `ShopDbContext`

### 6. **Middleware Pipeline**
- Ordered request processing in `Program.cs`
- Order matters (error handling first, auth later)
- Current pipeline:
  1. Error Handling Middleware
  2. Swagger (development only)
  3. HTTPS Redirection
  4. CORS
  5. Authorization (placeholder)
  6. Controllers

---

## State Management

### Frontend State
1. **Server State (API data):**
   - Fetched on demand via API calls
   - No caching implemented (fetched every time)
   - Server Components: Data fetched during SSR
   - Client Components: Data fetched on mount

2. **Client State (UI state):**
   - **Cart State:** React Context + useReducer
     - Persisted to localStorage
     - Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
   - **Form State:** Local component state (useState)
   - **UI State:** Loading, errors, modals (local state)

3. **URL State:**
   - Search params for filters (category, price, sort)
   - Product slug in URL
   - Shareable URLs for filtered views

### Backend State
- **Stateless API:** No session state on server
- **Database State:** All persistent state in SQL Server
- **No Caching:** Every request hits the database
- **No Distributed Sessions:** No Redis or similar

---

## Scalability Considerations

### Current Limitations (As-Is)
- ❌ No horizontal scaling (stateless API allows it, but not configured)
- ❌ No caching layer (repeated queries hit database)
- ❌ No CDN for static assets
- ❌ No database read replicas
- ❌ No API rate limiting
- ❌ No load balancer configuration
- ❌ Frontend SSR requires Node.js server (not static export)

### Scalability Strengths
- ✅ Stateless API design (can scale horizontally)
- ✅ Connection pooling (automatic via EF Core)
- ✅ AsNoTracking for read queries (better performance)
- ✅ Indexed database columns for common queries
- ✅ Pagination implemented (prevents large result sets)
- ✅ Separation of frontend/backend (can scale independently)

---

## Security Architecture

### Current Security Measures
1. **Input Validation:**
   - Data annotations on models
   - ModelState validation in controllers
   - EF Core parameterized queries (SQL injection prevention)

2. **Error Handling:**
   - Global error middleware
   - Different error details for dev vs production
   - No sensitive data in error responses

3. **CORS:**
   - Restricted to specific origins (localhost only)
   - Credentials allowed (for future auth)

4. **HTTPS:**
   - Redirection enabled in production

### Security Gaps (NOT IMPLEMENTED)
- ❌ **Authentication:** No user login/registration
- ❌ **Authorization:** No role-based access control
- ❌ **JWT Tokens:** No API authentication
- ❌ **Rate Limiting:** No protection against abuse
- ❌ **CSRF Protection:** Not needed (no cookies/sessions)
- ❌ **API Keys:** No API key requirement
- ❌ **Input Sanitization:** Relies on React's XSS protection
- ❌ **Security Headers:** No CSP, HSTS, X-Frame-Options

*See [Security Documentation](./security.md) for full details.*

---

## Performance Architecture

### Backend Performance
- **Database Query Optimization:**
  - Eager loading with `.Include()` (prevents N+1 queries)
  - AsNoTracking for read-only queries (30-40% faster)
  - Indexed columns (slug, categoryId, price, rating)
  - Pagination to limit result sets

- **Response Optimization:**
  - DTO projections (Select only needed fields)
  - No lazy loading (prevents accidental N+1)

- **NOT IMPLEMENTED:**
  - Response compression
  - Response caching
  - CDN integration
  - Database query result caching

### Frontend Performance
- **Next.js Optimizations:**
  - Automatic code splitting per route
  - Image optimization (next/image)
  - Font optimization (next/font)
  - Tree shaking (unused code removal)
  - Server Components for initial render

- **NOT IMPLEMENTED:**
  - API response caching
  - Stale-while-revalidate pattern
  - Prefetching
  - Service worker / PWA

---

## Deployment Architecture

### Current Setup (Development)
```
┌─────────────────────┐
│ Developer Machine   │
│                     │
│  Frontend (npm dev) │ ← localhost:3000
│       ↓ API calls   │
│  Backend (dotnet)   │ ← localhost:5250
│       ↓ EF Core     │
│  SQL Server LocalDB │ ← Local database
└─────────────────────┘
```

### Typical Production Deployment (Not Configured)
```
┌─────────────────────────────────────────────────┐
│                    Internet                      │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴──────────┐
        │                      │
┌───────▼─────────┐   ┌───────▼─────────┐
│  Frontend CDN   │   │  API Gateway    │
│  (Vercel/Azure) │   │  (Azure/AWS)    │
│  - Static files │   │  - Load balancer│
│  - SSR (Node)   │   │  - SSL/TLS      │
└─────────────────┘   └───────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐  ┌──────▼───────┐
            │ Backend API    │  │ Backend API  │
            │ Instance 1     │  │ Instance 2   │
            │ (Container)    │  │ (Container)  │
            └───────┬────────┘  └──────┬───────┘
                    └──────────┬───────┘
                               │
                    ┌──────────▼──────────┐
                    │  SQL Server         │
                    │  (Managed Service)  │
                    │  - Auto-scaling     │
                    │  - Backups          │
                    └─────────────────────┘
```

*See [Infrastructure Documentation](../infrastructure/deployment.md) for details.*

---

## Technology Alignment

### Why This Architecture?

1. **Separation of Concerns:**
   - Frontend devs work in TypeScript/React
   - Backend devs work in C#/.NET
   - Database admins manage SQL Server
   - Clear boundaries and responsibilities

2. **Independent Scaling:**
   - Frontend can scale separately (CDN, edge functions)
   - Backend can scale horizontally (stateless)
   - Database can scale vertically or with read replicas

3. **Technology Best Practices:**
   - .NET for robust, typed backend APIs
   - React for modern, component-based UI
   - TypeScript for type safety
   - SQL Server for ACID transactions

4. **Developer Experience:**
   - Fast feedback loops (hot reload on both sides)
   - Strong IDE support (VS Code, Visual Studio)
   - Clear project structure
   - Swagger for API testing

---

## Architecture Evolution

### Current State: **Monolithic Backend + SPA Frontend**
- Simple, straightforward architecture
- Easy to understand and develop
- Suitable for small to medium applications
- All business logic in one API project

### Potential Future State: **Microservices + Jamstack**
- Products Service
- Orders Service
- Users/Auth Service
- API Gateway
- Event-driven communication
- Static frontend with ISR

**Note:** This is speculation. Current architecture is sufficient for demo purposes.

---

## Architecture Decisions Records (ADRs)

### ADR-001: RESTful API over GraphQL
**Decision:** Use RESTful HTTP APIs instead of GraphQL  
**Rationale:**
- Simpler for small API surface
- No need for complex schema stitching
- Better tooling and documentation (Swagger)
- Easier to cache at CDN level

### ADR-002: No Repository Pattern
**Decision:** Controllers access DbContext directly  
**Rationale:**
- Reduces abstraction layers for demo project
- EF Core DbSet already provides repository-like interface
- Simpler code, less boilerplate
- Trade-off: Less testable (acceptable for demo)

### ADR-003: Client-Side Cart Management
**Decision:** Store cart in localStorage instead of backend database  
**Rationale:**
- No user authentication system (yet)
- Avoid managing anonymous sessions
- Faster cart updates (no network roundtrip)
- Cart data fetched from backend on checkout

### ADR-004: DTO Projections in Controllers
**Decision:** Map entities to DTOs in controller Select() statements  
**Rationale:**
- Avoid loading full entities when not needed
- Reduce memory allocation
- Better performance (fewer columns selected)
- Trade-off: Mapping logic in controllers (not reusable)

### ADR-005: Server Components First
**Decision:** Use Next.js Server Components by default, Client Components only when needed  
**Rationale:**
- Better initial page load performance
- Reduced JavaScript bundle size
- SEO-friendly (HTML rendered on server)
- Data fetched server-side (no loading states)

---

## Related Documentation

- [Technology Stack](../technology/stack.md) - Detailed technology choices
- [Component Architecture](./components.md) - Component-level details
- [Design Patterns](./patterns.md) - Patterns used throughout
- [Security Architecture](./security.md) - Security implementation
- [API Documentation](../integration/apis.md) - API endpoint reference
- [Database Schema](../integration/databases.md) - Data model details

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**Author:** Reverse Engineering Tech Analyst
