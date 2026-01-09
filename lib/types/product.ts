export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryType;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  sku: string;
  tags: string[];
  weight?: string;
  dimensions?: string;
  createdAt: string;
  isFeatured: boolean;
  isNewArrival: boolean;
}

export interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'material';
  name: string;
  value: string;
  priceDelta?: number;
  inStock: boolean;
}

export type CategoryType = 'electronics' | 'fashion' | 'home-garden' | 'beauty' | 'sports' | 'books';

export interface ProductFilters {
  category?: CategoryType;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}
