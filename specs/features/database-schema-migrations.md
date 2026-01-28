# Feature: Database Schema & Migrations

**Feature ID**: FRD-002  
**Version**: 1.0  
**Status**: Not Started  
**Owner**: Backend Team  
**Created**: January 27, 2026  
**Last Updated**: January 27, 2026

---

## 1. Feature Overview

### 1.1 Description
Design and implement the SQL Server database schema for the Shop Assistant e-commerce demo using Entity Framework Core code-first approach. Create entity models, configure relationships, and set up EF Core migrations for database version control.

### 1.2 Business Context
The application needs persistent data storage for products, categories, cart items, and orders. A simple, normalized schema will support all required functionality while remaining easy to understand for demo and learning purposes.

### 1.3 Goals
- Create simple, normalized database schema
- Support all core e-commerce operations
- Enable easy database setup and teardown for demos
- Provide foundation for data seeding
- Demonstrate EF Core code-first development

### 1.4 Related PRD Sections
- Section 5.1.3: Database
- Section 5.2.3: Database Schema (Simplified)
- Section 5.5.1: Database Setup Options
- Section 3.7: Database Features

---

## 2. User Stories

```gherkin
As a backend developer,
I want entity models defined in C#,
So that I can work with strongly-typed objects instead of SQL queries.

As a developer,
I want EF Core migrations,
So that I can version control database schema changes.

As a developer,
I want a simple database schema,
So that I can easily understand relationships and write queries.

As a new team member,
I want to run one command to create the database,
So that I can quickly set up my development environment.

As a presenter,
I want to reset the database to demo state,
So that I can run clean demonstrations repeatedly.
```

---

## 3. Functional Requirements

### 3.1 Entity Models

**[REQ-002.1] Product Entity**
```csharp
public class Product
{
    public int ProductId { get; set; }          // Primary key
    public string Name { get; set; }            // Required, max 200 chars
    public string Description { get; set; }     // Required
    public string ShortDescription { get; set; } // Optional, max 500 chars
    public decimal Price { get; set; }          // Required, precision (18,2)
    public decimal? OriginalPrice { get; set; } // Optional, for discounts
    public int CategoryId { get; set; }         // Foreign key
    public string Brand { get; set; }           // Required, max 100 chars
    public string ImageUrl { get; set; }        // Required, max 500 chars
    public decimal Rating { get; set; }         // 0-5, precision (3,2)
    public int ReviewCount { get; set; }        // Default 0
    public bool InStock { get; set; }           // Default true
    public string Sku { get; set; }             // Required, max 50 chars, unique
    public string Slug { get; set; }            // URL-friendly, max 250 chars
    public DateTime CreatedAt { get; set; }     // Default UTC now
    public bool IsFeatured { get; set; }        // Default false
    public bool IsNewArrival { get; set; }      // Default false
    
    // Navigation properties
    public Category Category { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}
```

**[REQ-002.2] Category Entity**
```csharp
public class Category
{
    public int CategoryId { get; set; }      // Primary key
    public string Name { get; set; }         // Required, max 100 chars, unique
    public string Description { get; set; }  // Optional, max 500 chars
    public string ImageUrl { get; set; }     // Optional, max 500 chars
    public string Slug { get; set; }         // URL-friendly, max 250 chars
    
    // Navigation properties
    public ICollection<Product> Products { get; set; }
}
```

**[REQ-002.3] CartItem Entity** (Optional - can use localStorage)
```csharp
public class CartItem
{
    public int CartItemId { get; set; }      // Primary key
    public string SessionId { get; set; }    // Required, max 100 chars (or UserId)
    public int ProductId { get; set; }       // Foreign key
    public int Quantity { get; set; }        // Required, min 1
    public DateTime AddedAt { get; set; }    // Default UTC now
    
    // Navigation properties
    public Product Product { get; set; }
}
```

**[REQ-002.4] Order Entity**
```csharp
public class Order
{
    public int OrderId { get; set; }            // Primary key
    public string OrderNumber { get; set; }     // Required, unique, max 50 chars
    public decimal TotalAmount { get; set; }    // Required, precision (18,2)
    public string Status { get; set; }          // Required, max 50 chars
    public string ShippingAddress { get; set; } // Required, JSON string
    public string CustomerEmail { get; set; }   // Optional, max 255 chars
    public string CustomerName { get; set; }    // Optional, max 200 chars
    public DateTime CreatedAt { get; set; }     // Default UTC now
    
    // Navigation properties
    public ICollection<OrderItem> OrderItems { get; set; }
}
```

**[REQ-002.5] OrderItem Entity**
```csharp
public class OrderItem
{
    public int OrderItemId { get; set; }     // Primary key
    public int OrderId { get; set; }         // Foreign key
    public int ProductId { get; set; }       // Foreign key
    public int Quantity { get; set; }        // Required, min 1
    public decimal UnitPrice { get; set; }   // Required, precision (18,2)
    public string ProductName { get; set; }  // Snapshot, max 200 chars
    
    // Navigation properties
    public Order Order { get; set; }
    public Product Product { get; set; }
}
```

