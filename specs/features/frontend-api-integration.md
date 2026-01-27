# Feature: Frontend API Integration

**Feature ID**: FRD-008  
**Version**: 1.0  
**Status**: Not Started  
**Created**: January 27, 2026

---

## 1. Feature Overview

Replace mocked data in the Next.js frontend with real API calls to the .NET backend. Maintain existing user experience while adding loading/error states.

---

## 2. User Stories

```gherkin
As a frontend developer,
I want an API client module,
So that I can make type-safe API calls.

As a user,
I want products loaded from the database,
So that the application feels like a real e-commerce site.

As a user,
I want to see loading indicators,
So that I know data is being fetched.

As a user,
I want clear error messages,
So that I understand when something goes wrong.
```

---

## 3. Functional Requirements

### 3.1 API Client Setup

**[REQ-008.1] API Configuration**
```typescript
// lib/config.ts
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

**[REQ-008.2] API Client Utility**
```typescript
// lib/api/client.ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  const data = await response.json();
  return data;
}
```

### 3.2 Replace Mocked API Calls

**[REQ-008.3] Products API Client**
```typescript
// lib/api/products.ts
import { apiClient } from './client';

export async function getProducts(filters?: ProductFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId.toString());
  if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
  // ... other filters
  
  const response = await apiClient<ApiResponse<ProductListResponse>>(
    `/products?${queryParams}`
  );
  
  return response.data;
}

export async function getProductById(id: string) {
  const response = await apiClient<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
}

export async function searchProducts(query: string) {
  const response = await apiClient<ApiResponse<ProductListResponse>>(
    `/products/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}
```

**[REQ-008.4] Categories API Client**
```typescript
// lib/api/categories.ts
export async function getCategories() {
  const response = await apiClient<ApiResponse<Category[]>>('/categories');
  return response.data;
}
```

**[REQ-008.5] Orders API Client**
```typescript
// lib/api/orders.ts
export async function createOrder(orderData: CreateOrderRequest) {
  const response = await apiClient<ApiResponse<Order>>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return response.data;
}
```

### 3.3 Update Frontend Pages

**[REQ-008.6] Product Listing Page**
- Replace `getProducts()` mock with API call
- Add loading skeleton UI
- Add error boundary
- Maintain existing filtering/sorting functionality

**[REQ-008.7] Product Detail Page**
- Replace product fetch with API call
- Show loading spinner while fetching
- Handle 404 errors gracefully

**[REQ-008.8] Checkout Page**
- Replace order creation with API call
- Show loading state on submit
- Handle API errors (show error message)
- Redirect to success page with order number

### 3.4 Error Handling

**[REQ-008.9] API Error States**
- Network errors: "Unable to connect. Please check your connection."
- 404 errors: "Product not found."
- 500 errors: "Something went wrong. Please try again."
- Timeout: "Request timed out. Please try again."

**[REQ-008.10] Loading States**
- Skeleton screens for product grids
- Spinner for single product fetch
- Button loading state for submit actions
- Maintain responsiveness during load

---

## 4. Technical Implementation

### 4.1 TypeScript Types

```typescript
// lib/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    details: string;
  };
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### 4.2 React Query (Optional Enhancement)

```typescript
// Using React Query for caching and state management
import { useQuery } from '@tanstack/react-query';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 4.3 Error Boundary Component

```typescript
// components/common/error-boundary.tsx
'use client';

export function ErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <div>Something went wrong. Please refresh the page.</div>;
  }

  return children;
}
```

---

## 5. Migration Strategy

### Phase 1: Setup (1 hour)
1. Create API client utility
2. Add API_BASE_URL configuration
3. Define TypeScript types

### Phase 2: Products (2 hours)
4. Implement products API client
5. Update product listing page
6. Update product detail page
7. Test thoroughly

### Phase 3: Categories (1 hour)
8. Implement categories API client
9. Update category navigation
10. Update category pages

### Phase 4: Orders (1-2 hours)
11. Implement orders API client
12. Update checkout page
13. Update success page

### Phase 5: Polish (1-2 hours)
14. Add loading states everywhere
15. Add error handling
16. Test all user flows
17. Handle edge cases

---

## 6. Testing Checklist

- [ ] Products load on homepage
- [ ] Product filtering works
- [ ] Product search works
- [ ] Product detail page loads
- [ ] Categories navigation works
- [ ] Checkout creates order
- [ ] Order confirmation shows order number
- [ ] Loading states display correctly
- [ ] Error messages show when API fails
- [ ] 404 pages work for invalid products
- [ ] Cart functionality unchanged (if using localStorage)
- [ ] Performance acceptable (< 3s page load)

---

## 7. Rollback Plan

If backend integration fails:
1. Keep mock data functions alongside API clients
2. Use feature flag to switch between mock/API:
   ```typescript
   const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
   
   export const getProducts = USE_API ? getProductsFromAPI : getProductsMock;
   ```

---

## 8. Acceptance Criteria

- [ ] All mocked data replaced with API calls
- [ ] Loading states implemented on all pages
- [ ] Error handling implemented
- [ ] No regression in existing features
- [ ] Performance acceptable (API response time < 500ms)
- [ ] Type safety maintained with TypeScript
- [ ] CORS issues resolved
- [ ] Frontend works with backend running
- [ ] Clear error messages for common failures
- [ ] Graceful degradation if backend unavailable

---

**Status**: Ready for Implementation  
**Priority**: P1 (Critical for integration)  
**Estimated Effort**: 6-8 hours  
**Dependencies**: FRD-004, FRD-005, FRD-007 (all backend APIs must be ready)
