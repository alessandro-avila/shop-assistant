# 🛍️ ShopAssistant - Premium E-Commerce Demo

A modern, full-featured e-commerce demo application built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Designed for live presentations and demonstrations of modern web development best practices.

## ✨ Features

### Core Functionality
- **Product Catalog**: Browse 10+ products across 6 categories
- **Advanced Filtering**: Filter by category, price, rating, and brand
- **Product Search**: Real-time search with debounced queries
- **Shopping Cart**: Persistent cart with localStorage
- **Multi-Step Checkout**: Complete checkout flow with form validation
- **Order Confirmation**: Success page with order details

### User Experience
- **Premium Design**: Clean, modern UI with custom color palette
- **Smooth Animations**: Framer Motion animations throughout
- **Fully Responsive**: Mobile-first design (mobile, tablet, desktop)
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance Optimized**: Fast page loads with Next.js optimizations

### Technical Highlights
- **Zero Backend**: All data mocked with static JSON files
- **Type Safe**: Full TypeScript coverage with strict mode
- **State Management**: React Context API with useReducer
- **Image Optimization**: Next.js Image component with lazy loading
- **SEO Ready**: Dynamic metadata and semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- pnpm (recommended) or npm

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <your-repo-url>
   cd shop-assistant
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
shop-assistant/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── products/            # Product listing and details
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   └── search/              # Search page
├── components/
│   ├── ui/                  # Reusable UI primitives
│   ├── product/             # Product-specific components
│   ├── layout/              # Header, Footer, Navigation
│   └── cart/                # Cart components
├── lib/
│   ├── api/                 # Mock API layer
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Helper functions
├── context/                 # React Context providers
├── data/                    # Mock JSON data
└── public/                  # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0284c7 - #0369a1)
- **Neutral**: Gray scale (#fafafa - #171717)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Heading Scale**: 3xl (30px) → 2xl → xl → lg
- **Body**: base (16px)

### Spacing
- 8px grid system
- Consistent padding and margins

## 📦 Technology Stack

### Core
- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.x

### State Management
- **Cart**: React Context + useReducer
- **Persistence**: localStorage

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (optional)

## 🛠️ Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint check
pnpm lint

# Type check
pnpm type-check
```

## 🎯 Key User Flows

### 1. Browse to Purchase
```
Homepage → Product Listing → Product Detail → Add to Cart → Checkout → Success
```

### 2. Search and Filter
```
Search → Results → Filter by Category/Price → Product Detail → Add to Cart
```

### 3. Cart Management
```
Add Items → View Cart → Update Quantities → Proceed to Checkout
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1536px
- **Large Desktop**: > 1536px

## 🎭 Demo Features

### Mock Data
- 10 realistic products across 6 categories
- Product images from Unsplash
- Realistic prices, ratings, and descriptions
- Multiple product variants (colors, sizes)

### Simulated Features
- API latency (300ms delay)
- Form validation (shipping, payment)
- Order processing (2-second delay)
- Email confirmations (mocked)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Build
```bash
pnpm build
pnpm start
```

The production build will be in the `.next` directory.

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90 (Performance, Accessibility, Best Practices)

## ♿ Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators on all focusable elements
- Screen reader friendly
- Color contrast: WCAG AA compliant

## 🎨 Animations

- Page transitions with fade-in
- Cart badge pulse animation
- Product card hover effects
- Modal/drawer slide animations
- Loading skeleton screens
- Success checkmark animation

## 📝 Future Enhancements

- [ ] Add more products (50-100)
- [ ] Implement wishlist functionality
- [ ] Add product reviews/ratings
- [ ] Product comparison feature
- [ ] Advanced search with autocomplete
- [ ] Dark mode support
- [ ] Internationalization (i18n)

## 🐛 Known Issues

- None currently - fully functional demo!

## 📚 Documentation

- [Product Requirements Document](specs/prd.md)
- [Implementation Plan](specs/PLAN.md)
- [Architecture Decisions](specs/adr/)
- [Development Guide](AGENTS.md)

## 🙏 Credits

- **Images**: [Unsplash](https://unsplash.com)
- **Icons**: Heroicons (SVG)
- **Fonts**: Google Fonts (Inter)

## 📄 License

This is a demo project for educational and presentation purposes.

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**

## 🎥 Demo

Visit the live demo: [Coming Soon]

## 📧 Contact

For questions or feedback about this demo, please reach out!

---

**Made for demonstrating modern e-commerce best practices** 🚀
