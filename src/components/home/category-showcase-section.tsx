
// src/components/home/category-showcase-section.tsx
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CategoryShowcaseSectionProps {
  title: string;
  description: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  ctaLink: string;
  ctaText?: string;
  productsToDisplay: Product[];
  reverseLayout?: boolean;
  imageAiHint?: string;
  onQuickViewProduct?: (product: Product) => void; // New prop
}

export default function CategoryShowcaseSection({
  title,
  description,
  backgroundImageUrl,
  backgroundImageAlt,
  ctaLink,
  ctaText = "Explorer la collection",
  productsToDisplay,
  reverseLayout = false,
  imageAiHint = "furniture category",
  onQuickViewProduct, // Destructure new prop
}: CategoryShowcaseSectionProps) {
  
  if (productsToDisplay.length === 0 && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <Image
        src={backgroundImageUrl}
        alt={backgroundImageAlt}
        fill
        style={{ objectFit: 'cover' }}
        quality={80}
        className="z-0"
        data-ai-hint={imageAiHint}
        priority 
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <div className={cn(
        "relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen py-24 md:py-32", 
        productsToDisplay.length > 0 ? "lg:text-left" : "text-center"
      )}>
        <div className={cn(
          "flex flex-col w-full items-center gap-8 lg:gap-12",
          productsToDisplay.length > 0 && (reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row')
        )}>
          <div className={cn(
            "space-y-5",
            productsToDisplay.length > 0 ? "lg:w-1/2" : "lg:w-3/4 text-center lg:text-left"
          )}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-lg text-neutral-200 leading-relaxed drop-shadow-sm">
              {description}
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group text-base px-8 py-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {productsToDisplay.length > 0 && (
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-0 w-full max-w-2xl">
              {productsToDisplay.slice(0, 2).map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  className="bg-card/90 backdrop-blur-sm border border-card-foreground/20"
                  onQuickViewClick={onQuickViewProduct} // Pass handler
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
