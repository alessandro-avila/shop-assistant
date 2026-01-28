# Task 005: Frontend Cart Page Implementation

**Task ID:** TASK-005  
**Feature:** FEAT-CART-001 (Shopping Cart Management)  
**Priority:** High  
**Complexity:** Medium  
**Estimated Effort:** 6-8 hours

---

## Description

Implement the shopping cart page (`/cart`) where users can view all items in their cart, update quantities, remove items, see totals, and proceed to checkout. This is a new page that needs to be created from scratch using the existing cart context.

---

## Dependencies

**Prerequisite Tasks:**
- TASK-004 (Frontend Cart Context Enhancement) - Required for cart operations and calculations

**Blocks:**
- TASK-006 (Frontend Checkout Form)

---

## Technical Requirements

### Page Specifications

1. **Route:** `/cart`
2. **File:** `frontend/app/cart/page.tsx`
3. **Layout:** Uses site-wide header/footer from root layout
4. **State Management:** Consumes `useCartContext()` hook

### UI Components to Create

1. **Cart Page (`app/cart/page.tsx`)**
   - Main container for cart display
   - Conditional rendering: empty state vs. cart with items
   - Responsive layout (mobile, tablet, desktop)

2. **Cart Item Component (`components/cart/cart-item.tsx`)**
   - Display single cart item:
     - Product image (thumbnail)
     - Product name (linked to product detail page)
     - Unit price
     - Quantity controls (-, input, + buttons)
     - Line total (quantity × price)
     - Remove button
   - Quantity update handlers
   - Remove item handler

3. **Cart Summary Component (`components/cart/cart-summary.tsx`)**
   - Display cart totals:
     - Item count: "X items"
     - Subtotal
     - "Proceed to Checkout" button
   - Sticky positioning on desktop (stays visible while scrolling)
   - Full-width on mobile

4. **Empty Cart Component (`components/cart/empty-cart.tsx`)**
   - Display when cart is empty
   - Icon/illustration (optional)
   - Message: "Your cart is empty"
   - "Continue Shopping" button (link to products page)

### Functional Requirements

1. **Display Cart Items**
   - Show all items from cart context
   - Display product name, image, price, quantity, line total
   - Product name links to `/products/{slug}`
   - Product image is clickable (same link)
   - Line total updates in real-time when quantity changes

2. **Quantity Controls**
   - Decrement button (-): Decreases quantity by 1
   - Increment button (+): Increases quantity by 1
   - Input field: Allows direct quantity entry
   - Minimum quantity: 1
   - Maximum quantity: 100
   - Quantity of 1: Decrement button changes to "Remove" or disables
   - Changes save automatically to cart context (localStorage)

3. **Remove Item**
   - Remove button/icon on each cart item
   - Confirmation not required (can undo by re-adding)
   - Item removed from cart immediately
   - Toast notification: "{Product} removed from cart" (optional)

4. **Cart Summary**
   - Display total item count
   - Display subtotal (sum of line totals)
   - "Proceed to Checkout" button
   - Button disabled if cart is empty
   - Button navigates to `/checkout`

5. **Empty Cart State**
   - Displayed when cart has 0 items
   - "Continue Shopping" button links to `/products`
   - Friendly message and visual

6. **Responsive Design**
   - **Desktop:** Cart items in table/grid, summary in sidebar
   - **Tablet:** Cart items stacked, summary below
   - **Mobile:** Single column, compact layout, summary fixed at bottom

7. **Loading States**
   - No loading needed (cart is local, instant)
   - Optional: Skeleton loaders on initial mount

8. **Animations** (Optional)
   - Fade out animation when removing item
   - Smooth quantity counter updates
   - Toast notification slide-in

---

## Acceptance Criteria

### Functional Requirements

1. **Cart Display**
   - ✅ Page accessible at `/cart` route
   - ✅ All cart items display correctly with images, names, prices
   - ✅ Product names are clickable links to product detail pages
   - ✅ Line totals calculate correctly (quantity × price)
   - ✅ Empty cart message shows when cart is empty

2. **Quantity Updates**
   - ✅ Increment button increases quantity by 1
   - ✅ Decrement button decreases quantity by 1
   - ✅ Direct input allows typing quantity
   - ✅ Quantity cannot go below 1 or above 100
   - ✅ Quantity changes update line total immediately
   - ✅ Quantity changes persist (saved to localStorage)

3. **Remove Item**
   - ✅ Remove button removes item from cart
   - ✅ Cart updates immediately (no page refresh)
   - ✅ Empty state shows if last item removed

