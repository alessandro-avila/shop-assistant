import { CheckCircle2 } from 'lucide-react';
import { OrderStatusBadge } from './order-status-badge';
import { formatOrderDate } from '@/lib/utils/date-format';

export interface OrderConfirmationHeaderProps {
  orderNumber: string;
  orderDate: string;
  status: string;
}

/**
 * Order confirmation header component
 * Displays success message, order number, date, and status
 */
export function OrderConfirmationHeader({
  orderNumber,
  orderDate,
  status,
}: OrderConfirmationHeaderProps) {
  return (
    <div className="text-center py-8 px-4">
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-green-100 p-3" aria-label="Order confirmed">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Order Confirmed!
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Thank you for your purchase
      </p>

      {/* Order Number */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
          Order Number
        </p>
        <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
      </div>

      {/* Order Date */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">{formatOrderDate(orderDate)}</p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <OrderStatusBadge status={status} />
      </div>
    </div>
  );
}
