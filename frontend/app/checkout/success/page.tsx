'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { OrderConfirmationHeader } from '@/components/order/order-confirmation-header';
import { OrderDetails } from '@/components/order/order-details';
import { ShippingAddressDisplay } from '@/components/order/shipping-address-display';
import { OrderActions } from '@/components/order/order-actions';
import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/api/orders';
import type { BackendOrderDto } from '@/lib/types/api';

/**
 * Order confirmation success page
 * Displays order details after successful checkout
 */
export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<BackendOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if no orderId
    if (!orderId) {
      router.push('/');
      return;
    }

    // Fetch order data
    async function fetchOrder() {
      setLoading(true);
      setError(null);

      try {
        const orderData = await getOrderById(orderId!); // orderId is guaranteed non-null here
        setOrder(orderData);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);

        if (err.response?.status === 404) {
          setError('Order not found. Please check your order number and try again.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else if (err.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router]);

  // Handle retry
  const handleRetry = () => {
    if (orderId) {
      window.location.reload();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2">Loading Your Order...</h1>
          <p className="text-gray-600">Please wait while we retrieve your order details.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            {error?.includes('not found') ? 'Order Not Found' : 'Error Loading Order'}
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetry} variant="primary">
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline">Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Confirmation Header */}
        <OrderConfirmationHeader
          orderNumber={order.orderNumber}
          orderDate={order.createdAt}
          status={order.status}
        />

        {/* Order Details and Shipping Address */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Order Details (2 columns on desktop) */}
          <div className="lg:col-span-2">
            <OrderDetails items={order.items} totalAmount={order.totalAmount} />
          </div>

          {/* Shipping Address (1 column on desktop) */}
          <div className="lg:col-span-1">
            <ShippingAddressDisplay address={order.shippingAddress} />
          </div>
        </div>

        {/* Actions */}
        <OrderActions showPrintButton={true} />

        {/* Print-friendly footer */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500 print:block">
          <p>
            Questions about your order? Contact us at{' '}
            <a href="mailto:support@shop-assistant.com" className="text-blue-600 hover:underline">
              support@shop-assistant.com
            </a>
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header,
          footer,
          nav,
          .no-print {
            display: none !important;
          }

          body {
            color: black;
            background: white;
          }

          .container {
            max-width: 100%;
            padding: 0;
          }

          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
