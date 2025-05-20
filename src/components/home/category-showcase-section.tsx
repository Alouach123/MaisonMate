
"use client";

import type { Product } from '@/types';
import ProductCard from '@/components/products/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CategoryShowcaseSectionProps {
  title: string;
  description: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  ctaLink: string;
  ctaText?: string;
  productsToDisplay: Product[];
  reverseLayout?: boolean; // For alternating layout if desired
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
    // Optionally render nothing or a simplified version if no products
    return null;
  }

  return (
    <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden rounded-lg shadow-2xl my-10">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt={backgroundImageAlt}
        fill
        style={{ objectFit: 'cover' }}
        quality={80}
        className="z-0"
        data-ai-hint={imageAiHint}
        priority // Consider adding priority for LCP images
      />
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className={`flex flex-col ${reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-12`}>
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
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-0">
            {productsToDisplay.slice(0, 2).map(product => ( // Show max 2 products in this layout
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