4. **Cart Summary**
   - ✅ Item count accurate (total quantity across all items)
   - ✅ Subtotal accurate (sum of all line totals)
   - ✅ "Proceed to Checkout" button enabled when cart has items
   - ✅ Button disabled/hidden when cart is empty
   - ✅ Button navigates to `/checkout` route

5. **Responsive Design**
   - ✅ Layout works on mobile (320px+)
   - ✅ Layout works on tablet (768px+)
   - ✅ Layout works on desktop (1024px+)
   - ✅ Touch-friendly buttons on mobile (44px+ tap targets)

6. **Accessibility**
   - ✅ All buttons have accessible labels
   - ✅ Quantity inputs have labels (visible or aria-label)
   - ✅ Screen readers announce cart updates
   - ✅ Keyboard navigation works (tab through items)
   - ✅ Focus management (focus on first item after delete)

### Non-Functional Requirements
- ✅ Page loads in < 500ms
- ✅ Quantity updates reflect instantly (< 100ms)
- ✅ No layout shift when updating quantities
- ✅ Smooth animations (60fps)

### Code Quality
- ✅ TypeScript strict mode compliant
- ✅ Components are modular and reusable
- ✅ Follows Next.js 14 App Router conventions
- ✅ Uses Tailwind CSS for styling
- ✅ Proper error boundaries

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: Cart Page Renders Empty State**
   - Given: Cart is empty
   - When: Cart page loads
   - Then: Empty cart message displayed, "Continue Shopping" button visible

2. **Test: Cart Page Renders Cart Items**
   - Given: Cart has 3 items
   - When: Cart page loads
   - Then: All 3 items displayed with correct details

3. **Test: Increment Quantity**
   - Given: Cart item with quantity 2
   - When: Click increment button
   - Then: Quantity updates to 3, line total recalculated

4. **Test: Decrement Quantity**
   - Given: Cart item with quantity 3
   - When: Click decrement button
   - Then: Quantity updates to 2, line total recalculated

5. **Test: Direct Quantity Input**
   - Given: Cart item with quantity 2
   - When: Type "5" in quantity input
   - Then: Quantity updates to 5, line total recalculated

6. **Test: Remove Item**
   - Given: Cart has 2 items
   - When: Click remove button on item 1
   - Then: Item 1 removed, cart has 1 item

7. **Test: Remove Last Item**
   - Given: Cart has 1 item
   - When: Click remove button
   - Then: Empty cart state displayed

8. **Test: Cart Summary Calculations**
   - Given: Cart with items (2×$100, 3×$50)
   - Then: Item count shows "5 items", Subtotal shows "$350.00"

9. **Test: Proceed to Checkout Button**
   - Given: Cart has items
   - When: Click "Proceed to Checkout"
   - Then: Navigate to `/checkout` route

### Integration Tests (Required)

1. **Test: Add Item from Product Page, View in Cart**
   - Navigate to product page
   - Add product to cart
   - Navigate to `/cart`
   - Verify: Product appears in cart

2. **Test: Update Quantity, Verify Persistence**
   - Update quantity on cart page
   - Refresh page
   - Verify: Quantity change persisted

3. **Test: Remove All Items, Verify Empty State**
   - Remove all items from cart
   - Verify: Empty cart message displayed
   - Click "Continue Shopping"
   - Verify: Navigate to products page

### Visual Regression Tests (Optional)

1. Test: Empty cart state
2. Test: Cart with 1 item
3. Test: Cart with 10 items
4. Test: Mobile layout (375px)
5. Test: Desktop layout (1440px)

---

## Design Specifications

### Layout Structure (Desktop)
```
┌─────────────────────────────────────────────────────┐
│ Header (from root layout)                           │
└─────────────────────────────────────────────────────┘
┌──────────────────────────────┬──────────────────────┐
│ Cart Items (70%)             │ Cart Summary (30%)   │
│ ┌──────────────────────────┐ │ ┌────────────────┐   │
│ │ Item 1                   │ │ │ Items: 5       │   │
│ │ - Image                  │ │ │ Subtotal: $350 │   │
│ │ - Name (link)            │ │ │ [Checkout]     │   │
│ │ - Price                  │ │ └────────────────┘   │
│ │ - Quantity controls      │ │                      │
│ │ - Remove button          │ │                      │
│ └──────────────────────────┘ │                      │
│ ┌──────────────────────────┐ │                      │
│ │ Item 2                   │ │                      │
│ └──────────────────────────┘ │                      │
└──────────────────────────────┴──────────────────────┘
```

