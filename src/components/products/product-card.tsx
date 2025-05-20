
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Eye, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist-context';
import AddToCartButton from './add-to-cart-button'; 
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string; // Added className prop
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
    <Card className={cn("overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg border border-border/60 group", className)}>
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`} className="block aspect-[4/3] relative overflow-hidden">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x400.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={aiHint}
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-card/70 hover:bg-card rounded-full h-8 w-8 z-10"
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-destructive text-destructive' : 'text-foreground/70'}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <Link href={`/products/${product.id}`}>
            <CardTitle className="text-sm sm:text-base font-semibold hover:text-primary transition-colors truncate" title={product.name}>
            {product.name}
            </CardTitle>
        </Link>
        {product.shortDescription && (
          <CardDescription className="text-xs text-muted-foreground mt-1 h-8 overflow-hidden text-ellipsis line-clamp-2">
            {product.shortDescription}
          </CardDescription>
        )}
        {product.rating && (
          <div className="flex items-center mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 flex flex-col items-start gap-2 border-t pt-3">
        <p className="text-base sm:text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
        <div className="w-full flex gap-2">
           <AddToCartButton product={product} size="sm" variant="default" className="flex-grow" showText={true} />
           <Button asChild variant="outline" size="icon" className="h-9 w-9">
            <Link href={`/products/${product.id}`} aria-label="Voir le produit">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
