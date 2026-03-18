---
agent: speckit.specify
---

# Goal
Complete the end-to-end order processing flow in the Shop Assistant 
application — connecting the existing frontend cart to the existing 
backend Orders API so that a placed order results in real Order and 
OrderItem rows persisted in the SQL database.

# Context
This is a brownfield e-commerce application with significant existing 
infrastructure:

BACKEND (ASP.NET Core 10 + EF Core + SQL Server):
- Order model with OrderNumber, TotalAmount, Status, ShippingAddress 
  (JSON), CustomerEmail, CustomerName, OrderItems collection
- OrderItem model with ProductId, ProductName, Quantity, UnitPrice, 
  linked to Order and Product
- CartItem model exists (SessionId, ProductId, Quantity, AddedAt) with 
  DbSet registered but NO controller/endpoints
- OrdersController with POST /api/orders (creates order + items in a 
  transaction), GET /api/orders/{id}, GET /api/orders/number/{orderNumber}
- CreateOrderRequest DTO expects Items[], TotalAmount, ShippingAddress, 
  CustomerEmail, CustomerName
- Products and Categories controllers already working

FRONTEND (Next.js 15 + TypeScript + React 19):
- Cart managed client-side via React Context + localStorage 
  (cart-context.tsx)
- Cart page (app/cart/page.tsx) displays items with quantity controls
- Checkout page (app/checkout/page.tsx) has 4 steps: 
  Shipping → Delivery → Payment → Review
- Checkout currently SIMULATES order processing with setTimeout and a 
  random order number — does NOT call the backend
- API client (lib/api/orders.ts) has createOrder(), getOrderById(), 
  getOrderByNumber(), buildOrderRequest() functions already defined 
  but never called from checkout
- Checkout success page exists but shows fake order data

# Instructions
Specify the complete feature to wire up the order flow:

1. CHECKOUT INTEGRATION: The checkout page's "Place Order" handler must 
   call the backend POST /api/orders via the existing createOrder() API 
   client function instead of simulating. Build the request using 
   buildOrderRequest() with cart items, shipping info, customer email 
   and name from the checkout form.

2. ORDER CONFIRMATION: After successful order creation, redirect to 
   /checkout/success with the real order number. The success page should 
   fetch and display real order details (items, totals, shipping address) 
   from GET /api/orders/number/{orderNumber}.

3. ERROR HANDLING: Handle API errors gracefully — show user-friendly 
   error messages if order creation fails (network error, validation 
   error, product not found). Do not clear the cart if the order fails.

4. CART CLEARING: Only clear the cart (via clearCart()) after a 
   successful order response from the backend.

5. DATA MAPPING: Map frontend cart items (productId as string, quantity) 
   to backend order items (productId as int, quantity, unitPrice from 
   product data). The frontend product IDs are strings; the backend 
   expects integers.

6. OPTIONAL - CART API (server-side): Optionally create a CartController 
   with basic endpoints (POST /api/cart/items, GET /api/cart/{sessionId}, 
   DELETE /api/cart/{sessionId}/items/{productId}) using the existing 
   CartItem model. This is secondary to the order flow but rounds out 
   the feature.

The end result must be: user adds products → goes to cart → proceeds 
to checkout → fills shipping/payment → places order → Order + OrderItem 
rows appear in the SQL database → success page shows real order details.