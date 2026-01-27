# Product Requirements Document: Shop Assistant

## Document Information
- **Version**: 2.0
- **Last Updated**: January 27, 2026
- **Status**: In Progress
- **Owner**: Product Team
- **Change Summary**: Added backend (.NET 10 API) and database (SQL Server) layers while maintaining simplicity for local development

---

## 1. Product Overview and Vision

### 1.1 Executive Summary
Shop Assistant is a premium e-commerce demonstration website designed to showcase modern web development capabilities in live presentation settings. The platform delivers a polished, high-end shopping experience that exemplifies best practices in UI/UX design, interaction patterns, and contemporary web technologies.

### 1.2 Vision Statement
To create the most compelling, visually stunning e-commerce demo that demonstrates the art of the possible in modern web development—a showcase piece that leaves audiences impressed with its premium feel, smooth interactions, and attention to detail.

### 1.3 Product Positioning
Shop Assistant positions itself as a **demonstration-grade** full-stack e-commerce platform that:
- Showcases professional-quality frontend development with React/Next.js
- Demonstrates modern UX patterns and smooth animations
- Illustrates a clean, simple backend API architecture with .NET 10
- Shows database integration patterns with SQL Server
- Serves as a reference implementation for premium e-commerce experiences
- Functions as a portfolio piece and live demo tool for full-stack capabilities

### 1.4 Key Differentiators
- **Simple Full-Stack Architecture**: Clean separation of frontend, API, and database layers
- **Local-First Development**: Runs entirely on localhost without cloud dependencies
- **Straightforward Backend**: Minimal .NET API showcasing RESTful patterns
- **Easy Database Setup**: SQL Server with simple schema and seed data scripts
- **Zero Dependencies**: Fully self-contained with mocked data—no backend required
- **Instant Setup**: Ready to demo immediately without configuration or API setup

---

## 2. Scope

### 2.1 In Scope
**What will be delivered**:

#### Frontend (Phase 1 - Existing)
- Premium e-commerce UI with Next.js + React + TypeScript
- Product browsing, filtering, search capabilities
- Shopping cart with localStorage persistence
- Multi-step checkout flow
- Responsive design (mobile, tablet, desktop)
- Smooth animations and interactions
- Full demo-ready user experience

#### Backend API (Phase 2 - NEW)
- .NET 10 Web API with RESTful endpoints
- Simple API contract for products, categories, cart, orders
- Entity Framework Core for database access
- Basic CRUD operations
- JSON response format
- CORS configuration for frontend
- Swagger/OpenAPI documentation
- Local development setup (runs on localhost:5000)

#### Database Layer (Phase 2 - NEW)
- SQL Server database (LocalDB or Developer Edition)
- Simple schema: Products, Categories, CartItems, Orders, OrderItems
- Entity Framework Core migrations
- Seed data scripts for demo catalog (50-100 products)
- Database initialization scripts
- Local database setup

#### Integration (Phase 2)
- Frontend API client to connect to backend
- Replace mocked data with real API calls
- Error handling for API failures
- Loading states during API calls
- Maintain cart functionality (localStorage or API-based)

### 2.2 Out of Scope
**What will NOT be addressed**:

#### Authentication & Security
- ❌ Real user authentication/authorization (mock only)
- ❌ OAuth, JWT, session management
- ❌ Password hashing and security
- ❌ User registration system
- ❌ Role-based access control

#### Advanced Backend Features
- ❌ Complex business logic
- ❌ Background jobs or queues
- ❌ Caching layers (Redis, etc.)
- ❌ File upload/storage systems
- ❌ Email services
- ❌ Payment processing integration
- ❌ Real-time features (SignalR)
- ❌ API versioning
- ❌ Rate limiting

#### DevOps & Deployment
- ❌ Cloud deployment (Azure, AWS)
- ❌ Docker containerization (except for SQL Server)
- ❌ CI/CD pipelines
- ❌ Production monitoring/logging
- ❌ Load balancing
- ❌ Database replication

#### Production Readiness
- ❌ Production-grade error handling
- ❌ Comprehensive logging (Serilog, etc.)
- ❌ Health checks and monitoring
- ❌ Performance optimization at scale
- ❌ Security hardening
- ❌ Data backup strategies

**Priority**: Keep it simple. This is a demo/learning project that runs locally, not a production system.

---

## 2. Target Audience

### 2.1 Primary Audience
**Demo Viewers & Developers** - individuals viewing or learning from the solution:
- Potential clients and stakeholders evaluating full-stack development capabilities
- Conference and meetup attendees
- Technical evaluators and decision-makers
- Fellow developers learning full-stack patterns (frontend + backend + database)
- Workshop and training participants learning .NET and React integration
- Students and junior developers building portfolio projects

### 2.2 Secondary Audience
**Presenters** - individuals conducting the demonstrations:
- Sales engineers and solution architects
- Developer advocates and community speakers
- Technical trainers and educators
- Portfolio showcasers

### 2.3 Audience Needs
- **First Impressions Matter**: Viewers judge quality within seconds
- **Clear Value Demonstration**: Must show full-stack capabilities (frontend + API + database)
- **Relatable Use Case**: E-commerce is universally understood
- **Visual Impact**: Needs to stand out from typical demo applications
- **Smooth Performance**: Any lag or jank undermines credibility
- **Simple Architecture**: Easy to understand and replicate for learning purposes
- **Local-First Development**: Should run on localhost without complex cloud setup

---

## 3. Core Features

### 3.1 Product Catalog & Discovery

#### 3.1.1 Product Listing Page
- Grid layout with responsive columns (4 → 3 → 2 → 1 column based on viewport)
- Product cards displaying:
  - High-quality product images
  - Product name and brand
  - Price with currency formatting
  - Star rating and review count
  - "Quick Add" and "View Details" actions
- Hover states with subtle elevation and animations
- Skeleton loading states for perceived performance

#### 3.1.2 Product Filtering & Sorting
- Category navigation (e.g., Electronics, Fashion, Home, Beauty)
- Filter panel with:
  - Price range slider
  - Brand selection (multi-select checkboxes)
  - Rating filter (4+ stars, 3+ stars, etc.)
  - Availability toggle (In Stock only)
- Sort options:
  - Featured
  - Price: Low to High
  - Price: High to Low
  - Highest Rated
  - Newest Arrivals
- Active filter badges with clear dismiss actions
- Animated filter panel slide-in/out

#### 3.1.3 Search Functionality
- Prominent search bar in header
- Real-time search suggestions as user types
- Search results page with highlighting of matched terms
- "No results" state with suggested alternatives
- Recent searches (stored in browser storage)

#### 3.1.4 Product Detail Page
- Large image gallery with:
  - Primary hero image
  - Thumbnail navigation strip
  - Zoom on hover/click functionality
  - Image transition animations
- Product information panel:
  - Product title and brand
  - Star rating with review count
  - Price with any discount indication
  - SKU and availability status
  - Color/size/variant selection with visual swatches
  - Quantity selector
  - "Add to Cart" primary action
  - "Add to Wishlist" secondary action
- Product description tabs:
  - Overview
  - Specifications
  - Reviews (with star breakdown chart)
  - Shipping & Returns
- Related products carousel
- Breadcrumb navigation

### 3.2 Shopping Cart

#### 3.2.1 Cart Icon & Badge
- Persistent cart icon in header
- Animated badge showing item count
- Notification animation when items are added
- Hover preview showing cart contents

#### 3.2.2 Cart Drawer/Modal
- Slides in from right side
- Cart items list with:
  - Product thumbnail
  - Name and selected variant
  - Quantity controls (+/- buttons)
  - Individual item price
  - Remove item action
- Subtotal calculation
- "View Cart" and "Checkout" action buttons
- Empty cart state with call-to-action
- Auto-save cart state to localStorage

#### 3.2.3 Cart Page
- Full-page cart view for detailed review
- Editable quantities
- "Save for Later" option
- Promotional code input field
- Order summary sidebar with:
  - Subtotal
  - Shipping estimate
  - Tax estimate
  - Order total
