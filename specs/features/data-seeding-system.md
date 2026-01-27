# Feature: Data Seeding System

**Feature ID**: FRD-003  
**Version**: 1.0  
**Status**: Not Started  
**Owner**: Backend Team  
**Created**: January 27, 2026  
**Last Updated**: January 27, 2026

---

## 1. Feature Overview

### 1.1 Description
Create an automated data seeding system to populate the database with realistic demo data including 50-100 products across 6 categories. The seeding should be repeatable, idempotent, and run automatically on first database initialization.

### 1.2 Business Context
Demo and development environments need realistic product data to showcase the e-commerce functionality. Manual data entry is time-consuming and error-prone. An automated seeding system ensures consistent, high-quality demo data for presentations and testing.

### 1.3 Goals
- Populate database with 50-100 realistic products
- Create 6 product categories with appropriate distribution
- Provide varied price points, ratings, and product types
- Enable quick demo environment setup
- Support database reset for clean demonstrations

### 1.4 Related PRD Sections
- Section 3.7.2: Data Seeding
- Section 5.2.1: Mocked Data Structure
- Section 5.5.4: Mock Data Generation Strategy

---

## 2. User Stories

```gherkin
As a developer,
I want the database to seed automatically on first run,
So that I don't have to manually enter product data.

As a presenter,
I want to reset the database to demo state with one command,
So that I can run clean demonstrations repeatedly.

As a developer,
I want realistic product data,
So that the application looks professional during demos.

As a new team member,
I want sample data available immediately after setup,
So that I can start developing features without creating test data.

As a QA tester,
I want consistent seed data,
So that I can write predictable tests against known data.
```

---

## 3. Functional Requirements

### 3.1 Seed Data Content

**[REQ-003.1] Categories**
Create 6 categories:
- Electronics (20 products)
- Fashion (15 products)
- Home & Garden (15 products)
- Beauty & Personal Care (15 products)
- Sports & Outdoors (15 products)
- Books & Media (10 products)

Each category includes:
- Name, description, slug
- Category image URL
- Appropriate products

**[REQ-003.2] Products**
50-100 products total with:
- Realistic product names and descriptions
- Varied price range: $9.99 - $999.99
- Ratings: 3.5 - 5.0 stars
- Review counts: 50 - 2000
- Mix of in-stock and out-of-stock items (90% in stock)
- 10-15 featured products
- 10-15 new arrivals
- Unique SKUs and slugs
- Product images (URLs or paths)
- Varied brands (10-15 different brands)

**[REQ-003.3] Price Distribution**
- Budget (< $50): 30% of products
- Mid-range ($50-$200): 50% of products
- Premium ($200-$500): 15% of products
- Luxury (> $500): 5% of products

**[REQ-003.4] Rating Distribution**
- 5 stars: 30%
- 4.5-4.9 stars: 40%
- 4.0-4.4 stars: 20%
- 3.5-3.9 stars: 10%

### 3.2 Seeding Behavior

**[REQ-003.5] Idempotent Seeding**
- Check if data already exists before seeding
- Skip seeding if products already present
- Safe to run multiple times
- No duplicate data created

**[REQ-003.6] Automatic Seeding**
- Run automatically on first application start
- Only in Development environment
- Log seeding progress to console
- Provide clear feedback when seeding completes

**[REQ-003.7] Manual Seeding**
- Support command-line flag: `dotnet run --seed`
- Support explicit method call for testing
- Option to clear existing data first

**[REQ-003.8] Database Reset**
- Command to drop all data and re-seed
- Preserve schema, only delete data
- Confirm before destructive operations

### 3.3 Data Quality

**[REQ-003.9] Realistic Content**
- Product names sound like real products
- Descriptions are detailed and professional
- Prices are realistic for product types
- Brands are genre-appropriate

**[REQ-003.10] Searchable Content**
- Products have rich descriptions for search functionality
- Include relevant keywords and tags
- Varied product names to test search algorithms

