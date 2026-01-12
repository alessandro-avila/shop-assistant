# Feature Requirements Document: Shopping Cart (F-001)

## 1. Feature Overview

### 1.1 Feature Name
Shopping Cart Management

### 1.2 Feature ID
F-001

### 1.3 Description
The shopping cart allows users to add, view, update, and remove products before proceeding to checkout. It maintains cart state across sessions and provides real-time calculations for subtotals, taxes, and shipping.

### 1.4 Priority
P0 - Critical (Core e-commerce functionality)

### 1.5 Related Documents
- PRD: `specs/prd.md`
- Related Features: F-002 (Checkout), F-003 (Payment Processing)

## 2. User Stories

### US-001: Add Product to Cart
**As a** customer  
**I want to** add products to my shopping cart  
**So that** I can purchase them later

**Acceptance Criteria**:
- Given a product page, when I click "Add to Cart", the product is added with quantity 1
- Given a product already in cart, when I add it again, the quantity increases
- Given the add action, when completed, I see a confirmation message
- Given the cart icon, when products are added, I see the updated item count

### US-002: View Cart Contents
**As a** customer  
**I want to** view all items in my cart  
**So that** I can review my selections before checkout

**Acceptance Criteria**:
- Given items in my cart, when I view cart page, I see all products with images, names, prices, and quantities
- Given the cart page, when displayed, I see subtotal, estimated tax, and total
- Given an empty cart, when I view it, I see a message indicating the cart is empty

### US-003: Update Quantity
**As a** customer  
**I want to** change product quantities in my cart  
**So that** I can adjust my order before checkout

**Acceptance Criteria**:
- Given a cart item, when I increase/decrease quantity, the subtotal updates immediately
- Given a quantity change, when I set quantity to 0, the item is removed
- Given quantity limits, when I exceed max stock, I see an error message
- Given quantity updates, when completed, the cart total recalculates

### US-004: Remove Item
**As a** customer  
**I want to** remove items from my cart  
**So that** I can delete products I no longer want

**Acceptance Criteria**:
- Given a cart item, when I click "Remove", the item is deleted from cart
- Given item removal, when completed, I see a confirmation message
- Given item removal, when completed, cart totals recalculate automatically

### US-005: Cart Persistence
**As a** customer  
**I want to** my cart to persist across sessions  
**So that** I don't lose my selections

**Acceptance Criteria**:
- Given items in cart, when I close browser and return, my cart is preserved
- Given a logged-in user, when I switch devices, I see the same cart
- Given a guest user, when I log in, my guest cart merges with saved cart

## 3. Functional Requirements

### 3.1 Add to Cart
**FR-001**: System shall allow users to add products to cart from product listing and detail pages  
**FR-002**: System shall display a confirmation message when product is added  
**FR-003**: System shall update cart icon badge with total item count  
**FR-004**: System shall prevent adding out-of-stock items to cart  
**FR-005**: System shall enforce maximum quantity limits per product (e.g., 10 units)

### 3.2 Cart Display
**FR-006**: Cart page shall display all items with: product image (thumbnail), product name, SKU/variant, unit price, quantity, and line total  
**FR-007**: Cart page shall show cart summary with: subtotal, estimated tax, estimated shipping, and grand total  
**FR-008**: Cart page shall display empty state with call-to-action when cart is empty  
**FR-009**: Cart page shall show cart item count (X items)

### 3.3 Update Cart
**FR-010**: System shall allow quantity updates via +/- buttons and direct input  
**FR-011**: System shall validate quantity is within allowed range (1 to max stock)  
**FR-012**: System shall recalculate totals in real-time when quantity changes  
**FR-013**: System shall debounce rapid quantity changes to minimize API calls  
**FR-014**: System shall display loading state during cart updates

### 3.4 Remove from Cart
**FR-015**: Each cart item shall have a "Remove" or "Delete" button  
**FR-016**: System shall show confirmation dialog before removing high-value items (>$100)  
**FR-017**: System shall provide "Undo" option for 5 seconds after removal  
**FR-018**: System shall recalculate totals after item removal

