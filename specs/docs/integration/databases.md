# Database Schema Documentation

## Overview

The Shop Assistant database is designed using **Entity Framework Core Code-First** approach with a **relational model** optimized for e-commerce operations. The schema consists of **5 tables** with well-defined relationships and indexes for performance.

**Database Name:** `ShopAssistantDb` (Production), `ShopAssistantDb_Dev` (Development)  
**DBMS:** Microsoft SQL Server  
**EF Core Version:** 10.x  
**Migration:** `20260127161612_InitialCreate`  
**File:** `backend/Data/ShopDbContext.cs`

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   Categories    │
│─────────────────│
│ CategoryId (PK) │
│ Name (UQ)       │
│ Slug (UQ)       │
│ Description     │
│ ImageUrl        │
│ CreatedAt       │
└────────┬────────┘
         │
         │ 1:N (Restrict)
         │
┌────────▼────────────────┐       ┌──────────────────┐
│      Products           │   N:1 │  OrderItems      │
│─────────────────────────│◄──────┤──────────────────│
│ ProductId (PK)          │       │ OrderItemId (PK) │
│ Name                    │       │ OrderId (FK)     │
│ Slug (UQ)               │       │ ProductId (FK)   │
│ Description             │       │ ProductName      │◄─┐
│ ShortDescription        │       │ Quantity         │  │
│ Price                   │       │ UnitPrice        │  │
│ OriginalPrice           │       └────────┬─────────┘  │
│ CategoryId (FK)         │                │            │
│ Brand                   │                │ N:1        │
│ ImageUrl                │                │ (Cascade)  │
│ Rating                  │                │            │
│ ReviewCount             │       ┌────────▼─────────┐  │
│ InStock                 │       │    Orders        │  │
│ IsFeatured              │       │──────────────────│  │
│ IsNewArrival            │       │ OrderId (PK)     │  │
│ CreatedAt               │       │ OrderNumber (UQ) │  │
│ UpdatedAt               │       │ TotalAmount      │  │
└────────┬────────────────┘       │ Status           │  │
         │                        │ ShippingAddress  │  │
         │ N:1 (Restrict)         │ CustomerEmail    │  │
         │                        │ CustomerName     │  │
┌────────▼────────────┐           │ CreatedAt        │  │
│    CartItems        │           └──────────────────┘  │
│─────────────────────│                                 │
│ CartItemId (PK)     │                                 │
│ SessionId (IDX)     │           1:N (Cascade)         │
│ ProductId (FK)      ├─────────────────────────────────┘
│ Quantity            │
│ AddedAt             │
└─────────────────────┘
```

**Relationship Legend:**
- `1:N` - One-to-Many
- `(PK)` - Primary Key
- `(FK)` - Foreign Key
- `(UQ)` - Unique Index
- `(IDX)` - Non-unique Index
- `Cascade` - Cascade delete
- `Restrict` - Restrict delete

---

## Table Schemas

### 1. Categories

Product categories for organizing the catalog.

**Table Name:** `Categories`  
**Primary Key:** `CategoryId`  
**Model:** `backend/Models/Category.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `CategoryId` | `int` | PK, IDENTITY(1,1) | Unique category identifier |
| `Name` | `nvarchar(100)` | NOT NULL, UNIQUE | Category name |
| `Slug` | `nvarchar(100)` | NOT NULL, UNIQUE | URL-friendly slug |
| `Description` | `nvarchar(500)` | NULL | Category description |
| `ImageUrl` | `nvarchar(500)` | NULL | Category image URL |
| `CreatedAt` | `datetime2` | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp (UTC) |

**Indexes:**
- `PK_Categories` (CategoryId) - Clustered primary key
- `IX_Categories_Name` (Name) - Unique index
- `IX_Categories_Slug` (Slug) - Unique index

**Relationships:**
- **Products:** One-to-Many (1:N) - Category can have many products

**Sample Data (6 categories seeded):**
```sql
CategoryId | Name              | Slug
-----------|-------------------|------------------
1          | Electronics       | electronics
2          | Fashion           | fashion
3          | Home & Garden     | home-garden
4          | Beauty            | beauty
5          | Sports & Outdoors | sports-outdoors
6          | Books & Media     | books-media
```

---

### 2. Products

Product catalog with pricing, ratings, and availability.

