# ADR 009: Frontend-Backend API Integration Strategy

**Date**: January 27, 2026  
**Status**: Accepted  
**Deciders**: Development Team

---

## Context and Problem Statement

The Shop Assistant frontend (Next.js) needs to integrate with the .NET backend API to fetch real product data, categories, and create orders. Key decisions needed:

1. **API Client Architecture**: How to structure API calls from frontend to backend?
2. **Error Handling**: How to handle network failures, timeouts, and API errors?
3. **Fallback Strategy**: Should we maintain mocked data as fallback?
4. **Cart Storage**: Should cart be stored in backend or client-side?
5. **Type Safety**: How to ensure type safety between frontend and backend?

---

## Decision Drivers

* **Developer Experience**: Easy to use and maintain API client
* **Type Safety**: Full TypeScript support matching backend DTOs
* **Graceful Degradation**: Application should work even if backend is unavailable
* **Error Handling**: Clear error messages and recovery strategies
* **Performance**: Minimize API calls and optimize loading states
* **Separation of Concerns**: Clean abstraction between UI and API
* **Simplicity**: Keep it simple for a demo/learning project

---

## Considered Options

### Option 1: Direct Fetch Calls from Components
Make fetch calls directly in React components without abstraction.

**Pros**:
- Simple and straightforward
- No additional abstraction layer
- Easy to understand for beginners

**Cons**:
- **Code duplication**: Same fetch logic repeated everywhere
- **No type safety**: Manual typing of responses
- **No error handling**: Must implement in every component
- **No fallback**: Difficult to switch between API/mock data
- **Hard to maintain**: Changes to API require updates everywhere

### Option 2: Centralized API Client with Type-Safe Wrapper
Create a dedicated API client layer with TypeScript types, error handling, and fallback strategy.

**Pros**:
- **Type safety**: Full TypeScript support with generics
- **Error handling**: Centralized error handling and retry logic
- **Fallback support**: Easy toggle between API and mocked data
- **Maintainable**: Single place to update API calls
- **Testable**: Easy to mock API client in tests
- **Consistent**: Same pattern across all API calls

**Cons**:
- Additional abstraction layer
- More initial setup time

### Option 3: React Query / TanStack Query
Use React Query library for data fetching with automatic caching and state management.

**Pros**:
- Powerful caching and invalidation
- Automatic refetching and background updates
- Optimistic updates support
- Built-in loading/error states

**Cons**:
- **Additional dependency**: 40KB+ library
- **Learning curve**: New concepts (queries, mutations, cache)
- **Overkill for demo**: Too complex for simple use case
- **Backend-first**: Doesn't support fallback to mocked data easily

---

## Decision Outcome

**Chosen option**: **Option 2 - Centralized API Client with Type-Safe Wrapper**

### Rationale

1. **Type Safety**: TypeScript generics ensure backend DTOs match frontend types
2. **Graceful Degradation**: Fallback to mocked data if backend unavailable
3. **Simple**: No heavy dependencies, just native fetch API
4. **Maintainable**: Single place to update API calls and error handling
5. **Educational**: Clear separation of concerns for learning purposes
6. **Demo-Friendly**: Works with or without backend running

### Architecture

**API Client Layers**:
```
Components
    ↓
Feature API Clients (products.ts, categories.ts, orders.ts)
    ↓
Core API Client (client.ts)
    ↓
Native Fetch API
```

**Core Client** (`lib/api/client.ts`):
- Generic `apiClient<T>()` function with TypeScript generics
- Timeout handling (30s default)
- Error handling with custom `ApiError` class
- Helper functions: `get()`, `post()`, `put()`, `del()`
- Query string builder for filters/pagination

**Feature Clients**:
- `lib/api/products.ts` - Product endpoints
- `lib/api/categories.ts` - Category endpoints
- `lib/api/orders.ts` - Order creation

**Configuration** (`lib/config.ts`):
```typescript
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5250/api';

export const USE_API = 
  process.env.NEXT_PUBLIC_USE_API !== 'false';
```

**Fallback Strategy**:
- Each API function has mocked equivalent
- If `USE_API=false` or API call fails, use mocked data
- Logs errors but continues with fallback
- Simulates API latency (300ms) for realistic UX

---

## Consequences

### Positive

