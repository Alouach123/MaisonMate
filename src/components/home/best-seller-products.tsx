
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';

interface BestSellerProductsProps {
  products: Product[];
}

export default function BestSellerProducts({ products }: BestSellerProductsProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground">Aucun produit à afficher.</p>; 
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
