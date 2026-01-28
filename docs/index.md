# Shop Assistant Documentation

Welcome to the Shop Assistant documentation. This is a premium e-commerce demo website built with Next.js and ASP.NET Core.

## Quick Links

- [Getting Started](getting-started/installation.md)
- [Architecture](architecture/overview.md)
- [API Reference](api/rest-api.md)
- [Guides](guides/development.md)

## Features

### Shopping Cart Management
The shopping cart feature allows customers to:
- Add products to cart from product listing and detail pages
- View all cart items with images, prices, and quantities
- Update item quantities with +/- buttons or direct input
- Remove items from cart
- See real-time subtotal calculations
- Proceed to checkout
- Persist cart data across browser sessions (localStorage)

**Components:**
- `app/cart/page.tsx` - Main cart page
- `components/cart/cart-item.tsx` - Individual cart item display with quantity controls
- `components/cart/cart-summary.tsx` - Order summary with subtotal and checkout button
- `components/cart/empty-cart.tsx` - Empty cart state display
- `lib/hooks/use-cart.ts` - Cart state management hooks

**Key Features:**
- Responsive design (mobile, tablet, desktop)
- Quantity limits (1-100 items)
- Real-time price calculations
- Product linking to detail pages
- Smooth animations with Framer Motion
- Type-safe with TypeScript

## Technology Stack

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** React Context API
- **Package Manager:** pnpm

### Backend
- **Framework:** ASP.NET Core (.NET 8/10)
- **Language:** C#
- **Database:** SQL Server LocalDB
- **ORM:** Entity Framework Core

## Project Structure

```
shop-assistant/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities, types, hooks, API clients
│   └── context/       # React context providers
├── backend/           # ASP.NET Core API
│   ├── Controllers/   # API controllers
│   ├── Models/        # Data models
│   ├── Data/          # Database context and migrations
│   └── DTOs/          # Data transfer objects
├── docs/              # Documentation (MkDocs)
└── specs/             # Product specifications and ADRs
```

## Getting Started

See [Installation Guide](getting-started/installation.md) for setup instructions.

## Development

See [Development Guide](guides/development.md) for development workflow.