**Table Name:** `Products`  
**Primary Key:** `ProductId`  
**Model:** `backend/Models/Product.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `ProductId` | `int` | PK, IDENTITY(1,1) | Unique product identifier |
| `Name` | `nvarchar(200)` | NOT NULL | Product name |
| `Slug` | `nvarchar(200)` | NOT NULL, UNIQUE | URL-friendly slug |
| `Description` | `nvarchar(MAX)` | NULL | Full product description |
| `ShortDescription` | `nvarchar(500)` | NULL | Brief description (1-2 sentences) |
| `Price` | `decimal(18,2)` | NOT NULL | Current price in USD |
| `OriginalPrice` | `decimal(18,2)` | NULL | Original price before discount |
| `CategoryId` | `int` | NOT NULL, FK | Foreign key to Categories |
| `Brand` | `nvarchar(100)` | NULL | Brand name |
| `ImageUrl` | `nvarchar(500)` | NULL | Product image URL (Unsplash) |
| `Rating` | `decimal(3,2)` | NOT NULL, DEFAULT 0 | Average rating (0.00-5.00) |
| `ReviewCount` | `int` | NOT NULL, DEFAULT 0 | Number of customer reviews |
| `InStock` | `bit` | NOT NULL, DEFAULT 1 | Availability flag |
| `IsFeatured` | `bit` | NOT NULL, DEFAULT 0 | Featured on homepage flag |
| `IsNewArrival` | `bit` | NOT NULL, DEFAULT 0 | New arrival flag |
| `CreatedAt` | `datetime2` | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp (UTC) |
| `UpdatedAt` | `datetime2` | NULL | Last update timestamp (UTC) |

**Indexes:**
- `PK_Products` (ProductId) - Clustered primary key
- `IX_Products_Slug` (Slug) - Unique index for SEO URLs
- `IX_Products_CategoryId` (CategoryId) - Foreign key index
- `IX_Products_Price` (Price) - Index for price filters
- `IX_Products_Rating` (Rating) - Index for rating sorts
- `IX_Products_IsFeatured` (IsFeatured) - Index for featured queries

**Foreign Keys:**
- `FK_Products_Categories` → Categories(CategoryId) - **RESTRICT** delete

**Relationships:**
- **Category:** Many-to-One (N:1) - Product belongs to one category
- **OrderItems:** One-to-Many (1:N) - Product can appear in many orders

**Constraints:**
- `Price` must be > 0
- `Rating` must be 0-5
- `Slug` must be unique across all products

**Sample Data (50 products seeded):**
- Electronics: 25 products (headphones, TVs, cameras, speakers, etc.)
- Fashion: 20 products (clothing, accessories, shoes)
- Home & Garden: 5 products (furniture, decor)
- Price range: $19.99 - $1,299.99
- Ratings: 4.3 - 4.9 stars
- 7 featured products, 9 new arrivals

---

### 3. Orders

Customer orders with metadata and status.

**Table Name:** `Orders`  
**Primary Key:** `OrderId`  
**Model:** `backend/Models/Order.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `OrderId` | `int` | PK, IDENTITY(1,1) | Unique order identifier |
| `OrderNumber` | `nvarchar(50)` | NOT NULL, UNIQUE | Human-readable order number |
| `TotalAmount` | `decimal(18,2)` | NOT NULL | Total order value in USD |
| `Status` | `nvarchar(50)` | NOT NULL, DEFAULT 'Pending' | Order status |
| `ShippingAddress` | `nvarchar(MAX)` | NOT NULL | JSON-encoded shipping address |
| `CustomerEmail` | `nvarchar(200)` | NULL | Customer email address |
| `CustomerName` | `nvarchar(200)` | NULL | Customer full name |
| `CreatedAt` | `datetime2` | NOT NULL, DEFAULT GETUTCDATE() | Order creation timestamp (UTC) |

**Indexes:**
- `PK_Orders` (OrderId) - Clustered primary key
- `IX_Orders_OrderNumber` (OrderNumber) - Unique index

**Relationships:**
- **OrderItems:** One-to-Many (1:N) - Order can have many line items

**Order Number Format:** `ORD-YYYY-XXXXX`
- `YYYY`: Year (e.g., 2026)
- `XXXXX`: Random 5-digit number (10000-99999)
- Example: `ORD-2026-45678`
- Generated in `OrdersController.GenerateUniqueOrderNumberAsync()`

