
"use client";

import { mockProducts } from '@/data/mock-products';
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Display a limited number of popular products, e.g., the first 4.
const popularProducts = mockProducts.slice(0, 4);

export default function PopularProducts() {
  if (popularProducts.length === 0) {
    return null; // Don't render if there are no products
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
