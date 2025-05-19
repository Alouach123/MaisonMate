
"use client";
import Link from 'next/link';
import { LayoutGrid, Heart, LifeBuoy, LogIn, LogOut, UserPlus, Armchair, Globe, UserCircle, UserCircle2 } from 'lucide-react'; // Added UserCircle2
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist-context';
import { useAuth } from '@/hooks/use-auth-context';
import { Badge } from "@/components/ui/badge";
import CartIcon from '@/components/cart/cart-icon';
import { toast } from '@/hooks/use-toast';
import { ThemeToggleButton } from "./theme-toggle-button"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Navbar() {
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, signOutUser, isLoading: isAuthLoading } = useAuth();

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
          
          <div className="h-6 border-l border-border/70 mx-1 md:mx-2"></div>
          
          {isAuthLoading ? (
            <Button variant="ghost" size="sm" className="text-sm font-medium text-foreground/70 px-2 md:px-3" disabled>
              <LogIn className="h-4 w-4 md:mr-1.5 animate-pulse" />
              <span className="hidden sm:inline">Chargement...</span>
            </Button>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full md:h-10 md:w-auto md:px-3 md:py-2">
                   <Avatar className="h-7 w-7 md:mr-2"> {/* Use ShadCN Avatar */}
                      <AvatarImage src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email?.split('@')[0] || 'User'}`} alt={user?.email || "User"} />
                      <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                   </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-foreground/90">
                    {user?.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>Profil (Bientôt)</DropdownMenuItem>
                <DropdownMenuItem>Commandes (Bientôt)</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={signOutUser} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
              <Link href="/auth" className="flex items-center gap-1 md:gap-1.5">
                <LogIn className="h-4 w-4 md:mr-1.5" /> 
                <span className="hidden sm:inline">Authentification</span>
              </Link>
            </Button>
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

// Minimal Avatar component for Navbar, or use ShadCN's Avatar if available
// If ShadCN's Avatar is already globally available, this can be removed.
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center", className)}
    {...props}
  >
    {children}
  </div>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
