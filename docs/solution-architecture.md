# Solution Architecture

## Overview

Shop Assistant is a full-stack e-commerce application demonstrating modern web development practices with .NET backend and Next.js frontend.

## System Architecture Overview

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#61dafb','primaryTextColor':'#000','primaryBorderColor':'#333','lineColor':'#666','secondaryColor':'#512bd4','tertiaryColor':'#0078d4'}}}%%

graph TB
    subgraph PRESENTATION["🎨 PRESENTATION LAYER"]
        direction TB
        FE_MAIN["<b>Next.js 14 Application</b><br/>────────────────────<br/>React 18 • TypeScript 5.7 • Tailwind CSS<br/>Server-Side Rendering • App Router"]
        
        subgraph FE_FEATURES["Application Features"]
            FE1["📦 Product Catalog<br/>Browse & Search"]
            FE2["🛒 Shopping Cart<br/>localStorage"]
            FE3["💳 Checkout Flow<br/>Order Management"]
        end
        
        FE_MAIN --> FE_FEATURES
    end
    
    subgraph APPLICATION["⚡ APPLICATION LAYER"]
        direction TB
        BE_MAIN["<b>ASP.NET Core 10 REST API</b><br/>────────────────────<br/>C# 13 • Swagger/OpenAPI • CORS Enabled"]
        
        subgraph BE_ENDPOINTS["API Controllers"]
            BE1["🏷️ Products API<br/>6 Endpoints"]
            BE2["📂 Categories API<br/>4 Endpoints"]
            BE3["📋 Orders API<br/>3 Endpoints"]
        end
        
        BE_MAIN --> BE_ENDPOINTS
    end
    
    subgraph DATAACCESS["🔄 DATA ACCESS LAYER"]
        direction TB
        ORM_MAIN["<b>Entity Framework Core 10</b><br/>────────────────────<br/>Code-First • LINQ • Async/Await"]
        
        subgraph ORM_MODELS["Domain Models"]
            M1["Product"]
            M2["Category"]
            M3["Order"]
            M4["OrderItem"]
        end
        
        ORM_MAIN --> ORM_MODELS
    end
    
    subgraph PERSISTENCE["💾 DATA PERSISTENCE LAYER"]
        direction TB
        DB_MAIN["<b>SQL Server LocalDB</b><br/>────────────────────<br/>Relational Database • ACID Transactions"]
        
        subgraph DB_DATA["Database Content"]
            D1["📊 50 Products"]
            D2["📁 6 Categories"]
            D3["📦 Orders & Items"]
        end
        
        DB_MAIN --> DB_DATA
    end
    
    FE_FEATURES -->|"HTTP/JSON<br/>REST API<br/>localhost:5250"| BE_ENDPOINTS
    BE_ENDPOINTS -->|"LINQ Queries<br/>Change Tracking"| ORM_MODELS
    ORM_MODELS -->|"ADO.NET<br/>SQL Commands"| DB_DATA
    
    style PRESENTATION fill:#e1f5ff,stroke:#61dafb,stroke-width:4px,color:#000
    style APPLICATION fill:#f3e8ff,stroke:#512bd4,stroke-width:4px,color:#000
    style DATAACCESS fill:#e6f3ff,stroke:#0078d4,stroke-width:4px,color:#000
    style PERSISTENCE fill:#ffe6e6,stroke:#cc2927,stroke-width:4px,color:#000
    
    style FE_MAIN fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style BE_MAIN fill:#512bd4,stroke:#333,stroke-width:2px,color:#fff
    style ORM_MAIN fill:#0078d4,stroke:#333,stroke-width:2px,color:#fff
    style DB_MAIN fill:#cc2927,stroke:#333,stroke-width:2px,color:#fff
    
    style FE_FEATURES fill:#b3e5fc,stroke:#01579b,stroke-width:1px
    style BE_ENDPOINTS fill:#e1bee7,stroke:#4a148c,stroke-width:1px
    style ORM_MODELS fill:#bbdefb,stroke:#01579b,stroke-width:1px
    style DB_DATA fill:#ffcdd2,stroke:#b71c1c,stroke-width:1px
