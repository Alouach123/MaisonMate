
"use client";

import type { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, ShoppingCart, X, Palette, Package, Ruler, ArrowRight } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0">
          {/* DialogTitle can be used here if preferred, or keep it clean */}
        </DialogHeader>
        
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
              <DialogTitle className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">{product.name}</DialogTitle>
              
              {product.category && <Badge variant="outline" className="text-sm">{product.category}</Badge>}

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
                <DialogDescription className="text-base text-foreground/80 leading-relaxed line-clamp-3">
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
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Couleurs:</span>
                    <span className="flex flex-wrap gap-1">
                        {product.colors.map(color => <Badge key={color} variant="outline" style={{backgroundColor: color, color: (parseInt(color.replace('#', ''), 16) > 0xffffff/2 ? '#000' : '#fff'), borderColor: '#ccc'}}>{color}</Badge>)}
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
                    <Package className="h-4 w-4 text-muted-foreground" />
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
