# Quick Start Guide: Shop Assistant Development

**Last Updated**: January 9, 2026  
**PRD Version**: 2.0 (Enhanced)  
**Status**: Ready for Development

---

## 🚀 Quick Reference

### Technology Stack
```bash
Framework:  Next.js 14 (App Router)
Language:   TypeScript 5.x (strict mode)
Styling:    Tailwind CSS 3.4.x
Animations: Framer Motion
UI:         Headless UI + Custom Components
State:      React Context + localStorage
Deploy:     Vercel
```

### Setup Commands
```bash
# Create project
npx create-next-app@latest shop-assistant --typescript --tailwind --app

# Install dependencies
pnpm add framer-motion @headlessui/react
pnpm add -D @types/node

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start
```

---

## 📁 Project Structure

```
shop-assistant/
├── public/
│   ├── images/
│   │   ├── products/        # Product images (WebP + JPEG)
│   │   ├── categories/      # Category banners
│   │   └── placeholders/    # Loading placeholders
│   └── fonts/               # Self-hosted fonts
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (shop)/          # Shop layout group
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx            # Product listing
│   │   │   │   └── [id]/page.tsx       # Product detail
│   │   │   ├── cart/page.tsx
│   │   │   └── checkout/
│   │   │       ├── page.tsx            # Checkout stepper
│   │   │       └── confirmation/page.tsx
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # Button, Input, Card, Modal
│   │   ├── product/         # ProductCard, ProductGrid, ProductGallery
│   │   ├── cart/            # CartDrawer, CartItem, CartSummary
│   │   ├── checkout/        # CheckoutForm, CheckoutSteps
│   │   └── layout/          # Header, Footer, Navigation
│   ├── lib/
│   │   ├── api/             # Mock API functions
│   │   │   ├── products.ts
│   │   │   ├── cart.ts
│   │   │   └── search.ts
│   │   ├── utils/
│   │   │   ├── format.ts    # Currency, date formatting
│   │   │   └── storage.ts   # localStorage helpers
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useLocalStorage.ts
│   │   └── types/
│   │       ├── product.ts   # Product, Variant types
│   │       ├── cart.ts      # Cart, CartItem types
│   │       └── user.ts      # User, Address types
│   ├── data/                # Static JSON data
│   │   ├── products.json
│   │   ├── categories.json
│   │   ├── brands.json
│   │   └── reviews.json
│   ├── context/
│   │   ├── CartContext.tsx
│   │   └── UserContext.tsx
│   └── styles/
│       └── design-tokens.ts # Colors, spacing, typography
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System Tokens

Create `/src/styles/design-tokens.ts`:

```typescript
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
};
```

Configure `tailwind.config.js`:
```javascript
import { colors, spacing, typography } from './src/styles/design-tokens';

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      spacing,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
    },
  },
};
```

---

## 📦 Core Data Types

### Product Type
```typescript
// src/lib/types/product.ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  variants?: ProductVariant[];
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
}

export interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'material';
  name: string;
  value: string;
  priceDelta?: number;
  inStock: boolean;
}

export type CategoryType = 
  | 'Electronics' 
  | 'Fashion' 
  | 'Home & Garden' 
  | 'Beauty' 
  | 'Sports' 
  | 'Books';
```

### Cart Types
```typescript
// src/lib/types/cart.ts
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  lastModified: string;
}
```

---

## 🔧 Core Utilities

### Mock API Layer
```typescript
// src/lib/api/products.ts
import productsData from '@/data/products.json';
import { Product } from '@/lib/types/product';

// Simulate API delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}): Promise<Product[]> {
  await delay(300); // Simulate network delay
  
  let filtered = productsData.products as Product[];
  
  if (filters?.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  if (filters?.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters?.brand) {
    filtered = filtered.filter(p => p.brand === filters.brand);
  }
  
  return filtered;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  
  const product = productsData.products.find(p => p.id === id);
  return product as Product || null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(250);
  
  const lowerQuery = query.toLowerCase();
  const results = productsData.products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
  
  return results as Product[];
}
```

### localStorage Helper
```typescript
// src/lib/utils/storage.ts
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

export function setInStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage:`, error);
  }
}
```

---

## 🛒 Cart Context Setup

```typescript
// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartState } from '@/lib/types/cart';
import { getFromStorage, setInStorage } from '@/lib/utils/storage';

interface CartContextType {
  cart: CartState;
  addToCart: (productId: string, quantity?: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'shop-assistant:cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => 
    getFromStorage<CartState>(STORAGE_KEY, { items: [], lastModified: new Date().toISOString() })
  );

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    setInStorage(STORAGE_KEY, cart);
  }, [cart]);

  const addToCart = (productId: string, quantity = 1, variantId?: string) => {
    setCart(prev => {
      const existingItem = prev.items.find(
        item => item.productId === productId && item.variantId === variantId
      );

      if (existingItem) {
        return {
          items: prev.items.map(item =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          lastModified: new Date().toISOString(),
        };
      }

      return {
        items: [...prev.items, { productId, variantId, quantity, addedAt: new Date().toISOString() }],
        lastModified: new Date().toISOString(),
      };
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => ({
      items: prev.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      ),
      lastModified: new Date().toISOString(),
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart(prev => ({
      items: prev.items.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      ),
      lastModified: new Date().toISOString(),
    }));
  };

  const clearCart = () => {
    setCart({ items: [], lastModified: new Date().toISOString() });
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

---

## 🎭 Animation Guidelines

### Framer Motion Best Practices

```typescript
// Example: Product Card Hover Animation
import { motion } from 'framer-motion';

