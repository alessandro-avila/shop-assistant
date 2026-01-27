# Shop Assistant - Backend API

.NET 8.0 Web API for the Shop Assistant e-commerce demo.

## Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- SQL Server (LocalDB, Developer Edition, or Docker)

### Setup

1. **Install dependencies:**
   ```bash
   dotnet restore
   ```

2. **Configure database connection:**
   
   Edit `appsettings.Development.json` and choose one of the connection strings:
   - `DefaultConnection`: SQL Server LocalDB (default)
   - `DockerConnection`: SQL Server in Docker
   - `DeveloperEdition`: SQL Server Developer Edition

3. **Build the project:**
   ```bash
   dotnet build
   ```

4. **Run the API:**
   ```bash
   dotnet run
   ```

   The API will start at: `http://localhost:5250`

5. **Access Swagger UI:**
   
   Open your browser to: `http://localhost:5250/swagger`

### Testing Endpoints

**Health Check:**
```bash
curl http://localhost:5250/health
```

Expected response:
```json
{
  "status": "Healthy",
  "timestamp": "2024-01-27T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "Development"
}
```

## Project Structure

```
backend/
├── Controllers/          # API Controllers (to be added in TASK-004+)
├── Data/                # Database context and configurations
│   └── ShopDbContext.cs # Entity Framework DbContext with entity configurations
├── DTOs/                # Data Transfer Objects (to be added)
├── Middleware/          # Custom middleware
│   └── ErrorHandlingMiddleware.cs
├── Migrations/          # EF Core migrations
│   └── 20260127161612_InitialCreate.cs # Initial database schema
├── Models/              # Entity models
│   ├── Product.cs       # Product entity
│   ├── Category.cs      # Category entity
│   ├── Order.cs         # Order entity
│   ├── OrderItem.cs     # Order item entity
│   └── CartItem.cs      # Cart item entity
├── Program.cs           # Application entry point
├── appsettings.json     # Configuration
└── ShopAssistant.Api.csproj
```

## Features

### Current
- [x] .NET 10 Web API project scaffolding (TASK-001 ✅)
- [x] Entity Framework Core 10.x with SQL Server
- [x] Global error handling middleware
- [x] CORS configuration for frontend (localhost:3000)
- [x] Swagger/OpenAPI documentation
- [x] Health check endpoint
- [x] Logging and diagnostics
- [x] Database schema with 5 entity models (TASK-002 ✅)
- [x] Entity relationships and indexes configured
- [x] Initial EF Core migration created and applied
- [x] Database creation and initialization
- [x] Data seeding system with 50 demo products (TASK-003 ✅)
- [x] Automatic seeding on first Development startup
- [x] Idempotent seeding (safe to run multiple times)

- [x] Products API with 6 endpoints (TASK-004 ✅)
  - List products with filtering, sorting, pagination
  - Get product by ID or slug
  - Search products
  - Featured and new arrival products
- [x] Categories API with 4 endpoints (TASK-005 ✅)
  - List all categories with product counts
  - Get category by ID or slug
  - Get products in a category with filtering
- [x] Orders API with 3 endpoints (TASK-006 ✅)
  - Create order from cart with transaction handling
  - Get order by ID or order number
  - Product name snapshots and address JSON storage
- [x] Comprehensive Swagger/OpenAPI documentation (TASK-007 ✅)
  - XML documentation generation enabled
  - Enhanced Swagger UI with metadata
  - Example values for all DTOs
  - Grouped by controller tags

### Upcoming
- [ ] Frontend API Integration (TASK-008)
- [ ] Orders API endpoints (TASK-006)
- [ ] Comprehensive API documentation (TASK-007)
- [ ] Frontend integration (TASK-008)

## API Endpoints

### Products API (TASK-004 ✅)

**Base URL:** `/api/products`

#### GET /api/products
List products with filtering, sorting, and pagination.

**Query Parameters:**
- `categoryId` (int): Filter by category ID
- `minPrice` (decimal): Minimum price filter
- `maxPrice` (decimal): Maximum price filter
- `minRating` (decimal): Minimum rating filter (0-5)
- `brand` (string): Filter by brand name
- `inStock` (bool): Filter by availability
- `isFeatured` (bool): Filter featured products
- `isNewArrival` (bool): Filter new arrival products
- `sortBy` (string): Sort field - `price`, `rating`, `name`, `newest`, `featured`
- `sortOrder` (string): Sort direction - `asc` or `desc`
- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 12, max: 100)

