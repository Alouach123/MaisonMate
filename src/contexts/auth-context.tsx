
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUpUser: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    setIsLoading(true);
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        setSession(sessionState);
        setUser(sessionState?.user ?? null);
        setIsLoading(false); // Ensure loading is false after auth state changes
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUpUser = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
    setIsLoading(true);
    // You can add 'nom', 'prénom', etc. to options.data
    // For example: options: { data: { first_name: 'John', last_name: 'Doe', phone: '123', birth_date: 'YYYY-MM-DD' } }
    // This requires configuring your Supabase table 'users' or a 'profiles' table to hold this data.
    const { data, error } = await supabase.auth.signUp(credentials);
    setIsLoading(false);
    if (error) {
      console.error("Sign up error:", error.message);
      return { error };
    }
    if (data.user) {
      // Supabase typically requires email confirmation.
      // If user is immediately available, it means confirmation might be off or auto-confirmed.
      toast({ title: "Inscription réussie !", description: "Veuillez vérifier votre e-mail pour confirmer votre compte." });
    }
    return { error: null };
  }, []);

  const signInUser = useCallback(async (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    setIsLoading(false);
    if (error) {
      console.error("Sign in error:", error.message);
      return { error };
    }
    if (data.user) {
      toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
    }
    return { error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      console.error("Sign out error:", error.message);
      return { error };
    }
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
    return { error: null };
  }, []);
  
  const isAuthenticated = !!user;

  // Don't render children until initial auth state is resolved to prevent flashes of incorrect UI
  if (isLoading && typeof window !== 'undefined' && !session) { // Check session specifically for initial load
     return null; // Or a global loading spinner component
  }


  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated, isLoading, signUpUser, signInUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
