using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ShopAssistant.Api.Controllers;
using ShopAssistant.Api.Data;
using ShopAssistant.Api.DTOs;
using ShopAssistant.Api.Models;

namespace ShopAssistant.Api.Tests;

public class ProductsControllerTests : IDisposable
{
    private readonly ShopDbContext _context;
    private readonly ProductsController _controller;
    private readonly Mock<ILogger<ProductsController>> _mockLogger;

    public ProductsControllerTests()
    {
        // Setup in-memory database
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ShopDbContext(options);
        _mockLogger = new Mock<ILogger<ProductsController>>();
        _controller = new ProductsController(_context, _mockLogger.Object);

        // Seed test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        var categories = new List<Category>
        {
            new() { CategoryId = 1, Name = "Electronics", Slug = "electronics", Description = "Electronic devices" },
            new() { CategoryId = 2, Name = "Clothing", Slug = "clothing", Description = "Apparel items" }
        };

        var products = new List<Product>
        {
            new()
            {
                ProductId = 1,
                Name = "Premium Wireless Headphones",
                Slug = "premium-wireless-headphones",
                Brand = "AudioTech",
                CategoryId = 1,
                Price = 299.99m,
                OriginalPrice = 399.99m,
                ShortDescription = "High-quality wireless headphones",
                Description = "Premium wireless headphones with noise cancellation",
                ImageUrl = "https://example.com/headphones.jpg",
                Rating = 4.5m,
                ReviewCount = 120,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new()
            {
                ProductId = 2,
                Name = "Smart Watch Pro",
                Slug = "smart-watch-pro",
                Brand = "TechWear",
                CategoryId = 1,
                Price = 399.99m,
                OriginalPrice = 499.99m,
                ShortDescription = "Advanced smartwatch",
                Description = "Feature-rich smartwatch with health tracking",
                ImageUrl = "https://example.com/watch.jpg",
                Rating = 4.7m,
                ReviewCount = 85,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                ProductId = 3,
                Name = "Cotton T-Shirt",
                Slug = "cotton-tshirt",
                Brand = "ComfyWear",
                CategoryId = 2,
                Price = 29.99m,
                OriginalPrice = null,
                ShortDescription = "Comfortable cotton t-shirt",
                Description = "100% cotton t-shirt in various colors",
                ImageUrl = "https://example.com/tshirt.jpg",
                Rating = 4.2m,
                ReviewCount = 45,
                InStock = false,
                IsFeatured = false,
                IsNewArrival = false,
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            }
        };

        _context.Categories.AddRange(categories);
        _context.Products.AddRange(products);
        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    #region GetProducts Tests

    [Fact]
    public async Task GetProducts_ReturnsOkResult_WithPaginatedProducts()
    {
        // Act
        var result = await _controller.GetProducts(new ProductQueryParameters());

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(3, response.TotalItems);
        Assert.Equal(3, response.Items.Count);
    }

    [Fact]
    public async Task GetProducts_FiltersByCategoryId()
    {
        // Arrange
        var parameters = new ProductQueryParameters { CategoryId = 1 };

        // Act
        var result = await _controller.GetProducts(parameters);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(2, response.TotalItems);
        Assert.All(response.Items, item => Assert.Equal(1, item.Category.CategoryId));
    }

    [Fact]
    public async Task GetProducts_FiltersByMinPrice()
    {
        // Arrange
        var parameters = new ProductQueryParameters { MinPrice = 100m };

        // Act
        var result = await _controller.GetProducts(parameters);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(2, response.TotalItems);
        Assert.All(response.Items, item => Assert.True(item.Price >= 100m));
    }

    [Fact]
    public async Task GetProducts_FiltersByInStock()
    {
        // Arrange
        var parameters = new ProductQueryParameters { InStock = true };

        // Act
        var result = await _controller.GetProducts(parameters);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(2, response.TotalItems);
        Assert.All(response.Items, item => Assert.True(item.InStock));
    }

    [Fact]
    public async Task GetProducts_SortsByPriceAscending()
    {
        // Arrange
        var parameters = new ProductQueryParameters { SortBy = "price", SortOrder = "asc" };

        // Act
        var result = await _controller.GetProducts(parameters);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(29.99m, response.Items[0].Price);
        Assert.Equal(299.99m, response.Items[1].Price);
        Assert.Equal(399.99m, response.Items[2].Price);
    }

    [Fact]
    public async Task GetProducts_PaginatesCorrectly()
    {
        // Arrange
        var parameters = new ProductQueryParameters { Page = 1, PageSize = 2 };

        // Act
        var result = await _controller.GetProducts(parameters);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Equal(3, response.TotalItems);
        Assert.Equal(2, response.Items.Count);
        Assert.Equal(2, response.TotalPages);
        Assert.True(response.HasNextPage);
        Assert.False(response.HasPreviousPage);
    }

    #endregion

    #region GetProduct Tests

    [Fact]
    public async Task GetProduct_ValidId_ReturnsProduct()
    {
        // Act
        var result = await _controller.GetProduct(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var product = Assert.IsType<ProductDetailDto>(okResult.Value);
        Assert.Equal(1, product.ProductId);
        Assert.Equal("Premium Wireless Headphones", product.Name);
        Assert.NotNull(product.Description);
    }

    [Fact]
    public async Task GetProduct_InvalidId_ReturnsNotFound()
    {
        // Act
        var result = await _controller.GetProduct(999);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Contains("999", notFoundResult.Value?.ToString());
    }

    #endregion

    #region GetProductBySlug Tests

    [Fact]
    public async Task GetProductBySlug_ValidSlug_ReturnsProduct()
    {
        // Act
        var result = await _controller.GetProductBySlug("premium-wireless-headphones");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var product = Assert.IsType<ProductDetailDto>(okResult.Value);
        Assert.Equal("premium-wireless-headphones", product.Slug);
    }

    [Fact]
    public async Task GetProductBySlug_InvalidSlug_ReturnsNotFound()
    {
        // Act
        var result = await _controller.GetProductBySlug("nonexistent-product");

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Contains("nonexistent-product", notFoundResult.Value?.ToString());
    }

    #endregion

    #region SearchProducts Tests

    [Fact]
    public async Task SearchProducts_ValidQuery_ReturnsMatchingProducts()
    {
        // Act
        var result = await _controller.SearchProducts("wireless");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Single(response.Items);
        Assert.Contains("wireless", response.Items[0].Name.ToLower());
    }

    [Fact]
    public async Task SearchProducts_EmptyQuery_ReturnsBadRequest()
    {
        // Act
        var result = await _controller.SearchProducts("");

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    #endregion

    #region GetFeaturedProducts Tests

    [Fact]
    public async Task GetFeaturedProducts_ReturnsOnlyFeaturedProducts()
    {
        // Act
        var result = await _controller.GetFeaturedProducts();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Single(response.Items);
        Assert.True(response.Items[0].IsFeatured);
    }

    #endregion

    #region GetNewArrivals Tests

    [Fact]
    public async Task GetNewArrivals_ReturnsOnlyNewArrivalProducts()
    {
        // Act
        var result = await _controller.GetNewArrivals();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PaginatedResponse<ProductDto>>(okResult.Value);
        Assert.Single(response.Items);
        Assert.True(response.Items[0].IsNewArrival);
    }

    #endregion
}
