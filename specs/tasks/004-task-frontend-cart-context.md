# Task 004: Frontend Cart Context Enhancement

**Task ID:** TASK-004  
**Feature:** FEAT-CART-001 (Shopping Cart Management)  
**Priority:** High  
**Complexity:** Low  
**Estimated Effort:** 2-3 hours

---

## Description

Enhance the existing shopping cart React Context with additional features required by the cart and checkout flows: cart clearing, item validation, and helper methods for cart calculations. The cart context already exists and functions but needs enhancements for the complete feature set.

---

## Dependencies

**Prerequisite Tasks:** None (can start immediately)

**Blocks:**
- TASK-005 (Frontend Cart Page)
- TASK-006 (Frontend Checkout Form)

---

## Technical Requirements

### Current Implementation
- Location: `frontend/context/cart-context.tsx`
- Current features:
  - ✅ ADD_ITEM action (with quantity merge)
  - ✅ REMOVE_ITEM action
  - ✅ UPDATE_QUANTITY action
  - ✅ CLEAR_CART action
  - ✅ LOAD_CART action
  - ✅ localStorage persistence (auto-save and load)
  - ✅ TypeScript types defined

### Required Enhancements

1. **Cart Calculation Helpers**
   Add computed values to cart state or context value:
   - `totalItems`: Total number of items in cart (sum of all quantities)
   - `subtotal`: Sum of all line totals (quantity × price)
   - `isEmpty`: Boolean indicating if cart has no items

2. **Item Validation**
   - Prevent negative quantities
   - Prevent quantities exceeding 100
   - Validate product IDs are positive integers
   - Show console warnings for validation failures (dev mode)

3. **Cart Actions Enhancement**
   - `INCREMENT_ITEM`: Increase quantity by 1 (convenience action)
   - `DECREMENT_ITEM`: Decrease quantity by 1, remove if reaches 0
   - Handle edge cases (incrementing to max, decrementing from 1)

4. **Error Boundary**
   - Wrap cart operations in try-catch
   - Handle localStorage quota exceeded error
   - Show user-friendly error message if cart save fails
   - Graceful degradation: cart works in-memory if localStorage fails

5. **TypeScript Enhancements**
   - Ensure strict typing for all actions
   - Add JSDoc comments for all exported functions
   - Export helper functions for cart calculations

6. **Performance Optimization**
   - Memoize cart calculations (totalItems, subtotal)
   - Prevent unnecessary re-renders
   - Use `useMemo` for computed values

---

## Acceptance Criteria

### Functional Requirements

1. **Cart Calculations**
   - ✅ `totalItems` accurately sums all item quantities
   - ✅ `subtotal` accurately sums all line totals (quantity × price)
   - ✅ `isEmpty` returns true when cart has 0 items
   - ✅ Calculations update immediately when cart changes

2. **Quantity Validation**
   - ✅ Quantity cannot be set to negative value (clamped to 0, item removed)
   - ✅ Quantity cannot exceed 100 (clamped to 100)
   - ✅ Quantity of 0 removes item from cart
   - ✅ Console warning logged for validation violations (dev mode)

3. **Increment/Decrement Actions**
   - ✅ INCREMENT_ITEM increases quantity by 1
   - ✅ INCREMENT_ITEM respects max quantity (100)
   - ✅ DECREMENT_ITEM decreases quantity by 1
   - ✅ DECREMENT_ITEM removes item if quantity reaches 0

4. **Error Handling**
   - ✅ localStorage quota exceeded: Cart works in-memory, user notified
   - ✅ Corrupted localStorage data: Cart resets gracefully
   - ✅ Invalid cart data: Logged and ignored, cart initializes empty