---

## 4. Technical Specifications

### 4.1 Seeding Implementation

**Approach**: Create `SeedData` static class with seeding logic

```csharp
public static class SeedData
{
    public static async Task InitializeAsync(ShopDbContext context, ILogger logger)
    {
        // Check if data already exists
        if (await context.Products.AnyAsync())
        {
            logger.LogInformation("Database already seeded. Skipping...");
            return;
        }

        logger.LogInformation("Seeding database...");

        // Seed categories
        var categories = GetCategories();
        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        // Seed products
        var products = GetProducts(categories);
        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();

        logger.LogInformation($"Database seeded with {products.Count} products across {categories.Count} categories.");
    }

    private static List<Category> GetCategories()
    {
        return new List<Category>
        {
            new Category
            {
                Name = "Electronics",
                Description = "Latest gadgets and electronic devices",
                Slug = "electronics",
                ImageUrl = "/images/categories/electronics.jpg"
            },
            // ... other categories
        };
    }

    private static List<Product> GetProducts(List<Category> categories)
    {
        var electronics = categories.First(c => c.Name == "Electronics");
        
        var products = new List<Product>();
        
        // Electronics products
        products.AddRange(new[]
        {
            new Product
            {
                Name = "Premium Wireless Headphones",
                ShortDescription = "High-fidelity audio with active noise cancellation",
                Description = "Experience premium sound quality with our flagship wireless headphones...",
                Price = 299.99m,
                OriginalPrice = 399.99m,
                Category = electronics,
                Brand = "AudioTech",
                ImageUrl = "/images/products/headphones-premium.jpg",
                Rating = 4.7m,
                ReviewCount = 1234,
                InStock = true,
                Sku = "ELEC-HP-001",
                Slug = "premium-wireless-headphones",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                IsFeatured = true,
                IsNewArrival = false
            },
            // ... more products
        });

        return products;
    }
}
```

### 4.2 Integration with Startup

```csharp
// Program.cs
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ShopDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            context.Database.Migrate(); // Apply migrations
            await SeedData.InitializeAsync(context, logger); // Seed data
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}
```

### 4.3 Sample Product Data Structure

```csharp
// Example: Electronics category products
var electronicsProducts = new[]
{
    // Premium tier
    new { Name = "Premium Wireless Headphones", Price = 299.99m, Brand = "AudioTech" },
    new { Name = "4K Ultra HD Smart TV 65\"", Price = 899.99m, Brand = "ViewMax" },
    new { Name = "Professional DSLR Camera", Price = 1299.99m, Brand = "PhotoPro" },
    
    // Mid-range
    new { Name = "Wireless Bluetooth Speaker", Price = 89.99m, Brand = "SoundWave" },
    new { Name = "Smartwatch Fitness Tracker", Price = 249.99m, Brand = "FitTech" },
    new { Name = "Wireless Gaming Mouse", Price = 79.99m, Brand = "GameGear" },
    
    // Budget
    new { Name = "USB-C Fast Charger", Price = 24.99m, Brand = "PowerPlus" },
    new { Name = "Portable Phone Stand", Price = 12.99m, Brand = "GadgetPro" },
    // ... more products
};
```

### 4.4 Image Handling

**Option 1**: External URLs (Unsplash, Pexels)
```csharp
ImageUrl = "https://images.unsplash.com/photo-1234567890?w=800"
```

**Option 2**: Local placeholder paths
```csharp
ImageUrl = "/images/products/electronics/headphones-01.jpg"
```

**Option 3**: Data URI (small placeholder)
```csharp
ImageUrl = "data:image/svg+xml;base64,..." // Simple SVG placeholder
```

**Recommendation**: Option 2 with SVG placeholders or Option 1 with Unsplash

### 4.5 Reset Database Script

