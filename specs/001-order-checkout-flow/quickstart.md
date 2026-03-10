# Quickstart: End-to-End Order Processing Flow

**Feature**: `001-order-checkout-flow`
**Date**: 2026-01-28
**Phase**: 1 — Design & Contracts

> Step-by-step implementation guide. Each step is atomic and testable. Zero backend changes. Two new files, four modified files.

## Prerequisites

- Backend running: `dotnet run` in `backend/` (SQL Server LocalDB with seed data)
- Frontend running: `pnpm dev` in `frontend/` (Next.js dev server at `localhost:3000`)
- Products seeded in database (existing migration handles this)

## Implementation Steps

### Step 1: Add mock fallback to `orders.ts`

**File**: `frontend/lib/api/orders.ts`
**Why**: Constitution Principle III compliance — every API function must implement mock fallback.
**Pattern**: Copy from `products.ts` (USE_API check + MOCK_API_DELAY + try/catch fallback).

**Changes**:
1. Import `USE_API`, `MOCK_API_DELAY` from `@/lib/config`
2. Add `delay()` helper (same as in `products.ts`)
3. For `createOrder()`: if `!USE_API`, return synthetic `BackendOrderDto` echoing submitted items with generated order number
4. For `getOrderById()` / `getOrderByNumber()`: if `!USE_API`, return synthetic order with sample data
5. Wrap existing API calls in try/catch with fallback + `console.warn`

**Verify**: Set `NEXT_PUBLIC_USE_API=false` in `.env.local`, call `createOrder()` from browser console → should return mock response without backend.

---

### Step 2: Create error categorization utility

**File**: `frontend/lib/utils/order-errors.ts` (NEW)
**Why**: FR-008, FR-009 — error responses must be mapped to user-friendly messages.

**Implementation**:
```typescript
import { ApiError } from '@/lib/api/client';

interface OrderError {
  title: string;
  message: string;
}

export function mapOrderError(error: unknown): OrderError {
  if (error instanceof ApiError) {
    const msg = error.message.toLowerCase();
    if (error.statusCode === 400 && msg.includes('not found')) {
      return { title: 'Product unavailable', message: 'A product in your cart is no longer available. Please review your cart.' };
    }
    if (error.statusCode === 400 && msg.includes('mismatch')) {
      return { title: 'Prices changed', message: 'Prices have changed since you added items to your cart. Please review and try again.' };
    }
    if (error.statusCode === 400) {
      return { title: 'Invalid order', message: 'There was a problem with your order. Please review your information and try again.' };
    }
    if (error.statusCode === 500) {
      return { title: 'Server error', message: 'Something went wrong on our end. Please try again in a moment.' };
    }
  }
  return { title: 'Connection error', message: 'Unable to reach the server. Please check your connection and try again.' };
}
```

**Verify**: Import in a test or browser console, call with various `ApiError` instances → returns correct category.

---

### Step 3: Create form validation utility

**File**: `frontend/lib/utils/checkout-validation.ts` (NEW)
**Why**: FR-016 — client-side validation before order submission.

**Implementation**:
```typescript
export type ValidationErrors = Record<string, string>;

export function validateShippingInfo(info: {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!info.firstName.trim()) errors.firstName = 'First name is required';
  if (!info.lastName.trim()) errors.lastName = 'Last name is required';
  if (!info.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!info.address.trim()) errors.address = 'Address is required';
  if (!info.city.trim()) errors.city = 'City is required';
  if (!info.state.trim()) errors.state = 'State is required';
  if (!info.zipCode.trim()) errors.zipCode = 'ZIP code is required';
  if (!info.country.trim()) errors.country = 'Country is required';

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
```

**Verify**: Call `validateShippingInfo({})` → returns errors for all fields. Call with valid data → returns `{}`.

---

### Step 4: Wire `handlePlaceOrder()` to real API

**File**: `frontend/app/checkout/page.tsx`
**Why**: FR-001, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010 — the core wiring.

**Changes** (surgical — only `handlePlaceOrder` function body and imports):

1. Add imports:
   ```typescript
   import { createOrder, buildOrderRequest } from '@/lib/api/orders';
   import { mapOrderError } from '@/lib/utils/order-errors';
   import { validateShippingInfo, hasErrors } from '@/lib/utils/checkout-validation';
   ```

2. Add error state:
   ```typescript
   const [orderError, setOrderError] = useState<{ title: string; message: string } | null>(null);
   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
   ```