**Example Request:**
```bash
curl "http://localhost:5250/api/products?categoryId=1&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc&page=1&pageSize=12"
```

**Response:** Paginated list of products with metadata (200 OK)

#### GET /api/products/{id}
Get product details by numeric ID.

**Example Request:**
```bash
curl http://localhost:5250/api/products/1
```

**Response:** Product detail object (200 OK) or 404 Not Found

#### GET /api/products/slug/{slug}
Get product details by SEO-friendly slug.

**Example Request:**
```bash
curl http://localhost:5250/api/products/slug/premium-wireless-headphones
```

**Response:** Product detail object (200 OK) or 404 Not Found

#### GET /api/products/search?q={query}
Search products by name, description, or brand.

**Query Parameters:**
- `q` (string, required): Search query (min 2 characters)
- `page` (int): Page number
- `pageSize` (int): Items per page

**Example Request:**
```bash
curl "http://localhost:5250/api/products/search?q=headphones&page=1&pageSize=12"
```

**Response:** Paginated search results (200 OK) or 400 Bad Request

#### GET /api/products/featured
Get featured products.

**Query Parameters:**
- `page` (int): Page number
- `pageSize` (int): Items per page

**Example Request:**
```bash
curl "http://localhost:5250/api/products/featured?page=1&pageSize=10"
```

**Response:** Paginated list of featured products (200 OK)

#### GET /api/products/new-arrivals
Get new arrival products.

**Query Parameters:**
- `page` (int): Page number
- `pageSize` (int): Items per page

**Example Request:**
```bash
curl "http://localhost:5250/api/products/new-arrivals?page=1&pageSize=10"
```

**Response:** Paginated list of new arrivals (200 OK)

### Categories API (TASK-005 ✅)

**Base URL:** `/api/categories`

#### GET /api/categories
List all categories with product counts (in-stock products only).

**Example Request:**
```bash
curl http://localhost:5250/api/categories
```

**Response:** Array of categories with product counts (200 OK)

#### GET /api/categories/{id}
Get category details by numeric ID.

**Query Parameters:**
- `includeSamples` (bool): Include top 10 sample products (default: false)

**Example Request:**
```bash
curl http://localhost:5250/api/categories/1
curl "http://localhost:5250/api/categories/1?includeSamples=true"
```

**Response:** Category detail object (200 OK) or 404 Not Found

#### GET /api/categories/slug/{slug}
Get category details by SEO-friendly slug.

**Query Parameters:**
- `includeSamples` (bool): Include top 10 sample products (default: false)

**Example Request:**
```bash
curl http://localhost:5250/api/categories/slug/electronics
curl "http://localhost:5250/api/categories/slug/electronics?includeSamples=true"
```

**Response:** Category detail object (200 OK) or 404 Not Found

#### GET /api/categories/{id}/products
Get all products in a specific category with filtering, sorting, and pagination.

**Query Parameters:** Same as Products API (minPrice, maxPrice, minRating, brand, inStock, sortBy, sortOrder, page, pageSize)

**Example Request:**
```bash
curl "http://localhost:5250/api/categories/1/products?minPrice=100&sortBy=price&page=1&pageSize=12"
```

**Response:** Paginated list of products in the category (200 OK) or 404 Not Found

### Orders API (TASK-006 ✅)

**Base URL:** `/api/orders`

#### POST /api/orders
Create a new order from cart items.

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 299.99
    }
  ],
  "totalAmount": 599.98,
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "customerEmail": "john@example.com",
  "customerName": "John Doe"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5250/api/orders \
  -H "Content-Type: application/json" \
  -d @order.json
