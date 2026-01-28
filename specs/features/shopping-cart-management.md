# Feature: Shopping Cart Management

## Feature ID
`FEAT-002`

## Feature Name
Shopping Cart Management and Persistence

## Business Purpose
Allow customers to add products to a shopping cart, manage quantities, and persist cart data across sessions for a seamless shopping experience.

## User Story
**As a** customer  
**I want to** add products to my cart and have my cart persist across sessions  
**So that** I can continue shopping later without losing my selections

---

## Functional Requirements

### FR-001: Add Product to Cart
**Description:** Add a product to the shopping cart with specified quantity

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Action: Click "Add to Cart" button on product card/detail page
- Component: Product card, product detail page
- File: `frontend/context/cart-context.tsx`
- Action type: `ADD_ITEM`
- Storage: localStorage (`shop-assistant:cart`)

**Logic:**
- If product already in cart, increment quantity
- If new product, add to cart with quantity 1 (or specified amount)
- Update localStorage immediately
- Display success notification (toast/banner)

**Acceptance Criteria:**
- ✅ Product added to cart with correct quantity
- ✅ Cart count badge updates in header
- ✅ User feedback (success message or animation)
- ✅ Cart persists across page navigation

**Implementation:**
```typescript
// Cart Context
dispatch({
  type: 'ADD_ITEM',
  payload: {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    imageUrl: product.imageUrl
  }
});
```

---

### FR-002: View Cart
**Description:** Display all products in the cart with details

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Page: `/cart`
- File: `frontend/app/cart/page.tsx`
- Data source: Cart Context (from localStorage)

**Display Elements:**
- Product image
- Product name
- Unit price
- Quantity selector
- Line total (quantity × price)
- Remove button
- Cart subtotal
- Cart total

**Acceptance Criteria:**
- ✅ All cart items displayed
- ✅ Correct pricing calculations
- ✅ Empty cart message if no items
- ✅ "Continue Shopping" button
- ✅ "Proceed to Checkout" button

---

### FR-003: Update Product Quantity
**Description:** Change the quantity of a product in the cart

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Control: Quantity selector (+ / - buttons or number input)
- Action type: `UPDATE_QUANTITY`
- Validation: Minimum quantity = 1

**Logic:**
- Update quantity in cart context
- Recalculate line total and cart total
- Update localStorage
- Validate product still available (future enhancement)

**Acceptance Criteria:**
- ✅ Quantity updates immediately
- ✅ Line total recalculates
- ✅ Cart total updates
- ✅ Cannot set quantity below 1
- ✅ Changes persist in localStorage

**Implementation:**
```typescript
dispatch({
  type: 'UPDATE_QUANTITY',
  payload: {
    productId: product.id,
    quantity: newQuantity
  }
});
```

---

### FR-004: Remove Product from Cart
**Description:** Remove a product entirely from the cart

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Control: "Remove" button/icon on each cart item
- Action type: `REMOVE_ITEM`
- Confirmation: Immediate removal (no confirmation dialog)

**Logic:**
- Remove item from cart array
- Recalculate cart total
- Update localStorage
- Display feedback message

**Acceptance Criteria:**
- ✅ Product removed from cart
- ✅ Cart total updates
- ✅ Cart count badge updates
- ✅ User feedback (success message)

**Implementation:**
```typescript
dispatch({
  type: 'REMOVE_ITEM',
  payload: productId
});
```

---

### FR-005: Clear Cart
**Description:** Remove all products from the cart at once

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Action: Clear cart after successful order
- Action type: `CLEAR_CART`
- Automatic: Triggered after order creation

**Logic:**
- Remove all items from cart
- Reset cart total to $0.00
- Update localStorage
- Used during checkout completion

**Acceptance Criteria:**
- ✅ All items removed
- ✅ Cart shows empty state
- ✅ Cart badge shows 0

**Implementation:**
```typescript
dispatch({ type: 'CLEAR_CART' });
```

---

### FR-006: Cart Persistence (localStorage)
**Description:** Persist cart data across browser sessions

**Implementation Status:** ✅ IMPLEMENTED

**Storage Mechanism:**
- Technology: Browser localStorage API
- Key: `shop-assistant:cart`
- Format: JSON string
- Trigger: Every cart state change

**Persistence Strategy:**
- **Save:** On every cart action (add, update, remove, clear)
- **Load:** On application mount (CartProvider useEffect)
- **Sync:** Automatic via React Context