- "Continue Shopping" and "Proceed to Checkout" actions

### 3.3 Checkout Flow

#### 3.3.1 Checkout Process
Multi-step checkout with progress indicator:

**Step 1: Shipping Information**
- Form fields for address details
- Address validation (format checking)
- "Save this address" checkbox
- Autofill support with mock data

**Step 2: Shipping Method**
- Radio button selection of shipping options:
  - Standard (5-7 days) - Free
  - Express (2-3 days) - $9.99
  - Overnight (1 day) - $24.99
- Delivery estimate dates

**Step 3: Payment**
- Mock payment form with:
  - Card number (with type detection icon)
  - Expiration date
  - CVV
  - Billing address (same as shipping checkbox)
- Security badges for trust signals
- Mock validation only (no real payment processing)

**Step 4: Review & Place Order**
- Summary of all information entered
- Edit links to return to previous steps
- Terms and conditions checkbox
- "Place Order" primary action button

#### 3.3.2 Order Confirmation
- Success page with:
  - Checkmark animation
  - Order number (randomly generated)
  - Order summary
  - Estimated delivery date
  - Email confirmation message (mocked)
- "Continue Shopping" and "View Order Details" actions

### 3.4 User Account (Lightweight)

#### 3.4.1 Mock Authentication
- Login/Sign up forms (no real authentication)
- Welcome message with user name in header
- Mock user profile data
- Persistent login state via localStorage

#### 3.4.2 Account Features
- Order history (showing mock past orders)
- Saved addresses
- Wishlist/Favorites
- Account settings (display only)

### 3.5 Additional Features

#### 3.5.1 Navigation
- Sticky header that shrinks on scroll
- Mega menu for category navigation (desktop)
- Mobile-friendly hamburger menu
- Breadcrumb trails for navigation context

#### 3.5.2 Footer
- Site map links
- Social media icons (non-functional)
- Newsletter signup (mock submission)
- Payment method icons
- Trust badges

#### 3.5.3 Homepage
- Hero banner with promotional imagery
- Featured categories grid
- "Best Sellers" product carousel
- "New Arrivals" section
- Social proof elements (testimonials, review highlights)
- Value propositions (Free Shipping, Easy Returns, etc.)

### 3.6 Backend API Features (NEW - Phase 2)

#### 3.6.1 RESTful API Endpoints
**Products API**:
- List products with optional filtering (category, price range, rating)
- Get single product by ID
- Search products by name/description
- Get featured products
- Get new arrivals

**Categories API**:
- List all categories with product counts
- Get products by category
- Category metadata (name, description, image)

**Cart API** (Optional - can use localStorage initially):
- Get current cart items
- Add item to cart
- Update cart item quantity
- Remove item from cart
- Clear cart

**Orders API**:
- Create order from cart
- Get order by ID
- Get order confirmation details
- Mock order history

#### 3.6.2 API Response Format
Consistent JSON response structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "details": "Product with ID 123 does not exist"
  }
}
```

#### 3.6.3 API Documentation
- Swagger/OpenAPI UI available at `/swagger`
- Interactive API testing interface
- Request/response examples for each endpoint
- Clear documentation of query parameters and filters

#### 3.6.4 Data Validation
- Input validation for all POST/PUT requests
- Price validation (must be positive)
- Quantity validation (must be positive integer)
- Required field validation
- Data type validation
- Return clear error messages for validation failures

#### 3.6.5 Error Handling
- Graceful handling of database connection failures
- 404 responses for not found resources
- 400 responses for bad requests
- 500 responses for server errors
- Detailed error logging to console (development)
- Generic error messages to client (avoid exposing internals)

### 3.7 Database Features (NEW - Phase 2)

#### 3.7.1 Database Schema
Simple, normalized schema with core tables:
- **Products**: Product catalog with prices, descriptions, images
- **Categories**: Product categories with metadata
- **CartItems**: Shopping cart items (optional - can use localStorage)
- **Orders**: Order header information
- **OrderItems**: Line items for each order

**Relationships**:
- Products belong to Categories (Many-to-One)
- Orders have OrderItems (One-to-Many)
- OrderItems reference Products (Many-to-One)

#### 3.7.2 Data Seeding
- Seed script to populate initial product catalog
- 50-100 demo products across 6 categories
- Realistic product data (names, descriptions, prices)
- Product images (URLs or paths)
- Varied ratings and prices for filtering demos
- Run automatically on first database creation

#### 3.7.3 Database Migrations
- Entity Framework Core migrations for schema changes
- Migration scripts committed to source control
- Automated migration application on startup (development)
- Rollback capability for schema changes

#### 3.7.4 Database Indexes
- Primary keys on all tables (auto-generated)
- Index on Products.CategoryId (for category filtering)
- Index on Products.Price (for price range queries)
- Index on Products.Rating (for rating filters)
- Keep indexes minimal for simplicity

---

## 3.8 High-Level Requirements for Backend Integration

### 3.8.1 Functional Requirements

**[REQ-1] Product Data Persistence**
- System must store product catalog in SQL Server database
- Products must include: name, description, price, category, brand, images, rating, stock status
- Products must be retrievable via RESTful API endpoints

**[REQ-2] API Endpoints**
- Backend must provide RESTful API endpoints for products, categories, cart, and orders
- API must return JSON responses with consistent structure
- API must handle filtering, sorting, and search operations
- API must implement proper HTTP status codes (200, 404, 400, 500)

**[REQ-3] Frontend Integration**
- Frontend must call backend API instead of using mocked data
- Frontend must handle API loading states
- Frontend must handle API error states gracefully
- Frontend must maintain existing user experience (no degradation)

**[REQ-4] Local Development**
- Entire stack must run on localhost without cloud dependencies
- Backend API must run on http://localhost:5000
- Frontend must run on http://localhost:3000
- SQL Server database must be accessible locally (LocalDB, Developer, or Docker)

**[REQ-5] Data Seeding**
- Database must be automatically populated with demo data on first run
- Seed data must include 50-100 products across 6 categories
- Seed data must be realistic and demo-ready

**[REQ-6] Simple Architecture**
- Backend code must be simple and easy to understand
- No complex abstractions or patterns (avoid over-engineering)
- Clear separation: Controllers → DbContext → Database
- Minimal business logic layer

### 3.8.2 Non-Functional Requirements

**[REQ-7] Performance**
- API response time < 500ms for product listing
- API response time < 200ms for single product retrieval
- Database queries must be efficient (no N+1 problems)

**[REQ-8] Developer Experience**
- Setup instructions must be clear and concise
- Fewer than 5 commands to get entire stack running
- Automatic database creation and seeding
- Good error messages when setup fails

**[REQ-9] API Documentation**
- Swagger UI must be available at `/swagger`
- All endpoints must be documented with examples
- Request/response schemas must be clearly defined

**[REQ-10] Code Quality**
- Backend code must follow .NET conventions
- Use async/await for all database operations
- Proper error handling and logging
- Clear variable and method names

---

## 3.9 User Stories for Backend Integration

```gherkin
As a frontend developer, I want to call a REST API to get products,
so that the application uses real data instead of mocked JSON files.

As a frontend developer, I want consistent API response formats,
so that I can easily handle responses without complex parsing logic.

As a user, I want products to be stored in a database,
so that data persists between application restarts.

As a developer, I want to easily seed demo data,
so that I can quickly set up a working demo environment.

As a presenter, I want the full stack to run locally,
so that I can demo without internet connectivity or cloud dependencies.

As a developer, I want clear API documentation,
so that I can understand available endpoints without reading code.

As a frontend developer, I want proper error responses from the API,
so that I can show meaningful error messages to users.

As a user, I want to browse products fetched from a database,
so that the application feels like a real e-commerce platform.

As a developer, I want simple backend architecture,
so that I can easily understand and modify the code.

