'use client';

import { useCartContext } from '@/context/cart-context';
import { getProductById } from '@/lib/api/products';
import { useMemo, useState, useEffect } from 'react';
import type { Product } from '@/lib/types/product';
import type { CartItemWithProduct } from '@/lib/types/cart';

/**
 * Hook to access cart state with basic calculations.
 * Returns cart items and total item count.
 */
export function useCart() {
  const { state, dispatch } = useCartContext();
  
  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);
  
  const isEmpty = useMemo(() => {
    return state.items.length === 0;
  }, [state.items]);
  
  return {
    items: state.items,
    totalItems,
    isEmpty,
    dispatch,
  };
}

/**
 * Hook to access cart state with full product details and calculations.
 * Fetches product information for all cart items and calculates subtotal.
 * Returns items with product data, subtotal, total count, and loading state.
 */
export function useCartWithProducts() {
  const { state } = useCartContext();
  const [itemsWithProducts, setItemsWithProducts] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const products = await Promise.all(
          state.items.map(async (item) => {
            const product = await getProductById(item.productId);
            if (!product) return null;
            
            const cartItemWithProduct: CartItemWithProduct = {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              addedAt: item.addedAt,
              product,
            };
            return cartItemWithProduct;
          })
        );
        
        // Filter out null values (products that couldn't be loaded)
        setItemsWithProducts(products.filter((item): item is CartItemWithProduct => item !== null));
      } catch (error) {
        console.error('Failed to load cart products:', error);
        setItemsWithProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProducts();
  }, [state.items]);
  
  const subtotal = useMemo(() => {
    return itemsWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [itemsWithProducts]);
  
  const totalItems = useMemo(() => {
    return itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);
  }, [itemsWithProducts]);
  
  const isEmpty = useMemo(() => {
    return itemsWithProducts.length === 0;
  }, [itemsWithProducts]);
  
  return {
    items: itemsWithProducts,
    subtotal,
    totalItems,
    isEmpty,
    isLoading,
  };
}

/**
 * Hook to access cart action functions.
 * Provides helper methods for common cart operations.
 */
export function useCartActions() {
  const { dispatch } = useCartContext();
  
  /**
   * Add a product to the cart with specified quantity.
   * If product already exists, quantity is added to existing amount.
   * @param product - Product to add
   * @param quantity - Quantity to add (default: 1)
   */
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
  
  /**
   * Remove a product completely from the cart.
   * @param productId - ID of product to remove
   */
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  /**
   * Update the quantity of a product in the cart.
   * If quantity is 0 or negative, the product is removed.
   * Quantity is clamped to maximum of 100.
   * @param productId - ID of product to update
   * @param quantity - New quantity
   */
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  /**
   * Increment the quantity of a product by 1.
   * Respects maximum quantity limit of 100.
   * @param productId - ID of product to increment
   */
  const incrementItem = (productId: string) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: productId });
  };
  
  /**
   * Decrement the quantity of a product by 1.
   * If quantity reaches 0, the product is removed from cart.
   * @param productId - ID of product to decrement
   */
  const decrementItem = (productId: string) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: productId });
  };
  
  /**
   * Remove all items from the cart.
   */
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return { 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    incrementItem,
    decrementItem,
    clearCart 
  };
}

/**
 * Calculate total price for cart items by fetching product prices.
 * @param items - Array of cart items with productId and quantity
 * @returns Promise<number> - Total price
 * @deprecated Use useCartWithProducts().subtotal instead for better performance
 */
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
