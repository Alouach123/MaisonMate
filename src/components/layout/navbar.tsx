
"use client";
import Link from 'next/link';
import { Home, LayoutGrid, Heart, LifeBuoy, ShieldCheck, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { useAuth } from '@/hooks/use-auth-context'; // Import useAuth
import { Badge } from "@/components/ui/badge";
import CartIcon from '@/components/cart/cart-icon';

export default function Navbar() {
  const { wishlist } = useWishlist();
  const { isAuthenticated, login, logout } = useAuth(); // Get auth state and functions

  const mainNavItems = [
    { href: '/', label: 'Produits', icon: LayoutGrid },
    { href: '/wishlist', label: 'Favoris', icon: Heart, badgeCount: wishlist.length > 0 ? wishlist.length : undefined },
    { href: '/support', label: 'Support', icon: LifeBuoy },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  // Placeholder actions for Sign Up - In a real app, these would likely go to separate pages or modals
  const handleSignUp = () => {
    // For now, simulate login as a placeholder for sign up completion
    login(); 
    // In a real app: router.push('/signup') or open signup modal
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <Home className="h-7 w-7" />
          <span className="font-bold">MaisonMate</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {mainNavItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative">
              <Link href={item.href} className="flex items-center gap-1.5">
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {item.badgeCount}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
          <CartIcon />

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <>
              <span className="text-sm text-foreground/90 ml-2 hidden md:inline">Bienvenue !</span>
              <Button onClick={logout} variant="ghost" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                <LogOut className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Se déconnecter</span>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSignUp} variant="ghost" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                <UserPlus className="h-4 w-4 md:mr-1.5" />
                 <span className="hidden md:inline">S'inscrire</span>
              </Button>
              <Button onClick={login} variant="ghost" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                <LogIn className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Se connecter</span>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
