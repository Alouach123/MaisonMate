
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { WishlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Eye } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { formatDistanceToNow } from 'date-fns';

interface WishlistItemCardProps {
  item: WishlistItem;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
  const { removeFromWishlist } = useWishlist();

  const hintKeywords: string[] = [];
  if (item.category) {
    hintKeywords.push(item.category.toLowerCase().split(' ')[0]);
  }
  if (item.style) {
    hintKeywords.push(item.style.toLowerCase().split(' ')[0]);
  }
  const uniqueHintKeywords = [...new Set(hintKeywords)];
  const aiHint = uniqueHintKeywords.slice(0, 2).join(' ') || 'item';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row rounded-lg border border-border/60">
      <Link href={`/products/${item.id}`} className="md:w-1/3 block relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-48 md:h-full object-cover transition-transform duration-300 hover:scale-105"
          data-ai-hint={aiHint}
        />
      </Link>
      <div className="flex flex-col justify-between md:w-2/3">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <Link href={`/products/${item.id}`}>
                <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
                {item.name}
                </CardTitle>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeFromWishlist(item.id)}
              aria-label="Remove from wishlist"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Added {formatDistanceToNow(new Date(item.addedAt), { addSuffix: true })}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-foreground/80 line-clamp-2">{item.description}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center border-t">
          <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/products/${item.id}`} className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                View Product
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
