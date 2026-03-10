# Feature Specification: End-to-End Order Processing Flow

**Feature Branch**: `001-order-checkout-flow`  
**Created**: 2026-01-28  
**Status**: Draft  
**Input**: User description: "Complete the end-to-end order processing flow connecting the frontend cart to the backend Orders API so that placed orders result in real Order and OrderItem rows persisted in SQL."

## Assumptions

- The frontend product IDs (currently strings like `"elec-001"`) will be resolved to backend integer product IDs by looking up each product by its slug via the existing products API at checkout time. This ensures the order always references current, valid backend product IDs.
- Payment processing is out of scope. The existing payment form fields remain as UI placeholders only; no real payment gateway integration is included in this feature.
- Tax calculation (currently hardcoded at 10%) and shipping cost logic remain as-is. Future features may introduce dynamic tax/shipping calculations.
- The "estimated delivery" shown on the confirmation page will be calculated client-side (e.g., order date + 7 days for standard shipping) rather than being returned by the backend.
- Session management for the optional server-side cart uses an opaque session identifier; authentication/user accounts are not in scope.

## Clarifications

### Session 2026-03-10

- Q: What should the `TotalAmount` field persisted on the Order represent — items subtotal only, or grand total including tax and shipping? → A: Items subtotal only (sum of quantity × unit price for all line items). Tax and shipping remain frontend display values and are not persisted on the Order.
- Q: How should frontend string product IDs be resolved to backend integer IDs? → A: Lookup by slug at checkout time — call the products API to resolve each slug to an integer ID before submitting the order.
- Q: Should error messages expose backend details or show only generic messages? → A: Categorized messages — map backend error types to user-friendly messages that describe the problem category (e.g., "A product in your cart is no longer available", "Prices have changed, please review your cart") without exposing raw backend internals.
- Q: Should the confirmation page always fetch from the backend, or use the in-memory order response when available? → A: Use in-memory response when available for instant display after placement; fetch from backend on refresh or direct navigation as fallback.
- Q: Should the system validate checkout form fields client-side before submitting to the backend? → A: Yes — validate required fields (name, email format, address completeness) on the client side before submitting, showing inline validation errors. Backend validation remains as a safety net.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Submit a Real Order (Priority: P1)

As a shopper who has added items to my cart and completed the checkout form, I want my order to be submitted to the backend so that it is persisted as a real order with a unique order number and associated line items.

Today, clicking "Place Order" triggers a simulated delay and generates a random string as an order number. After this feature, the same button sends the cart contents and shipping information to the orders backend, which creates a real Order record and returns a system-generated order number (e.g., `ORD-2026-12345`). The cart is cleared **only** after the backend confirms success.

**Why this priority**: This is the foundational capability that makes the shop functional. Without a real order submission, the entire checkout is a no-op and no business value is delivered.

**Independent Test**: Can be fully tested by filling in the checkout form and clicking "Place Order" — the backend database will contain a new Order row with correct OrderItems, and the user will see a real order number.

**Acceptance Scenarios**:

1. **Given** a cart with two different products and completed shipping/payment forms, **When** the user clicks "Place Order", **Then** the system sends the order to the backend, receives a response containing a system-generated order number, and the order (with both line items) is persisted in the database.
2. **Given** a cart with one product at quantity 3, **When** the user clicks "Place Order", **Then** the created order contains one line item with quantity 3 and a unit price matching the product's current price.
3. **Given** a cart with items and valid shipping information, **When** the order is successfully created, **Then** the shopping cart is cleared and the user is redirected to the order confirmation page with the real order number.
4. **Given** a cart with items, **When** the user clicks "Place Order" and the request is in progress, **Then** the button shows a loading/processing state and is disabled to prevent duplicate submissions.
5. **Given** a cart with items whose frontend identifiers are strings, **When** the order is submitted, **Then** the system correctly resolves each item to the corresponding backend integer product ID and includes the accurate unit price from the product catalog.

---

### User Story 2 — Graceful Error Handling (Priority: P2)

As a shopper, when something goes wrong during order submission (network failure, backend validation error, server error), I want to see a clear error message and retain my cart contents so that I can try again without re-adding items.

**Why this priority**: Without error handling, any backend failure results in an unresponsive UI or a silent failure. This story ensures a reliable user experience but is secondary to the core order submission path.

