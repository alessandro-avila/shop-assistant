'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import type { CartState, CartAction } from '@/lib/types/cart';

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const MAX_QUANTITY = 100;
const MIN_QUANTITY = 1;

/**
 * Clamp quantity to valid range (1-100).
 * Returns 0 if quantity should remove the item.
 */
function validateQuantity(quantity: number): number {
  if (quantity <= 0) return 0;
  if (quantity > MAX_QUANTITY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Quantity ${quantity} exceeds maximum of ${MAX_QUANTITY}, clamped to ${MAX_QUANTITY}`);
    }
    return MAX_QUANTITY;
  }
  return quantity;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        const newQuantity = validateQuantity(
          newItems[existingItemIndex].quantity + action.payload.quantity
        );
        
        // Remove item if quantity becomes 0
        if (newQuantity === 0) {
          return {
            ...state,
            items: newItems.filter((_, i) => i !== existingItemIndex),
            lastModified: new Date().toISOString(),
          };
        }
        
        newItems[existingItemIndex].quantity = newQuantity;
        return { 
          ...state, 
          items: newItems, 
          lastModified: new Date().toISOString() 
        };
      }
      
      const validatedQuantity = validateQuantity(action.payload.quantity);
      if (validatedQuantity === 0) {
        return state; // Don't add item with 0 quantity
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: validatedQuantity }],
        lastModified: new Date().toISOString(),
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        lastModified: new Date().toISOString(),
      };
    
    case 'UPDATE_QUANTITY': {
      const validatedQuantity = validateQuantity(action.payload.quantity);
      
      // Remove item if quantity is 0
      if (validatedQuantity === 0) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== action.payload.productId),
          lastModified: new Date().toISOString(),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: validatedQuantity }
            : item
        ),
        lastModified: new Date().toISOString(),
      };
    }
    
    case 'INCREMENT_ITEM': {
      const itemIndex = state.items.findIndex(item => item.productId === action.payload);
      if (itemIndex === -1) return state;
      
      const newItems = [...state.items];
      const currentQuantity = newItems[itemIndex].quantity;
      const newQuantity = validateQuantity(currentQuantity + 1);
      
      newItems[itemIndex].quantity = newQuantity;
      return {
        ...state,
        items: newItems,
        lastModified: new Date().toISOString(),
      };
    }
    
    case 'DECREMENT_ITEM': {
      const itemIndex = state.items.findIndex(item => item.productId === action.payload);
      if (itemIndex === -1) return state;
      
      const newItems = [...state.items];
      const currentQuantity = newItems[itemIndex].quantity;
      const newQuantity = currentQuantity - 1;
      
      // Remove item if quantity would become 0
      if (newQuantity <= 0) {
        return {
          ...state,
          items: newItems.filter((_, i) => i !== itemIndex),
          lastModified: new Date().toISOString(),
        };
      }
      
      newItems[itemIndex].quantity = newQuantity;
      return {
        ...state,
        items: newItems,
        lastModified: new Date().toISOString(),
      };
    }
    
    case 'CLEAR_CART':
      return { 
        items: [], 
        lastModified: new Date().toISOString() 
      };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
}

/**
 * Cart Provider component that manages cart state and localStorage persistence.
 * Provides cart context to all child components.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    lastModified: new Date().toISOString(),
  });
  const [storageError, setStorageError] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shop-assistant:cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Cart will work in-memory even if localStorage fails
      setStorageError(true);
    }
  }, []);
  
  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('shop-assistant:cart', JSON.stringify(state));
      if (storageError) {
        setStorageError(false); // Reset error if save succeeds
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Cart continues to work in-memory
      setStorageError(true);
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cart is running in memory-only mode. Changes will not persist across sessions.');
      }
    }
  }, [state, storageError]);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
      {storageError && process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#FFF3CD',
            border: '1px solid #FFC107',
            borderRadius: '4px',
            padding: '12px 16px',
            fontSize: '14px',
            zIndex: 9999,
          }}
        >
          ⚠️ Cart storage warning: Changes may not persist
        </div>
      )}
    </CartContext.Provider>
  );
}

/**
 * Hook to access cart context.
 * Must be used within a CartProvider.
 * @throws Error if used outside CartProvider
 */
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
