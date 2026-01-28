/**
 * Categories API Client
 * 
 * API client for category-related endpoints.
 * Supports both real backend API and mocked data (controlled by USE_API config).
 */

import { get } from './client';
import { USE_API, MOCK_API_DELAY } from '../config';
import type { Category } from '@/lib/types/product';
import type { BackendCategoryDto } from '@/lib/types/api';

// Import mocked data for fallback
import categoriesData from '@/data/categories.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Map backend category DTO to frontend category type
 */
function mapBackendCategory(dto: BackendCategoryDto): Category {
  return {
    id: dto.categoryId.toString(),
    name: dto.name,
    slug: dto.slug,
    image: dto.imageUrl || '',
    description: dto.description || '',
    productCount: dto.productCount,
  };
}

/**
 * Get all categories
 * 
 * @returns Promise resolving to category array
 */
export async function getCategories(): Promise<Category[]> {
  if (!USE_API) {
    return getMockedCategories();
  }
  
  try {
    const categories = await get<BackendCategoryDto[]>('/categories');
    return categories.map(mapBackendCategory);
  } catch (error) {
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to fetch categories, using mocked data:', error);
    return getMockedCategories();
  }
}

/**
 * Get category by slug
 * 
 * @param slug - Category URL slug
 * @returns Promise resolving to category or null if not found
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!USE_API) {
    return getMockedCategoryBySlug(slug);
  }
  
  try {
    const dto = await get<BackendCategoryDto>(`/categories/slug/${slug}`);
    return mapBackendCategory(dto);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to fetch category by slug, using mocked data:', error);
    return getMockedCategoryBySlug(slug);
  }
}

/**
 * Get category by ID
 * 
 * @param id - Category ID
 * @returns Promise resolving to category or null if not found
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  if (!USE_API) {
    return getMockedCategoryById(id);
  }
  
  try {
    const dto = await get<BackendCategoryDto>(`/categories/${id}`);
    return mapBackendCategory(dto);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    console.warn('%c⚠️ FALLBACK MODE', 'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold', 'Failed to fetch category by ID, using mocked data:', error);
    return getMockedCategoryById(id);
  }
}

// ============================================================================
// Mocked Data Functions (Fallback)
// ============================================================================

async function getMockedCategories(): Promise<Category[]> {
  await delay(MOCK_API_DELAY);
  return categoriesData as Category[];
}

async function getMockedCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(MOCK_API_DELAY);
  const categories = categoriesData as Category[];
  return categories.find(c => c.slug === slug) || null;
}

async function getMockedCategoryById(id: string): Promise<Category | null> {
  await delay(MOCK_API_DELAY);
  const categories = categoriesData as Category[];
  return categories.find(c => c.id === id) || null;
}
