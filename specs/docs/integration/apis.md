# API Documentation

## Overview

The Shop Assistant API is a RESTful HTTP API built with ASP.NET Core 10. It provides endpoints for managing products, categories, and orders in an e-commerce application.

**Base URL:** `http://localhost:5250/api` (Development)  
**API Version:** v1  
**Protocol:** HTTP/HTTPS  
**Request/Response Format:** JSON  
**Authentication:** NOT IMPLEMENTED  
**Swagger UI:** `http://localhost:5250/swagger` (Development only)

---

## API Endpoints Summary

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| **Products** | 6 endpoints | Product catalog management |
| **Categories** | 4 endpoints | Category browsing |
| **Orders** | 3 endpoints | Order creation and retrieval |
| **Health** | 1 endpoint | Health check |

**Total Endpoints:** 14

---

## Products API

**Controller:** `ProductsController`  
**Base Route:** `/api/products`  
**File:** `backend/Controllers/ProductsController.cs`

### 1. GET /api/products

List all products with filtering, sorting, and pagination.

#### Request

**Method:** `GET`  
**URL:** `/api/products`  
**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `categoryId` | integer | No | - | Filter by category ID |
| `minPrice` | decimal | No | - | Minimum price filter |
| `maxPrice` | decimal | No | - | Maximum price filter |
| `minRating` | decimal | No | - | Minimum rating (0-5) |
| `brand` | string | No | - | Filter by brand name (exact match, case-insensitive) |
| `inStock` | boolean | No | - | Filter by availability |
| `isFeatured` | boolean | No | - | Filter featured products |
| `isNewArrival` | boolean | No | - | Filter new arrivals |
| `sortBy` | string | No | `featured` | Sort field: `price`, `rating`, `name`, `newest`, `featured` |
| `sortOrder` | string | No | `desc` | Sort direction: `asc` or `desc` |
| `page` | integer | No | `1` | Page number (minimum: 1) |
| `pageSize` | integer | No | `12` | Items per page (maximum: 100) |

#### Response

**Status:** `200 OK`  
**Body:**

```json
{
  "items": [
    {
      "productId": 1,
      "name": "Premium Wireless Headphones",
      "slug": "premium-wireless-headphones",
      "brand": "AudioTech",
      "categoryId": 1,
      "price": 299.99,
      "originalPrice": 349.99,
      "imageUrl": "https://images.unsplash.com/photo-...",
      "rating": 4.7,
      "reviewCount": 1523,
      "inStock": true,
      "isFeatured": true,
      "isNewArrival": false,
      "shortDescription": "Premium over-ear headphones...",
      "category": {
        "categoryId": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "discountPercentage": 14
    }
  ],
  "currentPage": 1,
  "pageSize": 12,
  "totalItems": 50,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

#### Error Responses

- `400 Bad Request` - Invalid page number or page size
- `500 Internal Server Error` - Unexpected server error

#### Example Requests

```bash
# Get all products (default sorting)
GET /api/products

# Filter by category and price range
GET /api/products?categoryId=1&minPrice=100&maxPrice=500

# Sort by price ascending
GET /api/products?sortBy=price&sortOrder=asc

# Get page 2 with 20 items per page
GET /api/products?page=2&pageSize=20

# Complex filter: Electronics under $300, rated 4+, in stock
GET /api/products?categoryId=1&maxPrice=300&minRating=4&inStock=true
```

---

### 2. GET /api/products/{id}

Get product details by numeric ID.

#### Request

**Method:** `GET`  
**URL:** `/api/products/{id}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

#### Response

**Status:** `200 OK`  
**Body:**

