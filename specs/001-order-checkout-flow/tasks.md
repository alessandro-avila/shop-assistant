# Tasks: End-to-End Order Processing Flow

**Input**: Design documents from `/specs/001-order-checkout-flow/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/order-api.md ✅, quickstart.md ✅

> **CONSTITUTION EXCEPTION: Principle IV (Testing Standards)** — No test tasks are included because
> the project has zero test infrastructure. A follow-up feature increment MUST create test projects
> (`ShopAssistant.Api.Tests`, frontend `*.test.ts` convention) and retroactively cover this feature
> before the next feature ships.

**Tests**: Not requested. No test infrastructure exists yet (Constitution Principle IV, deferred).

**Organization**: Tasks grouped by user story. US1 (P1), US2 (P2), US3 (P2) are in scope. US4 (P3) is deferred (requires backend changes outside current scope).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

> Not needed — project exists, all dependencies installed, no new packages required. Zero backend changes for P1/P2 (R-007). The `Input` component already supports the `error` prop — no UI component modifications needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create utility files and add mock fallback pattern that ALL user stories depend on. These three tasks correspond to quickstart.md Steps 1–3 and are fully parallelizable.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 [P] Add mock data fallback pattern (USE_API check, MOCK_API_DELAY, delay helper, try/catch with console.warn fallback) to createOrder, getOrderById, and getOrderByNumber functions following the existing pattern in products.ts in frontend/lib/api/orders.ts
- [X] T002 [P] Create error categorization utility with mapOrderError(error: unknown) function that maps ApiError status codes and message content to user-friendly {title, message} objects covering 400/not-found, 400/mismatch, 400/other, 500, and network/timeout cases in frontend/lib/utils/order-errors.ts
- [X] T003 [P] Create form validation utility with validateShippingInfo function (validates firstName, lastName, email format, address, city, state, zipCode, country) returning Record<string, string> of field errors, and hasErrors helper function in frontend/lib/utils/checkout-validation.ts

**Checkpoint**: All three utility components ready. Mock fallback enables frontend-only development. Error mapping and validation utilities ready for checkout integration.

---

## Phase 3: User Story 1 — Submit a Real Order (Priority: P1) 🎯 MVP

**Goal**: Wire handlePlaceOrder to createOrder API so clicking "Place Order" persists real Order and OrderItem rows in SQL Server, clears the cart on success, and redirects to the confirmation page with a real ORD-YYYY-XXXXX order number.

**Independent Test**: Fill checkout form with valid shipping info → click "Place Order" → order created in backend DB with correct items and totals → cart cleared → redirected to `/checkout/success?order=ORD-YYYY-XXXXX` with real order number.

**Functional Requirements**: FR-001 (submit order data), FR-002/FR-003 (product ID resolution via parseInt, unit prices), FR-004 (total calculation via buildOrderRequest), FR-005 (clear cart after success only), FR-006 (redirect with real order number), FR-007 (loading/disabled state — existing isProcessing), FR-010 (re-enable button after error), FR-016 (client-side validation).

- [X] T004 [US1] Replace handlePlaceOrder mock implementation with real createOrder API call including: import createOrder/buildOrderRequest/mapOrderError/validateShippingInfo, add orderError and validationErrors state variables, validate shipping info before submission, map cart items to order items with parseInt(product.id) for productId and product.price for unitPrice, call buildOrderRequest and createOrder, cache response in sessionStorage as 'lastOrder', call clearCart on success, router.push to /checkout/success with real orderNumber, catch errors with mapOrderError, and re-enable button in finally block in frontend/app/checkout/page.tsx
- [X] T005 [US1] Pass validationErrors state to each shipping form Input component via the existing error prop (firstName, lastName, email, address, city, state, zipCode, country fields) and clear validationErrors when validation passes in frontend/app/checkout/page.tsx

**Checkpoint**: Core order submission works end-to-end. Form validation prevents invalid submissions. Cart clears only on success. Real order number in redirect URL. Button disabled during processing, re-enabled on completion/error.

---

## Phase 4: User Story 2 — Graceful Error Handling (Priority: P2)

**Goal**: Display categorized, user-friendly error messages when order submission fails (validation errors, network failures, server errors) while preserving cart contents and allowing retry.

**Independent Test**: Stop backend → click "Place Order" → connection error message displayed, cart preserved, button re-enabled. Send request with invalid product ID → validation error with actionable message. Trigger 500 → generic server error message.

**Functional Requirements**: FR-008 (categorized validation errors), FR-009 (connectivity error message), FR-010 (re-enable button for retry).

- [X] T006 [US2] Add order error notification display — a red-bordered alert box showing orderError.title and orderError.message from the orderError state variable — in the payment/review step of the checkout form, positioned above the Place Order button in frontend/app/checkout/page.tsx

**Checkpoint**: All error categories (product-not-found, price-mismatch, generic-400, server-500, network/timeout) display user-friendly messages. Cart preserved on all error types. Submit button re-enables after error for retry.

---

## Phase 5: User Story 3 — Order Confirmation with Real Details (Priority: P2)

**Goal**: Confirmation page displays real order data (order number, items with names/quantities/prices, total amount, shipping address) from sessionStorage for instant post-placement display, with backend API fallback on page refresh or direct navigation.

**Independent Test**: Place order → confirmation shows real items/totals/address instantly (no loading). Refresh → loading skeleton → data fetched from backend → same details displayed. Navigate to `/checkout/success?order=FAKE` → "Order not found" with continue shopping link.

**Functional Requirements**: FR-011 (real order details with dual-source), FR-012 (loading state on fetch), FR-013 (not-found handling).

- [X] T007 [US3] Implement dual-source order data fetching in useEffect: read orderNumber from searchParams, check sessionStorage for 'lastOrder' key (if found and matching orderNumber, parse as BackendOrderDto, remove entry, set order state — no loading), else set isLoading true and call getOrderByNumber(orderNumber) with error handling, managing order/isLoading/error states in frontend/app/checkout/success/page.tsx
- [X] T008 [US3] Replace static confirmation content with real order details display: order number from order.orderNumber, estimated delivery from order.estimatedDelivery, items list mapping order.items to show productName, quantity, unitPrice, and subtotal per item, order totalAmount, and parsed shippingAddress fields (name, address, city, state, zipCode, country) in frontend/app/checkout/success/page.tsx
- [X] T009 [US3] Add loading skeleton state (shown while isLoading is true during backend fetch) and order-not-found error state with "Order not found" heading and "Continue Shopping" link to /products (shown when fetch returns 404 or orderNumber is missing) in frontend/app/checkout/success/page.tsx

**Checkpoint**: Confirmation page shows real data from sessionStorage (instant) or backend (with loading skeleton). Invalid order numbers handled with friendly not-found message and navigation.

---

## Phase 6: User Story 4 — Server-Side Cart API (Priority: P3) — Deferred

**Goal**: Optional backend cart endpoints for cross-device persistence and future abandoned cart recovery.

**Independent Test**: Call cart API endpoints via HTTP client to add, retrieve, and remove cart items by session identifier, verifying correct persistence and product validation.

**Functional Requirements**: FR-014 (CRUD cart endpoints by session), FR-015 (validate product existence).

> ⚠️ **Deferred**: This user story requires backend changes (new controller, service layer, possible migrations). Per plan.md and R-007, P1/P2 features require zero backend changes. US4 is tracked here for completeness but should be implemented as a separate feature increment.

- [ ] T010 [US4] Create CartController with CRUD endpoints (POST add item, GET cart by session, DELETE remove item, DELETE clear cart) keyed by session identifier using existing CartItem model in backend/Controllers/CartController.cs
- [ ] T011 [US4] Add cart service with session-based cart management, product existence validation (FR-015), and quantity aggregation in backend/Services/CartService.cs
- [ ] T012 [P] [US4] Create cart API client functions (addToCart, getCart, removeFromCart, clearCart) with mock fallback pattern (USE_API check) in frontend/lib/api/cart.ts
- [ ] T013 [US4] Integrate frontend cart context with optional server-side cart API — sync localStorage cart to server when USE_API is true, fall back to localStorage-only when API unavailable in frontend/context/cart-context.tsx

**Checkpoint**: Cart state persisted server-side when backend available. Frontend uses server cart when USE_API is true, falls back to localStorage seamlessly.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and cleanup across all implemented user stories.

- [X] T014 Run quickstart.md validation steps to verify complete end-to-end flow: place order with backend running (real persistence), place order with USE_API=false (mock fallback), trigger each error category (network, validation, server), refresh confirmation page (backend fetch), navigate to invalid order number (not-found state)
- [X] T015 [P] Code cleanup — remove dead code, verify no unused imports, confirm TypeScript strict mode compliance, and ensure consistent code style across all modified files (orders.ts, order-errors.ts, checkout-validation.ts, checkout/page.tsx, success/page.tsx)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — no setup needed
- **Foundational (Phase 2)**: No dependencies — can start immediately. **BLOCKS all user stories.**
- **US1 (Phase 3)**: Depends on Phase 2 (uses orders.ts mock, validation utility, error utility)
- **US2 (Phase 4)**: Depends on Phase 3 (orderError state is set in handlePlaceOrder; US2 adds the display)
- **US3 (Phase 5)**: Depends on Phase 2 only (uses orders.ts mock for getOrderByNumber). **Independent of US1/US2.**
- **US4 (Phase 6)**: Deferred. Independent of US1–US3. Requires backend changes out of current scope.
- **Polish (Phase 7)**: Depends on US1, US2, US3 completion

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2) — uses all three utilities
- **US2 (P2)**: Depends on US1 (Phase 3) — error state set in handlePlaceOrder, US2 adds display
- **US3 (P2)**: Depends on Foundational (Phase 2) only — **independent of US1/US2**
- **US4 (P3)**: Deferred — independent of all other stories

### Parallel Opportunities

**Phase 2 (all three tasks parallel — different files, no dependencies)**:

```
T001 (orders.ts mock)  ║  T002 (order-errors.ts)  ║  T003 (checkout-validation.ts)
```

**After Phase 2, US1 and US3 can run in parallel (different files)**:

```
Phase 3: US1 (checkout/page.tsx)  ║  Phase 5: US3 (success/page.tsx)
  T004, T005                      ║    T007, T008, T009
