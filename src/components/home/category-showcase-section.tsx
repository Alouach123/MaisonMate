
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
  imageAiHint = "furniture category"
}: CategoryShowcaseSectionProps) {
  
  if (productsToDisplay.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
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
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12 md:py-16">
        <div className={cn(
          "flex flex-col items-center gap-8 lg:gap-12",
          reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
        )}>
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-lg text-neutral-200 leading-relaxed">
              {description}
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group text-base px-8 py-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Highlighted Products */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-0 w-full max-w-2xl">
            {productsToDisplay.slice(0, 2).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className="bg-card/90 backdrop-blur-sm border border-card-foreground/20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
