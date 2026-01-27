using Microsoft.EntityFrameworkCore;
using ShopAssistant.Api.Models;

namespace ShopAssistant.Api.Data;

/// <summary>
/// Database context for Shop Assistant application
/// </summary>
public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }

    // DbSet properties
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        ConfigureProduct(modelBuilder);
        ConfigureCategory(modelBuilder);
        ConfigureOrder(modelBuilder);
        ConfigureOrderItem(modelBuilder);
        ConfigureCartItem(modelBuilder);
    }

    private void ConfigureProduct(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId);
            
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(e => e.Slug)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(e => e.Price)
                .HasPrecision(18, 2)
                .IsRequired();
            
            entity.Property(e => e.OriginalPrice)
                .HasPrecision(18, 2);
            
            entity.Property(e => e.Rating)
                .HasPrecision(3, 2)
                .HasDefaultValue(0);
            
            entity.Property(e => e.ReviewCount)
                .HasDefaultValue(0);
            
            entity.Property(e => e.InStock)
                .HasDefaultValue(true);
            
            entity.Property(e => e.IsFeatured)
                .HasDefaultValue(false);
            
            entity.Property(e => e.IsNewArrival)
                .HasDefaultValue(false);
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
            
            // Indexes
            entity.HasIndex(e => e.Slug)
                .IsUnique()
                .HasDatabaseName("IX_Products_Slug");
            
            entity.HasIndex(e => e.CategoryId)
                .HasDatabaseName("IX_Products_CategoryId");
            
            entity.HasIndex(e => e.Price)
                .HasDatabaseName("IX_Products_Price");
            
            entity.HasIndex(e => e.Rating)
                .HasDatabaseName("IX_Products_Rating");
            
            entity.HasIndex(e => e.IsFeatured)
                .HasDatabaseName("IX_Products_IsFeatured");
            
            // Relationships
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Products_Categories");
        });
    }

    private void ConfigureCategory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId);
            
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.Slug)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
            
            // Indexes
            entity.HasIndex(e => e.Name)
                .IsUnique()
                .HasDatabaseName("IX_Categories_Name");
            
            entity.HasIndex(e => e.Slug)
                .IsUnique()
                .HasDatabaseName("IX_Categories_Slug");
        });
    }

    private void ConfigureOrder(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            
            entity.Property(e => e.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(e => e.TotalAmount)
                .HasPrecision(18, 2)
                .IsRequired();
            
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            
            entity.Property(e => e.ShippingAddress)
                .IsRequired();
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
            
            // Indexes
            entity.HasIndex(e => e.OrderNumber)
                .IsUnique()
                .HasDatabaseName("IX_Orders_OrderNumber");
        });
    }

    private void ConfigureOrderItem(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId);
            
            entity.Property(e => e.ProductName)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(e => e.UnitPrice)
                .HasPrecision(18, 2)
                .IsRequired();
            
            entity.Property(e => e.Quantity)
                .IsRequired();
            
            // Relationships
            entity.HasOne(e => e.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_OrderItems_Orders");
            
            entity.HasOne(e => e.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_OrderItems_Products");
        });
    }

    private void ConfigureCartItem(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartItemId);
            
            entity.Property(e => e.SessionId)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.Quantity)
                .IsRequired();
            
            entity.Property(e => e.AddedAt)
                .HasDefaultValueSql("GETUTCDATE()");
            
            // Indexes
            entity.HasIndex(e => e.SessionId)
                .HasDatabaseName("IX_CartItems_SessionId");
            
            // Relationships
            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_CartItems_Products");
        });
    }
}
