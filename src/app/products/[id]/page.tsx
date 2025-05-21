
"use client"; 

import Image from 'next/image';
import { notFound } from 'next/navigation'; 
import StyleSuggestions from '@/components/products/style-suggestions'; // This is now a review form
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Palette, Package, Ruler, ShoppingBag } from 'lucide-react';
import AddToWishlistButton from '@/components/products/add-to-wishlist-button';
import AddToCartButton from '@/components/products/add-to-cart-button';
import { getProductByIdAction } from '@/app/admin/actions'; 
import { useEffect, useState, useCallback } from 'react';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import AvisList from '@/components/products/avis-list';
import AvisForm from '@/components/products/avis-form';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avisRefreshKey, setAvisRefreshKey] = useState(0); 

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProduct = await getProductByIdAction(params.id);
      if (!fetchedProduct) {
        setError("Produit non trouvé.");
        setProduct(null);
      } else {
        setProduct(fetchedProduct);
      }
    } catch (e) {
      console.error("Failed to fetch product:", e);
      setError("Erreur lors du chargement du produit.");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAvisSubmitted = () => {
    setAvisRefreshKey(prevKey => prevKey + 1); 
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 pt-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div><Skeleton className="aspect-[4/3] w-full rounded-lg" /></div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-20 max-w-md mx-auto pt-20">
            <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
            <p className="text-muted-foreground">Désolé, nous n'avons pas pu charger les détails de ce produit.</p>
        </div>
    );
  }
  
  if (!product) {
    notFound(); 
    return null; 
  }

  const hintKeywords: string[] = [];
  if (product.category) {
    hintKeywords.push(product.category.toLowerCase().split(' ')[0]);
  }
  if (product.style) {
    hintKeywords.push(product.style.toLowerCase().split(' ')[0]);
  }
  const uniqueHintKeywords = [...new Set(hintKeywords)];
  const aiHint = uniqueHintKeywords.slice(0, 2).join(' ') || 'item';

  const isColorLight = (colorString: string): boolean => {
    if (!colorString) return true;
    const lightNamedColors = ['white', 'yellow', 'beige', 'ivory', 'cream', 'lightgray', 'lightgrey', 'silver', 'blanc', 'jaune', 'crème', 'transparent'];
    if (lightNamedColors.some(lightColor => colorString.toLowerCase().includes(lightColor))) {
      return true;
    }
    if (colorString.startsWith('#')) {
      try {
        const hex = colorString.replace('#', '');
        if (hex.length === 3) { // Handle short hex
          const r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
          const g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
          const b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
          return luminance > 186;
        }
        if (hex.length === 6) {
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
          return luminance > 186; 
        }
      } catch (e) {
        return true; 
      }
    }
    // For rgb, rgba, hsl, hsla - it's complex to parse reliably here, default to true
    if (colorString.startsWith('rgb') || colorString.startsWith('hsl')) {
        // A simple heuristic: if it contains "light" or a high lightness value in hsl
        if (colorString.toLowerCase().includes('light') || (colorString.includes('hsl') && parseInt(colorString.split(',')[2]?.replace('%','').trim() || '0') > 70)) {
            return true;
        }
        return false; // Assume dark for complex colors not easily parsed as light
    }
    return true; 
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 pt-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="md:sticky md:top-24">
          <Card className="overflow-hidden shadow-xl rounded-lg border">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-auto object-contain aspect-[4/3]"
              priority
              data-ai-hint={aiHint}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg rounded-lg border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  {product.category && <Badge variant="outline" className="mb-2 text-sm">{product.category}</Badge>}
                  <CardTitle className="text-3xl lg:text-4xl font-bold tracking-tight text-primary">{product.name}</CardTitle>
                </div>
                <AddToWishlistButton product={product} />
              </div>
              {product.rating && product.rating > 0 && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">({product.rating.toFixed(1)} de moyenne)</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
              {product.shortDescription && <CardDescription className="text-md text-foreground/80 leading-relaxed">{product.shortDescription}</CardDescription>}
              <CardDescription className="text-sm text-foreground/70 leading-relaxed pt-2 border-t">
                {product.description}
              </CardDescription>
              
              <div className="space-y-3 pt-3 border-t">
                {product.style && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="font-medium">Style: {product.style}</Badge>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                   <div className="flex items-start gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium shrink-0">Couleurs:</span>
                    <span className="flex flex-wrap gap-1.5">
                        {product.colors.map(color => (
                          <Badge 
                            key={color} 
                            variant="outline" 
                            style={{
                              backgroundColor: color, 
                              color: isColorLight(color) ? '#000' : '#fff',
                              borderColor: isColorLight(color) ? 'hsl(var(--border))' : color
                            }}
                            className="px-2 py-0.5 text-xs"
                          >
                            {color}
                          </Badge>
                        ))}
                    </span>
                  </div>
                )}
                 {product.materials && product.materials.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Matériaux:</span>
                    <span className="text-foreground/80">{product.materials.join(', ')}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-foreground/80">{product.dimensions}</span>
                  </div>
                )}
                {product.stock !== undefined && product.stock !== null && (
                   <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Stock:</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock > 0 ? `${product.stock} disponible(s)` : 'En rupture de stock'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <AddToCartButton product={product} size="lg" variant="default" showText={true} className="w-full" />
            </CardFooter>
          </Card>
          
          {/* The StyleSuggestions component is now repurposed as another review form */}
          <StyleSuggestions 
            productId={product.id} 
            productName={product.name} 
            onReviewSubmitted={handleAvisSubmitted} 
          />
        </div>
      </div>
      <div className="mt-12">
        <AvisList productId={product.id} refreshKey={avisRefreshKey} />
        {/* The AvisForm below is the original review form. 
            You might want to remove this one if StyleSuggestions is now the primary review form,
            or keep both if desired. For now, I'll keep it. */}
        <AvisForm productId={product.id} onAvisSubmitted={handleAvisSubmitted} />
      </div>
    </div>
  );
}