export function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="card"
    >
      {/* Card content */}
    </motion.div>
  );
}

// Example: Cart Drawer Slide-in
export function CartDrawer({ isOpen, onClose }) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="drawer"
    >
      {/* Drawer content */}
    </motion.div>
  );
}

// Example: List Stagger Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProductGrid({ products }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Animation Rules
- ✅ Duration: 200-400ms
- ✅ Easing: `easeOut` for entrances, `easeIn` for exits
- ✅ Use `transform` and `opacity` only (GPU-accelerated)
- ✅ Respect `prefers-reduced-motion`
- ❌ No animations on `height`, `width` (use `scale` instead)

---

## 📸 Image Optimization

### Next.js Image Component
```typescript
import Image from 'next/image';

// Product image
<Image
  src={product.thumbnail}
  alt={product.name}
  width={600}
  height={600}
  className="object-cover"
  priority={false} // Set to true for above-fold images
  placeholder="blur"
  blurDataURL="/images/placeholder.png"
/>

// Hero banner
<Image
  src="/images/hero-banner.jpg"
  alt="Shop Assistant"
  fill
  className="object-cover"
  priority={true}
  quality={85}
/>
```

---

## ✅ Development Checklist

### Week 1: Foundation
- [ ] Project setup with Next.js + TypeScript
- [ ] Install dependencies (Tailwind, Framer Motion, Headless UI)
- [ ] Create design tokens file
- [ ] Configure Tailwind with custom tokens
- [ ] Set up ESLint + Prettier
- [ ] Create folder structure
- [ ] Mock data JSON files (products, categories)
- [ ] Core TypeScript types (Product, Cart, User)
- [ ] CartContext + localStorage helpers
- [ ] Basic UI components (Button, Input, Card)

### Week 2: Product Features
- [ ] Product listing page with grid
- [ ] Product card component
- [ ] Product detail page
- [ ] Image gallery with zoom
- [ ] Product filtering (category, price, brand)
- [ ] Product sorting
- [ ] Mock API layer (getProducts, getProductById)

### Week 3: Cart & Search
- [ ] Cart icon with badge in header
- [ ] Cart drawer (slide-in)
- [ ] Add to cart functionality
- [ ] Cart item component
- [ ] Quantity controls
- [ ] Cart page (full view)
- [ ] Search bar with suggestions
- [ ] Search results page

### Week 4: Checkout & Responsive
- [ ] Checkout flow (multi-step)
- [ ] Shipping information form
- [ ] Payment form (mock)
- [ ] Order confirmation page
- [ ] Mobile responsive design
- [ ] Mobile navigation (hamburger menu)
- [ ] Homepage with hero + featured products

### Week 5: Polish & Performance
- [ ] Animations (hover, transitions, stagger)
- [ ] Loading states (skeletons)
- [ ] Error states (404, empty cart)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Lighthouse audit (target >90)
- [ ] Accessibility review (keyboard nav, ARIA)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### Week 6: Launch
- [ ] E2E tests (Playwright) - critical paths
- [ ] Bug fixes
- [ ] Documentation (README)
- [ ] Demo script creation
- [ ] Deploy to Vercel
- [ ] Final QA
- [ ] Demo rehearsal

---

## 🎯 Performance Targets

| Metric | Target | Critical? |
|--------|--------|-----------|
| First Contentful Paint (FCP) | < 1.5s | ✅ Yes |
| Largest Contentful Paint (LCP) | < 2.5s | ✅ Yes |
| Time to Interactive (TTI) | < 3.5s | ⚠️ Important |
| Cumulative Layout Shift (CLS) | < 0.1 | ✅ Yes |
| First Input Delay (FID) | < 100ms | ✅ Yes |
| Lighthouse Score | > 90 | ✅ Yes |

---

## 📚 Key Resources

- **PRD**: `/specs/prd.md`
- **Technical Review**: `/docs/technical-review.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Headless UI**: https://headlessui.com/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 🆘 Common Issues & Solutions

### Issue: LocalStorage not available (SSR)
```typescript
// Always check for window
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Issue: Images not loading
- Ensure images are in `/public/images/`
- Use Next.js Image component with proper paths
- Check `next.config.js` for image domains if using external images

### Issue: Tailwind classes not applying
- Verify `content` paths in `tailwind.config.js`
- Restart dev server after config changes
- Check for conflicting CSS

### Issue: Animations janky
- Use only `transform` and `opacity`
- Check for layout shifts
- Test on real devices, not just DevTools
- Enable GPU acceleration: `transform: translateZ(0)`

---

**Happy Coding! 🚀**

Questions? Refer to the full PRD at `/specs/prd.md` or Technical Review at `/docs/technical-review.md`.
