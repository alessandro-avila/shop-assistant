/**
 * Products API Client
 * 
 * API client for product-related endpoints.
 * Supports both real backend API and mocked data (controlled by USE_API config).
 */

import { get } from './client';
import { USE_API, MOCK_API_DELAY } from '../config';
import type { Product, ProductFilters, CategoryType } from '@/lib/types/product';
import type { 
  BackendProductDto, 
  BackendProductListResponse
} from '@/lib/types/api';

// Import mocked data for fallback
import productsData from '@/data/products.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Map backend product DTO to frontend product type
 */
function mapBackendProduct(dto: BackendProductDto): Product {
  return {
    id: dto.productId.toString(),
    slug: dto.slug,
    name: dto.name,
    brand: dto.brand || '',
    category: (dto.category?.name || 'Uncategorized').toLowerCase().replace(/\s+/g, '-') as CategoryType,
    price: dto.price,
    originalPrice: dto.originalPrice || undefined,
    discount: dto.discountPercentage || undefined,
    currency: 'USD',
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    images: [dto.imageUrl || '/placeholder-product.jpg'], // Backend has single image, frontend expects array
    thumbnail: dto.imageUrl || '/placeholder-product.jpg',
    description: dto.shortDescription || '',
    shortDescription: dto.shortDescription || '',
    specifications: {}, // Not provided by backend summary DTO
    features: [], // Not provided by backend summary DTO
    inStock: dto.inStock,
    sku: `SKU-${dto.productId}`,
    tags: [dto.brand, dto.category?.name].filter(Boolean) as string[],
    createdAt: new Date().toISOString(), // Not provided by backend
    isFeatured: dto.isFeatured,
    isNewArrival: dto.isNewArrival,
  };
}

/**
 * Convert frontend filters to backend query parameters
 */
function filtersToQueryParams(filters?: ProductFilters): Record<string, unknown> {
  if (!filters) return {};
  
  const params: Record<string, unknown> = {};
  
  if (filters.category) {
    // Map frontend category string to backend category slug
    params.categorySlug = filters.category;
  }
  
  if (filters.minPrice !== undefined) {
    params.minPrice = filters.minPrice;
  }
  
  if (filters.maxPrice !== undefined) {
    params.maxPrice = filters.maxPrice;
  }
  
  if (filters.minRating !== undefined) {
    params.minRating = filters.minRating;
  }
  
  if (filters.inStockOnly) {
    params.inStock = true;
  }
  
  // Handle sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        params.sortBy = 'price';
        params.sortOrder = 'asc';
        break;
      case 'price-desc':
        params.sortBy = 'price';
        params.sortOrder = 'desc';
        break;
      case 'rating':
        params.sortBy = 'rating';
        params.sortOrder = 'desc';
        break;
      case 'featured':
        params.isFeatured = true;
        break;
      case 'newest':
        params.isNewArrival = true;
        break;
    }
  }
  
  return params;
}

/**
 * Get products with optional filtering
 * 
 * @param filters - Product filters
 * @param page - Page number (1-indexed, default: 1)
 * @param pageSize - Items per page (default: 12)
 * @returns Promise resolving to product array
 */
export async function getProducts(
  filters?: ProductFilters,
  page: number = 1,
  pageSize: number = 12
): Promise<Product[]> {
  if (!USE_API) {
    // Use mocked data
    return getMockedProducts(filters);
  }
  
  try {
    const queryParams = filtersToQueryParams(filters);
    queryParams.page = page;
    queryParams.pageSize = pageSize;
    
    const response = await get<BackendProductListResponse>('/products', queryParams);
    return response.items.map(mapBackendProduct);
  } catch (error) {
    console.error('Failed to fetch products from API, falling back to mocked data:', error);
    return getMockedProducts(filters);
  }
}

