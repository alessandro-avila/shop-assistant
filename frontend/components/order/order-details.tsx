import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format-currency';
import type { BackendOrderItemDto } from '@/lib/types/api';

export interface OrderDetailsProps {
  items: BackendOrderItemDto[];
  totalAmount: number;
}

/**
 * Order details component
 * Displays order items list and total
 */
export function OrderDetails({ items, totalAmount }: OrderDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Order Details</h2>
      </CardHeader>
      <CardBody>
        {/* Order Items List */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.orderItemId} className="flex justify-between items-start gap-4">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
              </div>

              {/* Line Total */}
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t pt-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">{formatCurrency(totalAmount)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Shipping</span>
            <span className="text-sm font-medium text-green-600">FREE</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Tax</span>
            <span className="text-sm font-medium">{formatCurrency(0)}</span>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Item Count */}
        <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your order
        </div>
      </CardBody>
    </Card>
  );
}