```

## Simplified Architecture (Presentation View)

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%

graph LR
    subgraph CLIENT["<br/><b>CLIENT SIDE</b><br/><br/>"]
        FE["<b>Next.js 14</b><br/>─────────<br/>React 18<br/>TypeScript 5.7<br/>Tailwind CSS<br/>─────────<br/>Port: 3000"]
    end
    
    subgraph SERVER["<br/><b>SERVER SIDE</b><br/><br/>"]
        API["<b>ASP.NET Core 10</b><br/>─────────<br/>C# 13<br/>REST API<br/>Swagger<br/>─────────<br/>Port: 5250"]
    end
    
    subgraph DATA["<br/><b>DATA TIER</b><br/><br/>"]
        EF["<b>EF Core 10</b><br/>─────────<br/>ORM<br/>LINQ<br/>Migrations"]
        DB["<b>SQL Server</b><br/>─────────<br/>LocalDB<br/>50 Products<br/>6 Categories"]
    end
    
    FE -->|"REST API<br/>HTTP/JSON"| API
    API -->|"LINQ"| EF
    EF -->|"ADO.NET"| DB
    
    style CLIENT fill:#61dafb,stroke:#333,stroke-width:3px,color:#000
    style SERVER fill:#512bd4,stroke:#333,stroke-width:3px,color:#fff
    style DATA fill:#cc2927,stroke:#333,stroke-width:3px,color:#fff
    
    style FE fill:#e1f5ff,stroke:#01579b,stroke-width:2px,color:#000
    style API fill:#f3e8ff,stroke:#4a148c,stroke-width:2px,color:#000
    style EF fill:#bbdefb,stroke:#01579b,stroke-width:2px,color:#000
    style DB fill:#ffcdd2,stroke:#b71c1c,stroke-width:2px,color:#000
```

## Technology Stack at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%

mindmap
  root((Shop<br/>Assistant))
    Frontend
      Next.js 14
        React 18
        TypeScript 5.7
        Tailwind CSS 3.4
      Features
        Product Catalog
        Shopping Cart
        Checkout Flow
    Backend
      ASP.NET Core 10
        C# 13
        REST API
        Swagger/OpenAPI
      APIs
        Products API
        Categories API
        Orders API
    Data
      Entity Framework Core 10
        Code-First
        LINQ Queries
        Migrations
      SQL Server
        LocalDB
        5 Tables
        ACID Transactions
```

## Component Communication Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%

sequenceDiagram
    autonumber
    
    participant 👤 as User Browser
    participant 🎨 as Next.js App<br/>(Port 3001)
    participant ⚡ as .NET API<br/>(Port 5250)
    participant 🔄 as EF Core 10
    participant 💾 as SQL Server
    
    rect rgb(225, 245, 255)
        Note over 👤,💾: Product Browsing Flow
        👤->>🎨: Navigate to /products
        🎨->>⚡: GET /api/products?page=1
        ⚡->>🔄: LINQ: Products.Include(Category)
        🔄->>💾: SELECT with JOIN
        💾-->>🔄: Result Set
        🔄-->>⚡: Product Entities
        ⚡-->>🎨: JSON: {items, pagination}
        🎨-->>👤: Render Product Grid
    end
    
    rect rgb(255, 243, 224)
        Note over 👤,💾: Shopping Cart (Client-Side)
        👤->>🎨: Add to Cart
        🎨->>🎨: Update localStorage
        🎨-->>👤: Cart Updated ✓
    end
    
    rect rgb(232, 245, 233)
        Note over 👤,💾: Order Creation Flow
        👤->>🎨: Submit Order
        🎨->>⚡: POST /api/orders
        ⚡->>🔄: Create Order + Items
        🔄->>💾: BEGIN TRANSACTION
        💾->>💾: INSERT Order & Items
        💾->>💾: COMMIT
        💾-->>🔄: Order Created
        🔄-->>⚡: OrderDto
        ⚡-->>🎨: {orderId, orderNumber}
        🎨->>🎨: Clear Cart
        🎨-->>👤: Order Confirmation 🎉
    end
```

