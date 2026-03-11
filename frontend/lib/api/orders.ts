/**
 * Orders API Client
 * 
 * API client for order-related endpoints.
 * Supports both real backend API and mocked data (controlled by USE_API config).
 */

import { post, get } from './client';
import { USE_API, MOCK_API_DELAY } from '../config';
import type { 
  BackendOrderDto, 
  BackendCreateOrderRequest,
  BackendAddressDto,
  BackendOrderItemRequest
} from '@/lib/types/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a mock order number in ORD-YYYY-XXXXX format
 */
function generateMockOrderNumber(): string {
  const year = new Date().getFullYear();
  const id = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}-${id}`;
}

/**
 * Build a synthetic BackendOrderDto from a create request (for mock mode)
 */
function buildMockOrder(orderData: BackendCreateOrderRequest): BackendOrderDto {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return {
    orderId: Math.floor(1000 + Math.random() * 9000),
    orderNumber: generateMockOrderNumber(),
    totalAmount: orderData.totalAmount,
    status: 'Pending',
    shippingAddress: orderData.shippingAddress,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName,
    items: orderData.items.map((item, index) => ({
      orderItemId: index + 1,
      productId: item.productId,
      productName: `Product #${item.productId}`,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    })),
    createdAt: new Date().toISOString(),
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
}

/**
 * Build a synthetic order for getById/getByNumber mock fallback
 */
function buildMockOrderForLookup(identifier: string): BackendOrderDto {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return {
    orderId: 1,
    orderNumber: identifier.startsWith('ORD-') ? identifier : `ORD-2026-00001`,
    totalAmount: 99.99,
    status: 'Pending',
    shippingAddress: {
      name: 'Mock Customer',
      address: '123 Mock St',
      city: 'Mockville',
      state: 'MO',
      zipCode: '12345',
      country: 'United States',
    },
    customerEmail: 'mock@example.com',
    customerName: 'Mock Customer',
    items: [
      {
        orderItemId: 1,
        productId: 1,
        productName: 'Mock Product',
        quantity: 1,
        unitPrice: 99.99,
        subtotal: 99.99,
      },
    ],
    createdAt: new Date().toISOString(),
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
}

/**
 * Create a new order
 * 
 * @param orderData - Order creation request
 * @returns Promise resolving to created order
 * @throws ApiError if creation fails
 */
export async function createOrder(orderData: BackendCreateOrderRequest): Promise<BackendOrderDto> {
  if (!USE_API) {
    await delay(MOCK_API_DELAY);
    return buildMockOrder(orderData);
  }

  try {
    return await post<BackendOrderDto>('/orders', orderData);
  } catch (error) {
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to create order via API, using mock:', error);
    await delay(MOCK_API_DELAY);
    return buildMockOrder(orderData);
  }
}

/**
 * Get order by ID
 * 
 * @param id - Order ID
 * @returns Promise resolving to order details
 * @throws ApiError if order not found
 */
export async function getOrderById(id: string): Promise<BackendOrderDto> {
  if (!USE_API) {
    await delay(MOCK_API_DELAY);
    return buildMockOrderForLookup(id);
  }

  try {
    return await get<BackendOrderDto>(`/orders/${id}`);
  } catch (error) {
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to fetch order by ID, using mock:', error);
    await delay(MOCK_API_DELAY);
    return buildMockOrderForLookup(id);
  }
}

/**
 * Get order by order number
 * 
 * @param orderNumber - Order number (e.g., "ORD-2026-12345")
 * @returns Promise resolving to order details
 * @throws ApiError if order not found
 */
export async function getOrderByNumber(orderNumber: string): Promise<BackendOrderDto> {
  if (!USE_API) {
    await delay(MOCK_API_DELAY);
    return buildMockOrderForLookup(orderNumber);
  }

  try {
    return await get<BackendOrderDto>(`/orders/number/${orderNumber}`);
  } catch (error) {
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to fetch order by number, using mock:', error);
    await delay(MOCK_API_DELAY);
    return buildMockOrderForLookup(orderNumber);
  }
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
