'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCartActions } from '@/lib/hooks/use-cart';
import { getProductBySlug, getProducts } from '@/lib/api/products';
import { ProductGrid } from '@/components/product/product-grid';
import type { Product } from '@/lib/types/product';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCartActions();
  
  useEffect(() => {
    getProductBySlug(slug).then((data) => {
      setProduct(data);
      if (data) {
        getProducts({ category: data.category }).then((products) => {
          setRelatedProducts(products.filter(p => p.id !== data.id).slice(0, 4));
        });
      }
    });
  }, [slug]);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-neutral-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-3/4" />
              <div className="h-6 bg-neutral-200 rounded w-1/2" />
              <div className="h-12 bg-neutral-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1000);
  };
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-8">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-primary-600">Products</a>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square relative bg-neutral-100 rounded-lg overflow-hidden mb-4"
            >
              <Image
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <Badge variant="error" className="absolute top-4 right-4">
                  -{discount}%
                </Badge>
              )}
            </motion.div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <p className="text-sm text-neutral-600 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-neutral-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-neutral-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-neutral-700 mb-6">{product.description}</p>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={handleAddToCart}
              isLoading={isAdding}
              disabled={!product.inStock}
            >
              {isAdding ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
            
            {/* Features */}
            {product.features.length > 0 && (
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Specifications</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm text-neutral-600">{key}</dt>
                      <dd className="text-sm font-medium text-neutral-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
