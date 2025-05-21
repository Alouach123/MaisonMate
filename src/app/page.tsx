// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import ProductQuickViewModal from '@/components/products/product-quick-view-modal';

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


export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [moreToExploreProducts, setMoreToExploreProducts] = useState<Product[]>([]);
  
  // State for Quick View Modal
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);

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

  useEffect(() => {
    if (!isLoading && allProducts.length > 0) {
      // For Today's Deals
      const shuffledDeals = [...allProducts].sort(() => 0.5 - Math.random());
      setDealsProducts(shuffledDeals.slice(0, DEALS_COUNT));

      // For More to Explore, try to get different products
      const remainingProducts = allProducts.filter(p => !dealsProducts.find(dp => dp.id === p.id));
      const shuffledExplore = [...remainingProducts].sort(() => 0.5 - Math.random());
      setMoreToExploreProducts(shuffledExplore.slice(0, BEST_SELLERS_COUNT * 2)); // Show more items for exploration
    }
  }, [allProducts, isLoading]); // Removed dealsProducts from dependency array to avoid re-shuffling when dealsProducts changes

  // Quick View Modal Handlers - DEFINED BEFORE USAGE IN useMemo
  const handleOpenQuickView = useCallback((product: Product) => {
    setSelectedProductForQuickView(product);
    setIsQuickViewModalOpen(true);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewModalOpen(false);
    setSelectedProductForQuickView(null);
  }, []);
  
  const categoryShowcaseSections = useMemo(() => 
    CATEGORIES_TO_SHOWCASE.map((categoryConfig, index) => {
      if (isLoading && index < 3) { 
        return (
          <div key={`showcase-skel-${categoryConfig.name}`} className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center lg:text-left">
              <div className="flex flex-col w-full items-center gap-8 lg:gap-12 lg:flex-row">
                <div className="space-y-5 lg:w-1/2">
                  <Skeleton className="h-12 w-3/4 mb-4 mx-auto lg:mx-0" />
                  <Skeleton className="h-8 w-full mb-6 mx-auto lg:mx-0" />
                  <Skeleton className="h-10 w-1/3 mx-auto lg:mx-0" />
                </div>
                <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-0 w-full max-w-2xl">
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
          </div>
        );
      }
      
      const productsForShowcase = allProducts
        .filter(p => p.category === categoryConfig.name)
        .slice(0, PRODUCTS_PER_SHOWCASE);

      // Only render showcase if products are loaded or if it's in dev mode to see placeholders
      if (!isLoading && productsForShowcase.length === 0 && allProducts.length > 0 && process.env.NODE_ENV === 'production') return null;

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
          onQuickViewProduct={handleOpenQuickView}
        />
      );
    }).filter(Boolean), [allProducts, isLoading, handleOpenQuickView]
  );

  const bestSellerProducts = useMemo(() => {
    if (isLoading || allProducts.length === 0) return [];
    return [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, BEST_SELLERS_COUNT);
  }, [allProducts, isLoading]);


  return (
    <>
      <HeroSlideshow />
      
      {categoryShowcaseSections}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32"> 
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          <FeaturedCategories />
          
          {(isLoading && dealsProducts.length === 0 && allProducts.length === 0) ? (
            <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(DEALS_COUNT)].map((_, i) => <Skeleton key={`deal-skel-${i}`} className="h-64 w-full rounded-lg" />)}
              </div>
            </div>
          ) : dealsProducts.length > 0 && (
            <TodaysDeals products={dealsProducts} onQuickViewProduct={handleOpenQuickView} />
          )}
          
          <Separator />

          {(isLoading && bestSellerProducts.length === 0 && allProducts.length === 0) ? (
             <div>
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(BEST_SELLERS_COUNT)].map((_, i) => <Skeleton key={`bs-skel-${i}`} className="h-72 w-full rounded-lg" />)}
              </div>
            </div>
          ) : bestSellerProducts.length > 0 && (
            <BestSellerProducts 
              products={bestSellerProducts} 
              title="Nos Meilleures Ventes" 
              itemsToShow={BEST_SELLERS_COUNT} 
              onQuickViewProduct={handleOpenQuickView}
            />
          )}
          
          {!isLoading && allProducts.length === 0 && (
              <div className="py-10 text-center">
                  <p className="text-muted-foreground text-lg">
                    Notre catalogue est actuellement vide. Revenez bientôt pour découvrir nos collections !
                  </p>
              </div>
          )}

          {(isLoading || allProducts.length > 0) && ( 
              <>
                <ServiceHighlights />
              </>
          )}
        </div>
      </div>

      {(isLoading || allProducts.length > 0) && (
        <>
          <div className="w-full my-12 md:my-16 lg:my-20">
            <Separator />
          </div>
          <Testimonials />
          <div className="w-full my-12 md:my-16 lg:my-20">
            <Separator />
          </div>
        </>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {(isLoading || allProducts.length > 0) && ( 
                <>
                  <PartnerLogos />
                  <Separator />
                  <NewsletterSignup />
                </>
            )}
          </div>
      </div>

      <ProductQuickViewModal 
        product={selectedProductForQuickView} 
        isOpen={isQuickViewModalOpen} 
        onClose={handleCloseQuickView} 
      />
    </>
  );
}