**Independent Test**: Can be tested by simulating backend errors (e.g., invalid product ID, network timeout) and verifying the UI displays an appropriate error message while cart contents remain intact.

**Acceptance Scenarios**:

1. **Given** a cart with items, **When** the user clicks "Place Order" and the backend returns a validation error (e.g., product not found, total mismatch), **Then** the system displays a user-friendly error message describing the problem and the cart is **not** cleared.
2. **Given** a cart with items, **When** the user clicks "Place Order" and the network request fails (timeout, connection refused), **Then** the system displays a connectivity error message and the cart is **not** cleared.
3. **Given** a cart with items, **When** the user clicks "Place Order" and the backend returns a 500 server error, **Then** the system displays a generic error message (e.g., "Something went wrong. Please try again.") and the cart is **not** cleared.
4. **Given** an error message is displayed after a failed order attempt, **When** the user reviews the error, **Then** the "Place Order" button is re-enabled so the user can retry.

---

### User Story 3 — Order Confirmation with Real Details (Priority: P2)

As a shopper who just placed an order, I want the confirmation page to display real data from my order (order number, items, totals, shipping address) so that I have confidence my order was received correctly.

Today, the success page only shows the order number from the URL parameter and static content. After this feature, the confirmation page fetches the full order details from the backend and displays them.

**Why this priority**: This story enhances trust and user experience but is not strictly required for orders to be placed. Even without it, users would see a confirmation with the order number.

**Independent Test**: Can be tested by placing an order and verifying the success page shows the correct order number, item list, totals, and shipping address fetched from the backend.

**Acceptance Scenarios**:

1. **Given** a user has just placed an order, **When** they are redirected to the confirmation page, **Then** the page immediately displays the order details from the in-memory order response (order number, ordered items with names, quantities, prices, total amount, and shipping address) without an additional loading state.
2. **Given** a user is on the confirmation page, **When** the page is refreshed or accessed via a direct/bookmarked URL, **Then** the page fetches order details from the backend by order number and displays a loading indicator until the data is ready.
3. **Given** a user navigates directly to the confirmation page with an invalid or nonexistent order number, **When** the backend returns a 404 error, **Then** the page displays a message indicating the order was not found and provides a link to continue shopping.
4. **Given** a user is on the confirmation page, **When** they click "View Order Details", **Then** the button navigates to a view showing the complete order information (this may be the same page or a dedicated order details route).

---

### User Story 4 — Server-Side Cart API (Priority: P3)

As a system maintainer, I want an optional server-side cart API so that cart state can be persisted across devices/sessions and serve as a foundation for future features like abandoned cart recovery.

Today, the cart is managed entirely in the browser's local storage. This story introduces backend endpoints for creating, retrieving, and deleting cart items keyed by a session identifier, using the existing CartItem data model.

**Why this priority**: This is an enhancement that is not required for the core order flow to function. The frontend can continue using local storage for cart management. This story provides a backend foundation for future cart-related features.

**Independent Test**: Can be tested by calling the cart API endpoints directly (e.g., via HTTP client) to add, retrieve, and remove cart items, verifying correct persistence.

**Acceptance Scenarios**:

1. **Given** a session identifier, **When** a request is made to add a product to the cart with a quantity, **Then** the system persists the cart item and returns the updated cart state.
2. **Given** a session with existing cart items, **When** a request is made to retrieve the cart, **Then** the system returns all items associated with that session including product details.
3. **Given** a session with existing cart items, **When** a request is made to remove a specific item, **Then** the item is deleted and the updated cart state is returned.
4. **Given** a session with existing cart items, **When** a request is made to clear the entire cart, **Then** all items for that session are removed.

---

### Edge Cases

