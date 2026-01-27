# Task: Data Seeding System

**Task ID**: TASK-003  
**Priority**: P0 (Critical - Required for Demo)  
**Estimated Effort**: 4-6 hours  
**Dependencies**: TASK-002 (Database Schema)  
**Status**: Not Started

---

## Description

Implement an automated data seeding system that populates the database with realistic demo data including 50-100 products across 6 categories. The seeding process must be idempotent, run automatically on first startup, and support database reset functionality for demo preparation.

---

## Dependencies

**Blocking Tasks**:
- TASK-002: Database Schema & Entity Models (must complete first)

**Blocked Tasks**:
- TASK-004: Products API Implementation (needs seeded data for testing)
- TASK-005: Categories API Implementation (needs seeded data for testing)
- TASK-006: Orders API Implementation (needs products for order creation)

---

## Technical Requirements

### 1. Seed Data Structure

Create `Data/SeedData.cs` class with methods for seeding each entity type:
- `SeedCategories()`: Create 6 categories
- `SeedProducts()`: Create 80-100 products distributed across categories
- `SeedInitialData()`: Orchestrate seeding process

### 2. Category Seed Data

Create 6 categories with metadata:
1. **Electronics** - Gadgets, devices, and tech accessories
2. **Fashion** - Clothing, accessories, and footwear
3. **Home & Garden** - Furniture, decor, and outdoor items
4. **Beauty** - Skincare, makeup, and personal care
5. **Sports & Outdoors** - Fitness equipment and outdoor gear
6. **Books & Media** - Books, movies, and digital content

Each category must have:
- Descriptive name
- URL-friendly slug
- Brief description (2-3 sentences)
- Image URL or placeholder

### 3. Product Seed Data Requirements

Generate 80-100 products with:
- Realistic product names (e.g., "Premium Wireless Headphones", "Organic Cotton T-Shirt")
- Variety of brands (10-12 fictional brands)
- Descriptions (100-200 words each)
- Short descriptions (1-2 sentences)
- Price distribution:
  - 30% budget items ($10-$50)
  - 50% mid-range items ($50-$200)
  - 15% premium items ($200-$500)
  - 5% luxury items ($500-$1000+)
- Rating distribution:
  - Average rating: 4.0-4.5
  - Range: 3.5 to 5.0
- Review counts: 50-2000 reviews per product
- Stock status: 95% in stock, 5% out of stock
- Featured products: 10-15 products marked as featured
- New arrivals: 20-25 products marked as new arrivals
- Image URLs: Placeholder or actual images

### 4. Product Distribution Across Categories

Distribute products across categories:
- Electronics: 20-25 products
- Fashion: 18-22 products
- Home & Garden: 15-18 products
- Beauty: 12-15 products
- Sports & Outdoors: 10-12 products
- Books & Media: 8-10 products

### 5. Idempotent Seeding

Implement checks to prevent duplicate data:
- Check if categories already exist (by name or slug)
- Check if products already exist (by SKU or slug)
- Skip seeding if data already present
- Log seeding actions (created vs skipped)
- Support multiple seeding runs without errors

### 6. Seeding Execution Strategy

Configure automatic seeding:
- **Development**: Seed automatically on first application startup
- **Option 1**: Call `SeedData.Initialize(dbContext)` in `Program.cs`
- **Option 2**: Use EF Core data seeding (`OnModelCreating`)
- **Option 3**: Create custom database initializer

Provide manual seeding option:
- Command line argument: `dotnet run --seed-data`
- Or separate console command
- Clear logging of seeding progress

### 7. Database Reset Functionality

Implement database reset capability:
- Method to clear all data (DELETE FROM all tables)
- Method to drop and recreate database
- Command: `dotnet run --reset-database --seed-data`
- Confirmation prompt before destructive operations
- Only available in development environment

### 8. Data Generation Helpers

Create helper methods for realistic data generation:
- `GenerateSlug(string name)`: Convert names to URL-friendly slugs
- `GenerateRandomRating()`: Return rating between 3.5 and 5.0
- `GenerateRandomPrice(PriceRange range)`: Return price within range
- `GenerateReviewCount()`: Return review count between 50 and 2000
- `GenerateProductDescription(string productName)`: Template-based descriptions

### 9. Image Placeholders

Provide image URLs:
- Use placeholder services (e.g., `https://via.placeholder.com/600x600`)
- Or use Unsplash API for realistic product images
- Or commit actual images to `/public/images/products/`
- Ensure consistent aspect ratios (1:1 squares)

### 10. Logging and Feedback

