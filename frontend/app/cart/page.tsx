'use client';

import { useCartWithProducts } from '@/lib/hooks/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, subtotal, totalItems, isLoading } = useCartWithProducts();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-neutral-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-neutral-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  // Show empty cart if no items
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
        <EmptyCart />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-neutral-900 mb-8"
      >
        Shopping Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Cart Items ({totalItems})
            </h2>
            
            <div className="divide-y divide-neutral-200">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CartItem
                    productId={item.productId}
                    quantity={item.quantity}
                    product={item.product}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Cart Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <CartSummary itemCount={totalItems} subtotal={subtotal} />
        </motion.div>
      </div>
    </div>
  );
}
