
"use client";
import Link from 'next/link';
import { Home, LayoutGrid, Heart, LifeBuoy, ShieldCheck, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { useAuth } from '@/hooks/use-auth-context';
import { Badge } from "@/components/ui/badge";
import CartIcon from '@/components/cart/cart-icon';
import { toast } from '@/hooks/use-toast';
import { ThemeToggleButton } from "./theme-toggle-button"; // New import

export default function Navbar() {
  const { wishlist } = useWishlist();
  const { isAuthenticated, signUp, signIn, logout } = useAuth();

  const mainNavItems = [
    { href: '/', label: 'Produits', icon: LayoutGrid },
    { href: '/wishlist', label: 'Favoris', icon: Heart, badgeCount: wishlist.length > 0 ? wishlist.length : undefined },
    { href: '/support', label: 'Support', icon: LifeBuoy },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  const handleSignUpClick = () => {
    signUp();
  };

  const handleSignInClick = () => {
    signIn();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <Home className="h-7 w-7" />
          <span className="font-bold">MaisonMate</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2"> {/* Adjusted gap here */}
          {mainNavItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative px-2 md:px-3">
              <Link href={item.href} className="flex items-center gap-1 md:gap-1.5">
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                    {item.badgeCount}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
          <CartIcon />
          <div className="h-6 border-l border-border/70 mx-1 md:mx-2"></div> {/* Small separator */}
          
          {/* Auth Buttons and Theme Toggle */}
          {isAuthenticated ? (
            <>
              <span className="text-sm text-foreground/90 ml-1 md:ml-2 hidden md:inline">Bienvenue !</span>
              <Button onClick={logout} variant="ghost" size="sm" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <LogOut className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Se déconnecter</span>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSignUpClick} variant="ghost" size="sm" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <UserPlus className="h-4 w-4 md:mr-1.5" />
                 <span className="hidden md:inline">S'inscrire</span>
              </Button>
              <Button onClick={handleSignInClick} variant="ghost" size="sm" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <LogIn className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Se connecter</span>
              </Button>
            </>
          )}
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
