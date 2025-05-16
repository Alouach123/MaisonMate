
"use client";
import WishlistItemCard from '@/components/wishlist/wishlist-item-card';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <HeartCrack className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your wishlist yet.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Your Wishlist ({wishlist.length})</h1>
        {wishlist.length > 0 && (
          <Button variant="outline" onClick={clearWishlist} className="text-destructive hover:border-destructive hover:bg-destructive/10">
            <HeartCrack className="mr-2 h-4 w-4" /> Clear Wishlist
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {wishlist.map(item => (
          <WishlistItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
