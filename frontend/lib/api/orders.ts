/**
 * Orders API Client
 * 
 * API client for order-related endpoints.
 */

import { post, get } from './client';
import type { 
  BackendOrderDto, 
  BackendCreateOrderRequest,
  BackendAddressDto,
  BackendOrderItemRequest
} from '@/lib/types/api';

/**
 * Create a new order
 * 
 * @param orderData - Order creation request
 * @returns Promise resolving to created order
 * @throws ApiError if creation fails
 */
export async function createOrder(orderData: BackendCreateOrderRequest): Promise<BackendOrderDto> {
  return post<BackendOrderDto>('/orders', orderData);
}

/**
 * Get order by ID
 * 
 * @param id - Order ID
 * @returns Promise resolving to order details
 * @throws ApiError if order not found
 */
export async function getOrderById(id: string): Promise<BackendOrderDto> {
  return get<BackendOrderDto>(`/orders/${id}`);
}

/**
 * Get order by order number
 * 
 * @param orderNumber - Order number (e.g., "ORD-2026-12345")
 * @returns Promise resolving to order details
 * @throws ApiError if order not found
 */
export async function getOrderByNumber(orderNumber: string): Promise<BackendOrderDto> {
  return get<BackendOrderDto>(`/orders/number/${orderNumber}`);
}

/**
 * Helper: Build order creation request from cart data
 * 
 * @param cartItems - Items in cart
 * @param shippingAddress - Shipping address
 * @param customerEmail - Customer email
 * @param customerName - Customer name
 * @returns Order creation request object
 */
export function buildOrderRequest(
  cartItems: Array<{ productId: number; quantity: number; unitPrice: number }>,
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  },
  customerEmail: string,
  customerName: string
): BackendCreateOrderRequest {
  const items: BackendOrderItemRequest[] = cartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
  
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  );
  
  const addressDto: BackendAddressDto = {
    name: shippingAddress.name,
    address: shippingAddress.address,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zipCode: shippingAddress.zipCode,
    country: shippingAddress.country,
  };
  
  return {
    items,
    totalAmount,
    shippingAddress: addressDto,
    customerEmail,
    customerName,
  };
}
