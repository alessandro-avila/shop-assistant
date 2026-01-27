'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api/products';
import type { Product, ProductFilters, CategoryType } from '@/lib/types/product';

type SortByType = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  
  useEffect(() => {
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    
    const newFilters: ProductFilters = {};
    if (category) newFilters.category = category as CategoryType;
    if (sort) newFilters.sortBy = sort as SortByType;
    
    setFilters(newFilters);
    
    setIsLoading(true);
    getProducts(newFilters).then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, [searchParams]);
  
  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy: sortBy as SortByType };
    setFilters(newFilters);
    
    setIsLoading(true);
    getProducts(newFilters).then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  };
  
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
  ];
  
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ];
  
  const currentCategory = searchParams.get('category') || 'all';
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          {currentCategory === 'all' 
            ? 'All Products' 
            : categories.find(c => c.value === currentCategory)?.label || 'Products'}
        </h1>
        <p className="text-neutral-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>
      
      {/* Filters and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={currentCategory === category.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                const url = new URL(window.location.href);
                if (category.value === 'all') {
                  url.searchParams.delete('category');
                } else {
                  url.searchParams.set('category', category.value);
                }
                window.history.pushState({}, '', url);
                window.location.reload();
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600">Sort by:</label>
          <select
            className="border border-neutral-300 rounded-lg px-3 py-1.5 text-sm"
            value={filters.sortBy || 'featured'}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