## Macro Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE_Tech["<b>Next.js 14 / React 18</b><br/>─────────────────<br/>• TypeScript 5.7<br/>• Tailwind CSS 3.4<br/>• Framer Motion<br/>• Server-Side Rendering<br/>• App Router"]
        FE_Components["<b>Components</b><br/>─────────────────<br/>• Product Catalog<br/>• Shopping Cart<br/>• Checkout Flow<br/>• Order Tracking"]
        FE_State["<b>State Management</b><br/>─────────────────<br/>• localStorage (Cart)<br/>• React State<br/>• Server Components"]
    end
    
    subgraph "API Layer"
        API_Tech["<b>ASP.NET Core 10</b><br/>─────────────────<br/>• C# 13<br/>• REST API<br/>• Swagger/OpenAPI<br/>• CORS Enabled<br/>• JSON Serialization"]
        API_Endpoints["<b>API Endpoints</b><br/>─────────────────<br/>• Products (6)<br/>• Categories (4)<br/>• Orders (3)"]
        API_Features["<b>Features</b><br/>─────────────────<br/>• Filtering & Sorting<br/>• Pagination<br/>• Search<br/>• Validation"]
    end
    
    subgraph "Data Access Layer"
        ORM["<b>Entity Framework Core 10</b><br/>─────────────────<br/>• Code-First Approach<br/>• Migrations<br/>• LINQ Queries<br/>• Change Tracking<br/>• Async Operations"]
        Models["<b>Domain Models</b><br/>─────────────────<br/>• Product<br/>• Category<br/>• Order<br/>• OrderItem<br/>• Address"]
    end
    
    subgraph "Data Layer"
        DB_Tech["<b>SQL Server LocalDB</b><br/>─────────────────<br/>• Relational Database<br/>• Transactions<br/>• Foreign Keys<br/>• Indexes"]
        DB_Schema["<b>Schema</b><br/>─────────────────<br/>• 5 Tables<br/>• 50 Products<br/>• 6 Categories<br/>• Normalized Design"]
    end
    
    FE_Tech --> FE_Components
    FE_Components --> FE_State
    
    FE_State -->|"HTTP/JSON<br/>Port 5250"| API_Tech
    
    API_Tech --> API_Endpoints
    API_Endpoints --> API_Features
    
    API_Features --> ORM
    ORM --> Models
    
    Models --> DB_Tech
    DB_Tech --> DB_Schema
    
    style FE_Tech fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style API_Tech fill:#512bd4,stroke:#333,stroke-width:2px,color:#fff
    style ORM fill:#0078d4,stroke:#333,stroke-width:2px,color:#fff
    style DB_Tech fill:#cc2927,stroke:#333,stroke-width:2px,color:#fff
```

## Technology Stack Summary

### Frontend Layer (Client-Side)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 14 | React framework with SSR, App Router |
| **UI Library** | React 18 | Component-based UI |
| **Language** | TypeScript 5.7 | Type safety & IDE support |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Animation** | Framer Motion | Smooth transitions & effects |
| **Icons** | Lucide React | Icon components |
| **Build Tool** | Turbopack | Fast bundler (dev mode) |
| **Package Manager** | pnpm 10.20 | Efficient dependency management |
| **Deployment** | Vercel (ready) | Serverless hosting platform |

### Backend Layer (Server-Side)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | ASP.NET Core 10 | High-performance web framework |
| **Language** | C# 13 | Modern, type-safe language |
| **API Style** | REST | HTTP-based CRUD operations |
| **Documentation** | Swagger/OpenAPI | Interactive API docs |
| **Middleware** | CORS, Logging | Cross-origin, diagnostics |
| **Validation** | Data Annotations | Input validation |
| **Serialization** | System.Text.Json | JSON serialization |
| **Hosting** | Kestrel | Cross-platform web server |
| **Deployment** | Azure App Service (ready) | Cloud hosting platform |

### Data Access Layer
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **ORM** | Entity Framework Core 10 | Object-relational mapping |
| **Approach** | Code-First | Models define schema |
| **Migrations** | EF Core Migrations | Version control for schema |
| **Query Language** | LINQ | Type-safe queries in C# |
| **Change Tracking** | EF Core | Automatic change detection |
| **Connection Pooling** | Built-in | Efficient connection reuse |
| **Async/Await** | Full Support | Non-blocking I/O operations |

### Data Layer (Persistence)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | SQL Server LocalDB | Development database |
| **Production DB** | Azure SQL (ready) | Cloud relational database |
| **Version** | SQL Server 2022 | Latest features & performance |
| **Data Seeding** | Custom Seeder | Initialize with demo data |
| **Backup** | .mdf/.ldf files | Database files |

## Three-Tier Architecture

```mermaid
graph TB
    subgraph "Tier 1: Presentation"
        direction TB
        User[👤 User/Browser]
        NextJS["Next.js App<br/>─────────<br/>Port: 3000/3001<br/>React Components<br/>Client & Server"]
    end
    
    subgraph "Tier 2: Application"
        direction TB
        API["ASP.NET Core API<br/>─────────<br/>Port: 5250<br/>Controllers<br/>Business Logic<br/>DTOs"]
        Swagger["Swagger UI<br/>─────────<br/>/swagger<br/>API Documentation"]
    end
    
    subgraph "Tier 3: Data"
        direction TB
        EF["Entity Framework Core<br/>─────────<br/>DbContext<br/>Models<br/>Migrations"]
        SQL["SQL Server LocalDB<br/>─────────<br/>Products<br/>Categories<br/>Orders"]
    end
    
    User -->|HTTPS| NextJS
    NextJS -->|REST API<br/>HTTP/JSON| API
    API -.->|Documented by| Swagger
    API -->|LINQ Queries| EF
    EF -->|ADO.NET| SQL
    
    style User fill:#e1f5ff,stroke:#333,stroke-width:2px
    style NextJS fill:#61dafb,stroke:#333,stroke-width:2px
    style API fill:#512bd4,stroke:#333,stroke-width:2px,color:#fff
    style EF fill:#0078d4,stroke:#333,stroke-width:2px,color:#fff
    style SQL fill:#cc2927,stroke:#333,stroke-width:2px,color:#fff
    style Swagger fill:#85ea2d,stroke:#333,stroke-width:2px
