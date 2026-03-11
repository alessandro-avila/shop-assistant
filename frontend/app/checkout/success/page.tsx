'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getOrderByNumber } from '@/lib/api/orders';
import { formatCurrency } from '@/lib/utils/format-currency';
import type { BackendOrderDto } from '@/lib/types/api';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<BackendOrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderNumberParam = searchParams.get('order');

  useEffect(() => {
    if (!orderNumberParam) {
      router.push('/');
      return;
    }

    // Try sessionStorage cache first for instant display (R-002)
    const cached = sessionStorage.getItem('lastOrder');
    if (cached) {
      try {
        const parsed: BackendOrderDto = JSON.parse(cached);
        if (parsed.orderNumber === orderNumberParam) {
          setOrder(parsed);
          setIsLoading(false);
          sessionStorage.removeItem('lastOrder');
          return;
        }
      } catch {
        // Invalid cache — fall through to API
      }
    }

    // Fetch from API
    setIsLoading(true);
    getOrderByNumber(orderNumberParam)
      .then((data) => {
        setOrder(data);
      })
      .catch(() => {
        setError('Order not found');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderNumberParam, router]);

  // Loading skeleton (FR-012)
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-200 mb-6" />
          <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-2" />
          <div className="h-6 bg-neutral-200 rounded w-48 mx-auto" />
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
              <div className="h-6 bg-neutral-200 rounded w-40" />
            </div>
            <div>
              <div className="h-4 bg-neutral-200 rounded w-32 mb-2" />
              <div className="h-6 bg-neutral-200 rounded w-48" />
            </div>
          </div>
          <div className="pt-6 border-t border-neutral-200 space-y-3">
            <div className="h-5 bg-neutral-200 rounded w-full" />
            <div className="h-5 bg-neutral-200 rounded w-full" />
            <div className="h-5 bg-neutral-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found state (FR-013)
  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Not Found</h1>
        <p className="text-xl text-neutral-600 mb-8">
          We couldn&apos;t find an order with number &quot;{orderNumberParam}&quot;.
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery)
    : (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d; })();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Confirmed!</h1>
        <p className="text-xl text-neutral-600">Thank you for your purchase</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-neutral-200 rounded-lg p-8 mb-6"
      >
        {/* Order overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-neutral-600 mb-1">Order Number</p>
            <p className="text-lg font-bold text-neutral-900">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-1">Estimated Delivery</p>
            <p className="text-lg font-bold text-neutral-900">
              {estimatedDelivery.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Order items (FR-011) */}
        <div className="pt-6 border-t border-neutral-200 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.orderItemId} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-neutral-900">{item.productName}</p>
                  <p className="text-neutral-600">
                    Qty: {item.quantity} &times; {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <span className="font-semibold text-neutral-900">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100">
            <span className="text-lg font-bold text-neutral-900">Total</span>
            <span className="text-lg font-bold text-neutral-900">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="pt-6 border-t border-neutral-200 mb-6">
            <h2 className="font-semibold text-neutral-900 mb-2">Shipping Address</h2>
            <p className="text-neutral-700">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        )}

        {/* What's Next */}
        <div className="pt-6 border-t border-neutral-200">
          <h2 className="font-semibold text-neutral-900 mb-3">What&apos;s Next?</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>You&apos;ll receive a confirmation email at {order.customerEmail}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>We&apos;ll send you shipping updates via email</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Track your order status anytime</span>
            </li>
          </ul>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
