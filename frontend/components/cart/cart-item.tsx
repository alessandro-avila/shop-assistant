'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCartActions } from '@/lib/hooks/use-cart';
import type { Product } from '@/lib/types/product';

interface CartItemProps {
  productId: string;
  quantity: number;
  product: Product;
}

export function CartItem({ productId, quantity, product }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartActions();
  const [localQuantity, setLocalQuantity] = useState(quantity);
  
  // Sync local quantity with prop changes
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);
  
  const handleQuantityChange = (newQuantity: number) => {
    // Clamp between 1 and 100
    const clampedQuantity = Math.max(1, Math.min(100, newQuantity));
    setLocalQuantity(clampedQuantity);
    updateQuantity(productId, clampedQuantity);
  };
  
  const handleIncrement = () => {
    if (localQuantity < 100) {
      handleQuantityChange(localQuantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (localQuantity > 1) {
      handleQuantityChange(localQuantity - 1);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handleQuantityChange(value);
    } else if (e.target.value === '') {
      setLocalQuantity(1);
    }
  };
  
  const handleInputBlur = () => {
    // Ensure quantity is valid on blur
    if (localQuantity < 1) {
      handleQuantityChange(1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(productId);
  };
  
  const lineTotal = product.price * localQuantity;
  
  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 last:border-b-0">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 96px, 128px"
          />
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link 
              href={`/products/${product.slug}`}
              className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <p className="text-sm text-neutral-500 mt-1">{product.brand}</p>
            <p className="text-sm text-neutral-600 mt-1">
              {formatCurrency(product.price)} each
            </p>
          </div>
          
          {/* Remove Button (Desktop) */}
          <button
            onClick={handleRemove}
            className="hidden sm:flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {/* Quantity Controls & Line Total */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={localQuantity <= 1}
              className="w-8 h-8 p-0"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            
            <input
              type="number"
              min="1"
              max="100"
              value={localQuantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-16 text-center border border-neutral-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              aria-label="Quantity"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={localQuantity >= 100}
              className="w-8 h-8 p-0"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
          
          {/* Line Total */}
          <div className="text-right">
            <p className="font-bold text-neutral-900">
              {formatCurrency(lineTotal)}
            </p>
          </div>
        </div>
        
        {/* Remove Button (Mobile) */}
        <button
          onClick={handleRemove}
          className="sm:hidden flex items-center gap-2 mt-3 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
