# ADR 005: Mock Data Strategy

**Date**: January 9, 2026  
**Status**: Accepted  
**Deciders**: Development Team, Product Owner

---

## Context

Shop Assistant is a demo application requiring realistic e-commerce data without backend dependencies. The mock data strategy must provide:
- **Product Catalog**: 80-100 products across 6 categories
- **Product Details**: Names, descriptions, specs, images, pricing, ratings
- **Reviews**: Mock customer reviews with ratings
- **Categories & Brands**: Organized taxonomy
- **User Data**: Mock user profiles and order history

Key requirements:
- **Zero Backend Dependencies**: Must work completely offline after initial load
- **Demo Quality**: Data must look professional and realistic
- **Performance**: Fast data access without API latency
- **Maintainability**: Easy to update/extend product catalog
- **Realistic Behavior**: Simulate async operations for loading states

---

## Options Considered

### Option 1: Static JSON Files + TypeScript Interfaces
**Pros**:
- Simple and straightforward
- Type-safe with TypeScript interfaces
- Easy version control (Git-friendly)
- Fast access (no parsing overhead)
- Easy to hand-edit
- No external dependencies
- Works offline immediately

**Cons**:
- Large JSON files can be unwieldy
- Manual maintenance required
- No data generation tools built-in
- Harder to create variations

### Option 2: JSON Generator Library (e.g., Faker.js)
**Pros**:
- Programmatic data generation
- Realistic fake data (names, descriptions)
- Easy to scale to more products
- Repeatable with seed values
- Can generate variations
- Good for testing

**Cons**:
- Runtime dependency (~500KB for Faker.js)
- Generated data less curated than hand-crafted
- May need post-processing for quality
- Not suitable for production bundle (dev-only)
- Inconsistent data between runs without seed

### Option 3: MSW (Mock Service Worker) + Mocked API
**Pros**:
- Simulates real API calls
- Network tab shows requests
- Easy to add latency simulation
- Smooth migration path to real backend
- Intercepts fetch calls
- Great developer experience

**Cons**:
- Additional complexity (service worker setup)
- ~10KB additional bundle
- Overkill for static demo
- Service worker registration quirks
- Not necessary without real API

---

## Decision

**Selected**: Static JSON Files + TypeScript Interfaces + Data Generator Script (Build-time)

**Hybrid Approach**:
- **Build-time Generation**: Use Faker.js/custom script to generate `products.json` during development
- **Commit Generated Data**: Check generated JSON into Git for reproducibility
- **Runtime**: Import static JSON (zero runtime dependencies)
- **Type Safety**: TypeScript interfaces ensure data structure correctness
- **Mock API Layer**: Thin abstraction that reads from JSON files

**Rationale**:
1. **Zero Runtime Overhead**: Static JSON import, no libraries in production bundle
2. **Best of Both Worlds**: Use generation tools for scale, commit results for consistency
3. **Offline-First**: No service worker complexity, works immediately
4. **Type Safety**: TypeScript interfaces prevent data structure errors
5. **Demo Quality**: Can manually curate generated data for better realism
6. **Version Control**: JSON in Git provides audit trail and easy rollback
7. **Fast Access**: Direct imports, no parsing or network overhead
8. **Future Migration**: Mock API layer abstracts data source for easy backend swap

---

## Consequences

### Positive
- Zero production dependencies for data
- Instant data access (no async loading needed, but simulated for UX)
- Complete offline functionality
- Type-safe data structures with TypeScript
- Easy to inspect and modify data
- Reproducible data across environments
- Can curate high-quality demo scenarios

### Negative
- Initial setup requires data generation script
- Manual curation needed for best quality
- Large JSON files in Git (mitigated by good structure)
- Updates require re-running generator or manual edits

### Neutral
- Data generator script in `/scripts` (dev dependency)
- Generated JSON committed to `/src/data`
- Mock API layer provides abstraction for future backend
- Simulated delay for loading states (300ms) maintains realistic UX

---

## Implementation Notes

**Data Structure**:
```
src/data/
├── products.json          # 80-100 products
├── categories.json        # 6 main categories
├── brands.json           # 10-12 brands
├── reviews.json          # 200-300 reviews
└── users.json            # Mock user profiles
```

**TypeScript Interfaces**:
```typescript
// src/lib/types/product.ts
export interface Product {
  id: string;                    // "prod_001"
  slug: string;                  // "premium-wireless-headphones"
  name: string;
  brand: string;
  category: CategoryType;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;              // "USD"
  rating: number;                // 0-5 (one decimal)
  reviewCount: number;
  images: string[];              // URLs to local assets
  thumbnail: string;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  sku: string;
  tags: string[];
  createdAt: string;             // ISO date
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

**Mock API Layer**:
```typescript
// src/lib/api/products.ts
import productsData from '@/data/products.json';
import { Product } from '@/lib/types/product';

// Simulate network delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(300); // Simulate API latency
  
  let products = productsData as Product[];
  
  // Apply filters
  if (filters?.category) {
    products = products.filter(p => p.category === filters.category);
  }
  
  if (filters?.minPrice || filters?.maxPrice) {
    products = products.filter(p => 
      p.price >= (filters.minPrice || 0) && 
      p.price <= (filters.maxPrice || Infinity)
    );
  }
  
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  const products = productsData as Product[];
  return products.find(p => p.id === id) || null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(250);
  const products = productsData as Product[];
  const lowerQuery = query.toLowerCase();
  
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery)
  );
}
```

**Data Generation Script** (Build-time):
```typescript
// scripts/generate-data.ts
import { faker } from '@faker-js/faker';
import fs from 'fs';

const categories: CategoryType[] = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books'];
const brands = ['TechPro', 'StyleCo', 'HomeEssentials', 'BeautyBliss', 'SportMax', 'ReadWell'];

function generateProduct(id: number): Product {
  const category = faker.helpers.arrayElement(categories);
  const brand = faker.helpers.arrayElement(brands);
  const price = faker.number.float({ min: 19.99, max: 599.99, precision: 0.01 });
  
  return {
    id: `prod_${String(id).padStart(3, '0')}`,
    slug: faker.helpers.slugify(faker.commerce.productName()),
    name: faker.commerce.productName(),
    brand,
    category,
    price,
    originalPrice: Math.random() > 0.7 ? price * 1.25 : undefined,
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    reviewCount: faker.number.int({ min: 10, max: 5000 }),
    images: Array(4).fill(0).map(() => `/images/products/placeholder-${faker.number.int(1, 20)}.jpg`),
    thumbnail: `/images/products/placeholder-${faker.number.int(1, 20)}.jpg`,
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentence(),
    // ... more fields
  };
}

const products = Array(100).fill(0).map((_, i) => generateProduct(i + 1));
fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
```

**Usage in Components**:
```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/api/products';

export default async function ProductsPage() {
  const products = await getProducts(); // Server Component
  
  return <ProductGrid products={products} />;
}
```

**Image Strategy**:
- Use curated images from Unsplash (download and commit to `/public/images/products/`)
- Organize by category: `/public/images/products/electronics/`, etc.
- Fallback placeholder images for missing assets
- Next.js Image component for optimization

---

## Related Decisions
- [ADR-001: Framework Selection](001-framework-selection.md)
- [ADR-004: State Management](004-state-management.md)
