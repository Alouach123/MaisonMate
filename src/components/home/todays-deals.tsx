
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';

interface TodaysDealsProps {
  products: Product[];
}

export default function TodaysDeals({ products }: TodaysDealsProps) {
  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <section className="py-8 md:py-12 bg-primary/5 rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2">
            <Tag className="h-7 w-7" />
            Offres du Jour
          </h2>
          <Button asChild variant="outline" className="group text-sm">
            <Link href="/products?sort=deals"> {/* Assuming a future filter/sort for deals */}
              Voir toutes les offres
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