### 3.2 Database Configuration

**[REQ-002.6] DbContext Setup**
- Create `ShopDbContext` inheriting from `DbContext`
- Define DbSet properties for each entity
- Configure entity relationships in `OnModelCreating`
- Set up database connection from configuration

**[REQ-002.7] Relationships & Constraints**
- Products → Categories: Many-to-One (required)
- Orders → OrderItems: One-to-Many
- OrderItems → Products: Many-to-One (required)
- CartItems → Products: Many-to-One (required)
- Cascade delete: None (preserve referential integrity)
- Foreign key constraints on all relationships

**[REQ-002.8] Indexes**
- Primary keys (automatic)
- Index on `Products.CategoryId` for filtering
- Index on `Products.Slug` for URL lookups (unique)
- Index on `Products.IsFeatured` for featured queries
- Index on `Category.Slug` (unique)
- Index on `Order.OrderNumber` (unique)
- Index on `CartItem.SessionId` for cart lookups

**[REQ-002.9] Default Values & Constraints**
- `CreatedAt` defaults to UTC now
- `InStock` defaults to true
- `IsFeatured` and `IsNewArrival` default to false
- `Price` and `UnitPrice` must be positive
- `Quantity` must be positive
- `Rating` must be between 0 and 5
- Required fields: NOT NULL constraints

### 3.3 EF Core Migrations

**[REQ-002.10] Initial Migration**
- Create initial migration named "InitialCreate"
- Include all tables and relationships
- Migration should be reversible (up/down)
- Committed to source control

**[REQ-002.11] Migration Commands**
```bash
# Create migration
dotnet ef migrations add InitialCreate

# Apply migration (create database)
dotnet ef database update

# Rollback migration
dotnet ef database update 0

# Remove last migration
dotnet ef migrations remove
```

**[REQ-002.12] Database Initialization**
- Automatic migration on startup (development only)
- Check if database exists, create if not
- Apply pending migrations automatically
- Safe for repeated runs

---

## 4. Technical Specifications

### 4.1 Database Connection Strings

**LocalDB (Windows)**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb;Trusted_Connection=true;MultipleActiveResultSets=true"
}
```

**SQL Server Developer Edition**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ShopAssistantDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
}
```

**Docker SQL Server**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password=YourStrong@Password;TrustServerCertificate=true"
}
```

### 4.2 ShopDbContext Implementation

```csharp
public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
            entity.Property(e => e.Slug).HasMaxLength(250);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.IsFeatured);
            
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        // Order configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.HasIndex(e => e.OrderNumber).IsUnique();
        });

        // OrderItem configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            
            entity.HasOne(e => e.Order)
                  .WithMany(o => o.OrderItems)
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Product)
                  .WithMany(p => p.OrderItems)
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // CartItem configuration
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartItemId);
            entity.HasIndex(e => e.SessionId);
            
            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
```

### 4.3 Dependency Injection Registration

```csharp
// Program.cs
builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 4.4 Database Initialization on Startup

```csharp
// Program.cs (after app.Build())
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
        db.Database.Migrate(); // Apply pending migrations
    }
}
```

---

## 5. Dependencies

### 5.1 Prerequisites
- **FRD-001**: Backend API Setup (DbContext registration)
- SQL Server installed (LocalDB, Developer, or Docker)
- .NET EF Core CLI tools: `dotnet tool install --global dotnet-ef`

### 5.2 Blocks
- **FRD-003**: Data Seeding (needs schema to exist)
- **FRD-004**: Products API (needs Product entity)
- **FRD-005**: Categories API (needs Category entity)

### 5.3 NuGet Packages Required
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.*" />
```

---

## 6. Acceptance Criteria

### 6.1 Must Have
- [ ] All 5 entity models created with proper properties and data types
- [ ] `ShopDbContext` configured with all DbSet properties
- [ ] Entity relationships configured in `OnModelCreating`
- [ ] Initial EF Core migration created
- [ ] Database creates successfully with `dotnet ef database update`
- [ ] All tables exist in SQL Server with correct schema
- [ ] Foreign key constraints present and enforced
- [ ] Indexes created on specified columns
- [ ] Connection strings configured for at least 2 database options
- [ ] Automatic migration on startup (development) works
- [ ] Can create, query, update, and delete records for each entity

### 6.2 Should Have
- [ ] Migration is reversible (can roll back)
- [ ] Database schema matches entity models exactly
- [ ] Default values applied correctly
- [ ] Cascade delete configured appropriately
- [ ] Database initialization documented in README

### 6.3 Nice to Have
- [ ] Database reset script for clean demo state
- [ ] Script to check if database exists
- [ ] Validation errors provide clear messages
- [ ] Sample LINQ queries documented

---

## 7. Out of Scope

### 7.1 Explicitly Excluded
- ❌ Database optimization for production scale
- ❌ Database backups and recovery procedures
- ❌ Multi-database support (only SQL Server)
- ❌ Sharding or partitioning
- ❌ Full-text search indexes
- ❌ Stored procedures
- ❌ Database views
- ❌ Triggers
- ❌ User/authentication tables (mocked in frontend)
- ❌ Audit logging tables
- ❌ Soft delete patterns

---

## 8. Testing Strategy

### 8.1 Manual Testing
```bash
# Create migration
dotnet ef migrations add InitialCreate

