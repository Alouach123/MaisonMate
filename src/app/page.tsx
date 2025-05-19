
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions';
import FeaturedCategories from '@/components/home/featured-categories';
import PopularProductsDisplay from '@/components/home/popular-products-display'; // Renamed for clarity
import ServiceHighlights from '@/components/home/service-highlights';
import Testimonials from '@/components/home/testimonials';
import NewsletterSignup from '@/components/home/newsletter-signup';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_PRODUCTS_TO_SHOW = 12; // Show more products initially

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState(INITIAL_PRODUCTS_TO_SHOW);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsAction();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        // Optionally, set an error state to display a message to the user
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleLoadMore = () => {
    // This is a placeholder. Real "load more" would fetch more or slice differently.
    // For now, it just shows more from the already fetched list if available.
    setVisibleProducts(prev => Math.min(prev + INITIAL_PRODUCTS_TO_SHOW, products.length));
  };

  const productsToShow = products.slice(0, visibleProducts);

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <FeaturedCategories />

      <Separator />

      <section id="discover-products" className="py-2 md:py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
            You Might Like
          </h2>
          <p className="text-center text-muted-foreground mb-8 md:mb-10 text-lg">
            Explore our curated selection of quality home goods.
          </p>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(INITIAL_PRODUCTS_TO_SHOW)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] sm:h-[224px] w-full rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              ))}
            </div>
          ) : productsToShow.length > 0 ? (
            <>
              <PopularProductsDisplay products={productsToShow} />
              {visibleProducts < products.length && (
                <div className="text-center mt-10">
                  <Button onClick={handleLoadMore} size="lg" variant="outline" className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Load More Products
                    <ShoppingBag className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-10">No products available at the moment. Please check back later!</p>
          )}
        </div>
      </section>
      
      <ServiceHighlights />
      <Separator />
      <NewsletterSignup />
      <Separator />
      <Testimonials />
    </div>
  );
}
