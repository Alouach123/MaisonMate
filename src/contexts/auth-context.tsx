
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User, SignUpWithPasswordCredentials, UpdateUserAttributes } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import type { Profile, ProfileFormData } from '@/types';

interface ExtendedSignUpCredentials extends SignUpWithPasswordCredentials {
  options?: {
    data?: {
      first_name?: string;
      last_name?: string;
      [key: string]: any; 
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
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Main auth loading (session check)
  isLoadingProfile: boolean; // Specific profile loading
  signUpUser: (credentials: ExtendedSignUpCredentials) => Promise<{ data: any, error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
  updateUserEmail: (newEmail: string) => Promise<{ error: any | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: any | null }>;
  updateUserNames: (payload: UpdateUserNamesPayload) => Promise<{ error: any | null }>;
  updateUserAvatar: (avatarUrl: string) => Promise<{ error: any | null }>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<ProfileFormData>) => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For initial session check
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // For profile data fetching

  const fetchUserProfile = useCallback(async () => {
    const currentUser = (await supabase.auth.getUser()).data.user; // Get fresh user
    if (!currentUser) {
      setProfile(null);
      setIsLoadingProfile(false);
      return;
    }
    setIsLoadingProfile(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && status !== 406) {
        console.error("Error fetching profile:", error);
        // Do not throw, just set profile to null and log
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception while fetching profile:", error);
      toast({ variant: "destructive", title: "Erreur de profil", description: "Impossible de charger les informations du profil." });
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const getInitialAuthData = async () => {
      let sessionUser: User | null = null;
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        sessionUser = currentSession?.user ?? null;
        setUser(sessionUser);
      } catch (error) {
        console.error("Error fetching initial Supabase session:", error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false); // Crucial: Set main loading to false after session check
      }

      // Now, if there's a user, fetch their profile. This won't block `isLoading`.
      if (sessionUser) {
        await fetchUserProfile();
      } else {
        // No user, so no profile to fetch, and profile loading is done.
        setProfile(null);
        setIsLoadingProfile(false);
      }
    };

    getInitialAuthData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
            await fetchUserProfile(); // Re-fetch profile on these events
          }
        } else {
          setProfile(null);
          setIsLoadingProfile(false); // Ensure profile loading is false if no user
        }
        if (event === 'SIGNED_OUT') {
            setProfile(null); // Also clear profile on explicit sign out
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);


  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    // Supabase trigger handle_new_user should create a profile row.
    // onAuthStateChange will then call fetchUserProfile if SIGNED_IN event fires.
    return { data, error: null };
  }, []);

  const signInUser = useCallback(async (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error("Sign in error:", error.message);
      return { error };
    }
    if (data.user) {
      toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
      // onAuthStateChange will trigger profile fetch
    }
    return { error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      return { error };
    }
    // onAuthStateChange clears user and profile
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
    return { error: null };
  }, []);

  const updateUserEmail = useCallback(async (newEmail: string) => {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    toast({ title: "Email mis à jour", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer le changement." });
    return { error: null };
  }, []);

  const updateUserPassword = useCallback(async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été modifié avec succès." });
    return { error: null };
  }, []);

  const updateUserNames = useCallback(async ({ firstName, lastName }: UpdateUserNamesPayload) => {
    const attributes: UpdateUserAttributes = {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    };
    const { data, error } = await supabase.auth.updateUser(attributes);
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    if (data.user) {
        setUser(data.user); 
        toast({ title: "Profil mis à jour", description: "Vos nom et prénom ont été modifiés." });
        // onAuthStateChange with USER_UPDATED should re-fetch profile
    }
    return { error: null };
  }, []);

  const updateUserAvatar = useCallback(async (avatarUrl: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
      },
    });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour de l'avatar", description: error.message });
      return { error };
    }
    if (data.user) {
      setUser(data.user); 
      toast({ title: "Avatar mis à jour !", description: "Votre photo de profil a été modifiée." });
       // onAuthStateChange with USER_UPDATED should re-fetch profile
    }
    return { error: null };
  }, []);

  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
      if (!user) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        return { error: { message: "User not authenticated" }};
      }
      setIsLoadingProfile(true); // Indicate profile is being updated
      const updatePayload: Partial<Profile> = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      Object.keys(updatePayload).forEach(key => {
        const K = key as keyof typeof updatePayload;
        if (updatePayload[K] === '') {
          // updatePayload[K] = null; // Set to null if DB expects null for empty optional fields
        }
      });

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select() 
        .single(); 

      setIsLoadingProfile(false);
      if (error) {
        console.error("Error updating profile in DB:", error);
        toast({ variant: "destructive", title: "Erreur de profil", description: `Impossible de mettre à jour le profil: ${error.message}` });
        return { error };
      }
      if (data) {
        setProfile(data as Profile);
        toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
        // If names were updated, also trigger user metadata update for immediate navbar reflection
        if (profileData.first_name || profileData.last_name) {
           await updateUserNames({ 
             firstName: profileData.first_name || profile?.first_name || user.user_metadata.first_name || '', 
             lastName: profileData.last_name || profile?.last_name || user.user_metadata.last_name || ''
           });
        }
      }
      return { error: null };
  }, [user, profile, updateUserNames]); // Added profile and updateUserNames to dependencies
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile,
      isAuthenticated, 
      isLoading, 
      isLoadingProfile,
      signUpUser, 
      signInUser, 
      signOutUser, 
      updateUserEmail, 
      updateUserPassword, 
      updateUserNames, 
      updateUserAvatar,
      fetchUserProfile,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

    