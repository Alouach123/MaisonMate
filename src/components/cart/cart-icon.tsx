
"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/hooks/use-cart-context';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button variant="ghost" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative">
      <Link href="/cart" className="flex items-center gap-1.5">
        <ShoppingCart className="h-4 w-4" />
        Panier
        {totalItems > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
