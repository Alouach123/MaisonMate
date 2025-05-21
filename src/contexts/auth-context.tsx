
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
    // Ensure we get the most current user from auth state before fetching profile
    const { data: { user: currentUserFromAuth } } = await supabase.auth.getUser();

    if (!currentUserFromAuth) {
      setProfile(null);
      setIsLoadingProfile(false);
      return;
    }
    setIsLoadingProfile(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserFromAuth.id)
        .single();

      if (error && status !== 406) { // 406 means no rows found, which is not necessarily an error
        console.error("Error fetching profile in fetchUserProfile:", error);
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null); // No profile data found
      }
    } catch (error) {
      console.error("Exception while fetching profile in fetchUserProfile:", error);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []); // Empty dependency array makes this function stable

  useEffect(() => {
    let isMountedEffect = true;

    const getInitialAuthData = async () => {
      let sessionUser: User | null = null;
      try {
        // Step 1: Get session and user
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMountedEffect) return;

        if (sessionError) {
          console.error("Error fetching initial Supabase session:", sessionError);
          setSession(null);
          setUser(null);
        } else {
          setSession(currentSession);
          sessionUser = currentSession?.user ?? null;
          setUser(sessionUser);
        }
      } catch (error) {
        if (!isMountedEffect) return;
        console.error("Exception during initial session fetch:", error);
        setSession(null);
        setUser(null);
      } finally {
        // Step 2: Set main loading to false AFTER session check attempt
        if (isMountedEffect) {
          setIsLoading(false);
        }
      }

      // Step 3: If user exists, then fetch profile (manages its own isLoadingProfile)
      if (sessionUser && isMountedEffect) {
        try {
          await fetchUserProfile();
        } catch (profileError) {
            if (isMountedEffect) {
                 console.error("Error during initial profile fetch (triggered by session):", profileError);
                 // Profile fetching has its own loading and error handling, no need to block main isLoading
            }
        }
      } else if (!sessionUser && isMountedEffect) {
        // If no user, ensure profile state is also cleared and profile loading is false.
        setProfile(null);
        setIsLoadingProfile(false);
      }
    };

    getInitialAuthData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        if (!isMountedEffect) return;

        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);
        
        // Ensure isLoading is false if it was somehow still true from initial load
        // This helps if onAuthStateChange fires before getInitialAuthData fully completes its finally block
        // though with the new structure of getInitialAuthData, this should be less of an issue.
        if (isLoading) setIsLoading(false);


        if (currentUser) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
             await fetchUserProfile();
          }
        } else {
          setProfile(null);
          setIsLoadingProfile(false);
        }
      }
    );

    return () => {
      isMountedEffect = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile, isLoading]); // Added isLoading to deps of main useEffect to potentially help if onAuthStateChange fires quickly

  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    // Supabase trigger handle_new_user should create a profile row if SIGNED_IN event includes a new user.
    // onAuthStateChange for 'SIGNED_IN' will call fetchUserProfile.
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
    }
    // onAuthStateChange for 'SIGNED_IN' will call fetchUserProfile.
    return { error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      return { error };
    }
    // onAuthStateChange for 'SIGNED_OUT' will clear user and profile.
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
    return { error: null };
  }, []);

  const updateUserEmail = useCallback(async (newEmail: string) => {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    // onAuthStateChange for 'USER_UPDATED' should trigger profile refresh.
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
    // onAuthStateChange for 'USER_UPDATED' will trigger profile refresh.
    // Supabase trigger 'on_auth_user_meta_data_updated' should also update the profiles table.
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
    // onAuthStateChange for 'USER_UPDATED' will trigger profile refresh.
    // Supabase trigger 'on_auth_user_meta_data_updated' should also update the profiles table.
    return { error: null };
  }, []);

  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        return { error: { message: "User not authenticated" }};
      }
      setIsLoadingProfile(true);
      const updatePayload: Partial<Profile> = {
        ...profileData, // This includes first_name, last_name, phone, address fields
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile in DB:", error);
        toast({ variant: "destructive", title: "Erreur de profil", description: `Impossible de mettre à jour le profil: ${error.message}` });
        setIsLoadingProfile(false);
        return { error };
      }
      if (data) {
        setProfile(data as Profile);
        // If names were updated in profileData, also trigger Supabase Auth user_metadata update
        // This ensures user_metadata in Supabase Auth is also updated.
        // The onAuthStateChange for USER_UPDATED (or the Supabase trigger on auth.users)
        // should ensure profile state and user_metadata are consistent.
        if (profileData.first_name !== undefined || profileData.last_name !== undefined) {
           const nameUpdateResult = await updateUserNames({
             firstName: profileData.first_name || profile?.first_name || currentUser.user_metadata.first_name || '',
             lastName: profileData.last_name || profile?.last_name || currentUser.user_metadata.last_name || ''
           });
           // updateUserNames shows its own toast.
           if (!nameUpdateResult.error) {
             toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
           }
        } else {
           toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
        }
      }
      setIsLoadingProfile(false);
      return { error: null };
  }, [profile, updateUserNames]);

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
