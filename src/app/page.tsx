
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions';

import HeroSlideshow from '@/components/home/hero-slideshow';
import FeaturedCategories from '@/components/home/featured-categories';
import ServiceHighlights from '@/components/home/service-highlights';
import BestSellerProducts from '@/components/home/best-seller-products';
import Testimonials from '@/components/home/testimonials';
import PartnerLogos from '@/components/home/partner-logos';
import NewsletterSignup from '@/components/home/newsletter-signup';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const BEST_SELLERS_COUNT = 5; // Number of best sellers to show

export default function HomePage() {
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBestSellers() {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsAction({}); 
        const sortedProducts = fetchedProducts
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.stock ?? 0) - (a.stock ?? 0))
          .slice(0, BEST_SELLERS_COUNT);
        setBestSellerProducts(sortedProducts);
      } catch (error) {
        console.error("Failed to load best seller products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBestSellers();
  }, []);

  return (
    // No outer div with container/padding here, HeroSlideshow handles its own width/height
    <>
      <HeroSlideshow />
      
      {/* Wrapper for the rest of the content to apply container and padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-20"> {/* Added top padding */}
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          <FeaturedCategories />
          
          <Separator />
          
          <ServiceHighlights />
          
          <Separator />

          <section id="best-sellers" className="py-2 md:py-4">
            {/* Container and px removed from here as it's handled by the outer div */}
            <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
              Nos Meilleures Ventes
            </h2>
            <p className="text-center text-muted-foreground mb-8 md:mb-10 text-lg">
              Découvrez les articles préférés de nos clients.
            </p>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(BEST_SELLERS_COUNT)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] sm:h-[224px] w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                ))}
              </div>
            ) : bestSellerProducts.length > 0 ? (
              <BestSellerProducts products={bestSellerProducts} />
            ) : (
              <p className="text-center text-muted-foreground py-10">Aucun produit populaire à afficher pour le moment.</p>
            )}
          </section>
          
          <Separator />
          
          <Testimonials />
          
          <Separator />

          <PartnerLogos />
          
          <Separator />
          
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
