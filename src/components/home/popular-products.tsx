
"use client";

// This component is being replaced by PopularProductsDisplay
// Kept for reference or if you want to revert, but it's no longer used by page.tsx

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions'; 
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const POPULAR_PRODUCTS_COUNT = 4;

export default function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPopularProducts() {
      setIsLoading(true);
      try {
        const allProducts = await getProductsAction();
        setPopularProducts(allProducts.slice(0, POPULAR_PRODUCTS_COUNT));
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPopularProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Produits Populaires</h2>
          <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
            Découvrez les articles les plus appréciés par nos clients.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(POPULAR_PRODUCTS_COUNT)].map((_, i) => (
               <div key={i} className="space-y-3">
                <Skeleton className="h-[224px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (popularProducts.length === 0 && !isLoading) {
    return null; 
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Produits Populaires</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
          Découvrez les articles les plus appréciés par nos clients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline" className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/products">
              Voir toute la collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

