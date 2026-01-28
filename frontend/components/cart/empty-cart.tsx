'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty Cart Icon */}
      <div className="w-32 h-32 mb-6 text-neutral-300">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      
      {/* Empty Cart Message */}
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-neutral-600 mb-8 text-center max-w-md">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>
      
      {/* Continue Shopping Button */}
      <Link href="/products">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