# Verify migration file created

# Apply migration
dotnet ef database update

# Open SQL Server Management Studio or Azure Data Studio
# Verify tables exist
# Check table schemas match entity models
# Verify indexes exist
# Test foreign key constraints

# Test rollback
dotnet ef database update 0
# Verify database dropped

# Reapply
dotnet ef database update
```

### 8.2 Integration Testing (Optional)
- DbContext can connect to database
- Can insert record into each table
- Foreign key constraints enforced
- Required fields validated
- Cascade delete works as configured

### 8.3 Manual SQL Verification
```sql
-- Check tables exist
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'

-- Check indexes
SELECT * FROM sys.indexes 
WHERE object_id = OBJECT_ID('Products')

-- Check foreign keys
SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS

-- Insert test data
INSERT INTO Categories (Name, Description, Slug) 
VALUES ('Electronics', 'Electronic products', 'electronics')

INSERT INTO Products (Name, Description, Price, CategoryId, Brand, ImageUrl, Rating, Sku, Slug, CreatedAt, InStock, IsFeatured, IsNewArrival, ReviewCount)
VALUES ('Test Product', 'Test Description', 99.99, 1, 'TestBrand', 'http://example.com/image.jpg', 4.5, 'TEST-001', 'test-product', GETUTCDATE(), 1, 0, 0, 0)
```

---

## 9. Success Metrics

### 9.1 Technical Metrics
- **Migration creation**: < 30 seconds
- **Database creation**: < 10 seconds
- **Zero schema errors**: All tables created correctly
- **Foreign keys**: 100% defined and working

### 9.2 Developer Experience
- **Setup complexity**: Single command to create database
- **Schema understanding**: New developer understands schema in < 5 minutes
- **Migration reliability**: No failed migrations

### 9.3 Data Integrity
- **Referential integrity**: All foreign keys enforced
- **Data validation**: Required fields enforced
- **Constraint violations**: Caught at database level

---

## 10. Implementation Notes

### 10.1 Implementation Order
1. Create entity model classes in `Models/` folder
2. Create `ShopDbContext` in `Data/` folder
3. Configure entity relationships in `OnModelCreating`
4. Add connection string to `appsettings.json`
5. Register DbContext in `Program.cs`
6. Create initial migration: `dotnet ef migrations add InitialCreate`
7. Review generated migration code
8. Apply migration: `dotnet ef database update`
9. Verify database schema in SQL tool
10. Add automatic migration on startup (development)
11. Document database setup in README

### 10.2 Development Tips
- Use `dotnet ef migrations list` to see all migrations
- Use SQL Server Object Explorer in VS to browse database
- Test migration rollback before committing
- Keep entity models simple (no complex logic)
- Use data annotations sparingly (prefer Fluent API)
- Always use async methods in EF Core queries

### 10.3 Common Issues
- **Migration fails**: Check connection string, ensure SQL Server running
- **Foreign key errors**: Verify parent records exist before inserting
- **Unique constraint**: Check for duplicate slugs or SKUs
- **EF tools not found**: Install `dotnet tool install --global dotnet-ef`
- **Trust certificate error**: Add `TrustServerCertificate=true` to connection string

---

## 11. Documentation Requirements

### 11.1 README Updates
- Database setup instructions for all 3 options (LocalDB, Developer, Docker)
- EF Core migration commands
- How to reset database
- Database schema diagram (optional - can use dbdiagram.io)

### 11.2 Code Comments
- Document entity relationships
- Explain non-obvious configurations
- Comment complex Fluent API configurations

### 11.3 Database Schema Documentation
- Table descriptions
- Column descriptions
- Relationship explanations
- Index purposes

---

## 12. Review Checklist

Before marking this feature complete:
- [ ] Code review completed
- [ ] All entity models defined
- [ ] DbContext configured correctly
- [ ] Migration created and tested
- [ ] Database creates without errors
- [ ] Can query all tables successfully
- [ ] Foreign key constraints work
- [ ] Indexes exist on specified columns
- [ ] Connection strings tested for 2+ database options
- [ ] Automatic migration on startup tested
- [ ] README updated with database setup
- [ ] Schema matches PRD requirements
- [ ] All acceptance criteria met

---

**Status**: Ready for Implementation  
**Priority**: P0 (Foundational - blocks all data features)  
**Estimated Effort**: 4-6 hours  
**Dependencies**: FRD-001 (Backend API Setup)