3. Replace `handlePlaceOrder` body:
   ```typescript
   const handlePlaceOrder = async () => {
     setOrderError(null);

     // Client-side validation (FR-016)
     const errors = validateShippingInfo(shippingInfo);
     if (hasErrors(errors)) {
       setValidationErrors(errors);
       return;
     }
     setValidationErrors({});

     setIsProcessing(true);
     try {
       // Build order request from cart items (FR-001, FR-003, FR-004)
       const orderItems = cartItems.map(item => ({
         productId: parseInt(item.product.id),
         quantity: item.quantity,
         unitPrice: item.product.price,
       }));

       const request = buildOrderRequest(
         orderItems,
         {
           name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
           address: shippingInfo.address,
           city: shippingInfo.city,
           state: shippingInfo.state,
           zipCode: shippingInfo.zipCode,
           country: shippingInfo.country,
         },
         shippingInfo.email,
         `${shippingInfo.firstName} ${shippingInfo.lastName}`
       );

       const order = await createOrder(request);

       // Cache for instant display on confirmation page (R-002)
       sessionStorage.setItem('lastOrder', JSON.stringify(order));

       // Clear cart AFTER success (FR-005)
       clearCart();

       // Redirect with real order number (FR-006)
       router.push(`/checkout/success?order=${order.orderNumber}`);
     } catch (error) {
       // Map error to user-friendly message (FR-008, FR-009)
       const mapped = mapOrderError(error);
       setOrderError(mapped);
       // Cart NOT cleared (FR-008, FR-009)
     } finally {
       setIsProcessing(false); // Re-enable button (FR-010)
     }
   };
   ```

4. Add error display in the JSX (below the order summary, above the Place Order button):
   ```tsx
   {orderError && (
     <div className="rounded-lg border border-red-200 bg-red-50 p-4">
       <p className="font-medium text-red-800">{orderError.title}</p>
       <p className="mt-1 text-sm text-red-600">{orderError.message}</p>
     </div>
   )}
   ```

5. Pass `validationErrors` to `Input` components:
   ```tsx
   <Input label="First Name" error={validationErrors.firstName} ... />
   ```

**What NOT to change**: The multi-step layout, styling, shipping method selector, payment form, price calculation display, loading states for cart product fetching. Keep ALL of that intact.

**Verify**: 
- With backend running: fill form → Place Order → order created in DB, redirected to success page with real order number.
- With backend stopped: Place Order → error message displayed, cart preserved, button re-enabled.

---

### Step 5: Rewrite confirmation page with real data

**File**: `frontend/app/checkout/success/page.tsx`
**Why**: FR-011, FR-012, FR-013 — confirmation must show real order data.

**Changes** (replace data fetching logic, keep animation/layout):

1. Add three states: `order` (BackendOrderDto | null), `isLoading`, `error`
2. On mount (`useEffect`):
   - Read `orderNumber` from search params (existing)
   - Check `sessionStorage.getItem('lastOrder')` → if found AND matches orderNumber, parse and set `order`, remove sessionStorage entry. No loading state.
   - Else: set `isLoading = true`, call `getOrderByNumber(orderNumber)`, set result to `order` or error
3. Replace static content with real data:
   - Order number: from `order.orderNumber`
   - Estimated delivery: from `order.estimatedDelivery` (parsed date)
   - Add items list: `order.items.map(item => ...)` showing productName, quantity, unitPrice, subtotal
   - Add total: `order.totalAmount`
   - Add shipping address display: `order.shippingAddress`
4. Loading state: show skeleton when `isLoading` (FR-012)
5. Error state: show "Order not found" with "Continue Shopping" link (FR-013)
6. "View Order Details" button: remove if items are already displayed on the page (the confirmation IS the details view), or wire to scroll to the items section.

**What to preserve**: The animated checkmark, the "What's Next?" section, the "Continue Shopping" button, the overall layout structure. Add order details section below the existing hero section.

**Verify**: 
- Place order → confirmation shows real items, real total, real order number, real address.
- Refresh page → loading skeleton → data fetched from backend → displays correctly.
- Navigate to `/checkout/success?order=FAKE-NUMBER` → "Order not found" message.

---

## File Summary

### New Files (2)

| File | Size Est. | Purpose |
|------|-----------|---------|
| `frontend/lib/utils/order-errors.ts` | ~30 lines | Error categorization (Step 2) |
| `frontend/lib/utils/checkout-validation.ts` | ~35 lines | Form validation (Step 3) |

### Modified Files (4)

| File | Change Scope | Purpose |
|------|-------------|---------|
| `frontend/lib/api/orders.ts` | Add mock fallback pattern | Constitution compliance (Step 1) |
| `frontend/app/checkout/page.tsx` | Replace `handlePlaceOrder` body, add error/validation state + display | Core wiring (Step 4) |
| `frontend/app/checkout/success/page.tsx` | Add data fetching + real data display | Confirmation page (Step 5) |
| `frontend/components/ui/input.tsx` | **No changes needed** — `error` prop already exists | Already supports inline errors |

> **Note**: The `Input` component already has the `error` prop with red border + error message display. No modification needed — this was discovered during research (originally listed as needing changes).

### Files NOT Changed (backend)

Per R-007: Zero backend modifications. All endpoints, models, DTOs, and validations are correct as-is.

## Dependency Chain

```text
Step 1 (orders.ts mock) ─── independent
Step 2 (order-errors.ts) ── independent
Step 3 (checkout-validation.ts) ── independent
Step 4 (checkout/page.tsx) ── depends on Steps 1, 2, 3
Step 5 (success/page.tsx) ── depends on Step 1 (for mock support)
```

Steps 1, 2, 3 can be implemented in parallel. Step 4 depends on all three. Step 5 depends on Step 1.
