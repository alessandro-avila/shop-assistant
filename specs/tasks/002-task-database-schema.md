# Task: Database Schema & Entity Models

**Task ID**: TASK-002  
**Priority**: P0 (Critical - Foundational)  
**Estimated Effort**: 4-6 hours  
**Dependencies**: TASK-001 (Backend Scaffolding)  
**Status**: Not Started

---

## Description

Design and implement the complete database schema using Entity Framework Core code-first approach. Create all entity models, configure relationships, define indexes, and generate initial database migrations. This task establishes the data persistence layer for the entire application.

---

## Dependencies

**Blocking Tasks**:
- TASK-001: Backend Project Scaffolding (must complete first)

**Blocked Tasks**:
- TASK-003: Data Seeding System
- TASK-004: Products API Implementation
- TASK-005: Categories API Implementation
- TASK-006: Orders API Implementation

---

## Technical Requirements

### 1. Entity Models

Create the following entity classes in the `Models/` directory:

#### Products Table
- `ProductId` (int, primary key, auto-increment)
- `Name` (string, max 200 chars, required)
- `Slug` (string, max 200 chars, required, unique index)
- `Description` (string, unlimited, nullable)
- `ShortDescription` (string, max 500 chars, nullable)
- `Price` (decimal(18,2), required, must be positive)
- `OriginalPrice` (decimal(18,2), nullable)
- `CategoryId` (int, foreign key, required)
- `Brand` (string, max 100 chars, nullable)
- `ImageUrl` (string, max 500 chars, nullable)
- `Rating` (decimal(3,2), default 0, range 0-5)
- `ReviewCount` (int, default 0)
- `InStock` (bool, default true)
- `IsFeatured` (bool, default false)
- `IsNewArrival` (bool, default false)
- `CreatedAt` (datetime, default now)
- `UpdatedAt` (datetime, nullable)

#### Categories Table
- `CategoryId` (int, primary key, auto-increment)
- `Name` (string, max 100 chars, required, unique)
- `Slug` (string, max 100 chars, required, unique index)
- `Description` (string, max 500 chars, nullable)
- `ImageUrl` (string, max 500 chars, nullable)
- `CreatedAt` (datetime, default now)

#### CartItems Table (Optional - Phase 3)
- `CartItemId` (int, primary key, auto-increment)
- `SessionId` (string, max 100 chars, required, index)
- `ProductId` (int, foreign key, required)
- `Quantity` (int, required, must be positive)
- `AddedAt` (datetime, default now)

#### Orders Table
- `OrderId` (int, primary key, auto-increment)
- `OrderNumber` (string, max 50 chars, required, unique index)
- `TotalAmount` (decimal(18,2), required, must be positive)
- `Status` (string, max 50 chars, default "Pending")
- `ShippingAddress` (string, unlimited, required - stores JSON)
- `CustomerEmail` (string, max 200 chars, nullable)
- `CustomerName` (string, max 200 chars, nullable)
- `CreatedAt` (datetime, default now)

#### OrderItems Table
- `OrderItemId` (int, primary key, auto-increment)
- `OrderId` (int, foreign key, required)
- `ProductId` (int, foreign key, required)
- `ProductName` (string, max 200 chars, required - snapshot)
- `Quantity` (int, required, must be positive)
- `UnitPrice` (decimal(18,2), required, must be positive)

### 2. Entity Relationships

Configure the following relationships in `ShopDbContext.OnModelCreating`:

- **Products → Categories**: Many-to-One (required)
  - `Product.Category` navigation property
  - `Category.Products` collection navigation property
  - Delete behavior: Restrict (prevent deleting categories with products)

- **Orders → OrderItems**: One-to-Many
  - `Order.OrderItems` collection navigation property
  - `OrderItem.Order` navigation property
  - Delete behavior: Cascade (deleting order deletes items)

- **OrderItems → Products**: Many-to-One
  - `OrderItem.Product` navigation property
  - Delete behavior: Restrict (preserve order history even if product deleted)

- **CartItems → Products**: Many-to-One (if implementing cart persistence)
  - `CartItem.Product` navigation property
  - Delete behavior: Cascade (remove cart items if product deleted)

### 3. Indexes

Create indexes for performance optimization:
- `Products.CategoryId` (for category filtering)
- `Products.Slug` (unique, for URL lookups)
- `Products.Price` (for price range queries)
- `Products.Rating` (for rating filters)
- `Categories.Slug` (unique, for URL lookups)
- `Orders.OrderNumber` (unique, for order lookup)
- `CartItems.SessionId` (for cart retrieval, if implemented)

### 4. Data Annotations & Fluent API

Use a combination of data annotations and Fluent API:
- Data annotations for simple constraints (Required, MaxLength, Range)
- Fluent API for complex configurations (relationships, indexes, precision)
- Configure decimal precision explicitly: `HasPrecision(18, 2)`
- Configure default values where appropriate
- Specify cascade behaviors explicitly

