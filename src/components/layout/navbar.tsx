
"use client";
import Link from 'next/link';
import { Home, LayoutGrid, Heart, LifeBuoy, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist-context'; // Updated to use context hook
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { wishlist } = useWishlist();

  const navItems = [
    { href: '/', label: 'Products', icon: LayoutGrid },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badgeCount: wishlist.length > 0 ? wishlist.length : undefined },
    { href: '/support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <Home className="h-7 w-7" />
          <span className="font-bold">MaisonMate</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative">
              <Link href={item.href} className="flex items-center gap-1.5">
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badgeCount && (
                  <Badge variant="destructive" className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {item.badgeCount}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
