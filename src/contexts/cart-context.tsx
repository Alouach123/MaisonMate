
"use client";

import type { Product, CartItem } from '@/types';
import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isItemInCart: (productId: string) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('maisonmate-cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('maisonmate-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        toast({ title: `${product.name} est déjà dans votre panier. Quantité mise à jour.`, variant: "default" });
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      toast({ title: `${product.name} ajouté au panier !`, variant: "default" });
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({ title: `${itemToRemove.name} retiré du panier.`, variant: "default" });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    const item = cartItems.find(i => i.id === productId);
    if (item) {
         toast({ title: `Quantité de ${item.name} mise à jour.`, variant: "default" });
    }
  }, [removeFromCart, cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: "Panier vidé.", variant: "default" });
  }, []);

  const getTotalItems = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getSubtotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const isItemInCart = useCallback((productId: string): boolean => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);
  
  if (!isLoaded) {
    return null; // Or a loading spinner, but null is fine to prevent hydration issues
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, clearCart, getTotalItems, getSubtotal, isItemInCart }}>
      {children}
    </CartContext.Provider>
  );
};