As a user, I want cart operations to persist in the database (optional),
so that my cart is saved even if I close the browser.
```

---

## 4. User Experience Requirements

### 4.1 Visual Design

#### 4.1.1 Design System
- **Color Palette**:
  - Primary brand color with semantic variations
  - Neutral grays for text and backgrounds
  - Success, warning, error state colors
  - High contrast for accessibility
- **Typography**:
  - Modern sans-serif font family (e.g., Inter, Plus Jakarta Sans)
  - Clear typographic hierarchy (H1 → H6)
  - Consistent spacing and line heights
  - Readable font sizes (minimum 14px for body text)
- **Spacing System**:
  - Consistent 8px grid system
  - Generous whitespace for premium feel
  - Balanced content density

#### 4.1.2 Component Library
- Consistent button styles (primary, secondary, tertiary, ghost)
- Form inputs with clear labels and validation states
- Card components with elevation shadows
- Badges and tags
- Loading spinners and skeleton screens
- Toast notifications for user feedback
- Modals and drawers
- Tooltips for additional context

#### 4.1.3 Visual Hierarchy
- Clear focal points on each page
- Strategic use of size, color, and contrast
- Proper visual weight for CTAs
- Scannable layouts with F-pattern consideration

### 4.2 Interactions & Animations

#### 4.2.1 Microinteractions
- Button hover and active states
- Form input focus states
- Toggle and checkbox animations
- Icon transitions
- Card hover elevations
- Ripple effects on interactions

#### 4.2.2 Page Transitions
- Smooth fade-in for page loads
- Skeleton loading for perceived performance
- Staggered entrance animations for list items
- Parallax effects on hero sections (subtle)

#### 4.2.3 Feedback Mechanisms
- Toast notifications for cart actions ("Added to cart!")
- Success checkmarks for completed actions
- Loading states for async operations
- Error messages with clear guidance
- Form validation with inline feedback

#### 4.2.4 Animation Principles
- Animations duration: 200-400ms (quick and snappy)
- Easing: ease-out for entrances, ease-in for exits
- Respect `prefers-reduced-motion` for accessibility
- Purposeful animations that enhance UX, not distract
- Smooth 60fps performance

### 4.3 Responsive Design

#### 4.3.1 Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1536px
- Large Desktop: > 1536px

#### 4.3.2 Mobile Experience
- Touch-friendly targets (minimum 44x44px)
- Optimized tap areas for buttons
- Swipeable carousels
- Bottom-anchored navigation for thumb reach
- Simplified navigation structure
- Full-width CTAs on mobile

#### 4.3.3 Desktop Experience
- Multi-column layouts
- Hover interactions
- Persistent side navigation
- Larger imagery
- Enhanced filtering interfaces

### 4.4 Accessibility

#### 4.4.1 WCAG 2.1 AA Compliance
- Sufficient color contrast (4.5:1 for text)
- Keyboard navigation support
- Focus indicators on all interactive elements
- Screen reader-friendly labels and ARIA attributes
- Semantic HTML structure
- Alt text for all images

#### 4.4.2 Inclusive Design
- Support for reduced motion preferences
- Scalable text (no absolute font sizes)
- Clear error messages
- Multiple ways to complete tasks

### 4.5 Performance

#### 4.5.1 Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

#### 4.5.2 Optimization Strategies
- Lazy loading for images below fold
- Code splitting for route-based chunks
- Optimized asset sizes
- Minimal third-party dependencies
- Efficient re-renders (memoization where appropriate)

---

## 5. Technical Considerations

### 5.1 Technology Stack

#### 5.1.1 Frontend
- **React** with TypeScript for type safety
- **Next.js 14+** for enhanced routing and optimizations
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations

#### 5.1.2 Backend API
- **.NET 10** (latest LTS) with minimal API or controllers
- **RESTful API** design with simple endpoints
- **Entity Framework Core** for database access (code-first approach)
- **Swagger/OpenAPI** for API documentation
- **Local development**: Runs on http://localhost:5000 or :5001 (HTTPS)

#### 5.1.3 Database
- **SQL Server** (LocalDB or Developer Edition)
- **Simple schema**: Products, Categories, CartItems, Orders tables
- **Seed data scripts** for initial product catalog
- **Migrations** managed by Entity Framework Core

#### 5.1.4 Development Requirements
- **Node.js 20.x** for frontend
- **.NET 10 SDK** for backend
- **SQL Server** (LocalDB or Docker container)
- **VS Code** or **Visual Studio** for development
- **Package Managers**: pnpm (frontend), dotnet CLI (backend)

### 5.2 Architecture Overview

#### 5.2.1 Three-Layer Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js + React)        │  Port: 3000
│  - UI Components                    │
│  - Client-side state (cart)         │
│  - API calls to backend             │
└─────────────┬───────────────────────┘
              │ HTTP/REST
┌─────────────▼───────────────────────┐
│  Backend API (.NET 10)              │  Port: 5000
│  - RESTful endpoints                │
│  - Business logic (minimal)         │
│  - Data validation                  │
└─────────────┬───────────────────────┘
              │ Entity Framework Core
┌─────────────▼───────────────────────┐
│  Database (SQL Server)              │
│  - Products, Categories             │
│  - CartItems, Orders                │
│  - Seed data                        │
└─────────────────────────────────────┘
```

#### 5.2.2 API Contract (Simple RESTful Endpoints)

**Products**:
- `GET /api/products` - List all products with optional filters
- `GET /api/products/{id}` - Get single product by ID
- `GET /api/products/search?q={query}` - Search products

**Categories**:
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}/products` - Get products by category

**Cart** (session-based or user-based):
- `GET /api/cart` - Get current cart items
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart

**Orders** (simplified):
- `POST /api/orders` - Create new order from cart
- `GET /api/orders/{id}` - Get order details

**Response Format** (Consistent JSON):
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

#### 5.2.3 Database Schema (Simplified)

**Tables**:
1. **Products**
   - ProductId (PK, int, identity)
   - Name (nvarchar(200))
   - Description (nvarchar(max))
   - Price (decimal(18,2))
   - CategoryId (FK)
   - Brand (nvarchar(100))
   - ImageUrl (nvarchar(500))
   - Rating (decimal(3,2))
   - InStock (bit)
   - CreatedAt (datetime)

2. **Categories**
   - CategoryId (PK, int, identity)
   - Name (nvarchar(100))
   - Description (nvarchar(500))
   - ImageUrl (nvarchar(500))

3. **CartItems** (optional - can use localStorage initially)
   - CartItemId (PK, int, identity)
   - SessionId (nvarchar(100)) or UserId
   - ProductId (FK)
   - Quantity (int)
   - AddedAt (datetime)

4. **Orders** (simplified)
   - OrderId (PK, int, identity)
   - OrderNumber (nvarchar(50), unique)
   - TotalAmount (decimal(18,2))
   - Status (nvarchar(50))
   - ShippingAddress (nvarchar(max)) - JSON string
   - CreatedAt (datetime)

5. **OrderItems**
   - OrderItemId (PK, int, identity)
   - OrderId (FK)
   - ProductId (FK)
   - Quantity (int)
   - UnitPrice (decimal(18,2))

**Relationships**:
- Products → Categories (Many-to-One)
- CartItems → Products (Many-to-One)
- Orders → OrderItems (One-to-Many)
- OrderItems → Products (Many-to-One)

### 5.3 Data Flow

#### 5.3.1 Product Browsing Flow
```
User browses products
    ↓
Frontend calls GET /api/products
    ↓
Backend queries database via EF Core
    ↓
Returns JSON product list
    ↓
Frontend renders product grid
```

#### 5.3.2 Add to Cart Flow (Hybrid Approach)
```
User clicks "Add to Cart"
    ↓
Option A: Store in localStorage (simpler for demo)
    ↓
Frontend updates cart state locally

Option B: Persist to backend
    ↓
Frontend calls POST /api/cart/items
    ↓
Backend saves to CartItems table
    ↓