### 5. DbContext Configuration

Update `ShopDbContext` to include:
- DbSet properties for all entities
- `OnModelCreating` method with all entity configurations
- Connection string configuration
- Enable lazy loading proxies (optional, based on preference)
- Configure query tracking behavior for read-heavy operations

### 6. Validation Rules

Implement data validation:
- Price and UnitPrice must be > 0
- Quantity must be > 0
- Rating must be between 0 and 5
- Email must be valid format (if validating)
- Required fields must not be null or empty

### 7. EF Core Migrations

Create initial migration:
- Migration name: `InitialCreate`
- Generate migration using: `dotnet ef migrations add InitialCreate`
- Review generated migration code for correctness
- Ensure migration creates all tables, indexes, and foreign keys
- Test migration: `dotnet ef database update`

### 8. Database Initialization

Implement database initialization logic:
- Auto-create database on first run (development only)
- Auto-apply pending migrations on startup (development only)
- Fail gracefully with clear error messages if database unavailable
- Log database operations to console

---

## Acceptance Criteria

- [ ] All 5 entity classes created with proper properties and data annotations
- [ ] All relationships configured correctly in `OnModelCreating`
- [ ] All indexes defined and configured
- [ ] Initial EF Core migration generated successfully
- [ ] Migration applies cleanly to new database (`dotnet ef database update`)
- [ ] Database schema matches design specification
- [ ] Foreign key constraints created correctly
- [ ] Default values set where specified
- [ ] Cascade delete behaviors configured as specified
- [ ] ShopDbContext includes all DbSet properties
- [ ] No EF Core warnings or errors during migration
- [ ] Database can be dropped and recreated cleanly
- [ ] Code follows Entity Framework Core best practices

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `EntityModelTests`
- [ ] Test entity property validation (Required, MaxLength, Range)
- [ ] Test decimal precision for Price fields
- [ ] Test default values (Rating default 0, InStock default true)
- [ ] Test navigation property initialization

**Test Class**: `DbContextConfigurationTests`
- [ ] Test DbContext can be instantiated with valid connection string
- [ ] Test all DbSet properties are accessible
- [ ] Test relationships are configured (using model metadata)
- [ ] Test indexes are defined (using model metadata)

### Integration Tests

**Test Class**: `DatabaseMigrationTests`
- [ ] Test migration creates database successfully
- [ ] Test all tables exist after migration
- [ ] Test foreign keys are created
- [ ] Test indexes are created
- [ ] Test can insert entity of each type
- [ ] Test cascade delete behavior on Orders → OrderItems
- [ ] Test restrict delete behavior on Categories with Products

**Test Class**: `EntityRelationshipTests`
- [ ] Test can create Product with Category relationship
- [ ] Test can create Order with OrderItems
- [ ] Test can load Category with related Products
- [ ] Test deleting Order cascades to OrderItems
- [ ] Test deleting Category with Products fails (restrict behavior)

### Manual Testing Checklist
- [ ] Run `dotnet ef migrations add InitialCreate` successfully
- [ ] Run `dotnet ef database update` successfully
- [ ] Inspect database schema using SQL Server Management Studio or Azure Data Studio
- [ ] Verify all tables, columns, indexes, and foreign keys created
- [ ] Test inserting sample data directly into database
- [ ] Test relationships by querying related entities

---

## Implementation Notes

### Entity Framework Best Practices
- Use virtual navigation properties for lazy loading (if enabled)
- Always include foreign key properties explicitly (CategoryId, OrderId, etc.)
- Use `[Column(TypeName = "decimal(18,2)")]` or Fluent API for decimal precision
- Implement `IValidatableObject` if complex validation needed
- Consider adding audit fields (CreatedBy, UpdatedBy) for future needs

### Migration Strategy
- Never modify existing migrations after applying to database
- Create new migration for schema changes
- Test rollback capability: `dotnet ef database update <previous-migration>`
- Keep migrations small and focused on single logical change

### Performance Considerations
- Index frequently queried columns (CategoryId, Price, Rating, Slug)
- Avoid over-indexing (indexes have write overhead)
- Use appropriate cascade behaviors (Cascade vs Restrict)
- Consider query performance when designing relationships

### Data Integrity
- Use database constraints (foreign keys, unique indexes)
- Don't rely solely on application-level validation
- Define NOT NULL constraints for required fields
- Use default values where appropriate to simplify inserts

---

## Definition of Done

- [ ] All entity models implemented with complete properties
- [ ] Relationships configured correctly in DbContext
- [ ] Indexes defined and created
- [ ] Initial migration generated and applied successfully
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests written and passing
- [ ] Manual testing completed and verified
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] Database documentation updated in README or docs
- [ ] PR created and approved

---

## Related Documents

- [FRD-002: Database Schema & Migrations](../features/database-schema-migrations.md)
- [PRD: Section 5.2.3 Database Schema](../prd.md#523-database-schema-simplified)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
