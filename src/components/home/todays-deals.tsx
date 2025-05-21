
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';

interface TodaysDealsProps {
  products: Product[];
  onQuickViewProduct?: (product: Product) => void; // New prop
}

export default function TodaysDeals({ products, onQuickViewProduct }: TodaysDealsProps) {
  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <section className="py-8 md:py-12 bg-amber-500/10 dark:bg-amber-700/20 rounded-lg border border-amber-500/30 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2 sm:mb-0">
            <Tag className="h-7 w-7" />
            Offres du Jour
          </h2>
          <Button asChild variant="outline" className="group text-sm border-amber-600/50 text-amber-700 hover:bg-amber-500 hover:text-white dark:text-amber-400 dark:border-amber-400/50 dark:hover:bg-amber-500 dark:hover:text-black">
            <Link href="/products?sort=deals"> 
              Voir toutes les offres
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isDeal={true} 
              onQuickViewClick={onQuickViewProduct} // Pass handler
            />
          ))}
        </div>
      </div>
    </section>
  );
}