Returns updated cart
```

**Recommendation**: Start with localStorage (Option A) for simplicity, add backend persistence (Option B) as enhancement.

#### 5.3.3 Checkout Flow
```
User proceeds to checkout
    ↓
Frontend submits order: POST /api/orders
    ↓
Backend creates Order and OrderItems records
    ↓
Backend returns OrderId and confirmation
    ↓
Frontend shows success page
    ↓
Backend clears cart (if persisted)
```

### 5.4 Backend API Project Structure

```
ShopAssistant.Api/
├── Controllers/           # Or Endpoints/ for Minimal APIs
│   ├── ProductsController.cs
│   ├── CategoriesController.cs
│   ├── CartController.cs
│   └── OrdersController.cs
├── Data/
│   ├── ShopDbContext.cs  # EF Core context
│   ├── Migrations/       # Auto-generated
│   └── SeedData.cs       # Initial data seeding
├── Models/
│   ├── Product.cs
│   ├── Category.cs
│   ├── CartItem.cs
│   ├── Order.cs
│   └── OrderItem.cs
├── DTOs/                 # Data Transfer Objects
│   ├── ProductDto.cs
│   ├── CartItemDto.cs
│   └── CreateOrderRequest.cs
├── Services/             # Business logic (if needed)
│   └── OrderService.cs
├── Program.cs            # Entry point
├── appsettings.json      # Configuration
└── ShopAssistant.Api.csproj
```

### 5.5 Local Development Setup

#### 5.5.1 Database Setup Options

**Option 1: SQL Server LocalDB** (Recommended for Windows)
- Included with Visual Studio
- Lightweight, file-based SQL Server
- Connection string: `Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb;Trusted_Connection=true;`
- No separate installation needed

**Option 2: SQL Server Developer Edition**
- Full SQL Server features
- Free for development
- Runs as Windows service
- Connection string: `Server=localhost;Database=ShopAssistantDb;Trusted_Connection=true;`

**Option 3: SQL Server Docker Container**
- Cross-platform (Windows/Mac/Linux)
- Isolated environment
- Start with: `docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`
- Connection string: `Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password=YourStrong@Password;TrustServerCertificate=true;`

#### 5.5.2 Backend Development Workflow

**Initial Setup**:
```bash
# Navigate to backend directory
cd ShopAssistant.Api

# Restore dependencies
dotnet restore

# Create initial migration
dotnet ef migrations add InitialCreate

# Create database and apply migrations
dotnet ef database update

# Seed sample data
dotnet run --seed-data

# Run backend API
dotnet run
# API available at: https://localhost:5001 and http://localhost:5000
```

**Frontend Configuration**:
```typescript
// frontend/lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

**Frontend API Client**:
```typescript
// frontend/lib/api/client.ts
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  const result = await response.json();
  return result.data;
}
```

### 5.6 CORS Configuration

Backend must enable CORS for frontend origin:
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

app.UseCors("AllowFrontend");
```

### 5.7 Development Requirements Summary

**System Prerequisites**:
- ✅ Node.js 20.x (for frontend)
- ✅ .NET 10 SDK (for backend)
- ✅ SQL Server (LocalDB, Developer, or Docker)
- ✅ Visual Studio Code or Visual Studio
- ✅ Git for version control

**Startup Sequence**:
1. Start SQL Server (if using Developer/Docker)
2. Start backend API: `dotnet run` (Port 5000/5001)
3. Start frontend: `pnpm dev` (Port 3000)
4. Open browser: http://localhost:3000

**Development Ports**:
- Frontend: 3000
- Backend: 5000 (HTTP), 5001 (HTTPS)
- Database: 1433 (SQL Server default)

### 5.1 Technology Stack (Recommended) - DEPRECATED

**Note**: This section has been superseded by section 5.1 above which includes backend and database specifications.

#### 5.1.1 Frontend Framework
- **React** with TypeScript for type safety
- Or **Next.js** for enhanced routing and optimizations
- Alternative: Vue.js, Svelte (framework agnostic)

#### 5.1.2 Styling Solution
- **Tailwind CSS** for utility-first styling
- Or **styled-components** / **CSS Modules**
- Consistent with design system tokens

#### 5.1.3 State Management
- **React Context** or **Zustand** for cart state
- **localStorage** for cart and user persistence
- No complex state management needed

#### 5.1.4 UI Component Libraries (Optional)
- **Radix UI** or **Headless UI** for accessible components
- **Framer Motion** for animations
- **React Icons** for icon library

### 5.2 Data Architecture

#### 5.2.1 Mocked Data Structure
All data stored in static JSON files or in-memory objects:

**Products Data**:
```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Premium Wireless Headphones",
      "brand": "AudioTech",
      "category": "Electronics",
      "price": 299.99,
      "originalPrice": 399.99,
      "rating": 4.7,
      "reviewCount": 1234,
      "images": ["url1", "url2", "url3"],
      "description": "...",
      "specs": {...},
      "inStock": true,
      "variants": [...]
    }
  ]
}
```

**Mock Categories**: Electronics, Fashion, Home & Garden, Beauty, Sports, Books

**Mock Brands**: 10-15 fictional brand names

**Product Catalog Size**: 50-100 products for realistic browsing

#### 5.2.2 Cart State
- Stored in localStorage
- JSON structure with product IDs, quantities, variants
- Persists across sessions

#### 5.2.3 User Data (Mock)
- Predefined mock user profiles
- Mock order history
- Saved addresses template

### 5.3 Development Requirements

#### 5.3.1 Code Quality
- ESLint configuration for code consistency
- Prettier for code formatting
- TypeScript for type safety
- Component-driven development
- Clear folder structure and naming conventions

#### 5.3.2 Documentation
- README with setup instructions
- Component documentation with Storybook (optional)
- Code comments for complex logic
- Environment setup guide

#### 5.3.3 Version Control
- Git for version control
- Semantic commit messages
- Feature branch workflow

### 5.4 Deployment

#### 5.4.1 Hosting Options
- **Vercel** or **Netlify** for zero-config deployment
- GitHub Pages for simple hosting
- CloudFlare Pages
- Any static hosting service

#### 5.4.2 Build Process
- Production build optimizations
- Asset minification
- Tree shaking for unused code
- Source maps for debugging

### 5.5 Technical Specifications (Detailed)

#### 5.5.1 Build Configuration
**Recommended Stack**: Next.js 14+ with App Router
- **Package Manager**: pnpm (faster installs, efficient disk usage)
- **Node Version**: 18.x or 20.x LTS
- **TypeScript**: 5.x with strict mode enabled
- **Build Tool**: Native Next.js/Vite (Turbopack for Next.js)

**Development Tools**:
```json
{
  "eslint": "^8.x",
  "prettier": "^3.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.4.x",
  "@types/react": "^18.x",
  "@types/node": "^20.x"
}
```

#### 5.5.2 Browser Compatibility Matrix
| Browser | Minimum Version | Testing Priority |
|---------|----------------|------------------|
| Chrome | 90+ | High |
| Firefox | 88+ | High |
| Safari | 14+ | High |
| Edge | 90+ | Medium |
| Mobile Safari (iOS) | 14+ | High |
| Chrome Mobile (Android) | 90+ | Medium |

**Polyfills Required**: None (modern browsers only for demo)

#### 5.5.3 Image Asset Specifications
**Product Images**:
- Format: WebP with JPEG fallback
- Dimensions: 
  - Thumbnail: 300x300px
  - Medium: 600x600px
  - Large: 1200x1200px
- Optimization: Progressive loading
- Max file size: 150KB per image
- Aspect ratio: 1:1 (square) for consistency

**Hero/Banner Images**:
- Dimensions: 1920x600px (desktop), 768x400px (mobile)
- Format: WebP with JPEG fallback
- Max file size: 300KB

**Image Sources**:
- Unsplash API for high-quality product imagery
- Or curated static assets in `/public/images/products/`

#### 5.5.4 Mock Data Generation Strategy

**Approach**: Static JSON files with seed data generator

**Data Volume**:
- 80-100 products across 6 categories
- 15-20 products per category
- 10-12 unique brands
- 200-300 mock reviews

**Product Data Schema** (TypeScript):
```typescript
interface Product {
  id: string; // Format: "prod_xxx"
  slug: string; // URL-friendly name
  name: string;
  brand: string;
  category: CategoryType;
  subcategory?: string;
  price: number;
  originalPrice?: number; // For discounts
  discount?: number; // Percentage
  currency: string; // Default: "USD"
  rating: number; // 0-5, one decimal
  reviewCount: number;
  images: ProductImage[];
  thumbnail: string; // Primary image URL
  description: string; // Rich text/markdown
  shortDescription: string; // 1-2 sentences
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  stockCount?: number; // For display only
  variants?: ProductVariant[]; // Color, size, etc.
  sku: string;
  tags: string[];
  weight?: string;
  dimensions?: string;
  createdAt: string; // ISO date
  isFeatured: boolean;
  isNewArrival: boolean;
}

interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'material';
  name: string;
  value: string;
  priceDelta?: number; // Price adjustment
  inStock: boolean;
}
```

**Data Files Structure**:
```
src/data/
  ├── products.json          # All products
  ├── categories.json        # Category metadata
  ├── brands.json           # Brand information
  ├── reviews.json          # Product reviews
  └── generators/           # Scripts to generate data
      └── seed-data.ts
```

#### 5.5.5 State Management Architecture

**Cart State** (localStorage + Context):
```typescript
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  lastModified: string;
}
```

**User State** (localStorage):
```typescript
interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[]; // Product IDs
}
```

**Storage Keys**:
- `shop-assistant:cart` - Cart data
- `shop-assistant:user` - User data
- `shop-assistant:recent-searches` - Search history (max 10)
- `shop-assistant:preferences` - UI preferences

#### 5.5.6 API Interfaces (Mocked)

**Mock API Layer** for future backend integration:
```typescript
// src/lib/api/products.ts
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  // Returns filtered products from static data
  // Simulates 200-500ms delay for realistic loading states
}

export async function getProductById(id: string): Promise<Product | null> {
  // Returns single product
}

export async function searchProducts(query: string): Promise<Product[]> {
  // Client-side fuzzy search
}
```

This abstraction allows easy backend integration later without changing components.

#### 5.5.7 Testing Strategy

**Unit Tests** (Optional for demo, recommended):
- Test utilities and helper functions
- Cart logic and calculations
- Form validation functions
- Tool: Vitest or Jest

**E2E Tests** (Recommended):
- Critical user journeys:
  1. Browse → View Product → Add to Cart
  2. Cart → Checkout → Order Confirmation
  3. Search → Filter → View Product
- Tool: Playwright or Cypress
- Minimum 5 test scenarios

**Visual Regression** (Optional):
- Chromatic or Percy for component screenshots
- Storybook for component isolation

#### 5.5.8 Performance Optimization Techniques

**Code Splitting**:
- Route-based splitting (automatic with Next.js)
- Dynamic imports for heavy components (image gallery, charts)
- Separate bundle for animation libraries

**Image Optimization**:
- Next.js Image component with lazy loading
- Blur placeholders for loading states
- Responsive images with srcset

**Bundle Size Targets**:
- Initial JS bundle: < 100KB (gzipped)
- Total page weight (first load): < 500KB
- Max route-specific JS: < 50KB

**Caching Strategy**:
- Static assets: 1 year cache
- Product data: In-memory cache (no expiration needed)
- localStorage for cart/user state

#### 5.5.9 Error Handling & Boundaries

**Error Boundary Hierarchy**:
```
├── Root Error Boundary (full page fallback)
├── Layout Error Boundary (navigation intact)
├── Route Error Boundaries (per page)
└── Component Error Boundaries (critical components)
```

**Error States to Handle**:
- Image load failures (fallback placeholders)
- LocalStorage full/unavailable
- Invalid product IDs (404 page)
- Network simulation errors (mock API)
- Form validation errors

#### 5.5.10 SEO & Metadata (Demo Context)

**Dynamic Metadata** (per route):
- Product pages: Product name, description, price
- Category pages: Category name and description
- Open Graph tags for social sharing (demo purposes)
- Structured data (Product schema) using JSON-LD

**robots.txt & sitemap.xml**:
- Include even for demo (shows completeness)
- Generated programmatically from product data

#### 5.5.11 Environment Configuration

**Environment Variables** (.env.local):
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="Shop Assistant"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_SEARCH_SUGGESTIONS=true

# Mock Data Configuration
NEXT_PUBLIC_MOCK_API_DELAY=300 # ms
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12

# Analytics (Mock)
NEXT_PUBLIC_GA_ID="UA-XXXXXXXXX-X" # Optional, no real tracking
```

#### 5.5.12 Animation Library Configuration

**Framer Motion Settings**:
- Reduced motion detection automatic
- Shared layout animations for cart
- Exit animations for modal/drawer
- Optimized animation variants (reusable)

**Animation Performance**:
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `height`, `width` (use `scale` instead)
- Use `will-change` sparingly
- Request animation frame for scroll effects

#### 5.5.13 Component Architecture

**Component Categories**:
```
src/components/
├── ui/                  # Primitive components (Button, Input)
├── product/             # Product-specific (ProductCard, ProductGrid)
├── cart/                # Cart components (CartDrawer, CartItem)
├── checkout/            # Checkout flow components
├── layout/              # Layout components (Header, Footer)
└── common/              # Shared components (SearchBar, Modal)
```

**Component Design Principles**:
- Composition over inheritance
- Single responsibility
- Props interface with TypeScript
- Controlled vs. uncontrolled (prefer controlled)
- Ref forwarding where needed

#### 5.5.14 Accessibility Implementation Checklist

- [ ] Semantic HTML throughout (`<main>`, `<nav>`, `<article>`)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus management (trap in modals, restore on close)
- [ ] Skip to content link
- [ ] Color contrast testing (automated with axe-core)
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Form labels and error associations
- [ ] Live regions for cart updates (`aria-live`)
- [ ] Disabled state properly communicated

#### 5.5.15 Development Workflow

**Git Workflow**:
- Main branch: Production-ready
- Develop branch: Integration branch
- Feature branches: `feature/product-listing`, `feature/cart-drawer`
- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

**Code Review Checklist**:
- TypeScript types properly defined
- No console errors or warnings
- Responsive design tested
- Accessibility features present
- Loading states implemented
- Error handling in place

**Pre-commit Hooks** (Husky):
- ESLint check
- Prettier formatting
- TypeScript type checking
- (Optional) Unit tests

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

**Technical Assumptions**:
- [ASSUMPTION-1] Developers have Windows, macOS, or Linux with ability to run .NET 10 SDK
- [ASSUMPTION-2] SQL Server (LocalDB, Developer, or Docker) can be installed locally
- [ASSUMPTION-3] Developers have Node.js 20.x and pnpm installed
- [ASSUMPTION-4] Localhost ports 3000, 5000, 5001, and 1433 are available
- [ASSUMPTION-5] Developers have basic familiarity with React/Next.js and C#/.NET

**Data Assumptions**:
- [ASSUMPTION-6] Demo catalog of 50-100 products is sufficient for demonstration purposes
- [ASSUMPTION-7] Mocked user authentication is acceptable (no real security needed)
- [ASSUMPTION-8] Product images can be stored as URLs or local file paths
- [ASSUMPTION-9] Cart can use localStorage or database (hybrid approach acceptable)
- [ASSUMPTION-10] Orders don't need real payment processing

**Business Assumptions**:
- [ASSUMPTION-11] This is a demo/learning project, not a production system
- [ASSUMPTION-12] Simplicity is prioritized over feature completeness
- [ASSUMPTION-13] Local development is primary use case (not cloud deployment)
- [ASSUMPTION-14] Demo audience understands this is a simplified e-commerce implementation

### 6.2 Constraints

