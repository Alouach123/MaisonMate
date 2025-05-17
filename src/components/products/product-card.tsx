
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Eye, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = () => {
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
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg border border-border/60">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={aiHint}
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-card/70 hover:bg-card rounded-full"
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-5 w-5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-foreground/70'}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
            <CardTitle className="text-lg font-semibold hover:text-primary transition-colors truncate" title={product.name}>
            {product.name}
            </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">
          {product.description}
        </CardDescription>
        {product.rating && (
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/50'}`} />
            ))}
            <span className="ml-1.5 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t pt-4">
        <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/products/${product.id}`} className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
