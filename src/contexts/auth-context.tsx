
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User, SignUpWithPasswordCredentials, UpdateUserAttributes } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

// Extend SignUpWithPasswordCredentials to include first_name and last_name in options.data
interface ExtendedSignUpCredentials extends SignUpWithPasswordCredentials {
  options?: {
    data?: {
      first_name?: string;
      last_name?: string;
      [key: string]: any; // Allow other custom metadata
    };
    emailRedirectTo?: string;
    captchaToken?: string;
  };
}

interface UpdateUserNamesPayload {
  firstName: string;
  lastName: string;
}
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUpUser: (credentials: ExtendedSignUpCredentials) => Promise<{ data: any, error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
  updateUserEmail: (newEmail: string) => Promise<{ error: any | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: any | null }>;
  updateUserNames: (payload: UpdateUserNamesPayload) => Promise<{ error: any | null }>;
  updateUserAvatar: (avatarUrl: string) => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp(credentials);
    setIsLoading(false);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    return { data, error: null };
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

  const updateUserEmail = useCallback(async (newEmail: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    setIsLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    toast({ title: "Email mis à jour", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer le changement." });
    return { error: null };
  }, []);

  const updateUserPassword = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été modifié avec succès." });
    return { error: null };
  }, []);

  const updateUserNames = useCallback(async ({ firstName, lastName }: UpdateUserNamesPayload) => {
    setIsLoading(true);
    const attributes: UpdateUserAttributes = {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    };
    const { data, error } = await supabase.auth.updateUser(attributes);
    setIsLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    if (data.user) {
        setUser(data.user);
        toast({ title: "Profil mis à jour", description: "Vos nom et prénom ont été modifiés." });
    }
    return { error: null };
  }, []);

  const updateUserAvatar = useCallback(async (avatarUrl: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour de l'avatar", description: error.message });
      return { error };
    }
    if (data.user) {
      setUser(data.user); // Update user state with new metadata
      toast({ title: "Avatar mis à jour !", description: "Votre photo de profil a été modifiée." });
    }
    return { error: null };
  }, []);
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated, isLoading, signUpUser, signInUser, signOutUser, updateUserEmail, updateUserPassword, updateUserNames, updateUserAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