```json
{
  "productId": 1,
  "name": "Premium Wireless Headphones",
  "slug": "premium-wireless-headphones",
  "description": "Experience studio-quality audio with our premium wireless headphones...",
  "shortDescription": "Premium over-ear headphones with ANC...",
  "brand": "AudioTech",
  "price": 299.99,
  "originalPrice": 349.99,
  "imageUrl": "https://images.unsplash.com/photo-...",
  "rating": 4.7,
  "reviewCount": 1523,
  "inStock": true,
  "isFeatured": true,
  "isNewArrival": false,
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": null,
  "category": {
    "categoryId": 1,
    "name": "Electronics",
    "slug": "electronics"
  }
}
```

#### Error Responses

- `404 Not Found` - Product with specified ID does not exist
- `500 Internal Server Error` - Unexpected server error

---

### 3. GET /api/products/slug/{slug}

Get product details by SEO-friendly slug.

#### Request

**Method:** `GET`  
**URL:** `/api/products/slug/{slug}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Product URL slug |

#### Response

**Status:** `200 OK`  
**Body:** Same as GET /api/products/{id}

#### Error Responses

- `404 Not Found` - Product with specified slug does not exist
- `500 Internal Server Error` - Unexpected server error

#### Example Request

```bash
GET /api/products/slug/premium-wireless-headphones
```

---

### 4. GET /api/products/search

Search products by keyword.

#### Request

**Method:** `GET`  
**URL:** `/api/products/search`  
**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (minimum 2 characters) |
| `page` | integer | No | Page number (default: 1) |
| `pageSize` | integer | No | Items per page (default: 12, max: 100) |

**Search Scope:**
- Product name
- Product description
- Product short description
- Brand name

**Search Algorithm:** Case-insensitive substring matching (SQL LIKE with LOWER())

#### Response

**Status:** `200 OK`  
**Body:** Same paginated structure as GET /api/products

**Sorting:** Results sorted by featured status, then rating

#### Error Responses

- `400 Bad Request` - Empty query or query less than 2 characters
- `500 Internal Server Error` - Unexpected server error

#### Example Requests

```bash
# Search for headphones
GET /api/products/search?q=headphones

# Search with pagination
GET /api/products/search?q=wireless&page=1&pageSize=20
```

---

### 5. GET /api/products/featured

Get featured products.

#### Request

**Method:** `GET`  
**URL:** `/api/products/featured`  
**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | `1` | Page number |
| `pageSize` | integer | No | `12` | Items per page (max: 100) |

**Filter:** Only products where `IsFeatured = true`  
**Sorting:** By rating (descending), then review count (descending)

#### Response

**Status:** `200 OK`  
**Body:** Same paginated structure as GET /api/products

---

### 6. GET /api/products/new-arrivals

Get new arrival products.

#### Request

**Method:** `GET`  
**URL:** `/api/products/new-arrivals`  
**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | `1` | Page number |
| `pageSize` | integer | No | `12` | Items per page (max: 100) |

**Filter:** Only products where `IsNewArrival = true`  
**Sorting:** By created date (descending)

#### Response

**Status:** `200 OK`  
**Body:** Same paginated structure as GET /api/products

---

## Categories API

**Controller:** `CategoriesController`  
**Base Route:** `/api/categories`  
**File:** `backend/Controllers/CategoriesController.cs`

### 1. GET /api/categories

List all categories with product counts.

#### Request

**Method:** `GET`  
**URL:** `/api/categories`  
**Query Parameters:** None

#### Response

**Status:** `200 OK`  
**Body:**

```json
[
  {
    "categoryId": 1,
    "name": "Electronics",
    "slug": "electronics",
    "description": "Cutting-edge gadgets and electronic devices...",
    "imageUrl": "https://images.unsplash.com/photo-...",
    "productCount": 25
  },
  {
    "categoryId": 2,
    "name": "Fashion",
    "slug": "fashion",
    "description": "Trendy clothing and accessories...",
    "imageUrl": "https://images.unsplash.com/photo-...",
    "productCount": 20
  }
]
```

**Notes:**
- Product count includes only **in-stock products**
- Categories sorted by name (alphabetically)

#### Error Responses

- `500 Internal Server Error` - Unexpected server error

---

### 2. GET /api/categories/{id}

Get category details by numeric ID.

#### Request

**Method:** `GET`  
**URL:** `/api/categories/{id}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Category ID |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeSamples` | boolean | No | `false` | Include top 10 sample products |

#### Response

**Status:** `200 OK`  
**Body:**

```json
{
  "categoryId": 1,
  "name": "Electronics",
  "slug": "electronics",
  "description": "Cutting-edge gadgets and electronic devices...",
  "imageUrl": "https://images.unsplash.com/photo-...",
  "productCount": 25,
  "createdAt": "2026-01-27T10:00:00Z",
  "sampleProducts": [
    {
      // Same structure as ProductDto
      "productId": 1,
      "name": "Premium Wireless Headphones",
      // ... all ProductDto fields
    }
  ]
}
```

**Sample Products (if `includeSamples=true`):**
- Top 10 in-stock products
- Sorted by featured status, then rating

#### Error Responses

- `404 Not Found` - Category with specified ID does not exist
- `500 Internal Server Error` - Unexpected server error

---

### 3. GET /api/categories/slug/{slug}

Get category details by SEO-friendly slug.

#### Request

**Method:** `GET`  
**URL:** `/api/categories/slug/{slug}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Category URL slug |

