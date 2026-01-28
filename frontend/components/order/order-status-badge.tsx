import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

export interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Get status badge color classes based on order status
 */
function getStatusColorClasses(status: string): string {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Order status badge component with color-coded styling
 */
export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const colorClasses = getStatusColorClasses(status);
  
  return (
    <Badge
      variant="outline"
      className={cn(colorClasses, 'font-semibold', className)}
      aria-label={`Order status: ${status}`}
    >
      {status}
    </Badge>
  );
}