**Technical Constraints**:
- [CONSTRAINT-1] Must use .NET 10 for backend (latest LTS version)
- [CONSTRAINT-2] Must use SQL Server for database (LocalDB, Developer, or Docker)
- [CONSTRAINT-3] Must maintain existing Next.js frontend (no framework changes)
- [CONSTRAINT-4] Must run entirely on localhost without cloud dependencies
- [CONSTRAINT-5] Backend must be RESTful API (no GraphQL, gRPC, etc.)
- [CONSTRAINT-6] Database must use Entity Framework Core (code-first approach)

**Complexity Constraints**:
- [CONSTRAINT-7] Keep backend simple - no microservices, no complex patterns
- [CONSTRAINT-8] Avoid over-engineering - prefer simple solutions over clever ones
- [CONSTRAINT-9] No authentication/authorization complexity (mock only)
- [CONSTRAINT-10] No caching layers, message queues, or background jobs

**Development Constraints**:
- [CONSTRAINT-11] Setup must be quick - target < 10 minutes for full stack
- [CONSTRAINT-12] Documentation must be clear and beginner-friendly
- [CONSTRAINT-13] Code must be readable and easy to understand
- [CONSTRAINT-14] No production deployment requirements (local only)

**Timeline Constraints**:
- [CONSTRAINT-15] Backend integration should not break existing frontend features
- [CONSTRAINT-16] Maintain feature parity with current mocked-data implementation
- [CONSTRAINT-17] Gradual migration - frontend should work with backend disabled initially

---

## 7. Technical Risks & Mitigation Strategies

### 7.1 Identified Risks

#### 7.1.1 Backend Integration Risks (NEW)

**Risk**: Database connection failures during demo
- **Impact**: Critical - Application unusable
- **Probability**: Medium
- **Mitigation**:
  - Test database connectivity before demo
  - Provide clear error messages with troubleshooting steps
  - Have fallback to mocked data mode
  - Document common SQL Server setup issues
  - Test with all three database options (LocalDB, Developer, Docker)

**Risk**: CORS issues between frontend (port 3000) and backend (port 5000)
- **Impact**: High - API calls fail
- **Probability**: High
- **Mitigation**:
  - Configure CORS properly in backend
  - Test cross-origin requests early
  - Document CORS configuration clearly
  - Include CORS troubleshooting in setup guide

**Risk**: Entity Framework migrations fail or database schema issues
- **Impact**: High - Cannot initialize database
- **Probability**: Medium
- **Mitigation**:
  - Test migrations on fresh database
  - Provide rollback instructions
  - Include database reset script
  - Clear error messages for migration failures
  - Document manual migration steps

**Risk**: API endpoint design doesn't match frontend needs
- **Impact**: High - Requires backend rework
- **Probability**: Medium
- **Mitigation**:
  - Design API contract before implementation
  - Review endpoints with frontend developers
  - Create API interface/contract document
  - Use Swagger for early API testing
  - Iterative development with frequent testing

**Risk**: Performance degradation with API calls vs mocked data
- **Impact**: Medium - Slower user experience
- **Probability**: Low
- **Mitigation**:
  - Implement database indexes
  - Use async/await throughout
  - Add API response caching where appropriate
  - Monitor API response times
  - Optimize database queries

**Risk**: .NET 10 SDK or SQL Server not installed on developer machine
- **Impact**: High - Cannot run backend
- **Probability**: High (first-time setup)
- **Mitigation**:
  - Clear prerequisites documentation
  - Provide installation links and instructions
  - Script to check for prerequisites
  - Support multiple SQL Server options (LocalDB/Developer/Docker)
  - Video walkthrough of setup process

#### 7.1.2 Performance Risks

**Risk**: Animation performance degradation on lower-end devices
- **Impact**: High - Damages demo credibility
- **Probability**: Medium
- **Mitigation**:
  - Use CSS transforms and GPU acceleration
  - Implement `prefers-reduced-motion` detection
  - Test on mid-range devices (not just high-end)
  - Provide performance mode toggle
  - Lazy load animation libraries

**Risk**: Large bundle size from animation libraries and components
- **Impact**: Medium - Slow initial load
- **Probability**: High
- **Mitigation**:
  - Code splitting by route
  - Tree-shaking for unused code
  - Use lightweight alternatives (CSS animations where possible)
  - Dynamic imports for non-critical features
  - Bundle analysis in CI/CD

**Risk**: Image loading impacts perceived performance
- **Impact**: High - Poor first impression
- **Probability**: Medium
- **Mitigation**:
  - Implement skeleton screens
  - Use progressive image loading
  - Optimize image formats (WebP)
  - Preload critical images
  - Lazy load below-fold images

#### 6.1.2 Data & State Management Risks

**Risk**: LocalStorage quota exceeded (5-10MB limit)
- **Impact**: Medium - Cart data loss
- **Probability**: Low
- **Mitigation**:
  - Monitor storage usage
  - Implement cleanup for old data
  - Graceful degradation (in-memory fallback)
  - Clear error messaging to user

**Risk**: State synchronization issues across components
- **Impact**: Medium - Inconsistent UI state
- **Probability**: Medium
- **Mitigation**:
  - Use centralized state management (Context/Zustand)
  - Single source of truth for cart state
  - Immutable state updates
  - Thorough state testing

#### 6.1.3 Browser Compatibility Risks

**Risk**: CSS features not supported in Safari (especially iOS)
- **Impact**: High - Broken layout on iPhone demos
- **Probability**: Medium
- **Mitigation**:
  - Test early on Safari/iOS (not just Chrome DevTools)
  - Use PostCSS with autoprefixer
  - Provide fallbacks for modern CSS
  - Reference caniuse.com for features

**Risk**: LocalStorage behavior differences across browsers
- **Impact**: Medium - Cart persistence issues
- **Probability**: Low
- **Mitigation**:
  - Abstract storage layer with fallbacks
  - Test in private/incognito modes
  - Handle storage access exceptions

#### 6.1.4 Development & Timeline Risks

**Risk**: Scope creep with "just one more feature"
- **Impact**: High - Delays launch, incomplete polish
- **Probability**: High
- **Mitigation**:
  - Strict adherence to MVP scope
  - Feature freeze after Phase 2
  - "Demo Day" deadline as forcing function
  - Maintain "nice-to-have" backlog separately

**Risk**: Over-engineering for a demo application
- **Impact**: Medium - Wasted development time
- **Probability**: High
- **Mitigation**:
  - Remember: mocked data, no real backend
  - Avoid premature abstractions
  - Choose simplicity over flexibility
  - Time-box complex features

**Risk**: Design-development handoff gaps
- **Impact**: Medium - Inconsistent implementation
- **Probability**: Medium
- **Mitigation**:
  - Establish design system tokens early
  - Regular design reviews during development
  - Use Storybook for component alignment
  - Designer access to dev environment

#### 6.1.5 Demo-Specific Risks

**Risk**: Network dependency for external assets (fonts, images)
- **Impact**: Critical - Demo fails without internet
- **Probability**: Medium
- **Mitigation**:
  - Self-host all critical assets
  - Bundle fonts locally
  - No external API dependencies
  - Test in offline mode

**Risk**: Demo scenario not rehearsed/scripted
- **Impact**: High - Awkward live presentation
- **Probability**: Medium
- **Mitigation**:
  - Create documented demo script
  - Pre-populate cart for specific scenarios
  - Bookmark key pages
  - Practice run-through before presentations

### 6.2 Technical Recommendations

#### 6.2.1 Technology Stack (Final Recommendation)

**Recommended**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion

**Rationale**:
- ✅ Next.js App Router: Best-in-class routing and performance
- ✅ TypeScript: Type safety reduces runtime bugs in demo
- ✅ Tailwind CSS: Rapid UI development with consistent design
- ✅ Framer Motion: Production-ready animations with reduced motion support
- ✅ Vercel deployment: Zero-config, optimized for Next.js
- ✅ Strong ecosystem and documentation
- ✅ Easy to showcase modern best practices

