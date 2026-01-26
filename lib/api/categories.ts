import categoriesData from '@/data/categories.json';
import type { Category } from '@/lib/types/product';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCategories(): Promise<Category[]> {
  await delay(200);
  return categoriesData as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(200);
  const categories = categoriesData as Category[];
  return categories.find(c => c.slug === slug) || null;
}
