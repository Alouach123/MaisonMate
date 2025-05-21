
"use client";

import type { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Palette, Package, Ruler, ArrowRight, Zap, ShoppingBag } from 'lucide-react';
import AddToCartButton from './add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, isOpen, onClose }: ProductQuickViewModalProps) {
  if (!product) {
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

  // Helper function to determine if a color is "light" for text contrast
  const isColorLight = (colorString: string): boolean => {
    if (!colorString) return true; // Default to dark text for unknown/undefined colors
    // Basic check for named colors that are typically light
    const lightNamedColors = ['white', 'yellow', 'beige', 'ivory', 'cream', 'lightgray', 'lightgrey', 'silver'];
    if (lightNamedColors.some(lightColor => colorString.toLowerCase().includes(lightColor))) {
      return true;
    }
    if (colorString.startsWith('#')) {
      try {
        const hex = colorString.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Simple luminance approximation
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
        return luminance > 186; // Threshold for light colors (0-255 range)
      } catch (e) {
        return true; // Default to dark text if hex parsing fails
      }
    }
    // For non-hex, non-listed named colors, it's harder to tell, default to dark text
    return true; 
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] flex flex-col">
        {/* Removed DialogHeader to give more space to content if needed, title is inside scroll area */}
        
        <ScrollArea className="flex-grow">
          <div className="grid md:grid-cols-2 gap-6 p-6 items-start">
            {/* Image Section */}
            <div className="md:sticky md:top-6">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border shadow-md">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                  data-ai-hint={aiHint}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              {product.category && <Badge variant="outline" className="text-sm mb-1">{product.category}</Badge>}
              <DialogTitle className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">{product.name}</DialogTitle>
              
              {product.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">({product.rating.toFixed(1)} rating)</span>
                </div>
              )}

              <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
              
              {product.shortDescription && (
                <DialogDescription className="text-base text-foreground/80 leading-relaxed">
                  {product.shortDescription}
                </DialogDescription>
              )}
              <DialogDescription className="text-sm text-foreground/70 leading-relaxed pt-2 border-t">
                {product.description}
              </DialogDescription>

              <div className="space-y-3 pt-3 border-t">
                {product.style && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="font-medium">Style: {product.style}</Badge>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-start gap-2 text-sm"> {/* Changed to items-start for alignment */}
                    <Palette className="h-4 w-4 text-muted-foreground mt-0.5" /> {/* Added mt-0.5 for alignment */}
                    <span className="font-medium shrink-0">Couleurs:</span>
                    <span className="flex flex-wrap gap-1.5"> {/* Changed gap to 1.5 for better spacing */}
                        {product.colors.map(color => (
                          <Badge 
                            key={color} 
                            variant="outline" 
                            style={{
                              backgroundColor: color, 
                              color: isColorLight(color) ? '#000' : '#fff', // Text contrast
                              borderColor: isColorLight(color) ? 'hsl(var(--border))' : color // Border for light colors
                            }}
                            className="px-2 py-0.5 text-xs" // Ensure consistent padding and text size
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
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" /> {/* Changed icon to ShoppingBag */}
                    <span className="font-medium">Stock:</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock > 0 ? `${product.stock} disponible(s)` : 'En rupture de stock'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-0 border-t mt-auto">
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <AddToCartButton product={product} size="lg" variant="default" showText={true} className="flex-grow" />
            <Button asChild variant="outline" size="lg" className="flex-grow">
              <Link href={`/products/${product.id}`} onClick={onClose}>
                Voir la page du produit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