```

**Within Phase 5 (US3), T008 and T009 can run in parallel after T007**:

```
T007 (data fetching) → T008 (order details)  ║  T009 (loading/error states)
```

> Note: US2 (Phase 4, T006) depends on US1 and modifies the same file as T004/T005. It cannot start until Phase 3 completes.

---

## Parallel Example: Phase 2 (Foundational)

```bash
# All three tasks target different files — launch in parallel:
Task T001: "Add mock fallback to orders.ts"       → frontend/lib/api/orders.ts
Task T002: "Create order-errors.ts"                → frontend/lib/utils/order-errors.ts (NEW)
Task T003: "Create checkout-validation.ts"         → frontend/lib/utils/checkout-validation.ts (NEW)
```

## Parallel Example: US1 + US3 (After Phase 2)

```bash
# US1 and US3 work on different pages — can proceed in parallel:
Developer A: T004, T005         → frontend/app/checkout/page.tsx
Developer B: T007, T008, T009   → frontend/app/checkout/success/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002, T003 — all parallel)
2. Complete Phase 3: User Story 1 (T004, T005)
3. **STOP and VALIDATE**: Place a real order end-to-end — verify DB persistence, cart clearing, real order number
4. This is the MVP — the shop is functional

### Incremental Delivery

1. Phase 2 → Foundation ready (mock fallback + utilities)
2. Phase 3: US1 → Real order submission works → **MVP!**
3. Phase 4: US2 → Error messages visible → Production-ready error handling
4. Phase 5: US3 → Rich confirmation page → Full user experience
5. Phase 6: US4 → Server-side cart → Future enhancement (deferred)

