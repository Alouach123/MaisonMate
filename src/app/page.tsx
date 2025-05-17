
"use client";

import { useState, useCallback } from 'react';
import ProductCard from '@/components/products/product-card';
import FilterSidebar from '@/components/products/filter-sidebar';
import { mockProducts } from '@/data/mock-products';
import type { Product } from '@/types';

export default function HomePage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  }, []);

  const handleStyleChange = useCallback((style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedStyles([]);
  }, []);

  const filteredProducts = mockProducts.filter(product => {
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    // Style filter
    if (selectedStyles.length > 0 && (!product.style || !selectedStyles.includes(product.style))) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-72 xl:w-80">
        <FilterSidebar
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedStyles={selectedStyles}
          onStyleChange={handleStyleChange}
          onClearFilters={handleClearFilters}
        />
      </aside>
      <section className="w-full lg:flex-1">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to <span className="text-primary">MaisonMate</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Explore our curated collection and transform your space with quality items at competitive prices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">No products found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
}
