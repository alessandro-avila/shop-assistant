# Task: Frontend API Integration

**Task ID**: TASK-008  
**Priority**: P1 (Critical - Integration Required)  
**Estimated Effort**: 6-8 hours  
**Dependencies**: TASK-004, TASK-005, TASK-006  
**Status**: Not Started

---

## Description

Replace mocked data in the Next.js frontend with real API calls to the .NET backend. Implement API client utilities, update all pages to consume backend endpoints, add loading states, error handling, and ensure the user experience remains smooth throughout the integration.

---

## Dependencies

**Blocking Tasks**:
- TASK-004: Products API Implementation (provides products endpoints)
- TASK-005: Categories API Implementation (provides categories endpoints)
- TASK-006: Orders API Implementation (provides checkout endpoint)

**Blocked Tasks**: None (this is the final integration task)

---

## Technical Requirements

### 1. API Configuration

Create API configuration file:
- **File**: `lib/config.ts`
- **Content**: API base URL from environment variable
- **Default**: `http://localhost:5000/api`
- **Environment variable**: `NEXT_PUBLIC_API_URL`

Example:
```typescript
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### 2. API Client Utility

Create centralized API client:
- **File**: `lib/api/client.ts`
- **Features**:
  - Generic fetch wrapper with type safety
  - Automatic JSON parsing
  - Error handling
  - Consistent headers (Content-Type: application/json)
  - Support for GET, POST, PUT, DELETE methods
  - TypeScript generics for response types

Example structure:
```typescript
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Implementation with error handling
}
```

### 3. Products API Client

Create products API client:
- **File**: `lib/api/products.ts`
- **Functions**:
  - `getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>>`
  - `getProductById(id: string): Promise<Product>`
  - `getProductBySlug(slug: string): Promise<Product>`
  - `searchProducts(query: string): Promise<Product[]>`
  - `getFeaturedProducts(): Promise<Product[]>`
  - `getNewArrivals(): Promise<Product[]>`

### 4. Categories API Client

Create categories API client:
- **File**: `lib/api/categories.ts`
- **Functions**:
  - `getCategories(): Promise<Category[]>`
  - `getCategoryById(id: string): Promise<Category>`
  - `getCategoryBySlug(slug: string): Promise<Category>`
  - `getCategoryProducts(id: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>>`

### 5. Orders API Client

Create orders API client:
- **File**: `lib/api/orders.ts`
- **Functions**:
  - `createOrder(orderData: CreateOrderRequest): Promise<Order>`
  - `getOrderById(id: string): Promise<Order>`
  - `getOrderByNumber(orderNumber: string): Promise<Order>`

### 6. TypeScript Types

Define comprehensive TypeScript types:
- **File**: `lib/types/api.ts`
- **Types**:
  - `ApiResponse<T>` - Wrapper for API responses
  - `PaginatedResponse<T>` - Paginated data structure
  - `Product` - Product entity type
  - `Category` - Category entity type
  - `Order` - Order entity type
  - `CreateOrderRequest` - Order creation payload
  - `ProductFilters` - Query parameters for product filtering

### 7. Frontend Page Updates

Update the following pages to use API calls:

**Homepage (`app/page.tsx`)**:
- Replace mocked featured products with `getFeaturedProducts()`
- Replace mocked new arrivals with `getNewArrivals()`
- Add loading skeletons while fetching
- Add error boundary for API failures

**Products Listing Page (`app/products/page.tsx`)**:
- Replace mocked product list with `getProducts()`
- Implement filtering with query parameters
- Implement sorting with query parameters
- Implement pagination
- Add loading states (skeleton screens)
- Add error handling

**Product Detail Page (`app/products/[slug]/page.tsx`)**:
- Replace mocked product data with `getProductBySlug(slug)`
- Handle 404 errors (product not found)
- Add loading spinner
- Update related products section with API call

**Category Pages (`app/category/[slug]/page.tsx`)**:
- Replace mocked category data with `getCategoryBySlug(slug)`
- Replace mocked category products with `getCategoryProducts()`
- Maintain filtering and pagination
- Add loading states

**Checkout Page (`app/checkout/page.tsx`)**:
- Replace mocked order creation with `createOrder()`
- Show loading state on submit
- Handle API errors (show error message, allow retry)
- Redirect to success page with order number on success

**Order Confirmation Page (`app/order/[orderNumber]/page.tsx`)**:
- Fetch order details with `getOrderByNumber(orderNumber)`
- Display order information
- Handle 404 (order not found)

### 8. Loading States

Implement loading indicators:
- **Product grid**: Skeleton screen with placeholder cards
- **Product detail**: Spinner or skeleton
- **Checkout**: Button loading state ("Processing..." text, disabled button)
- Use consistent loading patterns across all pages

### 9. Error Handling

Implement comprehensive error handling:
- **Network errors**: "Unable to connect. Please check your connection."
- **404 errors**: "Product not found" with link back to catalog
- **500 errors**: "Something went wrong. Please try again later."
- **Validation errors**: Display specific validation messages from API
- Error boundary component for uncaught errors
- Toast notifications for transient errors (optional)

### 10. Cart Management Decision

Decide on cart management approach:
- **Option A (Recommended)**: Keep cart in localStorage (simpler, no backend changes)
- **Option B**: Migrate cart to backend API (requires TASK-009: Cart API)
- Document chosen approach in README
- If Option A: No changes to cart functionality needed

### 11. Environment Configuration

Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Add `.env.example` for reference:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 12. CORS Verification

Ensure CORS is working:
- Verify backend allows `http://localhost:3000` origin
- Test API calls from browser
- Check browser console for CORS errors
- Document CORS configuration in README

---

## Acceptance Criteria

- [ ] API client utility created with error handling
- [ ] Products API client implemented with all functions
- [ ] Categories API client implemented
- [ ] Orders API client implemented
- [ ] All TypeScript types defined
- [ ] Homepage updated to use API calls
- [ ] Products listing page integrated with API
- [ ] Product detail page integrated with API
- [ ] Category pages integrated with API
- [ ] Checkout flow creates orders via API
- [ ] Order confirmation page fetches order details
- [ ] Loading states implemented on all pages
- [ ] Error handling implemented for all scenarios
- [ ] No regression in existing features
- [ ] Cart functionality maintained (localStorage or API-based)
- [ ] CORS working without errors
- [ ] Environment variables configured
- [ ] Application works with backend running
- [ ] Application fails gracefully if backend unavailable

---

## Testing Requirements

### Unit Tests (≥85% Coverage Required)

**Test Class**: `apiClientTests`
- [ ] Test apiClient handles successful responses
- [ ] Test apiClient handles 404 errors
- [ ] Test apiClient handles 500 errors
- [ ] Test apiClient handles network errors
- [ ] Test apiClient parses JSON responses correctly

**Test Class**: `productsApiClientTests`
- [ ] Test getProducts returns products
- [ ] Test getProducts handles filters
- [ ] Test getProductById returns product
- [ ] Test getProductBySlug returns product
- [ ] Test searchProducts returns results

**Test Class**: `categoriesApiClientTests`
- [ ] Test getCategories returns categories
- [ ] Test getCategoryById returns category
- [ ] Test getCategoryProducts returns products

**Test Class**: `ordersApiClientTests`
- [ ] Test createOrder sends correct payload
- [ ] Test createOrder handles errors

### Integration Tests

**Test Class**: `FrontendBackendIntegrationTests`
- [ ] Test products load on homepage
- [ ] Test product filtering works end-to-end
- [ ] Test product search works
- [ ] Test product detail page loads
- [ ] Test category navigation works
- [ ] Test checkout creates order successfully
- [ ] Test order confirmation displays order

### Manual Testing Checklist
- [ ] Start backend (`dotnet run` in API project)
- [ ] Start frontend (`pnpm dev`)
- [ ] Browse homepage - verify featured/new products load
- [ ] Browse products page - verify products load
- [ ] Test filtering by category, price, rating
- [ ] Test sorting options
- [ ] Test pagination navigation
- [ ] Test search functionality
- [ ] Click product - verify detail page loads
- [ ] Add product to cart (verify cart still works)
- [ ] Complete checkout - verify order created
- [ ] View order confirmation - verify order details display
- [ ] Test with backend stopped - verify error messages
- [ ] Check browser console - no errors
- [ ] Test on mobile viewport

---

## Implementation Notes

### Migration Strategy

Recommend phased migration:
1. **Phase 1**: Migrate read-only operations (products, categories) - 3-4 hours
2. **Phase 2**: Migrate order creation (checkout) - 2-3 hours
3. **Phase 3**: Polish (loading states, error handling) - 1-2 hours

### API Client Pattern

Use factory pattern for API clients:
```typescript
// lib/api/index.ts
export * from './products';
export * from './categories';
export * from './orders';

// Usage in components
import { getProducts } from '@/lib/api';
```

### Error Handling Strategy

Use custom error types:
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
  }
}
```

### Loading State Pattern

Use React hooks for loading states:
```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  fetchProducts();
}, []);
```

### React Query Alternative

Consider using React Query / TanStack Query (optional enhancement):
- Automatic caching
- Background refetching
- Better loading/error states
- Optimistic updates

---

## Definition of Done

- [ ] All API client modules created and tested
- [ ] All pages updated to use API calls
- [ ] Loading states implemented everywhere
- [ ] Error handling implemented and tested
- [ ] No regression in existing features
- [ ] Cart functionality works (localStorage or API)
- [ ] All unit tests written and passing (≥85% coverage)
- [ ] All integration tests passing
- [ ] Manual testing completed successfully
- [ ] CORS verified working
- [ ] Environment variables documented
- [ ] Code reviewed and follows AGENTS.md standards
- [ ] README updated with backend setup instructions
- [ ] PR created and approved

---

## Related Documents

- [FRD-008: Frontend API Integration](../features/frontend-api-integration.md)
- [PRD: Section 3.6 Backend API Features](../prd.md#36-backend-api-features-new---phase-2)
- [AGENTS.md: General Engineering Standards](../../AGENTS.md)
