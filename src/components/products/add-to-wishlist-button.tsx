
"use client";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist-context";
import type { Product } from "@/types";
import { Heart } from "lucide-react";

interface AddToWishlistButtonProps {
  product: Product;
  className?: string;
}

export default function AddToWishlistButton({ product, className }: AddToWishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card link navigation if button is inside a link
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-primary/10 ${className}`}
      onClick={handleWishlistToggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`h-6 w-6 transition-colors ${wishlisted ? 'fill-destructive text-destructive' : 'text-foreground/70 hover:text-destructive'}`} />
    </Button>
  );
}
