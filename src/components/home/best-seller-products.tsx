
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BestSellerProductsProps {
  products: Product[];
  title?: string;
  itemsToShow?: number;
  showViewAllButton?: boolean;
  viewAllLink?: string;
  gridCols?: string; // e.g., "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
}

export default function BestSellerProducts({ 
  products, 
  title = "Nos Meilleures Ventes",
  itemsToShow = 4, 
  showViewAllButton = true,
  viewAllLink = "/products",
  gridCols = "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
}: BestSellerProductsProps) {

  const productsToDisplay = products.slice(0, itemsToShow);

  if (!productsToDisplay || productsToDisplay.length === 0) {
    return null; 
  }

  return (
    <section className="py-8 md:py-12">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        {showViewAllButton && (
          <Button asChild variant="outline" className="group text-sm">
            <Link href={viewAllLink}>
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>
      <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-6`}>
        {productsToDisplay.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
