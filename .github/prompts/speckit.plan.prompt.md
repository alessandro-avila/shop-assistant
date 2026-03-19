---
agent: speckit.plan
---

# Goal
Define the technical implementation plan for the order processing feature, 
working within the existing architecture and tech stack.

# Context
The spec is finalized. This plan translates the feature requirements into 
concrete technical changes aligned with the constitution and existing 
codebase patterns.

# Instructions
Provide technical decisions for each area:

BACKEND CHANGES (ASP.NET Core 10 / C# / EF Core):
- No new models needed — Order, OrderItem, CartItem already exist.
- No new migrations needed — schema already supports the flow.
- Optional: Add a CartController following the existing controller 
  patterns (constructor injection of ShopDbContext + ILogger, 
  ProducesResponseType attributes, try/catch with structured logging).
- Consider adding price validation in OrdersController.CreateOrder — 
  verify submitted unit prices match current product prices.

FRONTEND CHANGES (Next.js 15 / TypeScript / React 19):
- Modify checkout/page.tsx handlePlaceOrder() to use createOrder() 
  and buildOrderRequest() from lib/api/orders.ts instead of setTimeout.
- Product IDs are strings in the frontend (productId: string in CartItem) 
  but integers in the backend — use parseInt() during mapping.
- Modify checkout/success page to accept orderNumber as a query param 
  and fetch real order details via getOrderByNumber().
- Add error state handling in checkout — display API errors, don't 
  clear cart on failure.
- Wire up the existing useCartActions().clearCart() only after 
  successful API response.

API CLIENT:
- The api client functions in lib/api/orders.ts are already implemented 
  — createOrder(), buildOrderRequest(), getOrderByNumber(). 
  No changes needed.
- The base client in lib/api/client.ts handles errors via ApiError class.

DATA FLOW:
- Cart items (localStorage) → map to BackendOrderItemRequest[] → 
  POST /api/orders → Order + OrderItems in SQL → return OrderDto → 
  redirect to /checkout/success?order=ORD-XXXX → 
  GET /api/orders/number/ORD-XXXX → display confirmation.

TESTING:
- Backend: The api-tests.http file can be updated with order creation 
  test requests.
- Frontend: Manual testing flow — add product, checkout, verify DB.
- Use SQLite or existing SQL Server dev database.

Keep changes minimal and surgical — the goal is to wire existing 
pieces together, not to refactor.