### 3.5 Cart Persistence
**FR-019**: System shall save cart state to browser localStorage for guest users  
**FR-020**: System shall save cart state to database for authenticated users  
**FR-021**: System shall preserve cart for 30 days for authenticated users  
**FR-022**: System shall preserve cart for 7 days in localStorage for guests  
**FR-023**: System shall merge guest cart with user cart on login

### 3.6 Cart Calculations
**FR-024**: System shall calculate subtotal as sum of all line totals  
**FR-025**: System shall estimate tax based on shipping address (if available)  
**FR-026**: System shall estimate shipping based on cart weight and destination  
**FR-027**: System shall apply promotional discounts and coupon codes  
**FR-028**: System shall display all calculations with 2 decimal precision

## 4. Non-Functional Requirements

### 4.1 Performance
**NFR-001**: Cart operations (add, update, remove) shall complete in < 500ms  
**NFR-002**: Cart page shall load in < 2 seconds  
**NFR-003**: Cart icon badge shall update in < 100ms after cart change

### 4.2 Usability
**NFR-004**: Cart interface shall be accessible (WCAG 2.1 AA compliant)  
**NFR-005**: Cart shall be responsive and work on mobile, tablet, and desktop  
**NFR-006**: Cart updates shall provide visual feedback (loading spinners, success messages)

### 4.3 Security
**NFR-007**: Cart data shall not expose pricing logic or backend calculations  
**NFR-008**: Cart operations shall validate stock availability server-side  
**NFR-009**: Cart shall prevent price manipulation through client-side changes

### 4.4 Reliability
**NFR-010**: Cart operations shall have 99.9% success rate  
**NFR-011**: Cart state shall recover gracefully from network failures  
**NFR-012**: Cart shall handle concurrent updates (multiple tabs/devices)

## 5. API Specifications

### 5.1 Add to Cart
```
POST /api/cart/items
Request Body:
{
  "productId": "string",
  "variantId": "string (optional)",
  "quantity": number
}

Response (200):
{
  "success": true,
  "cart": { /* cart object */ },
  "message": "Product added to cart"
}

Response (400):
{
  "success": false,
  "error": "Out of stock"
}
```

### 5.2 Get Cart
```
GET /api/cart

Response (200):
{
  "items": [
    {
      "id": "string",
      "productId": "string",
      "name": "string",
      "image": "string",
      "price": number,
      "quantity": number,
      "lineTotal": number
    }
  ],
  "summary": {
    "subtotal": number,
    "tax": number,
    "shipping": number,
    "total": number,
    "itemCount": number
  }
}
```

### 5.3 Update Cart Item
```
PATCH /api/cart/items/:itemId
Request Body:
{
  "quantity": number
}

Response (200):
{
  "success": true,
  "cart": { /* updated cart */ }
}
```

### 5.4 Remove from Cart
```
DELETE /api/cart/items/:itemId

Response (200):
{
  "success": true,
  "cart": { /* updated cart */ }
}
```

### 5.5 Clear Cart
```
DELETE /api/cart

Response (200):
{
  "success": true,
  "message": "Cart cleared"
}
```

## 6. Data Model

### 6.1 Cart Object (Database)
```typescript
interface Cart {
  id: string;                    // UUID
  userId: string | null;         // null for guest carts
  sessionId: string;             // for guest carts
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface CartItem {
  id: string;                    // UUID
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  priceAtAdd: number;           // Price when added (for price change detection)
  addedAt: Date;
}
```

### 6.2 Cart State (Frontend)
```typescript
interface CartState {
  items: CartItemDisplay[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
}

interface CartItemDisplay {
  id: string;
  productId: string;
  name: string;
  image: string;
  sku: string;
  price: number;
  quantity: number;
  lineTotal: number;
  maxQuantity: number;
}

interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
}
```

## 7. User Interface Requirements

