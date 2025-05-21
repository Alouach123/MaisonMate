
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Eye, Star, Zap } from 'lucide-react'; // Added Zap for deal icon
import { useWishlist } from '@/hooks/use-wishlist-context';
import AddToCartButton from './add-to-cart-button'; 
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string; 
  style?: React.CSSProperties;
  isDeal?: boolean; // New prop for deal styling
}

export default function ProductCard({ product, className, style, isDeal = false }: ProductCardProps) {
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
    <Card 
      className={cn(
        "overflow-hidden group flex flex-col h-full rounded-xl border shadow-lg hover:shadow-2xl transition-all duration-300",
        isDeal ? "border-accent/70 bg-accent/5" : "border-card-foreground/10 bg-card",
        className
      )}
      style={style}
    >
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`} className="block aspect-[4/3] relative overflow-hidden rounded-t-xl">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x400.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={aiHint}
          />
          {isDeal && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-md shadow-md flex items-center gap-1 z-10">
              <Zap size={14} />
              Offre Flash!
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm rounded-full h-9 w-9 z-10 shadow-md"
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`h-5 w-5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-foreground/70'}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
            <CardTitle className="text-sm sm:text-base font-semibold hover:text-primary transition-colors truncate leading-tight" title={product.name}>
            {product.name}
            </CardTitle>
        </Link>
        {product.shortDescription && (
          <CardDescription className="text-xs text-muted-foreground mt-1.5 h-8 overflow-hidden text-ellipsis line-clamp-2">
            {product.shortDescription}
          </CardDescription>
        )}
        {product.rating && (
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} />
            ))}
            <span className="ml-1.5 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 sm:p-4 flex flex-col items-start gap-2 border-t pt-3 sm:pt-4">
        <p className={cn(
            "text-lg sm:text-xl font-bold",
            isDeal ? "text-destructive" : "text-primary"
        )}>
            ${product.price.toFixed(2)}
        </p>
        <div className="w-full flex gap-2">
           <AddToCartButton 
             product={product} 
             size="sm" 
             variant={isDeal ? "destructive" : "default"} 
             className="flex-grow h-9" 
             showText={true} 
           />
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
