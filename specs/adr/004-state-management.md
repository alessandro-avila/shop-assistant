# ADR 004: State Management

**Date**: January 9, 2026  
**Status**: Accepted  
**Deciders**: Development Team, Technical Lead

---

## Context

Shop Assistant requires state management for:
- **Shopping Cart**: Items, quantities, variants (persistent across sessions)
- **User State**: Mock user data, authentication status
- **UI State**: Filters, search queries, modal open/close
- **Wishlist**: Saved products (persistent)

The application has moderate state complexity with these characteristics:
- Cart state must persist to localStorage
- State shared across multiple components (cart icon, cart page, checkout)
- No server state synchronization (all data is mocked)
- Performance-critical updates (cart count badge animations)
- Simple state requirements (no complex async flows)

With Next.js App Router and Server Components, the solution must be compatible with client-side state while leveraging server rendering where possible.

---

## Options Considered

### Option 1: React Context API + useReducer
**Pros**:
- Built into React (zero dependencies)
- Simple mental model for moderate state
- Good for cart/user state patterns
- Works seamlessly with Next.js Client Components
- Sufficient for application scope
- Easy localStorage integration
- TypeScript-friendly

**Cons**:
- Can cause re-renders if not optimized
- Requires careful context splitting
- No built-in devtools
- Manual localStorage sync logic

### Option 2: Zustand
**Pros**:
- Lightweight (~1KB gzipped)
- Simple, minimal API
- Built-in persist middleware (localStorage)
- No Provider boilerplate
- Excellent TypeScript support
- React Devtools integration
- Optimized re-renders by default
- Can be used outside React components

**Cons**:
- Additional dependency (though tiny)
- Less familiar to some developers
- External state management paradigm
- Slightly more setup than Context

### Option 3: Redux Toolkit
**Pros**:
- Industry-standard state management
- Powerful DevTools
- Extensive middleware ecosystem
- Great for large, complex apps
- Time-travel debugging
- RTK Query for data fetching

**Cons**:
- **Overkill** for this application scope
- Significant boilerplate despite RTK simplification
- Larger bundle size (~14KB gzipped with dependencies)
- Steeper learning curve
- More complex setup
- Unnecessary complexity for mocked data

---

## Decision

**Selected**: React Context API + useReducer + localStorage

**Rationale**:
1. **Zero Dependencies**: Built into React, no external libraries needed
2. **Sufficient Complexity**: Application has moderate state needs perfectly suited for Context
3. **Simple Integration**: Native React patterns, no new paradigms to learn
4. **Next.js Compatibility**: Works seamlessly with Server/Client Component boundaries
5. **TypeScript Support**: Excellent type inference with discriminated unions in reducers
6. **Control**: Full control over persistence logic and state structure
7. **Learning Value**: Demonstrates native React patterns without external dependencies
8. **Performance**: With proper context splitting, re-render performance is excellent

The application doesn't have complex async flows, real-time updates, or deeply nested state that would justify Zustand or Redux. Context API provides clean, maintainable state management for this scope.

---

## Consequences

### Positive
- No external state management dependencies
- Straightforward debugging (React DevTools)
- TypeScript provides excellent type safety
- Easy to understand and maintain
- Perfect fit for cart/user state patterns
- localStorage integration is explicit and controllable
- Reduced bundle size
- Demonstrates core React patterns

### Negative
- Requires careful context splitting to avoid unnecessary re-renders
- Manual localStorage synchronization logic
- No built-in persistence middleware
- Less sophisticated DevTools than Redux
- Requires more boilerplate than Zustand

### Neutral
- Context providers wrapped at app layout level
- useReducer for cart logic (add, remove, update quantity)
- Custom hooks abstract context usage (`useCart`, `useUser`)
- localStorage sync on cart state changes

---

## Implementation Notes

**Context Structure**:

```tsx
// src/context/CartContext.tsx
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  lastModified: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Persist to localStorage on state change
  useEffect(() => {
    localStorage.setItem('shop-assistant:cart', JSON.stringify(state));
  }, [state]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shop-assistant:cart');
    if (saved) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
    }
  }, []);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
```

**Custom Hooks** (Business Logic):
```tsx
// src/lib/hooks/useCartActions.ts
export const useCartActions = () => {
  const { dispatch } = useCart();
  
  const addToCart = (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        quantity,
        addedAt: new Date().toISOString(),
      },
    });
    
    // Show toast notification
    toast.success('Added to cart!');
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };
  
  return { addToCart, removeFromCart, updateQuantity };
};
```

**Context Split Strategy**:
- **CartContext**: Cart items and operations
- **UserContext**: Mock user data and authentication
- **UIContext** (if needed): Modal state, filters (consider local state first)

**Performance Optimizations**:
- Use `useMemo` for derived state (cart total, item count)
- Split contexts to prevent unnecessary re-renders
- Memoize selector functions
- Use React DevTools Profiler to identify issues

---

## Related Decisions
- [ADR-001: Framework Selection](001-framework-selection.md)
- [ADR-005: Mock Data Strategy](005-mock-data-strategy.md)
