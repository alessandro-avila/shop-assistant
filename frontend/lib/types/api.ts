/**
 * Backend API Response Types
 * 
 * Type definitions matching the .NET backend API responses.
 */

/**
 * Pagination metadata from backend
 */
export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Backend product DTO (matches ProductDto.cs)
 */
export interface BackendProductDto {
  productId: number;
  name: string;
  slug: string;
  brand: string | null;
  categoryId: number;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  shortDescription: string | null;
  category: BackendCategoryDto | null;
  discountPercentage: number | null;
}

/**
 * Backend paginated product list response (matches PaginatedResponse<ProductDto>)
 */
export interface BackendProductListResponse {
  items: BackendProductDto[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Backend category DTO (matches CategoryDto.cs)
 */
export interface BackendCategoryDto {
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
}

/**
 * Backend order item DTO (matches OrderItemDto.cs)
 */
export interface BackendOrderItemDto {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Backend address DTO (matches AddressDto.cs)
 */
export interface BackendAddressDto {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Backend order DTO (matches OrderDto.cs)
 */
export interface BackendOrderDto {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  shippingAddress: BackendAddressDto;
  customerEmail: string;
  customerName: string;
  items: BackendOrderItemDto[];
  createdAt: string;
  estimatedDelivery: string;
}

/**
 * Backend create order request (matches CreateOrderRequest.cs)
 */
export interface BackendCreateOrderRequest {
  items: BackendOrderItemRequest[];
  totalAmount: number;
  shippingAddress: BackendAddressDto;
  customerEmail: string;
  customerName: string;
}

/**
 * Backend order item request (matches OrderItemRequest.cs)
 */
export interface BackendOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

/**
 * Query parameters for product filtering
 */
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  sortBy?: 'price' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}