```

## Communication Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Next as Next.js<br/>(Port 3001)
    participant API as .NET API<br/>(Port 5250)
    participant EF as Entity Framework<br/>Core
    participant SQL as SQL Server<br/>LocalDB
    
    Note over User,SQL: Example: Browse Products
    
    User->>Next: Navigate to /products
    activate Next
    Next->>Next: Server Component<br/>Pre-render
    Next->>API: GET /api/products?page=1
    activate API
    API->>EF: LINQ Query<br/>Include(Category)
    activate EF
    EF->>SQL: SELECT with JOIN
    activate SQL
    SQL-->>EF: Result Set
    deactivate SQL
    EF-->>API: Product Entities
    deactivate EF
    API->>API: Map to DTOs<br/>Calculate Pagination
    API-->>Next: JSON: PaginatedResponse
    deactivate API
    Next->>Next: Map to Frontend Types<br/>Render Components
    Next-->>User: HTML Response
    deactivate Next
    
    Note over User,SQL: Client-Side: Add to Cart
    
    User->>Next: Click "Add to Cart"
    Next->>Next: Update localStorage
    Next-->>User: Cart Updated (No API call)
    
    Note over User,SQL: Checkout: Create Order
    
    User->>Next: Submit Order
    Next->>API: POST /api/orders
    activate API
    API->>EF: Create Order Entity
    activate EF
    EF->>SQL: BEGIN TRANSACTION<br/>INSERT Order<br/>INSERT OrderItems<br/>COMMIT
    activate SQL
    SQL-->>EF: Order Created
    deactivate SQL
    EF-->>API: Order Entity
    deactivate EF
    API-->>Next: JSON: OrderDto
    deactivate API
    Next->>Next: Clear Cart<br/>Show Confirmation
    Next-->>User: Order Success
```

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        NextJS[Next.js 14 App Router]
    end
    
    subgraph "Frontend - Next.js 14"
        Pages[Pages & Routes]
        Components[React Components]
        APIClient[API Client Layer]
        StateManagement[Client State<br/>localStorage]
    end
    
    subgraph "Backend - .NET 10"
        Controllers[API Controllers]
        Services[Business Logic]
        EFCore[Entity Framework Core]
    end
    
    subgraph "Data Layer"
        SQLServer[(SQL Server<br/>LocalDB)]
        SeedData[Seed Data<br/>50 Products<br/>6 Categories]
    end
    
    Browser --> NextJS
    NextJS --> Pages
    Pages --> Components
    Components --> APIClient
    APIClient --> StateManagement
    
    APIClient -->|HTTP/JSON<br/>localhost:5250| Controllers
    Controllers --> Services
    Services --> EFCore
    EFCore --> SQLServer
    SeedData -.->|Initializes| SQLServer
    
    style Browser fill:#e1f5ff
    style NextJS fill:#61dafb
    style Controllers fill:#512bd4
    style SQLServer fill:#cc2927