**Query Parameters:** Same as GET /api/categories/{id}

#### Response

**Status:** `200 OK`  
**Body:** Same as GET /api/categories/{id}

#### Error Responses

- `404 Not Found` - Category with specified slug does not exist
- `500 Internal Server Error` - Unexpected server error

#### Example Requests

```bash
# Get category without samples
GET /api/categories/slug/electronics

# Get category with sample products
GET /api/categories/slug/electronics?includeSamples=true
```

---

### 4. GET /api/categories/{id}/products

Get all products in a specific category with filtering and pagination.

#### Request

**Method:** `GET`  
**URL:** `/api/categories/{id}/products`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Category ID |

**Query Parameters:** Same as GET /api/products (excluding `categoryId` which is implicit)

| Parameter | Type | Description |
|-----------|------|-------------|
| `minPrice` | decimal | Minimum price filter |
| `maxPrice` | decimal | Maximum price filter |
| `minRating` | decimal | Minimum rating (0-5) |
| `brand` | string | Filter by brand |
| `inStock` | boolean | Filter by availability |
| `sortBy` | string | Sort field |
| `sortOrder` | string | Sort direction |
| `page` | integer | Page number |
| `pageSize` | integer | Items per page |

#### Response

**Status:** `200 OK`  
**Body:** Same paginated structure as GET /api/products

#### Error Responses

- `400 Bad Request` - Invalid page number or page size
- `404 Not Found` - Category with specified ID does not exist
- `500 Internal Server Error` - Unexpected server error

#### Example Requests

```bash
# Get all electronics products
GET /api/categories/1/products

# Get electronics under $500, sorted by price
GET /api/categories/1/products?maxPrice=500&sortBy=price&sortOrder=asc

# Get featured electronics only
GET /api/categories/1/products?isFeatured=true
```

---

## Orders API

**Controller:** `OrdersController`  
**Base Route:** `/api/orders`  
**File:** `backend/Controllers/OrdersController.cs`

### 1. POST /api/orders

Create a new order from cart items.

#### Request