```csharp
public static class DatabaseReset
{
    public static async Task ResetAsync(ShopDbContext context, ILogger logger)
    {
        logger.LogWarning("Resetting database...");
        
        // Delete all data
        context.OrderItems.RemoveRange(context.OrderItems);
        context.Orders.RemoveRange(context.Orders);
        context.CartItems.RemoveRange(context.CartItems);
        context.Products.RemoveRange(context.Products);
        context.Categories.RemoveRange(context.Categories);
        
        await context.SaveChangesAsync();
        
        // Re-seed
        await SeedData.InitializeAsync(context, logger);
        
        logger.LogInformation("Database reset complete.");
    }
}
```

---

## 5. Dependencies

### 5.1 Prerequisites
- **FRD-002**: Database Schema (tables must exist)
- Database connection working
- EF Core migrations applied

### 5.2 Blocks
- **FRD-004**: Products API (needs product data to return)
- **FRD-005**: Categories API (needs category data)
- **FRD-008**: Frontend Integration (needs data to display)

### 5.3 Optional Dependencies
- Product images (can use placeholders)
- Brand list (can generate programmatically)

---

## 6. Acceptance Criteria

### 6.1 Must Have
- [ ] Database seeds automatically on first run (Development)
- [ ] 50+ products created across 6 categories
- [ ] All categories have at least 10 products each
- [ ] Products have varied prices ($10 - $1000 range)
- [ ] Products have ratings between 3.5 and 5.0
- [ ] At least 10 featured products
- [ ] At least 10 new arrival products
- [ ] All products have unique SKUs and slugs
- [ ] Seeding is idempotent (safe to run multiple times)
- [ ] Seeding logs progress to console
- [ ] Can reset database with command/script

### 6.2 Should Have
- [ ] Products have realistic names and descriptions
- [ ] Brands are varied and appropriate for categories
- [ ] Price distribution follows 30/50/15/5 split
- [ ] 90% of products are in stock
- [ ] Product images are set (even if placeholders)
- [ ] Seeding completes in under 10 seconds

### 6.3 Nice to Have
- [ ] Option to seed more or fewer products via configuration
- [ ] Different seed data sets (minimal, full, large)
- [ ] Seed data includes order history examples
- [ ] Random variation in seed data on each reset

---

## 7. Out of Scope

### 7.1 Explicitly Excluded
- ❌ Real product images (use URLs or placeholders)
- ❌ Product reviews/ratings detail (just aggregate scores)
- ❌ Product variants (colors, sizes)
- ❌ Product specifications (can add later)
- ❌ Multiple languages
- ❌ Historical order data
- ❌ User accounts data
- ❌ Cart data (localStorage or API)
- ❌ Inventory management
- ❌ Price history

---

## 8. Testing Strategy

### 8.1 Manual Testing
```bash
# Test automatic seeding
1. Drop database: dotnet ef database drop --force
2. Start application: dotnet run
3. Verify console shows "Seeding database..."
4. Check database has products

# Test idempotent seeding
1. Start application again
2. Verify console shows "Database already seeded. Skipping..."
3. Check no duplicate products created

# Test database reset
1. Run reset script/command
2. Verify all data removed
3. Verify data re-seeded
4. Check product count matches expectation
```

### 8.2 Integration Testing
```csharp
[Fact]
public async Task SeedData_CreatesCategories()
{
    var categories = await _context.Categories.ToListAsync();
    Assert.Equal(6, categories.Count);
}

[Fact]
public async Task SeedData_CreatesProducts()
{
    var products = await _context.Products.ToListAsync();
    Assert.True(products.Count >= 50);
}

[Fact]
public async Task SeedData_IsIdempotent()
{
    var firstCount = await _context.Products.CountAsync();
    await SeedData.InitializeAsync(_context, _logger);
    var secondCount = await _context.Products.CountAsync();
    Assert.Equal(firstCount, secondCount);
}
```