```

## Component Architecture

### Frontend Architecture (Next.js 14)

```mermaid
graph LR
    subgraph "Presentation Layer"
        Pages[Pages<br/>/, /products, /cart<br/>/checkout]
        Layout[Layout Components<br/>Header, Footer<br/>Navigation]
        UI[UI Components<br/>Button, Card<br/>Input, Badge]
    end
    
    subgraph "Business Layer"
        Features[Feature Components<br/>ProductCard<br/>CartItem<br/>CheckoutForm]
        Hooks[Custom Hooks<br/>useCart<br/>useProducts]
    end
    
    subgraph "Data Layer"
        API[API Client<br/>products.ts<br/>categories.ts<br/>orders.ts]
        Types[TypeScript Types<br/>Product, Category<br/>Order, Cart]
        Config[Configuration<br/>API URLs<br/>Timeouts]
    end
    
    subgraph "Storage"
        LocalStorage[localStorage<br/>Cart Data]
    end
    
    Pages --> Features
    Pages --> Layout
    Features --> UI
    Features --> Hooks
    Hooks --> API
    API --> Types
    API --> Config
    Hooks --> LocalStorage
    
    style Pages fill:#61dafb
    style API fill:#3178c6
    style LocalStorage fill:#ffd700
```

### Backend Architecture (.NET 10)

```mermaid
graph TB
    subgraph "API Layer"
        ProductsCtrl[ProductsController<br/>6 endpoints]
        CategoriesCtrl[CategoriesController<br/>4 endpoints]
        OrdersCtrl[OrdersController<br/>3 endpoints]
    end
    
    subgraph "Data Layer"
        DbContext[ShopDbContext<br/>EF Core]
        Models[Entity Models<br/>Product<br/>Category<br/>Order]
        DTOs[Data Transfer Objects<br/>ProductDto<br/>CategoryDto<br/>OrderDto]
    end
    
    subgraph "Database"
        Tables[(Products<br/>Categories<br/>Orders<br/>OrderItems<br/>Addresses)]
        Migrations[EF Migrations<br/>Schema Management]
    end
    
    subgraph "Infrastructure"
        Swagger[Swagger/OpenAPI<br/>API Documentation]
        CORS[CORS Policy<br/>Frontend Access]
        Logging[Logging<br/>Console + Debug]
    end
    
    ProductsCtrl --> DbContext
    CategoriesCtrl --> DbContext
    OrdersCtrl --> DbContext
    
    DbContext --> Models
    Models --> Tables
    Migrations --> Tables
    
    ProductsCtrl --> DTOs
    CategoriesCtrl --> DTOs
    OrdersCtrl --> DTOs
    
    Swagger -.->|Documents| ProductsCtrl
    Swagger -.->|Documents| CategoriesCtrl
    Swagger -.->|Documents| OrdersCtrl
    
    CORS -.->|Allows| ProductsCtrl
    Logging -.->|Monitors| DbContext
    
    style ProductsCtrl fill:#512bd4
    style DbContext fill:#0078d4
    style Tables fill:#cc2927
```

## Data Flow

### Product Listing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as Products Page
    participant A as API Client
    participant C as ProductsController
    participant DB as SQL Server
    
    U->>P: Navigate to /products
    P->>A: getProducts(filters)
    A->>C: GET /api/products?page=1
    C->>DB: Query Products with Category
    DB-->>C: Product Entities
    C-->>A: PaginatedResponse<ProductDto>
    A->>A: Map to Frontend Types
    A-->>P: Product[] + Pagination
    P-->>U: Render Product Grid
```

### Checkout Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Checkout Page
    participant A as API Client
    participant O as OrdersController
    participant DB as SQL Server
    
    U->>C: Fill Shipping Form
    U->>C: Click "Place Order"
    C->>A: createOrder(orderData)
    A->>O: POST /api/orders
    O->>DB: Insert Order + OrderItems
    DB-->>O: Order Created
    O-->>A: OrderDto with OrderNumber
    A-->>C: Order Confirmation
    C->>C: Clear Cart (localStorage)
    C-->>U: Redirect to Success Page