**Order Status Values:**
- `Pending` (default) - Order created, awaiting processing
- **Note:** Status updates NOT IMPLEMENTED (orders remain "Pending")

**ShippingAddress JSON Structure:**
```json
{
  "name": "John Doe",
  "address": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "country": "USA"
}
```

**Constraints:**
- `TotalAmount` must be > 0
- `OrderNumber` must be unique

---

### 4. OrderItems

Line items in an order (product snapshot at time of purchase).

**Table Name:** `OrderItems`  
**Primary Key:** `OrderItemId`  
**Model:** `backend/Models/OrderItem.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `OrderItemId` | `int` | PK, IDENTITY(1,1) | Unique order item identifier |
| `OrderId` | `int` | NOT NULL, FK | Foreign key to Orders |
| `ProductId` | `int` | NOT NULL, FK | Foreign key to Products |
| `ProductName` | `nvarchar(200)` | NOT NULL | Product name snapshot |
| `Quantity` | `int` | NOT NULL | Quantity ordered (minimum 1) |
| `UnitPrice` | `decimal(18,2)` | NOT NULL | Price per unit at time of order |

**Indexes:**
- `PK_OrderItems` (OrderItemId) - Clustered primary key
- `IX_OrderItems_OrderId` (OrderId) - Foreign key index (implicit)
- `IX_OrderItems_ProductId` (ProductId) - Foreign key index (implicit)

**Foreign Keys:**
- `FK_OrderItems_Orders` → Orders(OrderId) - **CASCADE** delete
- `FK_OrderItems_Products` → Products(ProductId) - **RESTRICT** delete

**Relationships:**
- **Order:** Many-to-One (N:1) - Order item belongs to one order
- **Product:** Many-to-One (N:1) - Order item references one product

**Design Decisions:**
- **Product Name Snapshot:** Stores product name at time of order to preserve historical accuracy (product names may change)
- **Unit Price Snapshot:** Stores price at time of order (product prices may change)
- **Cascade Delete:** When order is deleted, all order items are deleted
- **Restrict Delete:** Products cannot be deleted if referenced by order items

**Constraints:**
- `Quantity` must be >= 1
- `UnitPrice` must be > 0

**Calculated Field:**
- Line Total = `Quantity * UnitPrice` (calculated in application, not stored)

---

### 5. CartItems

Shopping cart items by session (OPTIONAL - not used by frontend).

**Table Name:** `CartItems`  
**Primary Key:** `CartItemId`  
**Model:** `backend/Models/CartItem.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `CartItemId` | `int` | PK, IDENTITY(1,1) | Unique cart item identifier |
| `SessionId` | `nvarchar(100)` | NOT NULL | Session identifier (cookie/token) |
| `ProductId` | `int` | NOT NULL, FK | Foreign key to Products |
| `Quantity` | `int` | NOT NULL | Quantity in cart (minimum 1) |
| `AddedAt` | `datetime2` | NOT NULL, DEFAULT GETUTCDATE() | Timestamp when added to cart |

**Indexes:**
- `PK_CartItems` (CartItemId) - Clustered primary key
- `IX_CartItems_SessionId` (SessionId) - Index for session lookups
- `IX_CartItems_ProductId` (ProductId) - Foreign key index (implicit)

**Foreign Keys:**
- `FK_CartItems_Products` → Products(ProductId) - **RESTRICT** delete

**Relationships:**
- **Product:** Many-to-One (N:1) - Cart item references one product

**Current Status:** ⚠️ **NOT USED BY FRONTEND**
- Frontend uses localStorage for cart management
- Table exists in database but no API endpoints
- Table remains for potential future server-side cart feature

**Constraints:**
- `Quantity` must be >= 1

---

## Relationships Detail

### Products ↔ Categories (Many-to-One)

```sql
Products.CategoryId → Categories.CategoryId
ON DELETE RESTRICT
```

**Behavior:**
- Each product must belong to exactly one category
- Categories cannot be deleted if products exist
- Prevents orphaned products
- Use case: Cannot delete "Electronics" category if products exist in it

---

### Orders ↔ OrderItems (One-to-Many)

```sql
OrderItems.OrderId → Orders.OrderId
ON DELETE CASCADE
```