```

**Response:** 201 Created with Location header
```json
{
  "orderId": 1,
  "orderNumber": "ORD-2026-12345",
  "totalAmount": 599.98,
  "status": "Pending",
  "createdAt": "2026-01-27T10:30:00Z",
  "estimatedDelivery": "2026-02-03T10:30:00Z"
}
```

**Features:**
- Atomic transaction handling (order + items created together)
- Unique order number generation (ORD-YYYY-XXXXX format)
- Product name snapshot for historical accuracy
- Address stored as JSON
- Total amount validation
- Product existence validation

#### GET /api/orders/{id}
Get order details by order ID.

**Example Request:**
```bash
curl http://localhost:5250/api/orders/1
```

**Response:** Order with all items (200 OK) or 404 Not Found

#### GET /api/orders/number/{orderNumber}
Get order details by order number.

**Example Request:**
```bash
curl http://localhost:5250/api/orders/number/ORD-2026-12345
```

**Response:** Order with all items (200 OK) or 404 Not Found

## Swagger/OpenAPI Documentation (TASK-007 ✅)

### Accessing Swagger UI

Swagger UI is available in Development mode at: **http://localhost:5250/swagger**

### Features

- **Interactive API Testing**: Try out all endpoints directly from the browser
- **Comprehensive Documentation**: All endpoints documented with XML comments
- **Request/Response Examples**: Example values for all DTOs and parameters
- **Grouped Endpoints**: Organized by controller (Products, Categories, Orders)
- **Schema Definitions**: Complete type information for all request and response models
- **Status Code Documentation**: All possible HTTP status codes documented per endpoint

### XML Documentation

XML documentation is automatically generated during build and includes:
- Controller and endpoint summaries
- Parameter descriptions
- Return type documentation
- Response status codes (200, 400, 404, 500)
- Example values for properties

### API Metadata

- **Title**: Shop Assistant API
- **Version**: v1
- **Description**: E-commerce demo API for managing products, categories, and orders
- **Contact**: support@shopassistant.demo
- **License**: MIT License

### Environment

**Note**: Swagger UI is only enabled in Development environment for security reasons.

## Configuration

### Connection Strings

Three connection string options are provided in `appsettings.json`:

1. **LocalDB** (Default):
   ```json
   "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb;Trusted_Connection=true"
   ```

2. **Docker**:
   ```json
   "DockerConnection": "Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password=YourStrong@Password123"
   ```

3. **Developer Edition**:
   ```json
   "DeveloperEdition": "Server=localhost;Database=ShopAssistantDb;Integrated Security=true"
   ```

### CORS

The API is configured to allow requests from:
- `http://localhost:3000` (Next.js frontend)

To add more origins, modify the CORS policy in `Program.cs`.

## Error Handling

All unhandled exceptions are caught by `ErrorHandlingMiddleware` and returned in a consistent format:

```json
{
  "success": false,
  "data": null,
  "message": "An error occurred while processing your request",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "details": "Detailed error message (development only)"
  }
}
```

## Development


When you make changes to entity models, create a new migration:

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

**Migration Commands:**
```bash
# List all migrations
dotnet ef migrations list

# Remove last migration (before applying)
dotnet ef migrations remove

# Rollback to specific migration
dotnet ef database update PreviousMigrationName

# Rollback all migrations (drop database)
dotnet ef database update 0
```

## Database Schema

The database consists of 5 tables:

### Tables

**Categories**
- CategoryId (PK, int, identity)
- Name (nvarchar(100), unique, required)
- Slug (nvarchar(100), unique, required)
- Description (nvarchar(500), nullable)
- ImageUrl (nvarchar(500), nullable)
- CreatedAt (datetime2, default UTC now)

**Products**
- ProductId (PK, int, identity)
- Name (nvarchar(200), required)
- Slug (nvarchar(200), unique, required)
- Description (nvarchar(max), nullable)
- ShortDescription (nvarchar(500), nullable)
- Price (decimal(18,2), required)
- OriginalPrice (decimal(18,2), nullable)
- CategoryId (FK → Categories, required)
- Brand (nvarchar(100), nullable)
- ImageUrl (nvarchar(500), nullable)
- Rating (decimal(3,2), default 0)
- ReviewCount (int, default 0)
- InStock (bit, default true)
- IsFeatured (bit, default false)
- IsNewArrival (bit, default false)
- CreatedAt (datetime2, default UTC now)
- UpdatedAt (datetime2, nullable)

**Orders**
- OrderId (PK, int, identity)
- OrderNumber (nvarchar(50), unique, required)
- TotalAmount (decimal(18,2), required)
- Status (nvarchar(50), default 'Pending')
- ShippingAddress (nvarchar(max), required - JSON format)
- CustomerEmail (nvarchar(200), nullable)
- CustomerName (nvarchar(200), nullable)
- CreatedAt (datetime2, default UTC now)

**OrderItems**
- OrderItemId (PK, int, identity)
- OrderId (FK → Orders, required, cascade delete)
- ProductId (FK → Products, required, restrict delete)
- ProductName (nvarchar(200), required - snapshot)
- Quantity (int, required)
- UnitPrice (decimal(18,2), required)

**CartItems** (Optional)
- CartItemId (PK, int, identity)
- SessionId (nvarchar(100), required, indexed)
- ProductId (FK → Products, required, restrict delete)
- Quantity (int, required)
- AddedAt (datetime2, default UTC now)

### Relationships

