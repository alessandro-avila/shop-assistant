/**
 * API Client Utility
 * 
 * Generic fetch wrapper with error handling, type safety, and consistent configuration.
 */

import { API_BASE_URL, API_TIMEOUT } from '../config';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client Options
 */
export interface ApiClientOptions extends RequestInit {
  timeout?: number;
}

/**
 * Generic API client function
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint path (e.g., '/products')
 * @param options - Fetch options with optional timeout
 * @returns Promise resolving to typed response
 * @throws ApiError on HTTP errors or network failures
 * 
 * @example
 * ```typescript
 * const products = await apiClient<Product[]>('/products');
 * ```
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;
  
  // Build full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`;
  
  // Set up timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails = null;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.title || errorMessage;
        errorDetails = errorData;
      } catch {
        // Response is not JSON, use status text
      }
      
      throw new ApiError(errorMessage, response.status, errorDetails);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }
    
    // Parse JSON response
    const data = await response.json();
    return data as T;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        'Network error: Unable to connect to server. Please check your connection.',
        0
      );
    }
    
    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Unknown error
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
}

/**
 * Build query string from object
 * 
 * @param params - Query parameters object
 * @returns URL-encoded query string (without leading '?')
 * 
 * @example
 * ```typescript
 * buildQueryString({ page: 1, limit: 10 })
 * // Returns: "page=1&limit=10"
 * ```
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * Make GET request
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint
 * @param params - Query parameters (optional)
 * @param options - Additional fetch options (optional)
 * @returns Promise resolving to typed response
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, unknown>,
  options?: ApiClientOptions
): Promise<T> {
  const queryString = params ? buildQueryString(params) : '';
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiClient<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * Make POST request
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint
 * @param body - Request body (will be JSON stringified)
 * @param options - Additional fetch options (optional)
 * @returns Promise resolving to typed response
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Make PUT request
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint
 * @param body - Request body (will be JSON stringified)
 * @param options - Additional fetch options (optional)
 * @returns Promise resolving to typed response
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Make DELETE request
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint
 * @param options - Additional fetch options (optional)
 * @returns Promise resolving to typed response
 */
export async function del<T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
