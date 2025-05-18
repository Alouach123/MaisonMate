
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart-context";
import type { Product } from "@/types";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showText?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function AddToCartButton({ 
  product, 
  className, 
  showText = false, 
  size = "default",
  variant = "default"
}: AddToCartButtonProps) {
  const { addToCart, isItemInCart } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = isItemInCart(product.id);

  useEffect(() => {
    if (inCart) {
      setAdded(true);
      const timer = setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [inCart]);


  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card link navigation if button is inside a link
    addToCart(product, 1);
    setAdded(true);
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleAddToCart}
      aria-label={added || inCart ? `${product.name} est dans le panier` : `Ajouter ${product.name} au panier`}
      disabled={added && !inCart} // disable briefly after adding, re-enable if already in cart for more additions
    >
      {added || inCart ? (
        <CheckCircle className={`h-5 w-5 ${showText ? 'mr-2' : ''}`} />
      ) : (
        <ShoppingCart className={`h-5 w-5 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (added || inCart ? 'Ajouté !' : 'Ajouter au panier')}
    </Button>
  );
}
