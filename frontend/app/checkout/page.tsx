'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderReview } from '@/components/checkout/order-review';
import { useCartWithProducts } from '@/lib/hooks/use-cart';
import { useCartActions } from '@/lib/hooks/use-cart';
import { createOrder } from '@/lib/api/orders';
import type { ShippingAddressData } from '@/lib/utils/form-validation';
import type { BackendAddressDto, BackendOrderItemRequest } from '@/lib/types/api';

/**
 * Checkout page with single-page form
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, subtotal } = useCartWithProducts();
  const { clearCart } = useCartActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  /**
   * Handle form submission
   */
  const handleSubmit = async (shippingData: ShippingAddressData) => {
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      // Build shipping address matching backend DTO
      const shippingAddress: BackendAddressDto = {
        fullName: shippingData.fullName,
        email: shippingData.email,
        phone: shippingData.phone,
        streetAddress: shippingData.streetAddress,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.postalCode,
        country: shippingData.country,
      };

      // Build order items
      const items: BackendOrderItemRequest[] = cartItems.map((item) => ({
        productId: parseInt(item.productId, 10), // Convert string to number
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      // Create order via API
      const order = await createOrder({
        items,
        totalAmount: subtotal,
        shippingAddress,
      });

      // Clear cart
      clearCart();

      // Clear sessionStorage form data
      if (typeof window !== 'undefined' && (window as any).__clearCheckoutFormData) {
        (window as any).__clearCheckoutFormData();
      }

      // Navigate to success page
      router.push(`/checkout/success?orderId=${order.orderId}`);
    } catch (error: any) {
      console.error('Failed to create order:', error);

      // Handle different error types
      if (error.response) {
        // HTTP error response
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          // Validation error
          if (data?.errors) {
            // ProblemDetails validation errors
            const errorMessages = Object.entries(data.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('\n');
            setSubmitError(`Validation failed:\n${errorMessages}`);
          } else if (data?.title || data?.detail) {
            setSubmitError(data.detail || data.title);
          } else {
            setSubmitError('Invalid order data. Please check your information and try again.');
          }
        } else if (status === 404) {
          setSubmitError('One or more products in your cart are no longer available.');
        } else if (status === 500) {
          setSubmitError('Server error. Please try again later.');
        } else {
          setSubmitError(`Error: ${data?.title || data?.detail || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Network error
        setSubmitError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <OrderReview items={cartItems} subtotal={subtotal} />
          </div>
        </div>
      </div>
    </div>
  );
}
