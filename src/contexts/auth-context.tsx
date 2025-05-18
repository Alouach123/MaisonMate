
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void; // Simulate login
  logout: () => void;
  // In a real app, you'd have user objects, signup functions, etc.
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthStatus = localStorage.getItem('maisonmate-auth-status');
      if (storedAuthStatus === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('maisonmate-auth-status', isAuthenticated.toString());
    }
  }, [isAuthenticated, isLoaded]);

  const login = useCallback(() => {
    // In a real app, this would involve API calls, credential checks, etc.
    setIsAuthenticated(true);
    toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate." });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
  }, []);
  
  if (!isLoaded) {
    return null; // Prevents hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
