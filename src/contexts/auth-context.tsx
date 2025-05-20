
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
  profile: Profile | null; // Add profile state
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingProfile: boolean; // Loading state for profile
  signUpUser: (credentials: ExtendedSignUpCredentials) => Promise<{ data: any, error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
  updateUserEmail: (newEmail: string) => Promise<{ error: any | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: any | null }>;
  updateUserNames: (payload: UpdateUserNamesPayload) => Promise<{ error: any | null }>; // Kept for direct metadata update if needed
  updateUserAvatar: (avatarUrl: string) => Promise<{ error: any | null }>;
  fetchUserProfile: () => Promise<void>; // Function to fetch profile
  updateUserProfile: (profileData: Partial<ProfileFormData>) => Promise<{ error: any | null }>; // Function to update profile
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const currentUser = (await supabase.auth.getUser()).data.user;
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

      if (error && status !== 406) { // 406 means no row found, which is fine initially
        console.error("Error fetching profile:", error);
        throw error;
      }
      if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null); // No profile found
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur de profil", description: "Impossible de charger les informations du profil." });
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserProfile();
      } else {
        setProfile(null);
        setIsLoadingProfile(false);
      }
      setIsLoading(false);
    };
    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
            await fetchUserProfile();
          }
        } else {
          setProfile(null);
          setIsLoadingProfile(false);
        }
        if (event === 'SIGNED_OUT') {
            setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    setIsLoading(true);
    // Supabase Auth will create the user.
    // The handle_new_user trigger in Supabase will create a corresponding row in public.profiles.
    const { data, error } = await supabase.auth.signUp(credentials);
    setIsLoading(false);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    // Profile will be fetched by onAuthStateChange or subsequent fetchUserProfile calls
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
      // Profile will be fetched by onAuthStateChange
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
    setProfile(null); // Clear profile on sign out
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
    return { error: null };
  }, []);

  const updateUserEmail = useCallback(async (newEmail: string) => {
    // Note: Supabase sends confirmation emails for email changes.
    // The user's email in `auth.users` is updated after confirmation.
    // The `profiles.email` field is not standard; email is primarily managed in `auth.users`.
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

  // Updates first_name and last_name in auth.users.user_metadata
  // The trigger handle_user_meta_data_update should sync this to public.profiles
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
        setUser(data.user); // Update user object which contains metadata
        // The onAuthStateChange listener (event USER_UPDATED) should trigger fetchUserProfile
        toast({ title: "Profil mis à jour", description: "Vos nom et prénom ont été modifiés." });
    }
    return { error: null };
  }, []);

  // Updates avatar_url in auth.users.user_metadata
  // The trigger handle_user_meta_data_update should sync this to public.profiles
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
      // The onAuthStateChange listener (event USER_UPDATED) should trigger fetchUserProfile
      toast({ title: "Avatar mis à jour !", description: "Votre photo de profil a été modifiée." });
    }
    return { error: null };
  }, []);

  // Updates specific fields in the public.profiles table
  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
      if (!user) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        return { error: { message: "User not authenticated" }};
      }
      setIsLoadingProfile(true);
      const updatePayload: Partial<Profile> = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      // Ensure that empty strings are converted to null if the DB field is nullable
      // and you want to represent "not set" as null.
      // For text fields, Supabase typically handles empty strings as empty strings.
      Object.keys(updatePayload).forEach(key => {
        const K = key as keyof typeof updatePayload;
        if (updatePayload[K] === '') {
          // If your DB schema expects NULL for empty optional fields, set to null.
          // Otherwise, empty string is fine for text fields.
          // updatePayload[K] = null; 
        }
      });


      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select() // Important to select to get the updated data back
        .single(); // Assuming one profile per user

      setIsLoadingProfile(false);
      if (error) {
        console.error("Error updating profile in DB:", error);
        toast({ variant: "destructive", title: "Erreur de profil", description: `Impossible de mettre à jour le profil: ${error.message}` });
        return { error };
      }
      if (data) {
        setProfile(data as Profile);
        toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
        // Also, if first_name or last_name were part of profileData, update user_metadata too
        // so the navbar updates immediately if it's reading from user_metadata.
        // However, the trigger should handle syncing metadata to profiles table.
        // For direct profile table updates, we've updated `profile` state.
        // If names are also in user_metadata, consider if those need a separate updateUser call.
        // For now, we assume the profile page edits are primarily for the `profiles` table.
      }
      return { error: null };
  }, [user]);
  
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
