/**
 * Order Error Categorization Utility
 *
 * Maps ApiError instances to user-friendly error messages for display
 * in the checkout flow. Covers validation, server, and network errors.
 */

import { ApiError } from '@/lib/api/client';

export interface OrderError {
  title: string;
  message: string;
}

/**
 * Map an unknown error to a categorized, user-friendly OrderError.
 *
 * Categories:
 * - 400 + "not found" → product unavailable
 * - 400 + "mismatch" → price changed
 * - 400 (other)       → generic validation
 * - 500               → server error
 * - network/timeout    → connection error
 *
 * @param error - The caught error (typically ApiError)
 * @returns User-friendly { title, message } object
 */
export function mapOrderError(error: unknown): OrderError {
  if (error instanceof ApiError) {
    const msg = error.message.toLowerCase();

    if (error.statusCode === 400 && msg.includes('not found')) {
      return {
        title: 'Product unavailable',
        message:
          'A product in your cart is no longer available. Please review your cart.',
      };
    }
    if (error.statusCode === 400 && msg.includes('mismatch')) {
      return {
        title: 'Prices changed',
        message:
          'Prices have changed since you added items to your cart. Please review and try again.',
      };
    }
    if (error.statusCode === 400) {
      return {
        title: 'Invalid order',
        message:
          'There was a problem with your order. Please review your information and try again.',
      };
    }
    if (error.statusCode === 500) {
      return {
        title: 'Server error',
        message:
          'Something went wrong on our end. Please try again in a moment.',
      };
    }
  }

  return {
    title: 'Connection error',
    message:
      'Unable to reach the server. Please check your connection and try again.',
  };
}