**Behavior:**
- Each order can have multiple order items
- Deleting an order automatically deletes all its items
- Atomic deletion ensures referential integrity
- Use case: Cancel order → all line items removed

---

### OrderItems ↔ Products (Many-to-One)

```sql
OrderItems.ProductId → Products.ProductId
ON DELETE RESTRICT
```

**Behavior:**
- Each order item references one product
- Products cannot be deleted if order history exists
- Preserves order history even if product discontinued
- Use case: Cannot delete product with order history

---

### CartItems ↔ Products (Many-to-One)

```sql
CartItems.ProductId → Products.ProductId
ON DELETE RESTRICT
```

**Behavior:**
- Each cart item references one product
- Products cannot be deleted if in any cart
- Use case: Cannot delete product currently in customer carts

---

## Indexes & Performance

### Purpose of Each Index

1. **Categories.Name (Unique):**
   - Ensures category names are unique
   - Fast lookup for category name validation
   - Query: `WHERE Name = 'Electronics'`

2. **Categories.Slug (Unique):**
   - Ensures slugs are unique
   - Fast lookup for SEO URLs
   - Query: `WHERE Slug = 'electronics'`

3. **Products.Slug (Unique):**
   - Product detail pages by slug
   - SEO-friendly URLs
   - Query: `WHERE Slug = 'premium-wireless-headphones'`

4. **Products.CategoryId:**
   - Filter products by category
   - Join optimization for Category navigation
   - Query: `WHERE CategoryId = 1`

5. **Products.Price:**
   - Price range filters
   - Price sorting
   - Query: `WHERE Price BETWEEN 100 AND 500`

6. **Products.Rating:**
   - Rating filters
   - Rating-based sorting
   - Query: `WHERE Rating >= 4.5 ORDER BY Rating DESC`

7. **Products.IsFeatured:**
   - Featured products queries
   - Homepage featured products
   - Query: `WHERE IsFeatured = 1`

8. **Orders.OrderNumber (Unique):**
   - Unique order number enforcement
   - Fast order lookup by order number
   - Query: `WHERE OrderNumber = 'ORD-2026-12345'`

9. **CartItems.SessionId:**
   - Fast cart retrieval by session
   - Query: `WHERE SessionId = 'session-abc123'`

---

## Data Types & Precision

### Decimal Precision

- **Price fields:** `decimal(18, 2)`
  - Total digits: 18
  - Decimal places: 2
  - Range: -999,999,999,999,999.99 to 999,999,999,999,999.99
  - Suitable for currency (cents precision)

- **Rating field:** `decimal(3, 2)`
  - Total digits: 3
  - Decimal places: 2
  - Range: 0.00 to 5.00
  - Example: 4.75 stars

### String Length Limits

| Field | Max Length | Rationale |
|-------|------------|-----------|
| Category.Name | 100 | Category names are short |
| Product.Name | 200 | Product names can be long |
| Product.Slug | 200 | Match product name length |
| Product.ShortDescription | 500 | Brief description (1-2 sentences) |
| Product.Description | MAX | Full product details |
| Brand | 100 | Brand names are short |
| ImageUrl | 500 | URLs can be long (with query params) |
| OrderNumber | 50 | Format: "ORD-YYYY-XXXXX" (14 chars) |
| CustomerEmail | 200 | Email addresses up to 200 chars |
| CustomerName | 200 | Full names up to 200 chars |
| SessionId | 100 | GUID or session token |

---

## Database Seeding

**File:** `backend/Data/SeedData.cs`  
**Method:** `SeedData.InitializeAsync()`  
**Trigger:** Automatic on first startup (Development environment)

### Seeded Data

**Categories:** 6
- Electronics (25 products)
- Fashion (20 products)
- Home & Garden (5 products)
- Beauty (0 products)
- Sports & Outdoors (0 products)
- Books & Media (0 products)

**Products:** 50 total
- Price range: $19.99 - $1,299.99
- Brands: AudioTech, ViewMax, PhotoPro, AudioMax, and 20+ others
- All have images (Unsplash URLs)
- All have ratings (4.3 - 4.9 stars)
- All have review counts (312 - 2,789 reviews)
- 7 featured products
- 9 new arrivals

**Idempotency:** Seeding checks `Products.Any()` and skips if data exists

