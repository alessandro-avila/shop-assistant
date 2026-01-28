using Microsoft.EntityFrameworkCore;
using ShopAssistant.Api.Models;

namespace ShopAssistant.Api.Data;

/// <summary>
/// Provides seed data for populating the database with demo products and categories
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Initializes the database with seed data if it doesn't already exist
    /// </summary>
    public static async Task InitializeAsync(ShopDbContext context, ILogger logger)
    {
        try
        {
            // Check if data already exists
            if (await context.Products.AnyAsync())
            {
                logger.LogInformation("Database already contains data. Skipping seed.");
                return;
            }

            logger.LogInformation("Seeding database...");

            // Seed categories first (required for foreign keys)
            var categories = GetCategories();
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} categories", categories.Count);

            // Seed products
            var products = GetProducts(categories);
            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} products", products.Count);

            logger.LogInformation("Database seeding completed successfully!");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    /// <summary>
    /// Resets the database by clearing all data and re-seeding
    /// </summary>
    public static async Task ResetDatabaseAsync(ShopDbContext context, ILogger logger)
    {
        logger.LogWarning("Resetting database - all data will be deleted!");

        // Delete in correct order to respect foreign keys
        context.OrderItems.RemoveRange(context.OrderItems);
        context.Orders.RemoveRange(context.Orders);
        context.CartItems.RemoveRange(context.CartItems);
        context.Products.RemoveRange(context.Products);
        context.Categories.RemoveRange(context.Categories);

        await context.SaveChangesAsync();
        logger.LogInformation("All data deleted");

        // Re-seed
        await InitializeAsync(context, logger);
    }

    private static List<Category> GetCategories()
    {
        return new List<Category>
        {
            new Category
            {
                Name = "Electronics",
                Slug = "electronics",
                Description = "Cutting-edge gadgets and electronic devices for tech enthusiasts",
                ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
            },
            new Category
            {
                Name = "Fashion",
                Slug = "fashion",
                Description = "Trendy clothing, accessories, and footwear for every style",
                ImageUrl = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
            },
            new Category
            {
                Name = "Home & Garden",
                Slug = "home-garden",
                Description = "Beautiful furniture, decor, and outdoor essentials for your space",
                ImageUrl = "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80"
            },
            new Category
            {
                Name = "Beauty",
                Slug = "beauty",
                Description = "Premium skincare, makeup, and personal care products",
                ImageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"
            },
            new Category
            {
                Name = "Sports & Outdoors",
                Slug = "sports-outdoors",
                Description = "Fitness equipment and gear for active lifestyles",
                ImageUrl = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
            },
            new Category
            {
                Name = "Books & Media",
                Slug = "books-media",
                Description = "Bestselling books, magazines, and entertainment media",
                ImageUrl = "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80"
            }
        };
    }

    private static List<Product> GetProducts(List<Category> categories)
    {
        var electronics = categories.First(c => c.Slug == "electronics");
        var fashion = categories.First(c => c.Slug == "fashion");
        var homeGarden = categories.First(c => c.Slug == "home-garden");
        var beauty = categories.First(c => c.Slug == "beauty");
        var sports = categories.First(c => c.Slug == "sports-outdoors");
        var books = categories.First(c => c.Slug == "books-media");

        var products = new List<Product>();

        // Electronics (25 products)
        products.AddRange(GetElectronicsProducts(electronics));

        // Fashion (20 products)
        products.AddRange(GetFashionProducts(fashion));

        // Home & Garden (18 products)
        products.AddRange(GetHomeGardenProducts(homeGarden));

        // Beauty (15 products)
        products.AddRange(GetBeautyProducts(beauty));

        // Sports & Outdoors (12 products)
        products.AddRange(GetSportsProducts(sports));

        // Books & Media (10 products)
        products.AddRange(GetBooksProducts(books));

        return products;
    }

    private static List<Product> GetElectronicsProducts(Category category)
    {
        return new List<Product>
        {
            new Product
            {
                Name = "Premium Wireless Headphones",
                Slug = "premium-wireless-headphones",
                ShortDescription = "High-fidelity audio with active noise cancellation",
                Description = "Experience premium sound quality with our flagship wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and exceptional comfort for all-day wear. Premium leather ear cups and intuitive touch controls make these headphones the perfect companion for music lovers.",
                Price = 299.99m,
                OriginalPrice = 399.99m,
                Category = category,
                Brand = "AudioTech",
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 1247,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "4K Ultra HD Smart TV 65\"",
                Slug = "4k-ultra-hd-smart-tv-65",
                ShortDescription = "Stunning picture quality with HDR and smart features",
                Description = "Transform your living room with this stunning 65-inch 4K Ultra HD Smart TV. Features HDR10+ for incredible contrast, built-in streaming apps, and voice control. Quantum dot technology delivers over a billion colors for the most lifelike picture quality.",
                Price = 899.99m,
                OriginalPrice = 1299.99m,
                Category = category,
                Brand = "ViewMax",
                ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 856,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Professional DSLR Camera",
                Slug = "professional-dslr-camera",
                ShortDescription = "24.2MP full-frame sensor for stunning photography",
                Description = "Capture life's moments in extraordinary detail with this professional-grade DSLR camera. Features a 24.2-megapixel full-frame sensor, 4K video recording, and advanced autofocus system. Perfect for both photography enthusiasts and professional photographers.",
                Price = 1299.99m,
                Category = category,
                Brand = "PhotoPro",
                ImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
                Rating = 4.9m,
                ReviewCount = 523,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Wireless Bluetooth Speaker",
                Slug = "wireless-bluetooth-speaker",
                ShortDescription = "Portable speaker with 360° sound",
                Description = "Take your music anywhere with this portable wireless speaker. Features 360-degree sound, 12-hour battery life, and waterproof design. Perfect for parties, beach trips, and outdoor adventures.",
                Price = 89.99m,
                OriginalPrice = 129.99m,
                Category = category,
                Brand = "SoundWave",
                ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 1834,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Smartwatch Fitness Tracker",
                Slug = "smartwatch-fitness-tracker",
                ShortDescription = "Advanced health monitoring and notifications",
                Description = "Stay connected and healthy with this advanced smartwatch. Track your heart rate, sleep patterns, and daily activity. Receive notifications, control music, and make contactless payments right from your wrist.",
                Price = 249.99m,
                Category = category,
                Brand = "FitTech",
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 967,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Wireless Gaming Mouse",
                Slug = "wireless-gaming-mouse",
                ShortDescription = "Precision gaming with 16000 DPI sensor",
                Description = "Dominate the competition with this high-performance wireless gaming mouse. Features a 16000 DPI sensor, customizable RGB lighting, and programmable buttons. Zero-lag wireless technology ensures you never miss a shot.",
                Price = 79.99m,
                Category = category,
                Brand = "GameGear",
                ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 654,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "USB-C Fast Charger 65W",
                Slug = "usb-c-fast-charger-65w",
                ShortDescription = "Universal fast charging for all your devices",
                Description = "Charge all your devices quickly with this powerful 65W USB-C charger. Compatible with laptops, tablets, and smartphones. Compact design perfect for travel with multiple safety protections.",
                Price = 34.99m,
                Category = category,
                Brand = "PowerPlus",
                ImageUrl = "https://images.unsplash.com/photo-1591290619762-c588dcb8d7c6?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 2341,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Mechanical Gaming Keyboard",
                Slug = "mechanical-gaming-keyboard",
                ShortDescription = "RGB backlit with tactile switches",
                Description = "Elevate your gaming experience with this premium mechanical keyboard. Features tactile switches for precise keystrokes, customizable RGB lighting, and dedicated media controls. Built to last with an aluminum frame.",
                Price = 129.99m,
                Category = category,
                Brand = "GameGear",
                ImageUrl = "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 445,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Portable External SSD 1TB",
                Slug = "portable-external-ssd-1tb",
                ShortDescription = "Lightning-fast storage on the go",
                Description = "Store and transfer your files at blazing speeds with this portable SSD. Up to 1050MB/s read speeds, shock-resistant design, and compact form factor. Perfect for photographers, videographers, and professionals.",
                Price = 149.99m,
                Category = category,
                Brand = "DataVault",
                ImageUrl = "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 734,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Wireless Earbuds Pro",
                Slug = "wireless-earbuds-pro",
                ShortDescription = "Premium sound with active noise cancellation",
                Description = "Experience studio-quality sound with these premium wireless earbuds. Active noise cancellation, transparency mode, and up to 24 hours of battery life with the charging case. IPX4 water resistance for workouts.",
                Price = 179.99m,
                OriginalPrice = 229.99m,
                Category = category,
                Brand = "AudioTech",
                ImageUrl = "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 1567,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Laptop Stand Aluminum",
                Slug = "laptop-stand-aluminum",
                ShortDescription = "Ergonomic design for better posture",
                Description = "Improve your workspace ergonomics with this sleek aluminum laptop stand. Adjustable height and angle, ventilated design for cooling, and non-slip base. Compatible with all laptop sizes 10-17 inches.",
                Price = 39.99m,
                Category = category,
                Brand = "DeskPro",
                ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 892,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Webcam HD 1080p",
                Slug = "webcam-hd-1080p",
                ShortDescription = "Crystal-clear video for calls and streaming",
                Description = "Look your best on video calls with this HD 1080p webcam. Features autofocus, automatic light correction, and built-in noise-cancelling microphone. Perfect for remote work, streaming, and content creation.",
                Price = 69.99m,
                Category = category,
                Brand = "WebView",
                ImageUrl = "https://images.unsplash.com/photo-1589739900243-c2c8f1f5b9c5?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 1243,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Smart Home Hub",
                Slug = "smart-home-hub",
                ShortDescription = "Control all your smart devices from one place",
                Description = "Centralize your smart home with this intelligent hub. Compatible with all major smart home brands, voice control with Alexa and Google Assistant, and easy setup. Control lights, thermostats, cameras, and more.",
                Price = 99.99m,
                Category = category,
                Brand = "SmartLife",
                ImageUrl = "https://images.unsplash.com/photo-1558089687-e2e42c1deeb1?w=800&q=80",
                Rating = 4.3m,
                ReviewCount = 567,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Tablet 10.5 inch",
                Slug = "tablet-10-5-inch",
                ShortDescription = "Powerful performance in a portable design",
                Description = "Work and play anywhere with this versatile tablet. 10.5-inch Retina display, powerful processor, and all-day battery life. Perfect for reading, browsing, streaming, and light productivity tasks.",
                Price = 449.99m,
                Category = category,
                Brand = "TabletPro",
                ImageUrl = "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 789,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Ring Light with Tripod",
                Slug = "ring-light-with-tripod",
                ShortDescription = "Professional lighting for content creators",
                Description = "Create professional-quality content with this adjustable ring light. Three color temperatures, dimmable brightness, and includes a sturdy tripod with phone holder. Perfect for makeup tutorials, photography, and video calls.",
                Price = 54.99m,
                Category = category,
                Brand = "StudioPro",
                ImageUrl = "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 1456,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Portable Power Bank 20000mAh",
                Slug = "portable-power-bank-20000mah",
                ShortDescription = "Never run out of battery on the go",
                Description = "Keep all your devices charged with this high-capacity power bank. 20000mAh capacity charges most phones 4-5 times, dual USB ports for charging multiple devices, and LED display shows remaining power.",
                Price = 44.99m,
                Category = category,
                Brand = "PowerPlus",
                ImageUrl = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 2134,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Monitor 27-inch 4K",
                Slug = "monitor-27-inch-4k",
                ShortDescription = "Ultra-sharp display for productivity and gaming",
                Description = "Upgrade your workspace with this stunning 27-inch 4K monitor. IPS panel for accurate colors, 60Hz refresh rate, and multiple ports including HDMI and DisplayPort. Perfect for creative work and entertainment.",
                Price = 379.99m,
                Category = category,
                Brand = "ViewMax",
                ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 423,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Smart Doorbell Camera",
                Slug = "smart-doorbell-camera",
                ShortDescription = "See who's at your door from anywhere",
                Description = "Enhance your home security with this smart doorbell camera. HD video, two-way audio, motion detection alerts, and night vision. Works with Alexa and Google Assistant for voice announcements.",
                Price = 129.99m,
                Category = category,
                Brand = "SmartLife",
                ImageUrl = "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 834,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Drone with 4K Camera",
                Slug = "drone-with-4k-camera",
                ShortDescription = "Capture stunning aerial footage",
                Description = "Take your photography to new heights with this feature-packed drone. 4K camera with 3-axis gimbal, 30-minute flight time, GPS return-to-home, and intelligent flight modes. Easy to fly for beginners, powerful enough for pros.",
                Price = 599.99m,
                Category = category,
                Brand = "SkyView",
                ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 312,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Noise-Cancelling Headset",
                Slug = "noise-cancelling-headset",
                ShortDescription = "Professional headset for calls and meetings",
                Description = "Stay productive with this professional noise-cancelling headset. Crystal-clear microphone, comfortable ear cushions, and all-day battery life. Perfect for remote work, customer service, and virtual meetings.",
                Price = 159.99m,
                Category = category,
                Brand = "AudioTech",
                ImageUrl = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 678,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Smart Light Bulbs 4-Pack",
                Slug = "smart-light-bulbs-4-pack",
                ShortDescription = "Color-changing WiFi-enabled bulbs",
                Description = "Transform your home lighting with these smart bulbs. 16 million colors, dimmable, schedule lighting, and voice control compatible. No hub required - connect directly to WiFi. Energy-efficient LED technology.",
                Price = 49.99m,
                Category = category,
                Brand = "SmartLife",
                ImageUrl = "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 1923,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Action Camera 4K",
                Slug = "action-camera-4k",
                ShortDescription = "Rugged camera for extreme adventures",
                Description = "Document your adventures with this rugged action camera. 4K video at 60fps, waterproof to 33ft, image stabilization, and voice control. Includes mounting accessories for any activity.",
                Price = 279.99m,
                Category = category,
                Brand = "AdventurePro",
                ImageUrl = "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 945,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "USB Hub 7-Port",
                Slug = "usb-hub-7-port",
                ShortDescription = "Expand your connectivity options",
                Description = "Add more USB ports to your laptop or desktop with this powered USB hub. 7 ports with individual power switches, fast data transfer speeds, and compact design. Includes power adapter for charging devices.",
                Price = 29.99m,
                Category = category,
                Brand = "DataVault",
                ImageUrl = "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
                Rating = 4.3m,
                ReviewCount = 1567,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Wireless Charging Pad",
                Slug = "wireless-charging-pad",
                ShortDescription = "Fast wireless charging for Qi-enabled devices",
                Description = "Charge your phone effortlessly with this sleek wireless charging pad. Fast charging up to 15W, non-slip surface, LED indicator, and foreign object detection. Compatible with all Qi-enabled devices.",
                Price = 24.99m,
                Category = category,
                Brand = "PowerPlus",
                ImageUrl = "https://images.unsplash.com/photo-1591290619762-c588dcb8d7c6?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 2789,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Digital Drawing Tablet",
                Slug = "digital-drawing-tablet",
                ShortDescription = "Professional tablet for artists and designers",
                Description = "Create digital art with this professional drawing tablet. 8192 levels of pressure sensitivity, battery-free pen, customizable express keys, and compatible with all major design software.",
                Price = 199.99m,
                Category = category,
                Brand = "ArtPro",
                ImageUrl = "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 456,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            }
        };
    }

    private static List<Product> GetFashionProducts(Category category)
    {
        return new List<Product>
        {
            new Product
            {
                Name = "Classic Denim Jacket",
                Slug = "classic-denim-jacket",
                ShortDescription = "Timeless style for any season",
                Description = "This classic denim jacket is a wardrobe essential. Made from premium cotton denim with a comfortable fit, perfect for layering. Features button closure, chest pockets, and a vintage wash finish.",
                Price = 79.99m,
                Category = category,
                Brand = "StyleCraft",
                ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 823,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Leather Crossbody Bag",
                Slug = "leather-crossbody-bag",
                ShortDescription = "Elegant and functional everyday bag",
                Description = "Elevate your style with this genuine leather crossbody bag. Perfect size for essentials, adjustable strap, multiple compartments, and timeless design that complements any outfit.",
                Price = 129.99m,
                OriginalPrice = 179.99m,
                Category = category,
                Brand = "LuxeLeather",
                ImageUrl = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 645,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Organic Cotton T-Shirt Pack",
                Slug = "organic-cotton-tshirt-pack",
                ShortDescription = "Sustainable basics in classic colors",
                Description = "Upgrade your basics with this 3-pack of organic cotton t-shirts. Soft, breathable fabric, classic fit, and available in versatile colors. Sustainably made for conscious consumers.",
                Price = 39.99m,
                Category = category,
                Brand = "EcoWear",
                ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 1234,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Running Sneakers Pro",
                Slug = "running-sneakers-pro",
                ShortDescription = "Performance footwear for serious runners",
                Description = "Achieve your running goals with these high-performance sneakers. Responsive cushioning, breathable mesh upper, and durable outsole. Designed for comfort mile after mile.",
                Price = 119.99m,
                Category = category,
                Brand = "SpeedFit",
                ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 956,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Wool Blend Sweater",
                Slug = "wool-blend-sweater",
                ShortDescription = "Cozy warmth with modern style",
                Description = "Stay warm and stylish with this premium wool blend sweater. Soft, non-itchy fabric, classic crew neck, and perfect for layering or wearing alone. Available in seasonal colors.",
                Price = 89.99m,
                Category = category,
                Brand = "CozyKnit",
                ImageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 534,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Slim Fit Chino Pants",
                Slug = "slim-fit-chino-pants",
                ShortDescription = "Versatile pants for work and weekend",
                Description = "These slim-fit chinos are a versatile wardrobe staple. Stretch cotton fabric, modern fit, and goes with everything. Perfect for the office or casual outings.",
                Price = 59.99m,
                Category = category,
                Brand = "StyleCraft",
                ImageUrl = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 789,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Aviator Sunglasses",
                Slug = "aviator-sunglasses",
                ShortDescription = "Classic eyewear with UV protection",
                Description = "Protect your eyes in style with these iconic aviator sunglasses. Polarized lenses, durable metal frame, and 100% UV protection. Timeless design that never goes out of style.",
                Price = 49.99m,
                Category = category,
                Brand = "SunStyle",
                ImageUrl = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 1456,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Silk Scarf Collection",
                Slug = "silk-scarf-collection",
                ShortDescription = "Luxurious silk scarves in vibrant patterns",
                Description = "Add elegance to any outfit with these luxurious silk scarves. 100% pure silk, vibrant colors and patterns, versatile styling options. Can be worn as a scarf, headband, or bag accessory.",
                Price = 69.99m,
                Category = category,
                Brand = "SilkLuxe",
                ImageUrl = "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 423,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Premium Leather Belt",
                Slug = "premium-leather-belt",
                ShortDescription = "Handcrafted full-grain leather belt",
                Description = "Complete your look with this premium leather belt. Handcrafted from full-grain leather, classic buckle design, and built to last for years. Available in multiple widths and colors.",
                Price = 54.99m,
                Category = category,
                Brand = "LuxeLeather",
                ImageUrl = "https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 678,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Cashmere Blend Scarf",
                Slug = "cashmere-blend-scarf",
                ShortDescription = "Soft and luxurious winter essential",
                Description = "Wrap yourself in luxury with this cashmere blend scarf. Incredibly soft, warm without bulk, and elegant drape. Classic colors that match everything in your wardrobe.",
                Price = 79.99m,
                Category = category,
                Brand = "CozyKnit",
                ImageUrl = "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 345,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "High-Waisted Jeans",
                Slug = "high-waisted-jeans",
                ShortDescription = "Flattering fit with premium denim",
                Description = "These high-waisted jeans combine style and comfort. Premium stretch denim, flattering silhouette, and classic five-pocket design. Perfect for everyday wear with endless styling possibilities.",
                Price = 89.99m,
                Category = category,
                Brand = "DenimCo",
                ImageUrl = "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 1123,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Minimalist Watch",
                Slug = "minimalist-watch",
                ShortDescription = "Elegant timepiece with clean design",
                Description = "This minimalist watch makes a sophisticated statement. Clean dial design, quality quartz movement, genuine leather strap, and water-resistant. Perfect for both formal and casual occasions.",
                Price = 149.99m,
                Category = category,
                Brand = "TimeClassic",
                ImageUrl = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 567,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Winter Puffer Jacket",
                Slug = "winter-puffer-jacket",
                ShortDescription = "Warm insulation for cold weather",
                Description = "Stay warm all winter with this premium puffer jacket. Synthetic down insulation, water-resistant shell, adjustable hood, and multiple pockets. Lightweight yet incredibly warm.",
                Price = 159.99m,
                OriginalPrice = 219.99m,
                Category = category,
                Brand = "WinterGear",
                ImageUrl = "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 734,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Canvas Backpack",
                Slug = "canvas-backpack",
                ShortDescription = "Durable and stylish everyday pack",
                Description = "Carry your essentials in style with this durable canvas backpack. Multiple compartments, padded laptop sleeve, adjustable straps, and vintage-inspired design. Perfect for work, school, or travel.",
                Price = 69.99m,
                Category = category,
                Brand = "TravelGear",
                ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 891,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Knit Beanie Hat",
                Slug = "knit-beanie-hat",
                ShortDescription = "Cozy winter hat in classic colors",
                Description = "Keep your head warm with this cozy knit beanie. Soft acrylic yarn, stretchy fit, and classic design. Available in multiple colors to match your winter wardrobe.",
                Price = 19.99m,
                Category = category,
                Brand = "CozyKnit",
                ImageUrl = "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
                Rating = 4.4m,
                ReviewCount = 1678,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Yoga Pants Premium",
                Slug = "yoga-pants-premium",
                ShortDescription = "Stretchy comfort for active lifestyles",
                Description = "Move freely in these premium yoga pants. Four-way stretch fabric, high waistband for support, moisture-wicking, and squat-proof design. Perfect for yoga, gym, or lounging.",
                Price = 54.99m,
                Category = category,
                Brand = "ActiveFit",
                ImageUrl = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 1234,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Leather Ankle Boots",
                Slug = "leather-ankle-boots",
                ShortDescription = "Versatile boots for every season",
                Description = "These leather ankle boots are a wardrobe essential. Genuine leather upper, cushioned insole, and sturdy rubber sole. Classic design pairs well with jeans, dresses, or skirts.",
                Price = 139.99m,
                Category = category,
                Brand = "LuxeLeather",
                ImageUrl = "https://images.unsplash.com/photo-1542834281-0e5abcbf5e4f?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 456,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Cotton Flannel Shirt",
                Slug = "cotton-flannel-shirt",
                ShortDescription = "Soft and comfortable plaid shirt",
                Description = "This classic flannel shirt offers timeless style and comfort. 100% cotton, soft brushed finish, button-down collar, and chest pockets. Perfect for layering or wearing alone.",
                Price = 44.99m,
                Category = category,
                Brand = "CountryStyle",
                ImageUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 923,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Designer Tote Bag",
                Slug = "designer-tote-bag",
                ShortDescription = "Spacious and stylish everyday bag",
                Description = "Carry everything you need in this spacious designer tote bag. Premium vegan leather, multiple interior pockets, reinforced handles, and elegant hardware details. Perfect for work or shopping.",
                Price = 99.99m,
                Category = category,
                Brand = "UrbanStyle",
                ImageUrl = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 678,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Performance Polo Shirt",
                Slug = "performance-polo-shirt",
                ShortDescription = "Moisture-wicking fabric for active wear",
                Description = "Stay cool and comfortable with this performance polo shirt. Moisture-wicking fabric, UV protection, and wrinkle-resistant. Perfect for golf, tennis, or casual wear.",
                Price = 49.99m,
                Category = category,
                Brand = "SportStyle",
                ImageUrl = "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 534,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            }
        };
    }

    // Continue with other categories... (truncated for brevity)
    // Would include similar implementations for:
    // - GetHomeGardenProducts
    // - GetBeautyProducts
    // - GetSportsProducts
    // - GetBooksProducts
    
    private static List<Product> GetHomeGardenProducts(Category category)
    {
        return new List<Product>
        {
            new Product
            {
                Name = "Ergonomic Office Chair",
                Slug = "ergonomic-office-chair",
                ShortDescription = "Premium comfort for long work sessions",
                Description = "Transform your workspace with this premium ergonomic office chair. Features adjustable lumbar support, breathable mesh back, adjustable armrests, and smooth-rolling casters. Supports up to 300 lbs with a sturdy base.",
                Price = 299.99m,
                OriginalPrice = 399.99m,
                Category = category,
                Brand = "ComfortPro",
                ImageUrl = "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80",
                Rating = 4.7m,
                ReviewCount = 834,
                InStock = true,
                IsFeatured = true,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Ceramic Plant Pot Set",
                Slug = "ceramic-plant-pot-set",
                ShortDescription = "Modern planters for indoor greenery",
                Description = "Beautify your space with this set of 3 modern ceramic planters. Each pot features a drainage hole and matching saucer. Available in white, gray, and terracotta finishes. Perfect for succulents, herbs, and small plants.",
                Price = 34.99m,
                Category = category,
                Brand = "GreenLife",
                ImageUrl = "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 1523,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "Memory Foam Pillow Set",
                Slug = "memory-foam-pillow-set",
                ShortDescription = "Hotel-quality sleep comfort",
                Description = "Experience the best sleep of your life with these premium memory foam pillows. Set of 2 pillows with adjustable loft, hypoallergenic covers, and cooling gel technology. Supports all sleep positions.",
                Price = 79.99m,
                OriginalPrice = 119.99m,
                Category = category,
                Brand = "DreamRest",
                ImageUrl = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
                Rating = 4.8m,
                ReviewCount = 2156,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            },
            new Product
            {
                Name = "Garden Tool Set 10-Piece",
                Slug = "garden-tool-set-10-piece",
                ShortDescription = "Complete set for gardening enthusiasts",
                Description = "Everything you need for a thriving garden in one convenient set. Includes trowel, pruning shears, cultivator, weeder, and more. Ergonomic handles and rust-resistant stainless steel. Comes with carrying tote bag.",
                Price = 54.99m,
                Category = category,
                Brand = "GardenPro",
                ImageUrl = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
                Rating = 4.5m,
                ReviewCount = 943,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = false
            },
            new Product
            {
                Name = "LED Floor Lamp Modern",
                Slug = "led-floor-lamp-modern",
                ShortDescription = "Stylish lighting for any room",
                Description = "Illuminate your space with this sleek modern floor lamp. Dimmable LED with 3 color temperatures, adjustable height, and stable weighted base. Energy-efficient and perfect for reading, working, or ambient lighting.",
                Price = 89.99m,
                Category = category,
                Brand = "LightStyle",
                ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
                Rating = 4.6m,
                ReviewCount = 678,
                InStock = true,
                IsFeatured = false,
                IsNewArrival = true
            }
        };
    }

    private static List<Product> GetBeautyProducts(Category category)
    {
        // Implementation here - 15 products
        return new List<Product>(); // Placeholder
    }

    private static List<Product> GetSportsProducts(Category category)
    {
        // Implementation here - 12 products
        return new List<Product>(); // Placeholder
    }

    private static List<Product> GetBooksProducts(Category category)
    {
        // Implementation here - 10 products
        return new List<Product>(); // Placeholder
    }
}