**Method:** `POST`  
**URL:** `/api/orders`  
**Content-Type:** `application/json`  
**Body:**

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 299.99
    },
    {
      "productId": 5,
      "quantity": 1,
      "unitPrice": 89.99
    }
  ],
  "totalAmount": 689.97,
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "customerEmail": "john.doe@example.com",
  "customerName": "John Doe"
}
```

**Validation Rules:**
- `items`: Must contain at least 1 item
- `totalAmount`: Must be greater than 0, should match sum of (quantity * unitPrice)
- `customerEmail`: Valid email format required
- `customerName`: Minimum 2 characters
- All `productId` values must exist in database

**Business Logic:**
- Order created in database transaction (atomic operation)
- Unique order number generated (format: `ORD-YYYY-XXXXX`)
- Product names snapshot for historical accuracy
- Shipping address stored as JSON
- Order status set to "Pending"
- Total amount validation (tolerance: ±$0.01 for rounding)

#### Response

**Status:** `201 Created`  
**Headers:**
- `Location: /api/orders/{orderId}`

**Body:**

```json
{
  "orderId": 1,
  "orderNumber": "ORD-2026-12345",
  "totalAmount": 689.97,
  "status": "Pending",
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "customerEmail": "john.doe@example.com",
  "customerName": "John Doe",
  "items": [
    {
      "orderItemId": 1,
      "productId": 1,
      "productName": "Premium Wireless Headphones",
      "quantity": 2,
      "unitPrice": 299.99
    },
    {
      "orderItemId": 2,
      "productId": 5,
      "productName": "Wireless Bluetooth Speaker",
      "quantity": 1,
      "unitPrice": 89.99
    }
  ],
  "createdAt": "2026-01-28T14:30:00Z"
}
```

#### Error Responses

- `400 Bad Request` - Validation errors:
  - Empty items list
  - Product not found
  - Total amount mismatch
  - Invalid email format
  - Name too short
- `500 Internal Server Error` - Unexpected server error

#### Example Request (cURL)

```bash
curl -X POST http://localhost:5250/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 1, "quantity": 2, "unitPrice": 299.99}],
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
  }'
```

---

### 2. GET /api/orders/{id}

Get order details by order ID.

#### Request

**Method:** `GET`  
**URL:** `/api/orders/{id}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Order ID |

#### Response

**Status:** `200 OK`  
**Body:** Same as POST /api/orders response

#### Error Responses

- `404 Not Found` - Order with specified ID does not exist
- `500 Internal Server Error` - Unexpected server error

---

### 3. GET /api/orders/number/{orderNumber}

Get order details by order number.

#### Request

