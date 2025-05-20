
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions';

import HeroSlideshow from '@/components/home/hero-slideshow';
import FeaturedCategories from '@/components/home/featured-categories';
import ServiceHighlights from '@/components/home/service-highlights';
import Testimonials from '@/components/home/testimonials';
import PartnerLogos from '@/components/home/partner-logos';
import NewsletterSignup from '@/components/home/newsletter-signup';
import CategoryProductSlider from '@/components/home/category-product-slider'; // New
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const FEATURED_CATEGORIES_FOR_SLIDERS = ["Canapés", "Lits", "Chaises"];
const PRODUCTS_PER_SLIDER = 6;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsAction({}); 
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load products for homepage:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const featuredCategorySections = FEATURED_CATEGORIES_FOR_SLIDERS.map(categoryName => {
    // Find if this category actually has products
    const hasProducts = allProducts.some(p => p.category === categoryName);
    if (!hasProducts && !isLoading) return null; // Don't render slider if no products and not loading

    return (
      <div key={categoryName}>
        {isLoading && !allProducts.length ? (
          <div className="py-6 md:py-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-none w-60 sm:w-64 md:w-72 space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CategoryProductSlider
            title={`Découvrez nos ${categoryName}`}
            allProducts={allProducts}
            categoryName={categoryName}
            categoryLink={`/products?category=${encodeURIComponent(categoryName)}`}
            maxProducts={PRODUCTS_PER_SLIDER}
          />
        )}
      </div>
    );
  }).filter(Boolean); // Remove null entries

  return (
    <>
      <HeroSlideshow />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-20">
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          <FeaturedCategories />
          
          {featuredCategorySections}
          
          {/* Render other sections if there are products or still loading */}
          {(isLoading || allProducts.length > 0) && (
            <>
              <Separator />
              <ServiceHighlights />
              <Separator />
              <Testimonials />
              <Separator />
              <PartnerLogos />
              <Separator />
              <NewsletterSignup />
            </>
          )}
          {!isLoading && allProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-lg">
              Notre catalogue est en cours de construction. Revenez bientôt !
            </p>
          )}
        </div>
      </div>
    </>
  );
}