/**
 * Get product by ID
 * 
 * @param id - Product ID
 * @returns Promise resolving to product or null if not found
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!USE_API) {
    return getMockedProductById(id);
  }
  
  try {
    const dto = await get<BackendProductDto>(`/products/${id}`);
    return mapBackendProduct(dto);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    console.error('Failed to fetch product by ID, falling back to mocked data:', error);
    return getMockedProductById(id);
  }
}

/**
 * Get product by slug
 * 
 * @param slug - Product URL slug
 * @returns Promise resolving to product or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!USE_API) {
    return getMockedProductBySlug(slug);
  }
  
  try {
    const dto = await get<BackendProductDto>(`/products/slug/${slug}`);
    return mapBackendProduct(dto);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    console.error('Failed to fetch product by slug, falling back to mocked data:', error);
    return getMockedProductBySlug(slug);
  }
}

/**
 * Search products by query
 * 
 * @param query - Search query
 * @returns Promise resolving to matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!USE_API) {
    return getMockedSearchProducts(query);
  }
  
  try {
    const response = await get<BackendProductListResponse>('/products/search', { 
      searchQuery: query 
    });
    return response.items.map(mapBackendProduct);
  } catch (error) {
    console.error('Failed to search products, falling back to mocked data:', error);
    return getMockedSearchProducts(query);
  }
}

/**
 * Get featured products
 * 
 * @returns Promise resolving to featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  if (!USE_API) {
    return getMockedFeaturedProducts();
  }
  
  try {
    const response = await get<BackendProductListResponse>('/products/featured');
    return response.items.map(mapBackendProduct);
  } catch (error) {
    console.error('Failed to fetch featured products, falling back to mocked data:', error);
    return getMockedFeaturedProducts();
  }
}

/**
 * Get new arrivals
 * 
 * @returns Promise resolving to new arrival products
 */
export async function getNewArrivals(): Promise<Product[]> {
  if (!USE_API) {
    return getMockedNewArrivals();
  }
  
  try {
    const response = await get<BackendProductListResponse>('/products/new-arrivals');
    return response.items.map(mapBackendProduct);
  } catch (error) {
    console.error('Failed to fetch new arrivals, falling back to mocked data:', error);
    return getMockedNewArrivals();
  }
}

// ============================================================================
// Mocked Data Functions (Fallback)
// ============================================================================

async function getMockedProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(MOCK_API_DELAY);
  
  let products = productsData as unknown as Product[];
  
  if (filters?.category) {
    products = products.filter(p => p.category === filters.category);
  }
  
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    products = products.filter(p =>
      p.price >= (filters.minPrice || 0) &&
      p.price <= (filters.maxPrice || Infinity)
    );
  }
  
  if (filters?.brands && filters.brands.length > 0) {
    products = products.filter(p => filters.brands!.includes(p.brand));
  }
  
  if (filters?.minRating) {
    products = products.filter(p => p.rating >= filters.minRating!);
  }
  
  if (filters?.inStockOnly) {
    products = products.filter(p => p.inStock);
  }
  
  // Sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        products = products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products = products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products = products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products = products.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        products = products.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }
  }
  
  return products;
}

async function getMockedProductById(id: string): Promise<Product | null> {
  await delay(MOCK_API_DELAY);
  const products = productsData as unknown as Product[];
  return products.find(p => p.id === id) || null;
}

async function getMockedProductBySlug(slug: string): Promise<Product | null> {
  await delay(MOCK_API_DELAY);
  const products = productsData as unknown as Product[];
  return products.find(p => p.slug === slug) || null;
}

async function getMockedSearchProducts(query: string): Promise<Product[]> {
  await delay(MOCK_API_DELAY);
  const products = productsData as unknown as Product[];
  const lowerQuery = query.toLowerCase();
  
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

async function getMockedFeaturedProducts(): Promise<Product[]> {
  await delay(MOCK_API_DELAY);
  const products = productsData as unknown as Product[];
  return products.filter(p => p.isFeatured);
}

async function getMockedNewArrivals(): Promise<Product[]> {
  await delay(MOCK_API_DELAY);
  const products = productsData as unknown as Product[];
  return products.filter(p => p.isNewArrival);
}
