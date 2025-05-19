
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
    // This effect runs only on the client after mount
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('maisonmate-cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error("Error parsing cart from localStorage", e);
          // Optionally clear corrupted localStorage item
          // localStorage.removeItem('maisonmate-cart');
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // This effect runs only on the client, and only after isLoaded is true
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
    const item = cartItems.find(i => i.id === productId); // Find item in the *current* cartItems for toast
    if (item) {
         toast({ title: `Quantité de ${item.name} mise à jour.`, variant: "default" });
    }
  }, [removeFromCart, cartItems]); // Added cartItems dependency for the toast message to get current name

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
  
  // Always render children. Components consuming the context can
  // show loading states or empty states based on the cartItems content
  // and the isLoaded flag if needed, but the provider itself shouldn't break the tree.
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, clearCart, getTotalItems, getSubtotal, isItemInCart }}>
      {children}
    </CartContext.Provider>
  );
};
