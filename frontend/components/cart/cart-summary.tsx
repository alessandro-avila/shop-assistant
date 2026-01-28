'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format-currency';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
}

export function CartSummary({ itemCount, subtotal }: CartSummaryProps) {
  const router = useRouter();
  
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 sticky top-20">
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-neutral-700">
          <span>Items ({itemCount})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="border-t border-neutral-300 pt-3">
          <div className="flex justify-between text-lg font-bold text-neutral-900">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </div>
      
      <Button
        variant="primary"
        className="w-full"
        onClick={handleCheckout}
        disabled={itemCount === 0}
      >
        Proceed to Checkout
      </Button>
      
      <p className="text-xs text-neutral-500 text-center mt-4">
        Shipping and taxes calculated at checkout
      </p>
    </div>
  );
}
