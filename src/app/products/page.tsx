
"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/product-card';
import FilterSidebar from '@/components/products/filter-sidebar';
import type { Product } from '@/types';
import { getProductsAction } from '@/app/admin/actions'; 
import { Skeleton } from '@/components/ui/skeleton';
import { productCategories, productStyles } from '@/data/mock-products'; 
import ProductQuickViewModal from '@/components/products/product-quick-view-modal'; // Import the modal

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // State for Quick View Modal
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategories(prev => {
        const decodedCategory = decodeURIComponent(categoryFromUrl);
        if (!prev.includes(decodedCategory)) {
            return [decodedCategory]; // Replace if different, or initialize
        }
        return prev;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const productsFromDb = await getProductsAction({}); 
        setAllProducts(productsFromDb);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []); 

  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [category] // Single category selection for now
    );
  }, []);

  const handleStyleChange = useCallback((style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    setSelectedStyles([]);
  }, []);

  const categorySortOrder = useMemo(() => {
    const orderMap: Record<string, number> = {};
    productCategories.forEach((category, index) => {
      orderMap[category] = index;
    });
    return orderMap;
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let productsToDisplay = allProducts.filter(product => {
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      if (selectedStyles.length > 0 && (!product.style || !selectedStyles.includes(product.style))) {
        return false;
      }
      return true;
    });

    productsToDisplay.sort((a, b) => {
      const orderA = categorySortOrder[a.category] ?? Infinity; 
      const orderB = categorySortOrder[b.category] ?? Infinity;

      if (orderA !== orderB) {
        return orderA - orderB; 
      }
      return a.name.localeCompare(b.name); 
    });

    return productsToDisplay;
  }, [allProducts, priceRange, selectedCategories, selectedStyles, categorySortOrder]);

  // Quick View Modal Handlers
  const handleOpenQuickView = useCallback((product: Product) => {
    setSelectedProductForQuickView(product);
    setIsQuickViewModalOpen(true);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewModalOpen(false);
    setSelectedProductForQuickView(null);
  }, []);


  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <aside className="w-full md:w-72 lg:w-80">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedStyles={selectedStyles}
              onStyleChange={handleStyleChange}
              onClearFilters={handleClearFilters}
              availableCategories={productCategories}
              availableStyles={productStyles}
            />
          </aside>

          <section id="products-section" className="flex-1">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Notre Collection
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Parcourez nos articles sélectionnés avec soin. ({isLoading ? "Chargement..." : `${sortedAndFilteredProducts.length} produit${sortedAndFilteredProducts.length !== 1 ? 's' : ''} trouvé${sortedAndFilteredProducts.length !== 1 ? 's' : ''}`})
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[224px] w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                ))}
              </div>
            ) : sortedAndFilteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">Aucun produit ne correspond à vos critères.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAndFilteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onQuickViewClick={handleOpenQuickView} />
                ))}
              </div>
            )}
          </section>
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
