import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Printer, ShoppingBag } from 'lucide-react';

export interface OrderActionsProps {
  showPrintButton?: boolean;
}

/**
 * Order actions component
 * Provides actions for the user after order confirmation
 */
export function OrderActions({ showPrintButton = false }: OrderActionsProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 no-print">
      {/* Continue Shopping Button */}
      <Link href="/products">
        <Button size="lg" className="w-full sm:w-auto">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </Link>

      {/* Print Button (Optional) */}
      {showPrintButton && (
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrint}
          className="w-full sm:w-auto"
          aria-label="Print order receipt"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
      )}
    </div>
  );
}
