
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryProductSliderProps {
  title: string;
  allProducts: Product[];
  categoryName: string;
  categoryLink: string;
  maxProducts?: number;
}

const SCROLL_AMOUNT_PX = 300; // Adjust scroll amount as needed

export default function CategoryProductSlider({ 
  title, 
  allProducts, 
  categoryName, 
  categoryLink,
  maxProducts = 8 // Show more products by default if available
}: CategoryProductSliderProps) {
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const categoryProducts = allProducts
    .filter(product => product.category === categoryName)
    .slice(0, maxProducts);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth -1); // -1 for pixel rounding issues
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability(); // Initial check
      container.addEventListener('scroll', checkScrollability); // Check on scroll
      window.addEventListener('resize', checkScrollability); // Check on resize

      // For a more robust check after products might have loaded images
      const observer = new MutationObserver(checkScrollability);
      observer.observe(container, { childList: true, subtree: true });
      
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
        observer.disconnect();
      };
    }
  }, [categoryProducts, checkScrollability]); // Rerun if products change

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -SCROLL_AMOUNT_PX : SCROLL_AMOUNT_PX;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (categoryProducts.length === 0) {
    return null; 
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
      <div className="relative">
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 pb-4 -mx-4 px-4 overflow-x-scroll no-scrollbar" // `no-scrollbar` hides the native scrollbar
          style={{ scrollSnapType: 'x mandatory' }} // Optional: for snap scrolling
        >
          {categoryProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className="flex-none w-60 sm:w-64 md:w-72" // Fixed width for cards in slider
              style={{ scrollSnapAlign: 'start' }} // Optional: for snap scrolling
            />
          ))}
        </div>

        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-md h-10 w-10"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-md h-10 w-10"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </section>
  );
}