```

## Technology Stack

### Frontend Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 14.2.35 |
| UI Library | React | 18.3.1 |
| Language | TypeScript | 5.7.3 |
| Styling | Tailwind CSS | 3.4.1 |
| Animation | Framer Motion | 11.15.0 |
| Icons | Lucide React | Latest |
| Package Manager | pnpm | 10.20.0 |

### Backend Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | ASP.NET Core | .NET 10 |
| ORM | Entity Framework Core | 10.0.2 |
| Database | SQL Server | LocalDB |
| API Documentation | Swashbuckle (Swagger) | 7.2.0 |
| Language | C# | 13.0 |

## API Endpoints

### Products API
- `GET /api/products` - List products with filtering, sorting, pagination
- `GET /api/products/{id}` - Get product by ID (detailed)
- `GET /api/products/slug/{slug}` - Get product by slug
- `GET /api/products/search?searchQuery={q}` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrival products

### Categories API
- `GET /api/categories` - List all categories with product counts
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{slug}` - Get category by slug
- `GET /api/categories/{id}/products` - Get products in category

### Orders API
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/number/{orderNumber}` - Get order by order number

## Database Schema

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    ORDERS ||--|{ ORDER_ITEMS : includes
    ORDERS ||--|| ADDRESSES : "ships to"
    
    CATEGORIES {
        int CategoryId PK
        string Name
        string Slug
        string Description
        string ImageUrl
    }
    
    PRODUCTS {
        int ProductId PK
        string Name
        string Slug
        string Description
        string Brand
        int CategoryId FK
        decimal Price
        decimal OriginalPrice
        string ImageUrl
        decimal Rating
        int ReviewCount
        bool InStock
        bool IsFeatured
        bool IsNewArrival
        datetime CreatedAt
    }
    
    ORDERS {
        int OrderId PK
        string OrderNumber UK
        decimal TotalAmount
        string Status
        int AddressId FK
        string CustomerEmail
        string CustomerName
        datetime CreatedAt
    }
    
    ORDER_ITEMS {
        int OrderItemId PK
        int OrderId FK
        int ProductId FK
        string ProductName
        int Quantity
        decimal UnitPrice
        decimal Subtotal
    }
    
    ADDRESSES {
        int AddressId PK
        string Name
        string Address
        string City
        string State
        string ZipCode
        string Country
    }
```

## Error Handling Strategy

```mermaid
graph TD
    A[API Request] --> B{Network Available?}
    B -->|No| C[ApiError 0<br/>Network Error]
    B -->|Yes| D{API Responds?}
    D -->|Timeout| E[ApiError 408<br/>Timeout]
    D -->|Yes| F{Status Code?}
    F -->|200-299| G[Success Response]
    F -->|404| H[ApiError 404<br/>Not Found]
    F -->|500| I[ApiError 500<br/>Server Error]
    
    C --> J[Log Error]
    E --> J
    H --> J
    I --> J
    
    J --> K{Fallback Available?}
    K -->|Yes| L[Return Mocked Data]
    K -->|No| M[Throw Error]
    
    style G fill:#90EE90
    style L fill:#FFD700
    style M fill:#FF6B6B
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production (Future)"
        CDN[CDN/Static Hosting<br/>Vercel/Azure Static Web Apps]
        AppService[App Service<br/>Azure App Service]
        Database[(Azure SQL Database<br/>or SQL Server)]
    end
    
    subgraph "Development (Current)"
        LocalFE[Next.js Dev Server<br/>localhost:3001]
        LocalBE[.NET Web API<br/>localhost:5250]
        LocalDB[(SQL Server LocalDB)]
    end
    
    Dev[Developer] --> LocalFE
    Dev --> LocalBE
    LocalFE -->|API Calls| LocalBE
    LocalBE --> LocalDB
    
    LocalFE -.->|Deploy| CDN
    LocalBE -.->|Deploy| AppService
    LocalDB -.->|Migrate| Database
    
    CDN -->|API Calls| AppService
    AppService --> Database
    
    style LocalFE fill:#61dafb
    style LocalBE fill:#512bd4
    style CDN fill:#00d4ff
    style AppService fill:#0078d4
```

## Security Considerations

### Current Implementation
- CORS policy configured for frontend origin
- SQL parameterized queries via Entity Framework (SQL injection protection)
- Input validation via Data Annotations
- HTTPS redirection middleware (production)
- Sensitive data logging disabled in production

### Future Enhancements
- Authentication & Authorization (JWT/OAuth)
- API rate limiting
- Request/Response encryption
- CSRF protection
- Security headers (HSTS, CSP, X-Frame-Options)
- API key management for external services

## Performance Optimizations

### Frontend
- Static site generation for product pages (ISR)
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Client-side caching (SWR/React Query - future)
- localStorage for cart persistence

