
"use client";
import Link from 'next/link';
import { LayoutGrid, Heart, LifeBuoy, ShieldCheck, LogIn, LogOut, UserPlus, Armchair, Globe } from 'lucide-react'; // Added Globe
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { useAuth } from '@/hooks/use-auth-context';
import { Badge } from "@/components/ui/badge";
import CartIcon from '@/components/cart/cart-icon';
import { toast } from '@/hooks/use-toast'; // For language switcher
import { ThemeToggleButton } from "./theme-toggle-button"; 

export default function Navbar() {
  const { wishlist } = useWishlist();
  const { isAuthenticated, logout } = useAuth(); // Removed signIn, signUp as they are on /auth page now

  const mainNavItems = [
    { href: '/products', label: 'Produits', icon: LayoutGrid },
    { href: '/wishlist', label: 'Favoris', icon: Heart, badgeCount: wishlist.length > 0 ? wishlist.length : undefined },
    { href: '/support', label: 'Support', icon: LifeBuoy },
  ];

  const handleLanguageSwitch = () => {
    toast({
      title: "Changement de Langue (Simulation)",
      description: "Cette fonctionnalité est en cours de développement. Le site serait normalement affiché en anglais.",
      variant: "default",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <Armchair className="h-7 w-7" />
          <span className="font-bold">MaisonMate</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
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
          
          {/* Admin Link - always visible, points to auth page */}
          <Button variant="ghost" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
            <Link href="/auth" className="flex items-center gap-1 md:gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>

          <div className="h-6 border-l border-border/70 mx-1 md:mx-2"></div>
          
          {isAuthenticated ? ( // User authentication status
            <>
              <span className="text-sm text-foreground/90 ml-1 md:ml-2 hidden md:inline">Bienvenue !</span>
              <Button onClick={logout} variant="ghost" size="sm" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <LogOut className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Se déconnecter</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <Link href="/auth" className="flex items-center gap-1 md:gap-1.5"> {/* Points to /auth */}
                  <UserPlus className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">S'inscrire</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
                <Link href="/auth" className="flex items-center gap-1 md:gap-1.5"> {/* Points to /auth */}
                  <LogIn className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">Se connecter</span>
                </Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={handleLanguageSwitch} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors h-9 w-9 md:h-10 md:w-10">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Changer de langue</span>
          </Button>
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