- **Products → Categories**: Many-to-One (Restrict delete)
- **Orders → OrderItems**: One-to-Many (Cascade delete)
- **OrderItems → Products**: Many-to-One (Restrict delete)
- **CartItems → Products**: Many-to-One (Restrict delete)

### Indexes

- Products: Slug (unique), CategoryId, Price, Rating, IsFeatured
- Categories: Name (unique), Slug (unique)
- Orders: OrderNumber (unique)
- CartItems: SessionId, ProductId

## Data Seeding

The application automatically seeds demo data on first startup in Development environment. This provides realistic product data for testing and development.

### Automatic Seeding

Seeding occurs automatically when you run the API in Development mode:

```bash
dotnet run
```

On first startup, you'll see logs:
```
info: Program[0] Seeding database...
info: Program[0] Seeded 6 categories
info: Program[0] Seeded 50 products
info: Program[0] Database seeding completed successfully!
```

On subsequent startups, seeding is skipped:
```
info: Program[0] Database already contains data. Skipping seed.
```

### Seeded Data

**Categories (6):**
1. Electronics - 25 products
2. Fashion - 20 products
3. Home & Garden - 5 products
4. Beauty - 0 products (placeholder)
5. Sports & Outdoors - 0 products (placeholder)
6. Books & Media - 0 products (placeholder)

**Products (50 total):**
- Premium Wireless Headphones ($299.99)
- 4K Ultra HD Smart TV 65" ($899.99)
- Professional DSLR Camera ($1,299.99)
- Wireless Bluetooth Speaker ($89.99)
- Smartwatch Fitness Tracker ($249.99)
- Classic Denim Jacket ($79.99)
- Leather Crossbody Bag ($129.99)
- Running Sneakers Pro ($119.99)
- Ergonomic Office Chair ($299.99)
- Memory Foam Pillow Set ($79.99)
- ...and 40 more products

### Product Data Features

- **Price Distribution:**
  - Budget: $19.99 - $49.99
  - Mid-range: $54.99 - $249.99
  - Premium: $299.99 - $1,299.99
- **Ratings:** 4.3 to 4.9 stars
- **Review Counts:** 312 to 2,789 reviews
- **Featured Products:** 7 products marked as featured
- **New Arrivals:** 9 products marked as new arrivals
- **Brands:** 25+ unique brands (AudioTech, ViewMax, PhotoPro, StyleCraft, etc.)
- **Images:** All products have Unsplash placeholder images

### Manual Database Operations

**Reset database and re-seed:**
```bash
cd backend
dotnet ef database drop --force
dotnet ef database update
dotnet run  # Will automatically seed fresh data
```

**Query seeded data:**
```sql
-- Check counts
SELECT COUNT(*) FROM Categories;  -- Should be 6
SELECT COUNT(*) FROM Products;    -- Should be 50

-- View category distribution
SELECT 
    c.Name, 
    COUNT(p.ProductId) AS ProductCount 
FROM Categories c
LEFT JOIN Products p ON c.CategoryId = p.CategoryId
GROUP BY c.Name
ORDER BY c.CategoryId;

-- Sample products
SELECT TOP 10 
    Name, 
    Price, 
    Rating, 
    Brand
FROM Products
ORDER BY ProductId;
```

### Idempotency

The seeding system is idempotent - safe to run multiple times:

- **First run:** Seeds all data
- **Subsequent runs:** Checks if products exist and skips seeding
- **Manual reset:** Use `dotnet ef database drop` to test fresh seeding

### Implementation Details

- **Location:** `backend/Data/SeedData.cs`
- **Trigger:** `Program.cs` - runs after `context.Database.Migrate()` in Development
- **Check:** `await context.Products.AnyAsync()` prevents duplicate seeding
- **Transaction:** Uses EF Core change tracking for atomic operations

## Dependencies

- `Microsoft.EntityFrameworkCore.SqlServer` (10.0.2)
- `Microsoft.EntityFrameworkCore.Tools` (10.0.23)
- `Swashbuckle.AspNetCore` (10.1.0)

## Migrations

Current migration:
- **20260127161612_InitialCreate** - Initial database schema with all 5 entity models

### Creating Migrations

When modifying entity models, create a new migration:

```bash
dotnet ef migrations add DescriptiveNameHere
dotnet ef database update
```

### Rolling Back

```bash
dotnet ef database update PreviousMigrationName
dotnet ef migrations remove
```

## Related Documentation

- [Backend Tasks](/specs/tasks/) - Implementation tasks
- [Feature Requirements](/specs/features/) - Feature specifications
- [PRD](/specs/prd.md) - Product Requirements Document
