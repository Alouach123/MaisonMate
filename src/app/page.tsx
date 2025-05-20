// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions';

import HeroSlideshow from '@/components/home/hero-slideshow';
import FeaturedCategories from '@/components/home/featured-categories';
import ServiceHighlights from '@/components/home/service-highlights';
import Testimonials from '@/components/home/testimonials';
import PartnerLogos from '@/components/home/partner-logos';
import NewsletterSignup from '@/components/home/newsletter-signup';
import CategoryShowcaseSection from '@/components/home/category-showcase-section'; 
import TodaysDeals from '@/components/home/todays-deals';
import BestSellerProducts from '@/components/home/best-seller-products';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES_TO_SHOWCASE = [
  { 
    name: "Canapés", 
    title: "Découvrez nos Canapés d'Exception",
    description: "Plongez dans un univers de confort et de style avec notre collection exclusive de canapés, conçus pour transformer votre salon en un havre de paix.",
    backgroundImageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1920&h=1080",
    backgroundImageAlt: "Salon luxueux avec un canapé confortable",
    imageAiHint: "luxury sofa"
  },
  { 
    name: "Lits", 
    title: "Des Nuits de Rêve dans nos Lits Raffinés",
    description: "Offrez-vous le summum de la relaxation avec nos lits au design élégant et au confort incomparable, pour des nuits réparatrices et des matins sereins.",
    backgroundImageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1920&h=1080",
    backgroundImageAlt: "Chambre élégante avec un lit confortable",
    imageAiHint: "elegant bed"
  },
  { 
    name: "Chaises", 
    title: "L'Élégance Assise : Explorez nos Chaises",
    description: "Qu'il s'agisse d'un dîner sophistiqué ou d'un coin lecture cosy, nos chaises allient design, confort et fonctionnalité pour chaque espace de votre intérieur.",
    backgroundImageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1920&h=1080",
    backgroundImageAlt: "Chaise design dans un intérieur moderne",
    imageAiHint: "stylish chair"
  },
];
const PRODUCTS_PER_SHOWCASE = 2;
const BEST_SELLERS_COUNT = 4; 
const DEALS_COUNT = 4; 
const MORE_TO_EXPLORE_COUNT = 8; 


export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [moreToExploreProducts, setMoreToExploreProducts] = useState<Product[]>([]);

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

  // Client-side effect for randomization to prevent hydration mismatch
  useEffect(() => {
    if (allProducts.length > 0 && !isLoading) { // Ensure products are loaded and not still in initial loading state
      setDealsProducts(
        [...allProducts].sort(() => 0.5 - Math.random()).slice(0, DEALS_COUNT)
      );
      setMoreToExploreProducts(
        [...allProducts].sort(() => 0.5 - Math.random()).slice(DEALS_COUNT, DEALS_COUNT + MORE_TO_EXPLORE_COUNT)
      );
    }
  }, [allProducts, isLoading]); // Re-run when allProducts or isLoading changes

  const categoryShowcaseSections = CATEGORIES_TO_SHOWCASE.map((categoryConfig, index) => {
    const productsForShowcase = allProducts
      .filter(p => p.category === categoryConfig.name)
      .slice(0, PRODUCTS_PER_SHOWCASE);

    if (isLoading && index < 3) { // Only show skeletons for initial showcases if loading
      return (
        <div key={`showcase-skel-${categoryConfig.name}`} className="w-full min-h-screen flex items-center justify-center bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <Skeleton className="h-12 w-1/2 mb-4 mx-auto" />
            <Skeleton className="h-8 w-3/4 mb-6 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[...Array(PRODUCTS_PER_SHOWCASE)].map((_, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg bg-background/50">
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Render showcase only if products for it are available or if still loading (to show skeleton)
    if (!isLoading && productsForShowcase.length === 0 && allProducts.length > 0) return null;


    // Determine the background color for the separator of the *next* section.
    // The last showcase section should transition to the main page background.
    const isLastShowcase = index === CATEGORIES_TO_SHOWCASE.length - 1;
    const nextSectionBgForSeparator = isLastShowcase ? 'hsl(var(--background))' : 'rgba(0,0,0,0.6)';


    return (
      <CategoryShowcaseSection
        key={categoryConfig.name}
        title={categoryConfig.title}
        description={categoryConfig.description}
        backgroundImageUrl={categoryConfig.backgroundImageUrl}
        backgroundImageAlt={categoryConfig.backgroundImageAlt}
        imageAiHint={categoryConfig.imageAiHint}
        ctaLink={`/products?category=${encodeURIComponent(categoryConfig.name)}`}
        ctaText={`Explorer nos ${categoryConfig.name.toLowerCase()}`}
        productsToDisplay={productsForShowcase}
        reverseLayout={index % 2 !== 0}
        nextSectionBgColor={nextSectionBgForSeparator} // Pass this for the embedded separator
      />
    );
  }).filter(Boolean);

  const bestSellerProducts = useMemo(() => 
    [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, BEST_SELLERS_COUNT),
    [allProducts]
  );

  return (
    <>
      <HeroSlideshow />
      
      {/* Full-width Category Showcases */}
      {categoryShowcaseSections}
      
      {/* Container for the rest of the content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-20">
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          <FeaturedCategories />
          
          {(isLoading && dealsProducts.length === 0) ? (
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(DEALS_COUNT)].map((_, i) => <Skeleton key={`deal-skel-${i}`} className="h-64 w-full rounded-lg" />)}
              </div>
            </div>
          ) : dealsProducts.length > 0 && (
            <TodaysDeals products={dealsProducts} />
          )}
          
          <Separator />

          {(isLoading && bestSellerProducts.length === 0) ? (
             <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(BEST_SELLERS_COUNT)].map((_, i) => <Skeleton key={`bs-skel-${i}`} className="h-72 w-full rounded-lg" />)}
              </div>
            </div>
          ) : bestSellerProducts.length > 0 && (
            <BestSellerProducts products={bestSellerProducts} title="Nos Meilleures Ventes" itemsToShow={BEST_SELLERS_COUNT} />
          )}

          <Separator />
          
          {(isLoading && moreToExploreProducts.length === 0 && allProducts.length > 0) ? ( 
             <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {[...Array(MORE_TO_EXPLORE_COUNT)].map((_, i) => <Skeleton key={`mte-skel-${i}`} className="h-64 w-full rounded-lg" />)}
              </div>
            </div>
          ) : moreToExploreProducts.length > 0 && (
            <BestSellerProducts products={moreToExploreProducts} title="Plus d'Articles à Explorer" itemsToShow={MORE_TO_EXPLORE_COUNT} gridCols="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
          )}
          
          {!isLoading && allProducts.length === 0 && (
              <div className="py-10 text-center">
                  <p className="text-muted-foreground text-lg">
                    Notre catalogue est actuellement vide. Revenez bientôt pour découvrir nos collections !
                  </p>
              </div>
          )}

          {/* Render these sections regardless of product loading, unless they depend on product data */}
          {(isLoading || allProducts.length > 0) && ( 
              <>
                <ServiceHighlights />
                <Separator />
                <Testimonials />
                <Separator />
                <PartnerLogos />
                <Separator />
                <NewsletterSignup />
              </>
          )}
        </div>
      </div>
    </>
  );
}
