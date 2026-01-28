using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen;
using ShopAssistant.Api.Data;
using ShopAssistant.Api.Middleware;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Configure DbContext with SQL Server
builder.Services.AddDbContext<ShopDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(30);
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
    
    // Enable detailed errors in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Version = "v1",
        Title = "Shop Assistant API",
        Description = "E-commerce demo API for managing products, categories, and orders. " +
                      "Built with .NET 10, Entity Framework Core, and SQL Server. " +
                      "Features include product catalog management, category browsing, and order processing.",
        Contact = new()
        {
            Name = "Shop Assistant Team",
            Email = "support@shopassistant.demo",
            Url = new Uri("https://github.com/shop-assistant")
        },
        License = new()
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Include XML comments for documentation
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }

    // Enable Swagger annotations
    options.EnableAnnotations();

    // Group actions by controller tag
    options.TagActionsBy(api => new[] { api.GroupName ?? api.ActionDescriptor.RouteValues["controller"] ?? "API" });
    options.DocInclusionPredicate((name, api) => true);
});

var app = builder.Build();

// Initialize database and seed data (Development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ShopDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            // Apply pending migrations
            context.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully");

            // Seed initial data
            await SeedData.InitializeAsync(context, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database");
        }
    }
}

// Configure the HTTP request pipeline

// 1. Error Handling Middleware (must be first)
app.UseMiddleware<ErrorHandlingMiddleware>();

// 2. Swagger (development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Shop Assistant API v1");
        options.RoutePrefix = "swagger";
        options.DocumentTitle = "Shop Assistant API Documentation";
    });
}

// 3. HTTPS Redirection
app.UseHttpsRedirection();

// 4. CORS
app.UseCors("AllowFrontend");

// 5. Authorization (placeholder for future)
app.UseAuthorization();

// 6. Controllers
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow,
    version = "1.0.0",
    environment = app.Environment.EnvironmentName
}))
.WithName("HealthCheck");

app.Run();
