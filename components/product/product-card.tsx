'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCartActions } from '@/lib/hooks/use-cart';
import type { Product } from '@/lib/types/product';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartActions();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product, 1);
    
    // Reset after animation
    setTimeout(() => setIsAdding(false), 1000);
  };
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Image */}
          <div className="relative aspect-square bg-neutral-100">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {discount > 0 && (
              <Badge variant="error" className="absolute top-2 right-2">
                -{discount}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="info" className="absolute top-2 left-2">
                New
              </Badge>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-neutral-500 mb-1">{product.brand}</p>
            <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-neutral-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-neutral-600">({product.reviewCount})</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-neutral-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              variant="primary"
              className="w-full"
              onClick={handleAddToCart}
              isLoading={isAdding}
            >
              {isAdding ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