**Alternative Stack** (if team prefers):
- Vite + React + TypeScript + Tailwind CSS + Framer Motion
  - Faster dev server
  - More lightweight
  - Requires manual routing (React Router)

#### 6.2.2 Component Library Decision

**Recommended**: Headless UI + Custom Components

**Rationale**:
- ✅ Full design control (critical for premium feel)
- ✅ Headless UI provides accessible primitives
- ✅ Lightweight (no heavy CSS frameworks)
- ✅ Demonstrates custom component development

**Not Recommended**:
- ❌ Material UI / Ant Design: Too opinionated, hard to customize
- ❌ Fully custom from scratch: Time-consuming, reinventing accessibility

#### 6.2.3 Animation Strategy

**Recommended Approach**:
1. CSS transitions for simple states (hover, focus)
2. Framer Motion for complex animations (modals, page transitions)
3. React Spring for physics-based animations (optional, if time permits)

**Animation Budget**:
- ~30KB for Framer Motion (gzipped)
- Keep animation code under 10KB total (excluding library)

#### 6.2.4 Image Strategy

**Recommended**:
- **Source**: Unsplash API (free, high-quality)
- **Storage**: Download and commit to repo (avoid external dependency)
- **Organization**: `/public/images/products/{category}/{product-id}/`
- **Formats**: WebP primary, JPEG fallback
- **Tooling**: Next.js Image component (automatic optimization)

#### 6.2.5 Testing Recommendation

**Minimum Viable Testing**:
- ✅ Manual testing checklist (documented)
- ✅ Browser compatibility testing (Chrome, Safari, Firefox)
- ✅ Responsive testing (mobile, tablet, desktop)
- ✅ Performance testing (Lighthouse CI)

**Recommended (if time permits)**:
- ✅ Playwright E2E for critical paths
- ✅ Accessibility audit with axe DevTools
- ⚠️ Unit tests (low priority for demo)

#### 6.2.6 Development Timeline Recommendation

**Realistic Timeline**: 5-6 weeks (1 developer) or 3-4 weeks (2 developers)

**Week-by-Week Breakdown**:
- **Week 1**: Setup, design system, component library, mock data structure
- **Week 2**: Product listing, filtering, product detail page
- **Week 3**: Cart functionality, navigation, search
- **Week 4**: Checkout flow, homepage, responsive design
- **Week 5**: Animations, polish, performance optimization
- **Week 6**: Testing, bug fixes, demo preparation

**Critical Path Items** (must not slip):
- Design system tokens and components (Week 1)
- Product listing with filtering (Week 2)
- Cart and checkout (Week 3)
- Responsive design (Week 4)

### 6.3 Architecture Recommendations

#### 6.3.1 Project Structure

```
shop-assistant/
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── categories/
│   │   └── placeholders/
│   └── fonts/
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── (shop)/         # Shop layout group
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── layout/
│   ├── lib/
│   │   ├── api/            # Mock API layer
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── types/
│   ├── data/               # Static JSON data
│   │   ├── products.json
│   │   ├── categories.json
│   │   └── reviews.json
│   ├── context/            # React Context providers
│   │   ├── CartContext.tsx
│   │   └── UserContext.tsx
│   └── styles/
│       └── globals.css
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

#### 6.3.2 Design System Implementation

**Create design tokens file early**:
```typescript
// src/lib/design-tokens.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  },
  // ...
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  // ...
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', '1rem'],
    // ...
  },
};
```

**Configure Tailwind to use tokens**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: colors,
      spacing: spacing,
      fontFamily: typography.fontFamily,
    },
  },
};
```

#### 6.3.3 Data Flow Architecture

```
User Interaction
      ↓
Component (View)
      ↓
Hook/Context (Controller)
      ↓
Mock API Layer (Model)
      ↓
Static JSON Data (Data Source)
      ↓
LocalStorage (Persistence)
```

This architecture allows:
- Easy testing of business logic
- Clear separation of concerns
- Future backend integration (swap mock API with real API)

### 6.4 Quality Gates

#### 6.4.1 Definition of Done (Per Feature)

- [ ] Feature works on Chrome, Firefox, Safari
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] TypeScript types defined (no `any`)
- [ ] Accessibility reviewed (keyboard nav, screen reader)
- [ ] Code reviewed by team member
- [ ] Tested on real devices (not just DevTools)

#### 6.4.2 Pre-Launch Checklist

- [ ] Lighthouse score > 90 (Performance, A11y, Best Practices, SEO)
- [ ] No runtime errors in console
- [ ] All images optimized and loading
- [ ] Cart persists across sessions
- [ ] Search functionality working
- [ ] Filtering accurate
- [ ] Checkout flow complete
- [ ] Mobile navigation functional
- [ ] Animations respect reduced motion
- [ ] Demo script documented
- [ ] README with setup instructions
- [ ] Deployed to production URL
- [ ] Custom domain configured (optional)
- [ ] Analytics placeholder (if demo includes)

---

## 7. Success Metrics

### 6.1 Demo Success Indicators

#### 6.1.1 Immediate Impact
- **"Wow Factor"**: Positive verbal reactions during demo
- **Visual Polish**: Zero obvious bugs or visual glitches
- **Smooth Performance**: No lag, stuttering, or broken animations
- **Professional Appearance**: Looks production-ready

#### 6.1.2 Engagement Metrics
- **Demo Completion Rate**: Presenter can complete full user journey
- **Question Quality**: Audience asks about "how it's built" not "why isn't this working"
- **Time to Wow**: User impression formed within 10 seconds
- **Interaction Success**: All click paths work as expected

#### 6.1.3 Technical Metrics
- **Performance Score**: Lighthouse score > 90
- **Accessibility Score**: Lighthouse a11y > 90
- **No Console Errors**: Clean browser console
- **Cross-Browser Compatibility**: Works in Chrome, Firefox, Safari, Edge

### 6.2 Quality Benchmarks

#### 6.2.1 Visual Quality
- Pixel-perfect implementation of designs
- Consistent spacing and alignment
- Smooth animations at 60fps
- High-quality imagery throughout

#### 6.2.2 Functional Quality
- All features work as intended
- Proper error handling
- State persistence across sessions
- Responsive across all device sizes

#### 6.2.3 Code Quality
- Maintainable, readable code
- Reusable components
- Type-safe where applicable
- Well-documented

---

## 8. Out of Scope

### 8.1 Explicitly Excluded Features

#### 7.1.1 Backend Integration
- ❌ Real API calls
- ❌ Database connections
- ❌ Server-side logic
- ❌ Real authentication/authorization
- ❌ Payment processing
- ❌ Email services

#### 7.1.2 Advanced Commerce Features
- ❌ Inventory management
- ❌ Multi-currency support
- ❌ Tax calculation (only mocked)
- ❌ Real-time stock updates
- ❌ Advanced recommendation algorithms
- ❌ A/B testing
- ❌ Analytics integration

#### 7.1.3 User Management
- ❌ Real user registration
- ❌ Password reset flows
- ❌ Email verification
- ❌ Two-factor authentication
- ❌ OAuth integration

#### 7.1.4 Content Management
- ❌ Admin panel
- ❌ Product upload interface
- ❌ CMS integration
- ❌ Dynamic content updates

#### 7.1.5 Production Concerns
- ❌ Real monitoring/logging
- ❌ Error tracking services
- ❌ CDN configuration
- ❌ Rate limiting
- ❌ Security hardening beyond basics
- ❌ GDPR compliance features
- ❌ Real customer support integration

### 8.2 Future Considerations

Features that could be added in future iterations if the demo is expanded:
- Advanced search with filters (faceted search)
- Product comparison feature
- 360° product views
- AR try-on experiences
- Live chat simulation
- Social sharing capabilities
- Gift card functionality
- Subscription/recurring orders

---

## 9. Development Phases