**Method:** `GET`  
**URL:** `/api/orders/number/{orderNumber}`  
**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orderNumber` | string | Yes | Order number (e.g., ORD-2026-12345) |

#### Response

**Status:** `200 OK`  
**Body:** Same as POST /api/orders response

#### Error Responses

- `404 Not Found` - Order with specified number does not exist
- `500 Internal Server Error` - Unexpected server error

#### Example Request

```bash
GET /api/orders/number/ORD-2026-12345
```

---

## Health Check API

**Route:** `/health`  
**File:** `backend/Program.cs` (inline endpoint)

### GET /health

Check API health status.

#### Request

**Method:** `GET`  
**URL:** `/health`  
**Query Parameters:** None

#### Response

**Status:** `200 OK`  
**Body:**

```json
{
  "status": "Healthy",
  "timestamp": "2026-01-28T14:30:00Z",
  "version": "1.0.0",
  "environment": "Development"
}
```

**Purpose:**
- Load balancer health checks
- Monitoring systems
- Smoke tests

---

## Common Response Patterns

### Pagination Response

All paginated endpoints return this structure:

```json
{
  "items": [...],           // Array of items
  "currentPage": 1,         // Current page number
  "pageSize": 12,           // Items per page
  "totalItems": 50,         // Total items in database
  "totalPages": 5,          // Calculated total pages
  "hasPreviousPage": false, // Can navigate back
  "hasNextPage": true       // Can navigate forward
}
```

### Error Response

All error responses follow this structure:

```json
{
  "success": false,
  "data": null,
  "message": "An error occurred while processing your request",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "details": "Specific error message (development only)"
  }
}
```

**Error Codes:**
- `INTERNAL_SERVER_ERROR` - Unhandled exception (500)
- Controller errors return simple string messages (400, 404)

---

## Data Transfer Objects (DTOs)

### ProductDto

Lightweight product representation for list views.

**File:** `backend/DTOs/ProductDto.cs`

**Fields:**
- `productId` (int) - Unique identifier
- `name` (string) - Product name
- `slug` (string) - URL slug
- `brand` (string?) - Brand name
- `categoryId` (int) - Category FK
- `price` (decimal) - Current price
- `originalPrice` (decimal?) - Original price before discount
- `imageUrl` (string?) - Image URL
- `rating` (decimal) - Average rating (0-5)
- `reviewCount` (int) - Number of reviews
- `inStock` (bool) - Availability
- `isFeatured` (bool) - Featured flag
- `isNewArrival` (bool) - New arrival flag
- `shortDescription` (string?) - Brief description
- `category` (CategoryDto?) - Nested category object
- `discountPercentage` (int?) - Calculated discount %

### ProductDetailDto

Complete product information for detail views.

**Fields:** All ProductDto fields plus:
- `description` (string?) - Full description
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime?) - Last update timestamp

### CategoryDto

Category information.

**Fields:**
- `categoryId` (int) - Unique identifier
- `name` (string) - Category name
- `slug` (string) - URL slug
- `description` (string?) - Description
- `imageUrl` (string?) - Image URL
- `productCount` (int?) - Number of in-stock products

### CategoryDetailDto

Complete category information with optional samples.

**Fields:** All CategoryDto fields plus:
- `createdAt` (DateTime) - Creation timestamp
- `sampleProducts` (List<ProductDto>?) - Top 10 sample products

### OrderDto

Order information with items.

**Fields:**
- `orderId` (int) - Unique identifier
- `orderNumber` (string) - Human-readable order number
- `totalAmount` (decimal) - Total order value
- `status` (string) - Order status (default: "Pending")
- `shippingAddress` (AddressDto) - Shipping address
- `customerEmail` (string?) - Customer email
- `customerName` (string?) - Customer name
- `items` (List<OrderItemDto>) - Order line items
- `createdAt` (DateTime) - Creation timestamp

### OrderItemDto

Single item in an order.

**Fields:**
- `orderItemId` (int) - Unique identifier
- `productId` (int) - Product FK
- `productName` (string) - Product name snapshot
- `quantity` (int) - Quantity ordered
- `unitPrice` (decimal) - Price at time of order

### CreateOrderRequest

Request body for creating orders.

**Fields:**
- `items` (List<OrderItemRequest>) - Items to order
- `totalAmount` (decimal) - Total value
- `shippingAddress` (AddressDto) - Shipping details
- `customerEmail` (string) - Email (validated)
- `customerName` (string) - Name (min 2 chars)

### AddressDto

Shipping address information.

**Fields:**
- `name` (string) - Recipient name
- `address` (string) - Street address
- `city` (string) - City
- `state` (string) - State/province
- `zipCode` (string) - Postal code
- `country` (string) - Country

---

## API Design Principles

### RESTful Design
- Resources identified by URLs (`/api/products/{id}`)
- HTTP verbs indicate actions (GET, POST)
- Status codes indicate results (200, 201, 404, 500)
- Stateless requests (no session state)

### Pagination
- All list endpoints support pagination
- Default page size: 12 items
- Maximum page size: 100 items
- Metadata includes navigation helpers

### Filtering & Sorting
- Query parameters for filtering (categoryId, price range, etc.)
- Flexible sorting with `sortBy` and `sortOrder`
- Multiple filters can be combined

### Idempotency
- GET requests are idempotent (safe to retry)
- POST /api/orders is NOT idempotent (creates new order each time)
- No PUT/PATCH/DELETE endpoints implemented

### Error Handling
- Consistent error response format
- Different error details for development vs production
- Appropriate HTTP status codes
- Validation errors return 400 Bad Request

---

## CORS Configuration

**Policy Name:** `AllowFrontend`  
**Allowed Origins:**
- `http://localhost:3000`
- `http://localhost:3001`