Implement comprehensive logging:
- Log start of seeding process
- Log each category created
- Log product creation progress (every 10 products)
- Log completion with summary (e.g., "Seeded 100 products across 6 categories")
- Log any errors or skipped items

---

## Acceptance Criteria

- [ ] SeedData class created with seeding methods
- [ ] 6 categories created with complete metadata
- [ ] 80-100 products created with realistic data
- [ ] Products distributed appropriately across categories
- [ ] Price distribution matches specification (30% / 50% / 15% / 5%)
- [ ] Rating distribution realistic (average 4.0-4.5)
- [ ] Seeding is idempotent (can run multiple times safely)
- [ ] Automatic seeding on first startup (development)
- [ ] Manual seeding command available
- [ ] Database reset functionality implemented
- [ ] Comprehensive logging of seeding operations
- [ ] All products have valid category relationships
- [ ] Featured products and new arrivals marked correctly
- [ ] No duplicate slugs or SKUs

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `SeedDataTests`
- [ ] Test `GenerateSlug` produces valid URL-friendly slugs
- [ ] Test `GenerateRandomRating` returns values between 3.5 and 5.0
- [ ] Test `GenerateRandomPrice` returns values within specified ranges
- [ ] Test `GenerateReviewCount` returns values between 50 and 2000
- [ ] Test price distribution helper (30/50/15/5 split)

**Test Class**: `SeedingLogicTests`
- [ ] Test category seeding creates exactly 6 categories
- [ ] Test product seeding creates 80-100 products
- [ ] Test products are assigned to correct categories
- [ ] Test idempotency - running twice doesn't duplicate data
- [ ] Test database reset clears all data

### Integration Tests

**Test Class**: `DatabaseSeedingIntegrationTests`
- [ ] Test seeding on fresh database creates all data
- [ ] Test categories are created before products (foreign key)
- [ ] Test all seeded products have valid CategoryId
- [ ] Test featured products count is correct (10-15)
- [ ] Test new arrivals count is correct (20-25)
- [ ] Test no duplicate slugs exist after seeding
- [ ] Test seeded data can be queried successfully

**Test Class**: `SeedingPerformanceTests`
- [ ] Test seeding completes within reasonable time (< 30 seconds)
- [ ] Test database reset completes successfully
- [ ] Test memory usage during seeding is acceptable

### Manual Testing Checklist
- [ ] Run application on fresh database and verify auto-seeding
- [ ] Verify 6 categories exist in database
- [ ] Verify 80-100 products exist in database
- [ ] Query products by category and verify distribution
- [ ] Check price distribution across products
- [ ] Verify all products have images (URLs or placeholders)
- [ ] Run seeding twice and verify no duplicates created
- [ ] Test manual seeding command: `dotnet run --seed-data`
- [ ] Test database reset: `dotnet run --reset-database --seed-data`

---

## Implementation Notes

### Seeding Strategy Selection

**Recommended: Program.cs Approach**
```csharp
// In Program.cs after app.Build()
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ShopDbContext>();
    
    // Apply migrations
    context.Database.Migrate();
    
    // Seed data
    SeedData.Initialize(context);
}
```

**Alternative: EF Core ModelBuilder Seeding**
Use `HasData()` in `OnModelCreating` - simpler but less flexible

### Data Generation Tips
- Use Lorem Ipsum generators for product descriptions
- Create brand names that sound realistic (TechPro, StyleCraft, HomeEssence)
- Vary product names with adjectives (Premium, Classic, Modern, Eco-Friendly)
- Use consistent pricing patterns ($X.99, $X9.99)

### Performance Optimization
- Use `AddRange()` for bulk inserts instead of individual `Add()`
- Consider disabling change tracking during seeding
- Use transactions for atomic seeding (all or nothing)

### Demo Preparation
- Create a "demo-ready" seeding preset with specific products
- Include products that demonstrate all features (filters, search, etc.)
- Ensure product variety for visual appeal
- Consider creating "story products" for demo narratives

---

## Definition of Done

- [ ] SeedData class fully implemented with all helper methods
- [ ] All 6 categories seeded with complete data
- [ ] 80-100 products seeded with realistic, varied data
- [ ] Idempotent seeding verified (no duplicates on re-run)
- [ ] Automatic seeding on first startup working
- [ ] Manual seeding command tested and working
- [ ] Database reset functionality tested
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests written and passing
- [ ] Manual testing completed successfully
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] Seeding documentation added to README
- [ ] PR created and approved

---

## Related Documents

- [FRD-003: Data Seeding System](../features/data-seeding-system.md)
- [PRD: Section 5.2 Data Flow](../prd.md#52-data-flow)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
