'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/product/product-grid';
import { searchProducts } from '@/lib/api/products';
import type { Product } from '@/lib/types/product';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);
  
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    const products = await searchProducts(searchQuery);
    setResults(products);
    setIsLoading(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Search Products</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-2xl">
          <Input
            type="search"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg"
          />
        </div>
      </form>
      
      {query && (
        <div className="mb-6">
          <p className="text-neutral-600">
            {isLoading ? 'Searching...' : `${results.length} results for "${query}"`}
          </p>
        </div>
      )}
      
      <ProductGrid products={results} isLoading={isLoading} />
    </div>
  );
}