**Data Structure:**
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Premium Wireless Headphones",
      "price": 299.99,
      "quantity": 2,
      "imageUrl": "https://..."
    }
  ],
  "lastModified": "2026-01-28T14:30:00Z"
}
```

**Acceptance Criteria:**
- ✅ Cart persists across page reloads
- ✅ Cart persists across browser sessions
- ✅ Cart loads on application startup
- ✅ Cart survives browser restart (until localStorage cleared)

---

### FR-007: Cart Count Badge
**Description:** Display number of items in cart in header

**Implementation Status:** ✅ IMPLEMENTED

**Frontend:**
- Location: Header navigation
- Component: Header
- Data source: Cart Context
- Calculation: Sum of all item quantities

**Display Rules:**
- Show count if cart not empty
- Hide or show "0" if empty
- Update in real-time on cart changes

**Acceptance Criteria:**
- ✅ Count displays correctly
- ✅ Updates on add/remove/update
- ✅ Visible on all pages

---

## Non-Functional Requirements

### NFR-001: Performance
**Status:** ✅ MET

- Cart operations: < 50ms (localStorage is fast)
- No network calls required for cart operations
- React Context updates cause minimal re-renders

### NFR-002: Data Integrity
**Status:** ✅ MET

- Cart data validated on load (JSON parsing with error handling)
- Invalid cart data is reset
- Product IDs are integers (validated)

### NFR-003: Storage Limits
**Status:** ✅ MET

- localStorage limit: ~5-10MB per domain (browser-dependent)
- Typical cart size: < 10KB
- No concerns with storage limits for normal use

---

## User Workflows

### Workflow 1: Add to Cart and Checkout
1. User browses products
2. User clicks "Add to Cart" on product card
3. System adds product to cart
4. Cart badge updates to show "1"
5. User clicks cart icon in header
6. System displays cart page with added product
7. User clicks "Proceed to Checkout"
8. System navigates to checkout page

### Workflow 2: Update Cart Before Checkout
1. User opens cart page
2. User increases quantity of item from 1 to 3
3. System updates line total and cart total
4. User removes another item
5. System updates cart total
6. User proceeds to checkout

### Workflow 3: Persistent Cart Across Sessions
1. User adds products to cart
2. User closes browser tab
3. User reopens website (hours/days later)
4. System loads cart from localStorage
5. Cart displays previously added items

---

## Data Model

**Cart State Structure:**

```typescript
interface CartState {
  items: CartItem[];
  lastModified: string;  // ISO 8601 timestamp
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug?: string;  // For navigation
}
```

**Calculated Fields:**
- Line Total: `quantity × price`
- Cart Subtotal: `Σ(quantity × price)` for all items
- Cart Total: Subtotal + Shipping + Tax (shipping/tax not implemented)

---

## State Management

**Technology:** React Context API + useReducer

**Provider:** `CartProvider` (wraps entire application)  
**File:** `frontend/context/cart-context.tsx`

**Reducer Actions:**
- `ADD_ITEM` - Add or increment product quantity
- `REMOVE_ITEM` - Remove product from cart
- `UPDATE_QUANTITY` - Set specific quantity
- `CLEAR_CART` - Remove all items
- `LOAD_CART` - Load from localStorage on mount

**Context API:**
```typescript
const { state, dispatch } = useCartContext();

// Add item
dispatch({ type: 'ADD_ITEM', payload: cartItem });

// Remove item
dispatch({ type: 'REMOVE_ITEM', payload: productId });

// Update quantity
dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });

