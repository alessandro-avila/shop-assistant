# Research: End-to-End Order Processing Flow

**Feature**: `001-order-checkout-flow`  
**Date**: 2026-01-28  
**Phase**: 0 — Outline & Research

## Research Tasks & Findings

### R-001: Product ID Resolution Chain

**Unknown**: How do frontend string product IDs map to backend integer IDs? Is a slug lookup needed at checkout?

**Decision**: Use `parseInt(product.id)` directly — no slug lookup required.

**Rationale**: The complete data flow already uses numeric IDs:
1. `mapBackendProduct(dto)` in `products.ts` sets `id: dto.productId.toString()` — the frontend `Product.id` IS the backend integer ID as a string.
2. `addToCart(product, quantity)` in `use-cart.ts` stores `productId: product.id` in the cart.
3. `getProductById(item.productId)` in checkout's `loadCartItems()` fetches by the same numeric string.
4. Therefore `parseInt(item.product.id)` yields the backend integer ID for `BackendOrderItemRequest.productId`.

**Alternatives Considered**:
- Slug lookup via `GET /api/products/slug/{slug}` → Rejected: unnecessary extra round-trip; the numeric ID is already available in the product object. The spec assumption about slug lookup was based on incomplete knowledge of the data flow.
- Storing backend integer ID separately in cart → Rejected: the existing `Product.id` already IS the numeric ID.

**Spec Reconciliation**: The spec (Assumption 1, Clarification 2, FR-002) mentions slug-based resolution. The implementation will satisfy FR-002's *intent* (ensuring valid backend product IDs) by using the already-resolved numeric IDs from the product objects loaded at checkout. This is functionally equivalent and avoids unnecessary API calls.

---

### R-002: Order Data Passing to Confirmation Page

**Unknown**: How should order details be passed from checkout to the success page for instant display?

**Decision**: Use `sessionStorage` to cache the full `BackendOrderDto` response after successful order placement.

**Rationale**:
- The success page (`/checkout/success`) currently only reads `order` from URL search params.
- `sessionStorage` persists across page navigation within the same tab but is cleared when the tab closes.
- On the success page: check sessionStorage first for instant display (no loading state needed), fall back to `getOrderByNumber()` for refresh/direct navigation.
- This satisfies FR-011's dual requirement: "in-memory response when available" + "fetch from backend on refresh."

**Alternatives Considered**:
- React Context / global state → Rejected: lost on page refresh, no fallback mechanism without additional complexity.
- URL parameters with full order data → Rejected: URL length limits, order data too large.
- Always fetch from backend → Rejected: adds unnecessary latency after placement; user waits for a second round-trip.
- `localStorage` → Rejected: persists beyond tab session; stale data risk.

---

### R-003: Total Amount Calculation

**Unknown**: Does the existing `buildOrderRequest()` calculate `totalAmount` correctly per spec requirements?

**Decision**: Yes — `buildOrderRequest()` is already correct. No changes needed.

**Rationale**:
- `buildOrderRequest()` in `orders.ts` computes: `totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)`
- Spec Clarification 1: "Items subtotal only (sum of quantity × unit price for all line items). Tax and shipping are displayed on the frontend only."
- Backend `OrdersController` validates: `Math.Abs(totalAmount - expectedTotal) > 0.01m` where `expectedTotal` = sum of `orderItem.Quantity * orderItem.UnitPrice`.
- The frontend's `subtotal` computed property also matches: `cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)`.

**Alternatives Considered**: None — the implementation is already aligned with the spec.

---

### R-004: Error Categorization Strategy

**Unknown**: How should backend error responses be mapped to user-friendly messages per FR-008/FR-009?

**Decision**: Create a utility function `mapOrderError(error: unknown): { title: string; message: string }` in a new file `frontend/lib/utils/order-errors.ts`.

**Rationale**:
- The `ApiError` class in `client.ts` provides `statusCode` and `message` properties.
- Backend validation errors return 400 with specific messages (e.g., "Products not found: [ids]", "Total amount mismatch").
- Network failures throw errors without status codes (timeout, connection refused).
- Server errors return 500.
- Mapping logic:
  - **400 + "not found"** → "A product in your cart is no longer available. Please review your cart."
  - **400 + "mismatch"** → "Prices have changed since you added items to your cart. Please review your cart and try again."
  - **400 (other)** → "There was a problem with your order. Please review your information and try again."
  - **404** → "Order service is temporarily unavailable. Please try again."
  - **500** → "Something went wrong on our end. Please try again in a moment."
  - **Network/timeout** → "Unable to reach the server. Please check your connection and try again."
- Extracted to a utility for testability and reuse (Constitution Principle I: single responsibility).

**Alternatives Considered**:
- Inline error mapping in checkout component → Rejected: violates single responsibility, not reusable, harder to test.
- Backend returning structured error codes → Not in scope; the backend already returns descriptive messages, we map them client-side.

---

### R-005: Mock Data Fallback for Orders API

**Unknown**: The `orders.ts` module lacks the mock data fallback pattern required by Constitution Principle III.

**Decision**: Add `USE_API` checks and mock fallback to all three order API functions (`createOrder`, `getOrderById`, `getOrderByNumber`).

**Rationale**:
- Constitution Principle III states: "Every API function MUST implement the mock data fallback pattern (check `USE_API` flag, catch errors, fall back to local JSON with a console warning)."
- `products.ts` and `categories.ts` both follow this pattern. `orders.ts` does not.
- Mock responses:
  - `createOrder` → Return a synthetic `BackendOrderDto` with generated order number, echoing back the submitted items.
  - `getOrderById` / `getOrderByNumber` → Return a synthetic order with sample data.
