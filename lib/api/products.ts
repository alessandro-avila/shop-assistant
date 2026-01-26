import productsData from '@/data/products.json';
import type { Product, ProductFilters } from '@/lib/types/product';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(300); // Simulate API latency
  
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

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  const products = productsData as unknown as Product[];
  return products.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(200);
  const products = productsData as unknown as Product[];
  return products.find(p => p.slug === slug) || null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(250);
  const products = productsData as unknown as Product[];
  const lowerQuery = query.toLowerCase();
  
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(200);
  const products = productsData as unknown as Product[];
  return products.filter(p => p.isFeatured);
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay(200);
  const products = productsData as unknown as Product[];
  return products.filter(p => p.isNewArrival);
}
