# Shop Assistant

A brownfield e-commerce application used as a workshop demo for **SpecKit** — a structured, agent-driven software development workflow powered by GitHub Copilot. The project consists of an ASP.NET Core 10 backend API and a Next.js 14 frontend, serving as the real-world codebase that SpecKit operates on to demonstrate how AI-assisted specification, planning, and implementation work in practice.

## Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Stable baseline of the shop-assistant application |
| `feature/spec-kit/01-init` | SpecKit initialization — scaffolds the `.specify/` directory and prompt files |
| `feature/spec-kit/02-constitution` | Constitution generation — establishes project principles from codebase analysis |
| `feature/spec-kit/03-specify` | Specification — produces the feature spec and API contracts |
| `feature/spec-kit/04-clarify` | Clarification — resolves open questions and ambiguities in the spec |
| `feature/spec-kit/05-plan` | Planning — creates the implementation plan from the spec |
| `feature/spec-kit/06-tasks` | Task generation — breaks the plan into actionable task files |
| `feature/spec-kit/07-analyze` | Analysis — reviews tasks for constitution compliance and risks |
| `feature/spec-kit/08-implement` | Implementation — executes the tasks with code changes |
| `feature/spec-kit/09-final-demo` | Final demo — complete end-to-end result of the SpecKit workflow |

Each `feature/spec-kit/*` branch builds incrementally on the previous one, showing the progression through the SpecKit workflow steps. You can check out any branch to see the state of the project at that stage.

## Frontend

Modern Next.js 14 e-commerce frontend with React, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/              # Next.js 14 App Router pages
│   ├── page.tsx      # Homepage
│   ├── products/     # Product listing and detail pages
│   ├── cart/         # Shopping cart page
│   ├── checkout/     # Checkout flow
│   └── layout.tsx    # Root layout
├── components/       # React components
│   ├── ui/           # Reusable UI primitives
│   ├── product/      # Product-specific components
│   ├── cart/         # Cart components
│   └── layout/       # Layout components
├── lib/              # Utilities and helpers
│   ├── api/          # API client (for backend integration)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── context/          # React Context providers
│   └── CartContext.tsx
├── data/             # Mock data (currently used)
│   └── products.json
└── public/           # Static assets (if created)
```

## 🎨 Features

### Implemented
- ✅ Product browsing with grid layout
- ✅ Category navigation
- ✅ Product filtering (category, price, rating, brand)
- ✅ Product sorting (price, rating, name, newest)
- ✅ Search functionality
- ✅ Product detail pages
- ✅ Shopping cart (localStorage-based)
- ✅ Checkout flow (multi-step)
- ✅ Order confirmation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations (Framer Motion)
- ✅ Loading states and skeletons
- ✅ **Backend API Integration (TASK-008)** - Real-time data from .NET API
- ✅ **Error Handling** - Network errors, timeouts, API failures
- ✅ **Type-Safe API Client** - Full TypeScript support

### Cart Management
- ✅ Cart stored in localStorage (no backend required)
- ✅ Persistent across sessions
- ✅ Add, update, remove items
- ✅ Real-time product data fetching

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context + useReducer
- **Data Persistence**: localStorage (cart state)
- **Package Manager**: pnpm

## 📝 Available Scripts

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

### API Client Architecture

The frontend uses a layered API client architecture:

**Core Client** (`lib/api/client.ts`):

- Generic fetch wrapper with error handling
- Automatic JSON parsing and error responses
- Timeout management (30s default)
- Type-safe with TypeScript generics

**Feature Clients**:

- `lib/api/products.ts` - Product endpoints (list, detail, search, featured, new arrivals)
- `lib/api/categories.ts` - Category endpoints (list, detail, products by category)
- `lib/api/orders.ts` - Order endpoints (create, retrieve)

**Fallback Mode**:

- If `NEXT_PUBLIC_USE_API=false`, uses mocked data from `data/` folder
- Graceful degradation if backend is unavailable
- Simulates API latency for realistic user experience

### Integration Features

✅ **Products API**: Real-time product data from database  
✅ **Categories API**: Category navigation with product counts  
✅ **Orders API**: Order creation with backend validation  
✅ **Error Handling**: Network errors, timeouts, 404s, 500s  
✅ **Loading States**: Skeleton screens and loading indicators  
✅ **Type Safety**: Full TypeScript types matching backend DTOs  
✅ **Cart Management**: Maintained in localStorage (no backend needed)

### Backend Setup

Ensure the backend API is running before starting the frontend:

```bash
# Start backend (from project root)
cd backend
dotnet run

# Backend will be available at http://localhost:5250
```

Then start the frontend:

```bash
# Start frontend (from frontend directory)
pnpm dev

# Frontend will be available at http://localhost:3000
```

### API Endpoints Used

- `GET /api/products` - List products with filtering, sorting, pagination
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/slug/{slug}` - Get product by slug
- `GET /api/products/search?searchQuery={q}` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrival products
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{slug}` - Get category by slug
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/number/{orderNumber}` - Get order by number

### Error Handling

The frontend handles various error scenarios:

- **Network Errors**: "Unable to connect" message with fallback to mocked data
- **404 Not Found**: "Product not found" page
- **500 Server Error**: "Something went wrong" message
- **Timeout**: Request timeout after 30 seconds
- **Validation Errors**: Display specific error messages from API

**Error Boundary**: Use `<ErrorBoundary>` component to catch React errors:

```typescript
import { ErrorBoundary } from '@/components/common/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 🎯 Current Data Source

Frontend now supports **two modes**:

1. **API Mode** (default): Fetches data from .NET backend API
2. **Mock Mode**: Uses static data from `data/products.json`

Toggle between modes using `NEXT_PUBLIC_USE_API` environment variable.

## 📖 Documentation

- **[Demo Guide](DEMO_GUIDE.md)** - 5-10 minute presentation guide
- **[Demo Script](DEMO_SCRIPT.md)** - Detailed demo walkthrough
- **[Parent README](../README.md)** - Full project overview
- **[PRD](../specs/prd.md)** - Product requirements
- **[Tasks](../specs/tasks/)** - Backend integration tasks

## 🎨 Design System

- **Colors**: Defined in `tailwind.config.ts`
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run E2E tests (when implemented)
pnpm test:e2e
```

## 🚀 Deployment

Frontend can be deployed to Vercel, Netlify, or any static hosting service:

```bash
pnpm build
# Deploy the .next/ and out/ directories
```