**Allowed Methods:** All (GET, POST, PUT, DELETE, etc.)  
**Allowed Headers:** All  
**Credentials:** Allowed  
**File:** `backend/Program.cs`

---

## Swagger/OpenAPI Documentation

**URL:** `http://localhost:5250/swagger` (Development only)  
**Specification:** OpenAPI 3.0  
**Library:** Swashbuckle.AspNetCore 10.1.0

**Features:**
- Interactive API testing
- Request/response examples
- Schema definitions
- XML documentation comments
- Grouped by controller tags
- Example values for DTOs

**Configuration File:** `backend/Program.cs` (SwaggerGen configuration)

---

## API Limitations & Missing Features

### NOT IMPLEMENTED:
- ❌ Authentication (no user login)
- ❌ Authorization (no role-based access control)
- ❌ Rate limiting
- ❌ API versioning
- ❌ Response caching
- ❌ ETag support
- ❌ Partial responses (field selection)
- ❌ Bulk operations
- ❌ File uploads
- ❌ WebSocket support
- ❌ GraphQL endpoint
- ❌ HATEOAS links
- ❌ API key authentication
- ❌ OAuth/OpenID Connect

### Known Limitations:
- No product create/update/delete (read-only catalog)
- No category management
- No order status updates (orders stuck in "Pending")
- No order cancellation
- No user accounts
- No cart management API (frontend uses localStorage)
- Search is basic substring match (no fuzzy search, no relevance ranking)
- No product reviews API (review data is static)

---

## Testing the API

### Using Swagger UI

1. Start backend: `dotnet run` (from `backend/` directory)
2. Open browser: `http://localhost:5250/swagger`
3. Select endpoint to test
4. Click "Try it out"
5. Fill in parameters
6. Click "Execute"
7. View response

### Using cURL

```bash
# Get all products
curl http://localhost:5250/api/products

# Get product by ID
curl http://localhost:5250/api/products/1

# Search products
curl "http://localhost:5250/api/products/search?q=headphones"

# Create order
curl -X POST http://localhost:5250/api/orders \
  -H "Content-Type: application/json" \
  -d @order.json
```

### Using HTTP File

**File:** `backend/ShopAssistant.Api.http` (for VS Code REST Client extension)

Contains pre-configured requests for all endpoints.

---

## Performance Characteristics

### Query Performance
- Products endpoint: ~50-100ms for 12 items (including category join)
- Product detail: ~10-20ms (single query with join)
- Search: ~100-200ms (depends on result size, uses LIKE)
- Categories: ~5-10ms (simple query)
- Order creation: ~50-100ms (transaction with multiple inserts)

**Note:** Performance measured on local SQL Server LocalDB, development machine.

### Optimization Techniques Used
- `AsNoTracking()` for read-only queries (30-40% faster)
- Eager loading with `.Include()` prevents N+1 queries
- Indexed columns for common filters (slug, categoryId, price, rating)
- DTO projections with `Select()` (only needed fields)
- Pagination limits result set size

### NOT IMPLEMENTED:
- Response caching
- Database query result caching
- CDN integration
- Connection pooling tuning (uses defaults)
- Database read replicas
- Query result streaming

---

## API Evolution & Versioning

**Current State:** v1 (no versioning implemented)

**If versioning were added:**
- URL versioning: `/api/v1/products`, `/api/v2/products`
- Header versioning: `X-API-Version: 1`
- Query parameter: `/api/products?version=1`

**Current approach:** Breaking changes not expected (demo application)

---

## Related Documentation

- [System Architecture](../architecture/overview.md) - Overall system design
- [Database Schema](./databases.md) - Data model details
- [Technology Stack](../technology/stack.md) - Technologies used
- [Frontend Integration](../architecture/components.md) - How frontend consumes API

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**API Version:** v1  
**Backend Version:** 1.0.0
