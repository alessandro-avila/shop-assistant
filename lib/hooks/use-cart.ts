'use client';

import { useCartContext } from '@/context/cart-context';
import { getProductById } from '@/lib/api/products';
import { useMemo } from 'react';
import type { Product } from '@/lib/types/product';

export function useCart() {
  const { state, dispatch } = useCartContext();
  
  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);
  
  return {
    items: state.items,
    totalItems,
    dispatch,
  };
}

export function useCartActions() {
  const { dispatch } = useCartContext();
  
  const addToCart = (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        quantity,
        addedAt: new Date().toISOString(),
      },
    });
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
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return { addToCart, removeFromCart, updateQuantity, clearCart };
}

export async function getCartTotal(items: { productId: string; quantity: number }[]): Promise<number> {
  let total = 0;
  for (const item of items) {
    const product = await getProductById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
}