### 7.1 Cart Icon (Global Navigation)
- Display shopping cart icon in header
- Show badge with item count (e.g., "3")
- Provide mini-cart dropdown on hover/click showing last 3 items
- Include "View Cart" and "Checkout" buttons in dropdown

### 7.2 Cart Page Layout
- Header: "Shopping Cart (X items)"
- Left column (70%): List of cart items
- Right column (30%): Order summary card
- Each item shows: thumbnail image, product name, price, quantity controls, line total, remove button
- Bottom: "Continue Shopping" and "Proceed to Checkout" buttons

### 7.3 Empty Cart State
- Large cart icon
- Message: "Your cart is empty"
- "Start Shopping" button
- Optional: Recommended products

### 7.4 Mobile Considerations
- Single column layout
- Swipe to delete on mobile
- Sticky "Checkout" button at bottom
- Collapsible order summary

## 8. Edge Cases and Error Handling

### 8.1 Stock Availability
- **Scenario**: Item goes out of stock after being added to cart
- **Handling**: Show warning on cart page, prevent checkout, offer to remove item or save for later

### 8.2 Price Changes
- **Scenario**: Product price changes after being added to cart
- **Handling**: Display notice "Price updated since added", show old vs new price, update total

### 8.3 Product Deletion
- **Scenario**: Product is deleted/discontinued after being added to cart
- **Handling**: Mark as unavailable, prevent checkout, offer to remove

### 8.4 Cart Conflicts
- **Scenario**: User has cart in multiple devices/tabs
- **Handling**: Last-write-wins, show notification of cart update

### 8.5 Network Failures
- **Scenario**: API call fails during cart operation
- **Handling**: Show error message, retry with exponential backoff, maintain UI state

## 9. Testing Requirements

### 9.1 Unit Tests
- Cart calculations (subtotal, tax, total)
- Quantity validation logic
- Cart merge logic (guest → authenticated)
- Price change detection

### 9.2 Integration Tests
- Add to cart API
- Update quantity API
- Remove item API
- Cart persistence (database and localStorage)

### 9.3 E2E Tests
- Complete cart workflow: add → view → update → remove → checkout
- Multi-device cart synchronization
- Cart persistence across sessions
- Edge case scenarios (out of stock, price change)

### 9.4 Performance Tests
- Cart operations under load (1000+ concurrent users)
- Cart page load with 50+ items
- Rapid quantity updates

## 10. Acceptance Criteria Summary

✅ Users can add any in-stock product to cart  
✅ Users can view all cart items with details  
✅ Users can update quantities with real-time total updates  
✅ Users can remove items from cart  
✅ Cart persists across browser sessions  
✅ Authenticated users' carts sync across devices  
✅ Cart calculations are accurate (subtotal, tax, total)  
✅ Cart operations complete in < 500ms  
✅ Cart page is mobile responsive  
✅ Cart handles out-of-stock and price change scenarios  
✅ Cart is accessible (WCAG 2.1 AA)

## 11. Dependencies

- Product Service (for product details, pricing, stock)
- User Service (for authenticated cart storage)
- Tax Service (for tax calculation)
- Shipping Service (for shipping estimates)

## 12. Risks and Mitigations

### Risk 1: Cart Abandonment Due to Complexity
**Mitigation**: Keep cart UI simple, provide clear CTAs, show progress indicators

### Risk 2: Cart State Synchronization Issues
**Mitigation**: Implement robust conflict resolution, use optimistic UI updates with rollback

### Risk 3: Performance Degradation with Large Carts
**Mitigation**: Implement pagination for carts > 20 items, optimize database queries

## 13. Future Enhancements (Out of Scope)

- Save for later functionality
- Share cart feature
- Cart expiration notifications
- Guest cart recovery via email
- Bulk actions (clear all, update all quantities)
- Product recommendations in cart
- Cart analytics (abandonment tracking)

## 14. Approval

**Status**: Ready for Implementation  
**Created**: 2026-01-12  
**Owner**: Engineering Team  
**Reviewed By**: Product Manager, UX Designer, Tech Lead
