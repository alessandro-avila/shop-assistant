'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartState, CartAction } from '@/lib/types/cart';

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { 
          ...state, 
          items: newItems, 
          lastModified: new Date().toISOString() 
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        lastModified: new Date().toISOString(),
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        lastModified: new Date().toISOString(),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        lastModified: new Date().toISOString(),
      };
    
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    lastModified: new Date().toISOString(),
  });
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shop-assistant:cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);
  
  // Persist to localStorage on state change
  useEffect(() => {
    localStorage.setItem('shop-assistant:cart', JSON.stringify(state));
  }, [state]);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
