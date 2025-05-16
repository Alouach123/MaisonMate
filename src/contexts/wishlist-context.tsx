
"use client";

import type { Product, WishlistItem } from '@/types';
import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = localStorage.getItem('maisonmate-wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('maisonmate-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find(item => item.id === product.id)) {
        toast({ title: `${product.name} is already in your wishlist.`, variant: "default" });
        return prevWishlist;
      }
      toast({ title: `${product.name} added to wishlist!`, variant: "default" });
      return [...prevWishlist, { ...product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prevWishlist) => {
      const productToRemove = prevWishlist.find(item => item.id === productId);
      if (productToRemove) {
        toast({ title: `${productToRemove.name} removed from wishlist.`, variant: "default" });
      }
      return prevWishlist.filter(item => item.id !== productId);
    });
  }, []);

  const isWishlisted = useCallback((productId: string): boolean => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast({ title: "Wishlist cleared.", variant: "default" });
  }, []);
  
  if (!isLoaded) {
    return null; // Or a loading spinner, but null is fine to prevent hydration issues
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
