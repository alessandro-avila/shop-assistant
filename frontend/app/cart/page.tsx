'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart, useCartActions } from '@/lib/hooks/use-cart';
import { getProductById } from '@/lib/api/products';
import { formatCurrency } from '@/lib/utils/format-currency';
import type { Product } from '@/lib/types/product';
import { motion } from 'framer-motion';

interface CartItemWithProduct {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
  product: Product;
}

export default function CartPage() {
  const router = useRouter();
  const { items } = useCart();
  const { removeFromCart, updateQuantity, clearCart } = useCartActions();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadCartItems() {
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return product ? { ...item, product } : null;
        })
      );
      
      setCartItems(itemsWithProducts.filter((item): item is CartItemWithProduct => item !== null));
      setIsLoading(false);
    }
    
    loadCartItems();
  }, [items]);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-neutral-900">Your cart is empty</h2>
          <p className="mt-2 text-neutral-600">Start shopping to add items to your cart!</p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="mt-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 border border-neutral-200 rounded-lg p-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-neutral-600 mb-2">{item.product.brand}</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
              Clear Cart
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="border border-neutral-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200">
                <div className="flex justify-between text-lg font-bold text-neutral-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            {shipping > 0 && (
              <p className="text-sm text-neutral-600 mb-6">
                Add {formatCurrency(50 - subtotal)} more to get free shipping!
              </p>
            )}
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