// Clear cart
dispatch({ type: 'CLEAR_CART' });
```

---

## Business Rules

### BR-001: Minimum Quantity
- Minimum quantity per item: 1
- Cannot set quantity to 0 (use Remove instead)

### BR-002: Maximum Quantity
**Status:** ❌ NOT IMPLEMENTED

- No maximum quantity limit enforced
- Future: Should validate against product stock

### BR-003: Product Availability
**Status:** ❌ NOT IMPLEMENTED

- Cart does not check if product is still in stock
- Cart does not check if product still exists
- Future: Validate products during checkout

### BR-004: Price Updates
**Status:** ❌ NOT IMPLEMENTED

- Prices in cart are snapshots from when added
- Prices do NOT update if product price changes
- Future: Refresh prices on checkout or periodically

### BR-005: Cart Expiration
**Status:** ❌ NOT IMPLEMENTED

- Cart data never expires in localStorage
- Persists indefinitely until manually cleared or browser storage cleared
- Future: Consider 30-day expiration

---

## API Endpoints

**Note:** Cart management is **entirely client-side**. No backend API endpoints for cart operations.

**Backend API used during checkout:**
- `POST /api/orders` - Create order from cart items
- `GET /api/products/{id}` - Fetch current product details (optional, for validation)

---

## Frontend Components

| Component | Purpose | File |
|-----------|---------|------|
| `CartProvider` | Global cart state provider | `context/cart-context.tsx` |
| `CartPage` | Cart display page | `app/cart/page.tsx` |
| `CartItem` | Individual cart item display | (Inline in cart page) |
| `Header` | Cart badge display | `components/layout/header.tsx` |

---

## Security Considerations

### SEC-001: Client-Side Storage
**Risk:** Cart data stored in browser localStorage (client-controlled)  
**Impact:** User can modify cart data in browser developer tools  
**Mitigation:**  
- Prices validated on backend during order creation
- Product IDs validated against database
- Total amount recalculated on backend
**Status:** ✅ MITIGATED

### SEC-002: Price Manipulation
**Risk:** User modifies product prices in localStorage  
**Impact:** User attempts to place order with incorrect prices  
**Mitigation:**  
- Backend ignores client-sent prices (except for validation)
- Backend fetches current product prices from database
- Total amount validated on backend
**Status:** ✅ MITIGATED (backend validates)

### SEC-003: XSS via Product Names
**Risk:** Malicious product name injected into cart  
**Impact:** XSS attack when displaying cart  
**Mitigation:**  
- React automatically escapes HTML
- Product names from trusted source (backend database)
**Status:** ✅ PROTECTED

---

## Edge Cases & Error Handling

### EC-001: localStorage Not Available
**Scenario:** Browser has localStorage disabled or in private browsing mode  
**Behavior:** Cart still works (in-memory only), but does not persist  
**Status:** ⚠️ PARTIAL (should detect and warn user)

### EC-002: Corrupted Cart Data
**Scenario:** Invalid JSON in localStorage  
**Behavior:** Cart resets to empty state  
**Status:** ✅ HANDLED (try/catch on JSON.parse)

### EC-003: Product Deleted from Database
**Scenario:** Product in cart is deleted from backend  
**Behavior:** Cart still shows product, but order creation fails  
**Status:** ⚠️ KNOWN ISSUE (should validate during checkout)

### EC-004: Product Out of Stock
**Scenario:** Product in cart becomes out of stock  
**Behavior:** Cart still allows checkout (no stock validation)  
**Status:** ❌ NOT HANDLED (future enhancement)

### EC-005: Price Changed Since Added
**Scenario:** Product price changes after adding to cart  
**Behavior:** Cart shows old price, checkout uses new price  
**Status:** ⚠️ KNOWN ISSUE (should refresh prices or warn user)

---

## Testing

### Unit Tests
**Status:** ❌ NOT IMPLEMENTED

Should test:
- Cart reducer actions (add, remove, update, clear)
- Cart calculations (line totals, cart total)
- localStorage save/load logic

### Integration Tests
**Status:** ❌ NOT IMPLEMENTED

Should test:
- Add product to cart → verify localStorage updated
- Update quantity → verify calculations correct
- Remove item → verify cart state updated

### E2E Tests
**Status:** ❌ NOT IMPLEMENTED

Should test:
- Complete shopping flow (add → view cart → update → checkout)
- Cart persistence across page reloads
- Cart badge updates correctly

---

## Dependencies

### Frontend Dependencies
- React Context API (state management)
- Browser localStorage API (persistence)
- React hooks (useState, useEffect, useReducer, useContext)

### No Backend Dependencies
- Cart management is entirely client-side
- Backend only used during checkout

---

## Future Enhancements

**NOT CURRENTLY IMPLEMENTED:**

1. **Server-Side Cart:**
   - Store cart in database (CartItems table exists but unused)
   - Associate with user session or account
   - Sync across devices

2. **Cart Validation:**
   - Check product stock before checkout
   - Validate product still exists
   - Refresh prices on cart page load

3. **Cart Expiration:**
   - Auto-clear cart after 30 days
   - Show warning for old cart items

4. **Save for Later:**
   - Move items to "saved" list
   - Retrieve later

5. **Cart Sharing:**
   - Generate shareable cart link
   - Social sharing

6. **Abandoned Cart Recovery:**
   - Email reminders (requires user accounts)

7. **Guest Cart Migration:**
   - Transfer guest cart to account after login

8. **Quantity Limits:**
   - Max quantity per product
   - Max items in cart
   - Bulk discounts

9. **Cart Analytics:**
   - Track cart abandonment rate
   - Track average cart value

---

## Known Limitations

1. **No Stock Validation:**
   - Cart doesn't check product availability
   - User can add out-of-stock products

2. **No Price Refresh:**
   - Prices are snapshots from when added
   - Don't update automatically

3. **No Multi-Currency:**
   - All prices in USD
   - No currency conversion

4. **No Cart Recovery:**
   - If localStorage cleared, cart is lost
   - No server-side backup

5. **Single-Device Only:**
   - Cart doesn't sync across devices
   - Each browser has own cart

---

## Implementation Files

### Frontend Files
- `frontend/context/cart-context.tsx` - Cart state management
- `frontend/app/cart/page.tsx` - Cart display page
- `frontend/lib/types/cart.ts` - TypeScript types
- `frontend/lib/hooks/use-cart.ts` - Custom cart hook
- `frontend/components/layout/header.tsx` - Cart badge

### No Backend Files
- Cart management is entirely frontend
- CartItems table in database not used

---

## Alternative Approaches Considered

### Approach 1: Server-Side Cart (Not Chosen)
**Pros:**
- Cart syncs across devices
- Stock validation possible
- Price updates automatic
- Persistent even if localStorage cleared

**Cons:**
- Requires user authentication or session management
- Requires backend API endpoints
- More complex implementation
- Network calls for every cart operation

**Decision:** Use localStorage for simplicity (no auth system yet)

### Approach 2: Redux/Zustand (Not Chosen)
**Pros:**
- More sophisticated state management
- Better dev tools
- Middleware support

**Cons:**
- Additional dependency
- Overkill for simple cart state
- Steeper learning curve

**Decision:** Use React Context + useReducer (built-in, sufficient)

---

**Feature Status:** ✅ FULLY IMPLEMENTED (Client-Side Only)  
**Last Updated:** January 28, 2026  
**Version:** 1.0
