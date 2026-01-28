'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CartItemWithProduct } from '@/lib/types/cart';
import { formatCurrency } from '@/lib/utils/format-currency';

export interface OrderReviewProps {
  items: CartItemWithProduct[];
  subtotal: number;
  shipping?: number;
  tax?: number;
}

/**
 * Order review component displaying cart summary
 */
export function OrderReview({ items, subtotal, shipping = 0, tax = 0 }: OrderReviewProps) {
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.product.thumbnail ? (
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>

              {/* Line Total */}
              <div className="text-right flex-shrink-0">
                <p className="font-medium">{formatCurrency(item.quantity * item.product.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t pt-4 space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping > 0 ? formatCurrency(shipping) : 'FREE'}
            </span>
          </div>

          {/* Tax */}
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Item Count */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your order
        </div>
      </CardContent>
    </Card>
  );
}
