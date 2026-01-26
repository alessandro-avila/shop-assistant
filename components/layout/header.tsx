'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  
  const categories = [
    { name: 'Electronics', href: '/products?category=electronics' },
    { name: 'Fashion', href: '/products?category=fashion' },
    { name: 'Home & Garden', href: '/products?category=home-garden' },
    { name: 'Beauty', href: '/products?category=beauty' },
    { name: 'Sports', href: '/products?category=sports' },
    { name: 'Books', href: '/products?category=books' },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">Shop</span>
            <span className="text-2xl font-bold text-neutral-900">Assistant</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              All Products
            </Link>
            <div className="relative group">
              <button className="text-neutral-700 hover:text-primary-600 transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          
          {/* Search & Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="text-neutral-700 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            <Link
              href="/cart"
              className="relative text-neutral-700 hover:text-primary-600 transition-colors"
              aria-label={`Cart with ${totalItems} items`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-neutral-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-neutral-200 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <Link
                  href="/products"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