### 8.3 Data Quality Checks
```sql
-- Check product count by category
SELECT c.Name, COUNT(p.ProductId) as ProductCount
FROM Categories c
LEFT JOIN Products p ON c.CategoryId = p.CategoryId
GROUP BY c.Name

-- Check price distribution
SELECT 
    CASE 
        WHEN Price < 50 THEN 'Budget'
        WHEN Price < 200 THEN 'Mid-range'
        WHEN Price < 500 THEN 'Premium'
        ELSE 'Luxury'
    END as PriceRange,
    COUNT(*) as ProductCount
FROM Products
GROUP BY CASE 
    WHEN Price < 50 THEN 'Budget'
    WHEN Price < 200 THEN 'Mid-range'
    WHEN Price < 500 THEN 'Premium'
    ELSE 'Luxury'
END

-- Check featured/new products
SELECT 
    COUNT(CASE WHEN IsFeatured = 1 THEN 1 END) as FeaturedCount,
    COUNT(CASE WHEN IsNewArrival = 1 THEN 1 END) as NewArrivalCount,
    COUNT(*) as TotalProducts
FROM Products
```

---

## 9. Success Metrics

### 9.1 Technical Metrics
- **Seeding time**: < 10 seconds for 50-100 products
- **Data quality**: 100% of products have all required fields
- **Idempotency**: Zero duplicate products on repeated runs
- **Distribution accuracy**: Price/rating distribution within 5% of target

### 9.2 Developer Experience
- **Setup effort**: Zero manual data entry required
- **Reset time**: < 30 seconds to reset database
- **Demo readiness**: Immediate after first run

### 9.3 Data Coverage
- **Product count**: 50-100 products
- **Category coverage**: All 6 categories populated
- **Feature flags**: 15-25% featured/new products

---

## 10. Implementation Notes

### 10.1 Implementation Order
1. Create `SeedData.cs` in `Data/` folder
2. Implement `GetCategories()` method (hardcode 6 categories)
3. Implement `GetProducts()` method (create 50-100 product definitions)
4. Add idempotency check (check if data exists)
5. Integrate with `Program.cs` startup
6. Test seeding on fresh database
7. Add reset functionality
8. Document seeding process in README
9. Add console logging for visibility

### 10.2 Development Tips
- Start with 10-20 products, expand to 50-100
- Use consistent naming patterns for easy identification
- Generate SKUs programmatically (`CAT-BRAND-###`)
- Use descriptive product names that include key features
- Vary review counts and ratings for realism
- Mark 10-15% as featured, 10-15% as new arrivals
- Use DateTime.UtcNow.AddDays(-X) to vary creation dates

### 10.3 Data Generation Strategy
- **Manual**: Hardcode 20-30 key products
- **Programmatic**: Generate variations of base products
- **Hybrid**: Define base products, generate variants

**Recommended**: Hybrid approach
- Define 10-15 "hero" products per category manually
- Generate price/rating/brand variants programmatically
- Ensures quality while maintaining variety

---

## 11. Documentation Requirements

### 11.1 README Updates
- Explain automatic seeding on first run
- Document reset database command
- Show how to verify seed data
- Explain how to customize seed data

### 11.2 Code Comments
- Document seeding logic
- Explain idempotency check
- Comment data distribution rationale

### 11.3 Seed Data Documentation
- List all categories
- Describe product distribution
- Explain pricing strategy
- Document featured/new arrival logic

---

## 12. Review Checklist

Before marking this feature complete:
- [ ] Code review completed
- [ ] Seeding runs automatically on first start
- [ ] 50+ products created
- [ ] All 6 categories populated
- [ ] Products have realistic data
- [ ] Idempotency tested and working
- [ ] Reset functionality works
- [ ] Console logging provides clear feedback
- [ ] No duplicate SKUs or slugs
- [ ] Price and rating distributions look reasonable
- [ ] README documents seeding process
- [ ] Can demo immediately after setup
- [ ] All acceptance criteria met

---

**Status**: Ready for Implementation  
**Priority**: P0 (Required for API testing)  
**Estimated Effort**: 4-6 hours  
**Dependencies**: FRD-002 (Database Schema)
