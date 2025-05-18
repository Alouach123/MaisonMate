
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  signUp: () => void; // Simule l'inscription et connecte l'utilisateur
  signIn: () => void; // Simule la connexion
  logout: () => void;
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

  const signUp = useCallback(() => {
    setIsAuthenticated(true);
    toast({
      title: "Inscription (simulée) réussie !",
      description: "Normalement, vous auriez fourni : Nom, Prénom, Email, Mot de passe, Téléphone, Date de naissance. Bienvenue sur MaisonMate !",
    });
  }, []);

  const signIn = useCallback(() => {
    setIsAuthenticated(true);
    toast({
      title: "Connexion (simulée) réussie !",
      description: "Normalement, vous auriez fourni : Email, Mot de passe. Bienvenue sur MaisonMate !",
    });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
  }, []);
  
  if (!isLoaded) {
    return null; // Prevents hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