### Backend
- Database query optimization with `.AsNoTracking()`
- Pagination to limit result sets
- Indexed columns (CategoryId, Slug, ProductId)
- Response caching (future enhancement)
- Connection pooling (EF Core default)

## Scalability Path

```mermaid
graph LR
    subgraph "Phase 1: Current"
        P1FE[Next.js<br/>Single Instance]
        P1BE[.NET API<br/>Single Instance]
        P1DB[(LocalDB)]
    end
    
    subgraph "Phase 2: Cloud Migration"
        P2FE[Next.js<br/>Vercel/Static Web App]
        P2BE[App Service<br/>Auto-scaling]
        P2DB[(Azure SQL)]
    end
    
    subgraph "Phase 3: Distributed"
        P3FE[Next.js<br/>Multi-region CDN]
        P3BE[API Gateway +<br/>Load Balancer]
        P3Cache[Redis Cache]
        P3DB[(SQL Database<br/>Read Replicas)]
    end
    
    P1FE --> P2FE
    P1BE --> P2BE
    P1DB --> P2DB
    
    P2FE --> P3FE
    P2BE --> P3BE
    P3BE --> P3Cache
    P2DB --> P3DB
    
    style P1FE fill:#90EE90
    style P2FE fill:#FFD700
    style P3FE fill:#FF6B6B
```

## Development Workflow

```mermaid
graph TB
    Start[Developer] --> Branch[Create Feature Branch]
    Branch --> Code[Write Code]
    Code --> Test[Run Tests<br/>pnpm test / dotnet test]
    Test --> Lint[Lint & Type Check<br/>pnpm lint / dotnet build]
    Lint --> Commit[Commit Changes]
    Commit --> PR[Create Pull Request]
    PR --> Review[Code Review]
    Review -->|Changes Requested| Code
    Review -->|Approved| Merge[Merge to Main]
    Merge --> Deploy[Deploy<br/>Frontend + Backend]
    
    style Start fill:#e1f5ff
    style Test fill:#90EE90
    style Deploy fill:#FFD700
```

## Key Features Implemented

### ✅ Backend (TASK-001 to TASK-007)
- [x] .NET 10 Web API project structure
- [x] Entity Framework Core with SQL Server
- [x] Database migrations and seeding (50 products, 6 categories)
- [x] Products API (6 endpoints with filtering, sorting, pagination)
- [x] Categories API (4 endpoints)
- [x] Orders API (3 endpoints)
- [x] Swagger/OpenAPI documentation

### ✅ Frontend (TASK-008)
- [x] Next.js 14 with App Router
- [x] Type-safe API client with error handling
- [x] Product listing with filters and sorting
- [x] Product detail pages
- [x] Shopping cart (localStorage)
- [x] Checkout flow
- [x] Order confirmation
- [x] Graceful fallback to mocked data

### 🔄 Integration (TASK-008 Completed)
- [x] API client infrastructure
- [x] Type-safe DTOs matching backend
- [x] Error boundary component
- [x] Environment configuration
- [x] Full-stack data flow verification

## Documentation

- **API Docs**: [http://localhost:5250/swagger](http://localhost:5250/swagger)
- **Frontend README**: [frontend/README.md](../frontend/README.md)
- **Backend README**: [backend/README.md](../backend/README.md)
- **ADR 009**: [Frontend-Backend Integration](../specs/adr/009-frontend-backend-integration.md)

## Running the Application

### Prerequisites
- .NET 10 SDK
- Node.js 18+ and pnpm
- SQL Server LocalDB

### Start Backend
```bash
cd backend
dotnet run
# API available at http://localhost:5250
# Swagger UI at http://localhost:5250/swagger
```

### Start Frontend
```bash
cd frontend
pnpm install
pnpm dev
# App available at http://localhost:3000
```

## Repository Structure

```
shop-assistant/
├── backend/                 # .NET 10 Web API
│   ├── Controllers/        # API endpoints
│   ├── Models/            # Entity models
│   ├── DTOs/              # Data transfer objects
│   ├── Data/              # DbContext & seed data
│   └── Migrations/        # EF Core migrations
├── frontend/               # Next.js 14 App
│   ├── app/               # Pages (App Router)
│   ├── components/        # React components
│   ├── lib/               # Utilities & API client
│   ├── data/              # Mocked data (fallback)
│   └── public/            # Static assets
├── docs/                   # Documentation
├── specs/                  # Specifications & ADRs
└── .gitignore             # Version control exclusions
```