Each increment adds value without breaking previous stories.

### File Change Summary

| File | Tasks | Stories | Change Type |
|------|-------|---------|-------------|
| frontend/lib/api/orders.ts | T001 | Foundational | MODIFY |
| frontend/lib/utils/order-errors.ts | T002 | Foundational | NEW |
| frontend/lib/utils/checkout-validation.ts | T003 | Foundational | NEW |
| frontend/app/checkout/page.tsx | T004, T005, T006 | US1, US2 | MODIFY |
| frontend/app/checkout/success/page.tsx | T007, T008, T009 | US3 | MODIFY |
| backend/Controllers/CartController.cs | T010 | US4 (deferred) | NEW |
| backend/Services/CartService.cs | T011 | US4 (deferred) | NEW |
| frontend/lib/api/cart.ts | T012 | US4 (deferred) | NEW |
| frontend/context/cart-context.tsx | T013 | US4 (deferred) | MODIFY |

---

## Notes

- **Zero backend changes** for P1/P2 (US1, US2, US3) — all work is frontend-only (R-007)
- **Zero new dependencies** — custom validation, no form libraries (R-006)
- **Input component** already has `error` prop — no UI component changes needed (plan.md)
- **Product ID mapping**: `parseInt(product.id)` converts frontend string IDs to backend integer IDs (R-001)
- **Total calculation**: `buildOrderRequest()` already computes correct items subtotal (R-003)
- **Confirmation data**: sessionStorage for instant display, getOrderByNumber for refresh fallback (R-002, R-008)
- **Error mapping**: ApiError.statusCode + message content → user-friendly categories (R-004)
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
