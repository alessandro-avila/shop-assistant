# Implementation Plan: End-to-End Order Processing Flow

**Branch**: `001-order-checkout-flow` | **Date**: 2026-01-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-order-checkout-flow/spec.md`

## Summary

Wire the existing frontend checkout page to the backend Orders API so that placed orders create real `Order` and `OrderItem` rows in SQL Server. The frontend cart context, API client (`orders.ts`), backend controller, and database schema all exist — this feature connects them end-to-end with proper error handling, form validation, and order confirmation display.

**Technical approach** (from research): Product IDs resolved via `parseInt(product.id)` (no slug lookup), order confirmation data passed via `sessionStorage` with `getOrderByNumber()` fallback, two new utility files for error mapping and validation, mock fallback added to `orders.ts`. Zero backend changes. Zero new dependencies.

## Technical Context

**Language/Version**: C# / .NET 10 (backend), TypeScript 5.x strict (frontend)
**Primary Dependencies**: ASP.NET Core 10, EF Core 10, Next.js 14.2, React 18.3, Tailwind 3.x, Framer Motion 11.x
**Storage**: SQL Server (LocalDB) via EF Core — all tables pre-exist, no migrations needed
**Testing**: xUnit (backend, not yet set up), React Testing Library (frontend, not yet set up), Playwright (E2E, not yet set up)
**Target Platform**: Web — localhost development (backend :5250, frontend :3000)
**Project Type**: Full-stack web application (REST API + Next.js App Router SPA)
**Performance Goals**: Order submission < 2s response time, confirmation page instant from sessionStorage
**Constraints**: Frontend must function with or without running backend (mock fallback), no new npm/NuGet dependencies
**Scale/Scope**: Single checkout flow — 4 modified files, 2 new files, 0 backend changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Code Quality & Consistency | ✅ PASS | New utility files follow existing patterns. `cn()` used for conditional classes. No `any` types. Functions < 50 lines. |
| II | Backend Architecture Discipline | ✅ PASS (N/A) | Zero backend changes. Existing `OrdersController` already uses transactions and validates data. |
| III | Frontend Architecture Discipline | ⚠️ VIOLATION → RESOLVED | `orders.ts` currently lacks mock fallback. **Step 1 of quickstart adds it.** After implementation: PASS. |
| IV | Testing Standards | ⚠️ CONSTITUTION EXCEPTION | CONSTITUTION EXCEPTION: IV — No test infrastructure (xUnit, RTL, Playwright) exists in this project yet. Adding test scaffolding is out of scope for this wiring feature. Tracked as mandatory follow-up before any subsequent feature ships. Exception expires when test projects are created. |
| V | API Design Contract | ✅ PASS (N/A) | No endpoint changes. Existing contract documented in `contracts/order-api.md`. |
| VI | Data Integrity & Safety | ✅ PASS (N/A) | Backend validation unchanged. `decimal(18,2)` for money. FK constraints configured. Transactions wrap order creation. |
| VII | Performance by Default | ✅ PASS | `Promise.all` for cart product loading (existing). `sessionStorage` avoids redundant API call on confirmation. |
| VIII | User Experience Excellence | ✅ PASS | Loading states on order submission (existing `isProcessing`). Inline form validation via `error` prop (Input component already supports it). Error recovery with user-friendly messages. Skeleton on confirmation page refresh. |

**Pre-design gate**: PASS (Principle III violation has planned remediation in Step 1)
**Post-design re-check**: PASS (all violations addressed in quickstart steps)

## Project Structure

### Documentation (this feature)

```text
specs/001-order-checkout-flow/
├── plan.md              # This file
├── research.md          # Phase 0: 8 research decisions (R-001 through R-008)
├── data-model.md        # Phase 1: Entity documentation, ID mapping, validation rules
├── quickstart.md        # Phase 1: 5-step implementation guide
├── contracts/
│   └── order-api.md     # Phase 1: API contract for 3 order endpoints
└── tasks.md             # Phase 2 output (not yet created)
```

### Source Code (repository root)

```text
backend/                          # NO CHANGES — all endpoints and models pre-exist
├── Controllers/
│   └── OrdersController.cs       # POST /api/orders, GET /api/orders/{id}, GET /api/orders/number/{num}
├── Models/
│   ├── Order.cs                  # OrderId, OrderNumber, TotalAmount, Status, ShippingAddress (JSON)
│   └── OrderItem.cs              # OrderItemId, OrderId (FK), ProductId (FK), ProductName, Quantity, UnitPrice
└── DTOs/
    ├── CreateOrderRequest.cs     # Request: Items, TotalAmount, ShippingAddress, CustomerEmail, CustomerName
    ├── OrderDto.cs               # Response: full order with EstimatedDelivery (computed)
    └── OrderItemDto.cs           # Response: item with Subtotal (computed)

frontend/
├── app/
│   └── checkout/
│       ├── page.tsx              # MODIFY: Wire handlePlaceOrder() to createOrder(), add validation + errors
│       └── success/
│           └── page.tsx          # MODIFY: Fetch real order data, display items/total/address
├── lib/
│   ├── api/
│   │   └── orders.ts            # MODIFY: Add mock data fallback pattern (USE_API check + catch)
│   └── utils/
│       ├── order-errors.ts      # NEW: Error categorization (ApiError → user-friendly messages)
│       └── checkout-validation.ts # NEW: Form field validation (shipping info)
└── components/
    └── ui/
        └── input.tsx             # NO CHANGES — error prop already exists
```

**Structure Decision**: Web application (Option 2). The existing `backend/` + `frontend/` separation is preserved. All changes are in the `frontend/` directory. The backend is untouched.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle III (mock fallback missing in orders.ts) | `orders.ts` was created without the `USE_API` / fallback pattern | Adding mock fallback in Step 1 resolves this — no structural complexity added |
| Principle IV (no tests) | Test infrastructure does not exist yet in this project | Adding test scaffolding is out of scope for this wiring feature; tracked as separate follow-up |