### Phase 1: Frontend Foundation (Week 1-2) - COMPLETED ✅
- Project setup and configuration
- Design system and component library
- Mocked product data structure
- Basic routing and navigation
- Product listing and filtering
- Product detail pages
- Shopping cart functionality
- Basic checkout flow
- Animations and microinteractions
- Responsive design
- Performance optimization

**Status**: Frontend-only implementation is complete and running on localhost:3000

### Phase 2: Backend & Database (Week 3-4) - NEW
**Week 3: Backend API Setup**
- .NET 10 Web API project setup
- Entity Framework Core configuration
- SQL Server database setup (LocalDB/Developer/Docker)
- Database schema design and migrations
- Seed data generation (50-100 products)
- Basic CRUD endpoints for Products
- Categories API endpoints
- Swagger/OpenAPI documentation
- CORS configuration
- Error handling middleware

**Week 4: Integration & Advanced Features**
- Frontend API client implementation
- Replace mocked data with real API calls
- Loading and error state handling
- Cart API endpoints (optional)
- Orders API endpoints
- Checkout integration with backend
- End-to-end testing of full stack
- Performance tuning
- API response optimization
- Database query optimization

### Phase 3: Testing & Polish (Week 5)
- Integration testing (frontend + backend + database)
- Cross-browser testing
- Error scenario testing
- Database reset and seed scripts
- Setup documentation and README updates
- Demo scenario testing
- Performance benchmarking
- Bug fixes and refinements

### Phase 4: Documentation & Deployment (Week 6)
- Comprehensive setup guide
- API documentation finalization
- Architecture diagrams
- Demo script updates
- Code comments and inline documentation
- Optional: Docker Compose for easy setup
- Optional: Local deployment with IIS/Kestrel
- Final testing and validation

**Total Timeline**: 6 weeks (with backend integration)
- Weeks 1-2: Frontend (DONE)
- Weeks 3-4: Backend + Integration (NEW)
- Week 5: Testing & Polish
- Week 6: Documentation & Finalization

---

## 10. Success Metrics (Updated)

### 10.1 Phase 2 Success Criteria

**Backend Completeness**:
- [ ] All API endpoints functional and documented
- [ ] Database schema created and seeded with demo data
- [ ] Swagger UI accessible and showing all endpoints
- [ ] CORS properly configured
- [ ] Error handling in place
- [ ] API response times < 500ms for listing, < 200ms for single items

**Integration Success**:
- [ ] Frontend successfully calls backend APIs
- [ ] No mocked data remaining (all from database)
- [ ] Loading states displayed during API calls
- [ ] Error states handled gracefully
- [ ] Cart functionality preserved (localStorage or API)
- [ ] Checkout creates orders in database
- [ ] No regression in frontend features

**Developer Experience**:
- [ ] Setup takes < 10 minutes from scratch
- [ ] Clear error messages when setup fails
- [ ] Documentation covers all setup scenarios
- [ ] Both database options (LocalDB and Docker) tested
- [ ] Prerequisites clearly documented
- [ ] Troubleshooting guide available

**Code Quality**:
- [ ] Backend code follows .NET conventions
- [ ] Async/await used throughout
- [ ] Proper separation of concerns
- [ ] No over-engineering
- [ ] Clear variable and method names
- [ ] Comments where needed

---

## 11. Design Inspiration & References

### 11.1 Visual Benchmarks
Look to these sites for inspiration (aesthetic only):
- **Apple Store**: Premium product presentation
- **Stripe**: Clean, modern design language
- **Vercel**: Smooth animations and interactions
- **Nike**: Dynamic product imagery
- **Glossier**: Minimal, elegant e-commerce

### 11.2 UX Patterns
- Familiar e-commerce conventions (don't reinvent basics)
- Clear CTAs and user paths
- Delightful but not distracting animations
- Accessibility-first approach

---

## 12. Technical Review Summary

### 12.1 Dev Lead Assessment

**Review Date**: January 27, 2026  
**Reviewer**: Development Lead  
**Status**: ✅ **APPROVED FOR BACKEND IMPLEMENTATION**

#### Updated Assessment (Version 2.0)
The PRD has been updated to include backend (.NET 10 API) and database (SQL Server) layers while maintaining the simplicity principle. All additions are feasible and align with the project goals.

#### Key Changes from Version 1.0:
1. ✅ Added .NET 10 Web API with RESTful endpoints
2. ✅ Added SQL Server database with simple schema
3. ✅ Defined API contract and response formats
4. ✅ Updated technical architecture to three-layer model
5. ✅ Added backend-specific risks and mitigations
6. ✅ Updated development phases to include backend work
7. ✅ Added assumptions and constraints
8. ✅ Added high-level requirements for backend
9. ✅ Added user stories for backend integration
10. ✅ Maintained simplicity as core principle

#### Technical Feasibility: **CONFIRMED**
All backend requirements are achievable with .NET 10 and SQL Server. The architecture remains simple and appropriate for a demo/learning project.

#### Previous Assessment (Version 1.0)

**Review Date**: January 9, 2026  
**Reviewer**: Development Lead  
**Status**: ✅ **APPROVED FOR ARCHITECTURE PHASE**

#### Technical Feasibility: **CONFIRMED**
All requirements are achievable with modern web technologies. The scope is realistic for a 5-6 week timeline with 1-2 developers.

#### Recommended Technology Stack:
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **State Management**: React Context + localStorage
- **Deployment**: Vercel
- **UI Primitives**: Headless UI

#### Key Technical Additions:
1. ✅ Detailed data schemas and mock API interfaces
2. ✅ Browser compatibility matrix
3. ✅ Performance optimization strategies
4. ✅ Testing strategy and quality gates
5. ✅ Risk identification and mitigation plans
6. ✅ Project structure and architecture recommendations
7. ✅ Image specifications and asset requirements
8. ✅ Error handling and accessibility implementation
9. ✅ Environment configuration
10. ✅ Development workflow and quality checklist

#### Critical Success Factors:
1. **Early design system implementation** - Week 1 priority
2. **Performance testing throughout** - Not just at the end
3. **Safari/iOS testing early** - Don't wait until final week
4. **Strict scope control** - No feature creep after Phase 2
5. **Demo rehearsal** - Practice presentation before go-live

#### Next Steps for Architecture Team:
1. Create detailed component diagram
2. Design mock data structure (products, categories, reviews)
3. Define routing strategy
4. Create wireframes for responsive breakpoints
5. Establish CI/CD pipeline
6. Set up development environment

#### Go/No-Go Decision: **GO** 🟢

The PRD is now **technically complete** and ready for the architecture and planning phases. All critical technical gaps have been addressed. The team can proceed with confidence.

---

## 13. Appendix

### 13.1 Glossary
- **CTA**: Call to Action
- **SKU**: Stock Keeping Unit
- **UX**: User Experience
- **UI**: User Interface
- **A11y**: Accessibility
- **FCP, LCP, TTI**: Performance metrics (Core Web Vitals)
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **CORS**: Cross-Origin Resource Sharing
- **EF Core**: Entity Framework Core (ORM for .NET)
- **DTO**: Data Transfer Object
- **CRUD**: Create, Read, Update, Delete
- **ORM**: Object-Relational Mapping
- **LocalDB**: Lightweight SQL Server for development
- **Swagger**: API documentation tool (OpenAPI)

### 13.2 Open Questions (Updated for Version 2.0)
- [x] ~~Preferred tech stack?~~ RESOLVED: Next.js + .NET 10 + SQL Server
- [x] ~~Timeline constraints?~~ RESOLVED: 6 weeks total (2 weeks done, 4 weeks remaining)
- [ ] Database option preference: LocalDB vs Developer Edition vs Docker?
- [ ] Cart persistence: localStorage (simpler) or database API (full-stack)?
- [ ] Authentication: Mock only or add simple session-based auth?
- [ ] Deployment target: Local only or add Azure deployment guide?
- [ ] CI/CD setup: Required or optional?
- [ ] Testing coverage: Manual only or add automated tests?

### 13.3 Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Design Lead | | | |

---

**Document End**

*For questions or feedback on this PRD, please contact the product team.*
