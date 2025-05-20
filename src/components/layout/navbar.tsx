
"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Heart, LifeBuoy, LogIn, LogOut, Armchair, Globe, UserCircle } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const getUserDisplayName = () => {
    if (user?.user_metadata) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      if (firstName) {
        return firstName;
      }
    }
    return user?.email?.split('@')[0] || "Utilisateur";
  };

  const getAvatarFallback = () => {
    if (user?.user_metadata) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name;
      if (firstName && lastName && firstName.length > 0 && lastName.length > 0) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
      }
      if (firstName && firstName.length > 0) {
        return firstName[0].toUpperCase();
      }
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };
  
  const avatarSeed = user?.user_metadata?.avatar_url ? null : (user?.user_metadata?.first_name || user?.user_metadata?.last_name || user?.email?.split('@')[0] || 'User');


  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/30 backdrop-blur-lg supports-[backdrop-filter]:bg-background/20 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <Armchair className="h-7 w-7" />
          <span className="font-bold">MaisonMate</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {mainNavItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative px-2 md:px-3">
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
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full md:h-10 md:w-auto md:px-3 md:py-2">
                   <Avatar className="h-7 w-7 md:mr-2">
                      <AvatarImage src={user.user_metadata?.avatar_url || (avatarSeed ? `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}` : undefined)} alt={getUserDisplayName()} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                   </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-foreground/90">
                    {getUserDisplayName()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Mon Profil</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOutUser} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-2 md:px-3">
              <Link href="/auth" className="flex items-center gap-1 md:gap-1.5">
                <LogIn className="h-4 w-4" /> 
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