- **Type-safe end-to-end**: Frontend types match backend DTOs
- **Graceful degradation**: Works without backend (mocked data)
- **Maintainable**: Centralized API logic, easy to update
- **Clear errors**: Specific error messages for network, 404, 500 errors
- **Demo-ready**: Can demo with or without backend running
- **Educational**: Clear API client pattern for learning
- **No heavy dependencies**: Uses native fetch, no libraries

### Negative

- **Manual cache management**: No automatic caching (acceptable for demo)
- **No optimistic updates**: Must manually handle loading states
- **Fallback maintenance**: Must keep mocked data in sync with backend
- **DTO mapping overhead**: Must map backend DTOs to frontend types

---

## Implementation Details

### Type Definitions

**Backend Types** (`lib/types/api.ts`):
```typescript
export interface BackendProductDto {
  productId: number;
  name: string;
  slug: string;
  // ... matches backend C# DTO
}
```

**Frontend Types** (`lib/types/product.ts`):
```typescript
export interface Product {
  id: string;  // Mapped from productId
  name: string;
  slug: string;
  // ... frontend-specific fields
}
```

**Type Mapper**:
```typescript
function mapBackendProduct(dto: BackendProductDto): Product {
  return {
    id: dto.productId.toString(),
    name: dto.name,
    // ... full mapping
  };
}
```

### Error Handling

**API Error Class**:
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

**Error Types**:
- `0`: Network error (no connection)
- `404`: Resource not found
- `500`: Server error
- `408`: Timeout

**Error Recovery**:
1. Try API call
2. If fails, log error to console
3. Fall back to mocked data
4. Display user-friendly error message

### Cart Storage Decision

**Decision**: Keep cart in localStorage (client-side)

**Rationale**:
- Simpler implementation (no backend Cart API needed)
- Persists across sessions
- No user authentication required
- Demo-appropriate level of complexity

**Alternative** (not implemented):
- Backend Cart API (TASK-009 - optional future enhancement)

---

## Testing Strategy

### Manual Testing Completed

✅ Products load on homepage (with API and fallback)  
✅ Product filtering works  
✅ Product search works  
✅ Product detail page loads  
✅ Category navigation works  
✅ Cart functionality unchanged (localStorage)  
✅ Frontend builds successfully  
✅ TypeScript type checking passes  
✅ ESLint passes  
✅ Fallback to mocked data works when backend offline

### Integration Scenarios Tested

- **Backend Running**: All data from API
- **Backend Offline**: Graceful fallback to mocked data
- **Network Timeout**: Fallback after 30s
- **Invalid API URL**: Immediate fallback

---

## Configuration

### Environment Variables

**`.env.local`**:
```bash
# Backend API URL (default: http://localhost:5250/api)
NEXT_PUBLIC_API_URL=http://localhost:5250/api

# Enable/disable API integration (default: true)
# Set to 'false' to use mocked data
NEXT_PUBLIC_USE_API=true
```

### Development Workflow

**Start Backend**:
```bash
cd backend
dotnet run
# API available at http://localhost:5250
```

**Start Frontend**:
```bash
cd frontend
pnpm dev
# Frontend available at http://localhost:3000
```

**Frontend Without Backend**:
```bash
cd frontend
NEXT_PUBLIC_USE_API=false pnpm dev
# Uses mocked data
```

---

## Alternative Approaches Not Chosen

### Why Not React Query?

- **Pros**: Excellent caching, automatic refetching, optimistic updates
- **Cons**: 
  - 40KB+ dependency for a demo
  - Doesn't support fallback to mocked data easily
  - Overkill for simple fetch operations
  - Additional learning curve

**Decision**: For a production app, React Query would be recommended. For this demo/learning project, custom API client provides better educational value and flexibility.

### Why Not GraphQL?

- **Pros**: Single endpoint, flexible queries, strong typing
- **Cons**:
  - Backend doesn't support GraphQL
  - Adds complexity (Apollo Client, codegen)
  - RESTful API is simpler for learning

---

## Related Documents

- [TASK-008: Frontend API Integration](../../specs/tasks/008-task-frontend-integration.md)
- [FRD-008: Frontend API Integration](../../specs/features/frontend-api-integration.md)
- [ADR 006: Backend API Architecture](006-backend-api-architecture.md)
- Frontend README: Backend Integration section

---

## References

- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- TypeScript Generics: https://www.typescriptlang.org/docs/handbook/2/generics.html
- Error Handling Best Practices: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
