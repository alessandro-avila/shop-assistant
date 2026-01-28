# Feature: Cart API (Optional)

**Feature ID**: FRD-006  
**Version**: 1.0  
**Status**: Optional  
**Created**: January 27, 2026

---

## 1. Feature Overview

Implement server-side cart management API. **Note**: Cart can also be managed via localStorage on frontend for simplicity. This feature is optional for Phase 2.

---

## 2. User Stories

```gherkin
As a user,
I want my cart persisted on the server,
So that it's available across devices.

As a frontend developer,
I want cart API endpoints,
So that I can sync cart state with the backend.
```

---

## 3. API Endpoints

### GET /api/cart
Get current user's cart items.

**Query**: Use SessionId from cookie/header

### POST /api/cart/items
Add item to cart.

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

### PUT /api/cart/items/{cartItemId}
Update item quantity.

### DELETE /api/cart/items/{cartItemId}
Remove item from cart.

### DELETE /api/cart
Clear entire cart.

---

## 4. Implementation Decision

**Recommendation**: Start with localStorage (simpler), add Cart API as Phase 3 enhancement.

**Rationale**:
- Faster initial development
- No session management needed
- Sufficient for demo purposes
- Can be added later without frontend changes

---

## 5. Acceptance Criteria (If Implemented)

- [ ] Session-based cart identification
- [ ] Cart persists across browser sessions
- [ ] Concurrent cart access handled
- [ ] Expired cart cleanup job (optional)

---

**Status**: Optional - Defer to Phase 3  
**Priority**: P3 (Nice to have)  
**Estimated Effort**: 4-6 hours  
**Recommendation**: Use localStorage initially
