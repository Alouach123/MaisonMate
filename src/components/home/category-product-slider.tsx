
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryProductSliderProps {
  title: string;
  allProducts: Product[];
  categoryName: string;
  categoryLink: string;
  maxProducts?: number;
}

export default function CategoryProductSlider({ 
  title, 
  allProducts, 
  categoryName, 
  categoryLink,
  maxProducts = 6 // Default to showing 6 products
}: CategoryProductSliderProps) {
  
  const categoryProducts = allProducts
    .filter(product => product.category === categoryName)
    .slice(0, maxProducts);

  if (categoryProducts.length === 0) {
    return null; // Don't render the section if no products in this category
  }

  return (
    <section className="py-6 md:py-8">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        <Button asChild variant="outline" className="group text-sm">
          <Link href={categoryLink}>
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {/* 
          Horizontal scrollbar custom styling:
          - `scrollbar-thin`: Makes the scrollbar thinner (Tailwind plugin needed or custom CSS)
          - `scrollbar-thumb-muted`: Colors the scrollbar thumb using the 'muted' theme color
          - `scrollbar-track-transparent`: Makes the scrollbar track transparent
          Note: These classes rely on a tailwind scrollbar plugin (like `tailwind-scrollbar`) or custom global CSS.
          If not available, default browser scrollbar will be used.
          For simplicity, using default browser scrollbar behavior if plugin is not present.
          The -mx-4 px-4 trick is to allow box shadows of cards to not be clipped by parent overflow.
        */}
        {categoryProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            className="flex-none w-60 sm:w-64 md:w-72" // Adjust width as needed
          />
        ))}
      </div>
    </section>
  );
}