**Reset Database:**
```bash
cd backend
dotnet ef database drop --force
dotnet ef database update
dotnet run  # Will automatically reseed
```

---

## Migrations

### Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| `20260127161612_InitialCreate` | 2026-01-27 | Initial schema with all 5 tables |

**Migration File:** `backend/Migrations/20260127161612_InitialCreate.cs`

### Creating New Migrations

```bash
# Create migration
dotnet ef migrations add DescriptiveName

# Apply migration
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName

# Remove last migration (before applying)
dotnet ef migrations remove
```

---

## Database Configuration

### Connection Strings

**Development (appsettings.Development.json):**
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb_Dev;Trusted_Connection=true;MultipleActiveResultSets=true"
```

**Production (appsettings.json):**
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb;Trusted_Connection=true;MultipleActiveResultSets=true"
```

**Docker:**
```json
"DockerConnection": "Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

### DbContext Configuration

**File:** `backend/Program.cs`

**Features Enabled:**
- Connection timeout: 30 seconds
- Retry on failure: 3 attempts, 5-second delay
- Sensitive data logging (Development only)
- Detailed errors (Development only)
- Connection pooling (automatic)

---

## Query Patterns

### Common Queries

**Get products with category:**
```csharp
var products = await _context.Products
    .Include(p => p.Category)  // Eager loading
    .AsNoTracking()            // Read-only optimization
    .Where(p => p.InStock)
    .ToListAsync();
```

**Get product by slug:**
```csharp
var product = await _context.Products
    .Include(p => p.Category)
    .AsNoTracking()
    .FirstOrDefaultAsync(p => p.Slug == slug);
```

**Create order with items (transaction):**
```csharp
using var transaction = await _context.Database.BeginTransactionAsync();

var order = new Order { /* ... */ };
_context.Orders.Add(order);
await _context.SaveChangesAsync();

var orderItems = items.Select(i => new OrderItem { OrderId = order.OrderId, /* ... */ });
_context.OrderItems.AddRange(orderItems);
await _context.SaveChangesAsync();

await transaction.CommitAsync();
```

---

## Database Constraints Summary

### Primary Keys (5)
- Categories.CategoryId
- Products.ProductId
- Orders.OrderId
- OrderItems.OrderItemId
- CartItems.CartItemId

### Foreign Keys (5)
- Products.CategoryId → Categories.CategoryId (RESTRICT)
- OrderItems.OrderId → Orders.OrderId (CASCADE)
- OrderItems.ProductId → Products.ProductId (RESTRICT)
- CartItems.ProductId → Products.ProductId (RESTRICT)

### Unique Constraints (4)
- Categories.Name
- Categories.Slug
- Products.Slug
- Orders.OrderNumber

### Check Constraints (NOT IMPLEMENTED)
- EF Core data annotations enforce validation in application layer
- Database-level check constraints not generated

---

## Performance Considerations

### Optimization Techniques Used
- ✅ Indexed columns for common filters (slug, categoryId, price, rating)
- ✅ AsNoTracking for read-only queries
- ✅ Eager loading with Include() (prevents N+1 queries)
- ✅ Connection pooling (automatic)
- ✅ Retry logic for transient failures

### NOT IMPLEMENTED
- ❌ Computed columns
- ❌ Materialized views
- ❌ Full-text search indexes
- ❌ Partitioning
- ❌ Read replicas
- ❌ Query result caching

---

## Backup & Recovery

**NOT CONFIGURED**

Recommended production setup:
- Automated daily backups
- Transaction log backups every 15 minutes
- Point-in-time recovery enabled
- Backup retention: 30 days minimum

---

## Security

### Database-Level Security

**NOT IMPLEMENTED:**
- ❌ Row-level security
- ❌ Column-level encryption
- ❌ Always Encrypted
- ❌ Dynamic data masking
- ❌ Audit trails
- ❌ Least-privilege access control

**Current State:**
- Connection uses integrated security (LocalDB)
- No user authentication system
- No sensitive data encryption
- Development database only

---

## Related Documentation

- [API Documentation](./apis.md) - How data is accessed via API
- [Technology Stack](../technology/stack.md) - EF Core version and configuration
- [Architecture Overview](../architecture/overview.md) - Data flow and patterns

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**Database Version:** InitialCreate (2026-01-27)  
**EF Core Version:** 10.x