5. **Performance**
   - ✅ Cart calculations memoized (don't recalculate unnecessarily)
   - ✅ Context updates don't cause excessive re-renders
   - ✅ localStorage operations are batched/debounced (optional)

### Non-Functional Requirements
- ✅ All cart operations complete in < 50ms
- ✅ Context value is properly typed (no `any` types)
- ✅ Code is well-documented with JSDoc comments
- ✅ Follows React best practices (hooks, memoization)

### Code Quality
- ✅ TypeScript strict mode compliant
- ✅ ESLint passes with no warnings
- ✅ Consistent code style with existing codebase
- ✅ No console errors or warnings in normal usage

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: Add Item to Empty Cart**
   - Given: Empty cart
   - When: ADD_ITEM action dispatched
   - Then: Cart contains 1 item with correct details

2. **Test: Add Duplicate Item (Quantity Merge)**
   - Given: Cart has Product A (quantity: 2)
   - When: ADD_ITEM for Product A (quantity: 3)
   - Then: Cart has Product A (quantity: 5)

3. **Test: Remove Item**
   - Given: Cart has 3 items
   - When: REMOVE_ITEM action for item 2
   - Then: Cart has 2 items, item 2 removed

4. **Test: Update Quantity**
   - Given: Cart has Product A (quantity: 2)
   - When: UPDATE_QUANTITY to 5
   - Then: Product A quantity = 5

5. **Test: Update Quantity to Zero**
   - Given: Cart has Product A (quantity: 2)
   - When: UPDATE_QUANTITY to 0
   - Then: Product A removed from cart

6. **Test: Update Quantity Exceeds Max**
   - Given: Cart has Product A (quantity: 50)
   - When: UPDATE_QUANTITY to 150
   - Then: Product A quantity clamped to 100

7. **Test: Increment Item**
   - Given: Cart has Product A (quantity: 2)
   - When: INCREMENT_ITEM action
   - Then: Product A quantity = 3

8. **Test: Decrement Item to Zero**
   - Given: Cart has Product A (quantity: 1)
   - When: DECREMENT_ITEM action
   - Then: Product A removed from cart

9. **Test: Clear Cart**
   - Given: Cart has 5 items
   - When: CLEAR_CART action
   - Then: Cart is empty

10. **Test: Total Items Calculation**
    - Given: Cart has 3 products (quantities: 2, 3, 1)
    - When: Calculate totalItems
    - Then: Returns 6

11. **Test: Subtotal Calculation**
    - Given: Cart has 2 items (2×$100, 3×$50)
    - When: Calculate subtotal
    - Then: Returns 350.00

12. **Test: isEmpty Flag**
    - Given: Empty cart
    - Then: isEmpty = true
    - When: Add item
    - Then: isEmpty = false

### Integration Tests (Required)

1. **Test: localStorage Persistence**
   - Add items to cart
   - Simulate page refresh (remount component)
   - Verify: Cart loads from localStorage with same items

2. **Test: localStorage Error Handling**
   - Mock localStorage to throw quota exceeded error
   - Add item to cart
   - Verify: Cart works in-memory, error logged

3. **Test: Corrupted localStorage**
   - Set localStorage to invalid JSON
   - Load cart context
   - Verify: Cart initializes empty, no crash

### Component Tests (React Testing Library)

1. **Test: Context Provider**
   - Render component wrapped in CartProvider
   - Verify: Context value accessible via useCartContext()

2. **Test: Cart Operations Trigger Re-renders**
   - Render component using cart context
   - Dispatch ADD_ITEM action
   - Verify: Component re-renders with updated cart

---

## Implementation Notes

### Files to Modify

1. **frontend/context/cart-context.tsx**
   - Add calculation helpers (totalItems, subtotal, isEmpty)
   - Add INCREMENT_ITEM and DECREMENT_ITEM actions
   - Add validation logic
   - Add error handling for localStorage
   - Add memoization for performance

2. **frontend/lib/types/cart.ts** (if needed)
   - Update CartAction type with new actions
   - Add helper type definitions

### Code Structure (Conceptual)

The implementation should:
1. Use `useMemo` to calculate totalItems and subtotal
2. Add INCREMENT_ITEM and DECREMENT_ITEM to reducer
3. Wrap localStorage operations in try-catch
4. Validate quantities in reducer (clamp to 0-100)
5. Export helper functions: `getCartTotal`, `getItemCount`, etc.

### Helper Functions to Export
```typescript
// Calculate total number of items
export function getCartItemCount(cart: CartState): number

// Calculate subtotal
export function getCartSubtotal(cart: CartState): number

// Check if cart is empty
export function isCartEmpty(cart: CartState): boolean

// Get line total for single item
export function getLineTotal(item: CartItem): number
```

### Context Value Enhancement
```typescript
// Current: { state, dispatch }
// Enhanced: { state, dispatch, totalItems, subtotal, isEmpty }
```

### Performance Considerations
- Use `useMemo` for calculations (avoid recalculating on every render)
- Consider debouncing localStorage writes (optional)
- Ensure reducer is pure (no side effects)

---

## Error Handling

### localStorage Quota Exceeded
```
Error: QuotaExceededError
Solution: Cart continues working in-memory
User notification: Toast or console warning
```

### Corrupted localStorage Data
```
Error: JSON parse error
Solution: Reset cart to empty state
User notification: Console warning (dev mode)
```

### Invalid Action
```
Error: Unknown action type
Solution: Log warning, return current state
```

---

## Related Features

- **FEAT-CART-001**: Shopping Cart Management (primary feature)
- **FEAT-CHECKOUT-001**: Checkout Process (consumes cart data)

---

## Open Questions

1. **Q:** Should we debounce localStorage writes to improve performance?  
   **A:** Optional enhancement - implement if performance issues observed

2. **Q:** Should we show toast notifications for cart actions?  
   **A:** Out of scope for context - handle in UI components

3. **Q:** Should we track cart analytics (items added, removed)?  
   **A:** Out of scope for MVP - consider for future

---

## Definition of Done

- ✅ All enhancements implemented in cart context
- ✅ Helper functions added and exported
- ✅ All unit tests passing (≥85% coverage)
- ✅ Integration tests passing
- ✅ Component tests passing (React Testing Library)
- ✅ TypeScript strict mode compliant
- ✅ ESLint passes with no warnings
- ✅ Code peer-reviewed
- ✅ JSDoc comments added
- ✅ localStorage error handling tested
- ✅ PR approved and merged

---

## Success Metrics

- Cart operations complete in < 50ms
- Zero console errors in normal usage
- 100% test coverage for cart logic
- No performance degradation with 100 items in cart
