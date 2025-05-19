
"use client";

// This component can be reused for any product grid display if needed.
// For the homepage, BestSellerProducts.tsx is now used.
// If you want a generic grid, this is a good starting point.

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';

interface ProductGridDisplayProps {
  products: Product[];
}

export default function ProductGridDisplay({ products }: ProductGridDisplayProps) {
  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