- Pattern: `if (!USE_API) { await delay(MOCK_API_DELAY); return mockResponse; }` at function start, plus try/catch with fallback around the real API call.

**Alternatives Considered**:
- Skip mock fallback (accept constitution violation) → Rejected: must comply, and this ensures the checkout works without a running backend.
- Import mock data from JSON file → Rejected: orders are dynamic, not static catalog data. Generate mock responses inline.

---

### R-006: Client-Side Form Validation Strategy

**Unknown**: What approach for client-side validation per FR-016? Should a validation library be added?

**Decision**: Custom validation functions in a new `frontend/lib/utils/checkout-validation.ts` file. No new dependencies.

**Rationale**:
- Constitution (New Dependencies): "Is there a built-in or existing dependency that solves this?" — HTML5 validation + custom functions suffice.
- Constitution Principle VIII: "All form inputs MUST provide inline validation feedback. Error messages MUST appear adjacent to the offending field."
- Validation rules are simple:
  - `firstName`, `lastName`: non-empty
  - `email`: non-empty + email format regex
  - `address`, `city`, `state`, `zipCode`, `country`: non-empty
  - `phone`: optional (no validation needed, just present)
- The validation utility returns a `Record<string, string>` mapping field names to error messages.
- The `Input` component already accepts props; add an `error` prop for inline display.
- Validation triggers: on "Continue" button click for each step, not on every keystroke (avoids premature error display).

**Alternatives Considered**:
- `react-hook-form` + `zod` → Rejected: adds two new dependencies; violates Constitution (prefer existing solutions); overkill for 8 simple fields.
- HTML5 `required` + `pattern` attributes only → Rejected: doesn't provide the inline error message UI that FR-016 and Principle VIII require.
- Validate on blur → Considered and acceptable as enhancement, but initial implementation uses step-transition validation for simplicity.

---

### R-007: Backend Changes Assessment

**Unknown**: Are any backend changes required for P1/P2 features?

**Decision**: Zero backend changes needed for P1/P2.

**Rationale**:
- `POST /api/orders` — fully implemented with validation, transaction wrapping, order number generation.
- `GET /api/orders/{id}` — returns full order with items, uses `AsNoTracking`.
- `GET /api/orders/number/{orderNumber}` — returns order by number.
- All DTOs (`BackendOrderDto`, `BackendCreateOrderRequest`, etc.) are already defined in `frontend/lib/types/api.ts`.
- Product validation in the order controller checks all product IDs exist before creating.
- Total validation checks within $0.01 tolerance.
- No new endpoints, no schema changes, no migrations needed.

**Alternatives Considered**:
- Add estimated delivery date to order response → Rejected: spec says "calculated client-side" (Assumption 4). Not needed for MVP.
- Add service layer refactor → Rejected: "minimal and surgical" instruction; existing controller-based logic works correctly.

---

### R-008: Confirmation Page Data Fetching

**Unknown**: What's the exact pattern for the dual-source confirmation page (sessionStorage + backend fallback)?

**Decision**: Implement a three-state loading pattern:

1. **Immediate (from sessionStorage)**: On mount, check `sessionStorage.getItem('lastOrder')`. If present, parse and display immediately — no loading state shown.
2. **Fetching (from backend)**: If sessionStorage is empty (refresh/direct nav), show loading skeleton, call `getOrderByNumber(orderNumber)`.
3. **Error (not found)**: If backend returns 404 or fetch fails, show "Order not found" with link to continue shopping.

**Rationale**:
- Satisfies FR-011 (dual source), FR-012 (loading on fetch only), FR-013 (not found handling).
- The success page already reads `orderNumber` from `searchParams.get('order')`.
- After displaying, remove the sessionStorage entry to avoid showing stale data on future visits.
- For "View Order Details" button: since we already have the full order data on the page, this button can scroll to or expand the details section (the page IS the order details view).

**Alternatives Considered**:
- Keep sessionStorage indefinitely → Rejected: stale data accumulates; remove after reading.
- Use `getOrderById` instead of `getOrderByNumber` → Rejected: URL has order number, not ID; `getOrderByNumber` is the correct lookup.

## Summary of Decisions

| # | Topic | Decision | Impact |
|---|-------|----------|--------|
| R-001 | Product ID resolution | `parseInt(product.id)` — no slug lookup | Simplifies implementation; no extra API calls |
| R-002 | Confirmation data passing | `sessionStorage` + backend fallback | Instant display after placement, resilient to refresh |
| R-003 | Total calculation | `buildOrderRequest()` already correct | Zero changes to existing function |
| R-004 | Error categorization | New `order-errors.ts` utility | Clean separation, testable, reusable |
| R-005 | Mock fallback for orders | Add `USE_API` + mock pattern to `orders.ts` | Constitution compliance; frontend works standalone |
| R-006 | Form validation | Custom validation in `checkout-validation.ts` | No new dependencies; inline error display |
| R-007 | Backend changes | None needed for P1/P2 | Zero backend risk |
| R-008 | Confirmation page pattern | Three-state: immediate / fetching / error | Satisfies FR-011, FR-012, FR-013 |

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/lib/utils/order-errors.ts` | Error categorization utility (R-004) |
| `frontend/lib/utils/checkout-validation.ts` | Form field validation (R-006) |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/lib/api/orders.ts` | Add mock data fallback pattern (R-005) |
| `frontend/app/checkout/page.tsx` | Wire `handlePlaceOrder()` to real API, add error state, add form validation (R-001, R-002, R-004, R-006) |
| `frontend/app/checkout/success/page.tsx` | Real order display with dual-source loading (R-002, R-008) |
| `frontend/components/ui/input.tsx` | Add `error` prop for inline validation display (R-006) |