- What happens when a product in the cart has been deleted or deactivated on the backend between being added to the cart and submitting the order? The backend should return a validation error identifying the invalid product, and the user should see a message prompting them to update their cart.
- What happens when the user's cart contains the same product added at different times (duplicate product IDs)? The order should consolidate or handle them according to the cart's existing merge behavior (currently, quantities are aggregated).
- What happens when the user double-clicks the "Place Order" button very quickly? The UI must disable the button during processing to prevent duplicate order submissions.
- What happens when the user navigates away from the checkout page mid-submission? The in-flight request may complete or fail; the cart should only be cleared if the backend confirmed success.
- What happens when the backend is unreachable (API server down)? The user should see a clear network error message and the cart should be preserved.
- What happens when the order total calculated on the frontend does not match the backend's calculation? The backend returns a total-mismatch validation error; the user should see a message suggesting they refresh and try again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST submit order data (items, quantities, unit prices, shipping address, customer info) to the backend order creation endpoint when the user clicks "Place Order".
- **FR-002**: System MUST resolve frontend product identifiers (slugs) to backend product identifiers (integers) by querying the products API by slug at checkout time, before submitting the order, ensuring each item references a valid backend product.
- **FR-003**: System MUST include the unit price from the product catalog for each line item in the order request.
- **FR-004**: System MUST calculate the order total as the sum of (quantity × unit price) for all line items — excluding tax and shipping — and this total MUST match the backend's expected total within a rounding tolerance. Tax and shipping are displayed on the frontend only and are not included in the persisted `TotalAmount`.
- **FR-005**: System MUST clear the shopping cart only after receiving a successful order creation response from the backend.
- **FR-006**: System MUST redirect the user to the order confirmation page with the backend-generated order number upon successful order placement.
- **FR-007**: System MUST display a loading/processing state on the "Place Order" button while the order request is in progress and prevent duplicate submissions.
- **FR-008**: System MUST display a categorized, user-friendly error message when the backend returns a validation error — mapping error types to actionable descriptions (e.g., product-not-found → "A product in your cart is no longer available", total-mismatch → "Prices have changed, please review your cart") — without exposing raw backend error details, and MUST NOT clear the cart.
- **FR-009**: System MUST display a user-friendly connectivity error message (e.g., "Unable to reach the server. Please check your connection and try again.") when a network failure or server error occurs during order submission and MUST NOT clear the cart.
- **FR-010**: System MUST re-enable the "Place Order" button after an error so the user can retry.
- **FR-011**: The order confirmation page MUST display real order details (order number, items, totals, shipping address). When navigated to immediately after order placement, it MUST use the in-memory order response for instant display. When accessed via refresh or direct URL, it MUST fetch order details from the backend by order number.
- **FR-012**: The order confirmation page MUST show a loading state while fetching order details from the backend (applies to refresh/direct navigation only; not needed when using in-memory data).
- **FR-013**: The order confirmation page MUST handle invalid or missing order numbers gracefully by showing a "not found" message with navigation back to the shop.
- **FR-014** *(P3 only)*: System MUST provide API endpoints to add items to a server-side cart, retrieve cart contents by session, remove individual items, and clear the cart for a session.
- **FR-015** *(P3 only)*: Server-side cart endpoints MUST validate that referenced products exist before persisting cart items.
- **FR-016**: System MUST validate required checkout form fields (customer name, email format, shipping address completeness) on the client side before submitting the order request. Inline validation errors MUST be displayed for invalid or missing fields, and the order request MUST NOT be sent until all client-side validations pass. Backend validation remains as a safety net.

### Key Entities

- **Order**: A confirmed purchase record containing a unique order number (format: `ORD-YYYY-XXXXX`), customer information (name, email), shipping address, total amount (items subtotal only, excluding tax and shipping), order status, and creation timestamp. Each order has one or more order items.
- **Order Item**: A line item within an order, capturing the product reference, a snapshot of the product name at time of purchase, quantity, and unit price. The subtotal is derived from quantity multiplied by unit price.
- **Cart Item** *(P3 only)*: A temporary record associating a session identifier with a product reference and quantity. Cart items are transient and exist until the user places an order or explicitly removes them.
- **Shipping Address**: A composite value capturing recipient name, street address, city, state/province, postal code, and country.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full checkout flow (fill forms, place order, see confirmation) in under 30 seconds, excluding time spent filling in form fields.
- **SC-002**: 100% of successfully submitted orders result in a persisted order record with the correct number of line items and accurate totals.
- **SC-003**: When the backend returns an error, the user sees an error message within 2 seconds and the cart contents are fully preserved.
- **SC-004**: The order confirmation page displays real order details (items, prices, shipping address) matching the data submitted during checkout.
- **SC-005**: Zero duplicate orders are created during normal usage — the submit button is disabled during processing to prevent double-clicks.
- **SC-006**: 95% of users who begin the checkout process with a valid cart can successfully place an order on the first attempt (measured by order creation success rate).
- **SC-007** *(P3 only)*: Cart API endpoints respond within 500 milliseconds under typical load and correctly persist/retrieve cart state across requests for the same session.