### Layout Structure (Mobile)
```
┌───────────────────────┐
│ Header                │
└───────────────────────┘
│ Cart Items            │
│ ┌───────────────────┐ │
│ │ Item 1            │ │
│ │ Image | Details   │ │
│ │ Qty: [-][2][+]    │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ Item 2            │ │
│ └───────────────────┘ │
├───────────────────────┤
│ Fixed Bottom Summary  │
│ 5 items | $350        │
│ [Proceed to Checkout] │
└───────────────────────┘
```

### Color Scheme (Tailwind)
- Primary button: `bg-blue-600 hover:bg-blue-700`
- Remove button: `bg-red-600 hover:bg-red-700` or `text-red-600`
- Borders: `border-gray-200 dark:border-gray-700`
- Text: `text-gray-900 dark:text-gray-100`

### Typography
- Page title: `text-3xl font-bold`
- Product name: `text-lg font-medium`
- Prices: `text-lg font-semibold`
- Subtotal: `text-2xl font-bold`

---

## Implementation Notes

### Files to Create

1. **frontend/app/cart/page.tsx** - Main cart page
2. **frontend/components/cart/cart-item.tsx** - Single cart item component
3. **frontend/components/cart/cart-summary.tsx** - Cart totals and checkout button
4. **frontend/components/cart/empty-cart.tsx** - Empty cart state
5. **frontend/components/cart/quantity-control.tsx** (optional) - Reusable quantity controls

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State:** React Context (from cart-context.tsx)
- **Routing:** Next.js Link component
- **Icons:** Lucide React or Heroicons (optional)

### Key Implementation Details

1. Import cart context: `const { state, dispatch } = useCartContext()`
2. Use `state.items` to render cart items
3. Use `dispatch` to update quantities, remove items
4. Use Next.js `<Link>` for navigation
5. Use Next.js `<Image>` component for product images
6. Format prices with utility function: `formatCurrency(price)`

### Helper Functions Needed
```typescript
// Format currency (e.g., 299.99 → "$299.99")
function formatCurrency(amount: number): string

// Calculate line total
function calculateLineTotal(quantity: number, price: number): number
```

### State Management Pattern
```typescript
// Increment quantity
dispatch({ 
  type: 'INCREMENT_ITEM', 
  payload: productId 
})

// Update quantity directly
dispatch({ 
  type: 'UPDATE_QUANTITY', 
  payload: { productId, quantity } 
})

// Remove item
dispatch({ 
  type: 'REMOVE_ITEM', 
  payload: productId 
})
```

---

## Accessibility Requirements

1. **Semantic HTML**
   - Use `<main>` for cart content
   - Use `<section>` for cart items and summary
   - Use `<article>` for individual cart items
   - Use `<button>` for all interactive elements

2. **ARIA Labels**
   - Increment button: `aria-label="Increase quantity"`
   - Decrement button: `aria-label="Decrease quantity"`
   - Remove button: `aria-label="Remove {productName} from cart"`
   - Quantity input: `aria-label="Quantity"`

3. **Keyboard Navigation**
   - All buttons focusable and operable via keyboard
   - Tab order logical (top to bottom, left to right)
   - Enter/Space activates buttons

4. **Screen Readers**
   - Announce cart updates: `aria-live="polite"` on cart summary
   - Product links have descriptive text
   - Quantity changes announced

---

## Related Features

- **FEAT-CART-001**: Shopping Cart Management (primary feature)
- **FEAT-CHECKOUT-001**: Checkout Process (next step after cart)

---

## Open Questions

1. **Q:** Should we show product variants/options in cart (size, color)?  
   **A:** Not in scope - products don't have variants currently

2. **Q:** Should we show estimated shipping costs in cart?  
   **A:** Out of scope for MVP - no shipping calculation implemented

3. **Q:** Should we allow saving cart for later?  
   **A:** Out of scope - cart already persists in localStorage

---

## Definition of Done

- ✅ Cart page created at `/cart` route
- ✅ All components implemented (cart item, summary, empty state)
- ✅ All functional requirements met
- ✅ Responsive design works on all screen sizes
- ✅ All unit tests passing (≥85% coverage)
- ✅ Integration tests passing
- ✅ Accessibility requirements met (WCAG 2.1 AA)
- ✅ TypeScript strict mode compliant
- ✅ ESLint passes with no warnings
- ✅ Code peer-reviewed
- ✅ Manual testing completed on multiple devices
- ✅ PR approved and merged

---

## Success Metrics

- Page load time < 500ms
- Quantity update latency < 100ms
- Zero accessibility violations (axe DevTools)
- Works on all major browsers (Chrome, Firefox, Safari, Edge)
- Positive user testing feedback
