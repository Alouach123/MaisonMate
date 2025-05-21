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

      if (error && status !== 406) {
        console.error("Error fetching profile in fetchUserProfile:", error);
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception while fetching profile in fetchUserProfile:", error);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    let isMountedEffect = true;
    setIsLoading(true); // Set main loading true at the start of the effect

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMountedEffect) return;

      setSession(currentSession);
      const sessionUser = currentSession?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        // Asynchronously fetch profile, don't let main isLoading wait for this
        fetchUserProfile();
      } else {
        setProfile(null);
        setIsLoadingProfile(false); // No user, so profile is not loading
      }
      setIsLoading(false); // Crucially, set main isLoading to false after session is processed
    }).catch(error => {
      if (!isMountedEffect) return;
      console.error("Error fetching initial Supabase session:", error);
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoadingProfile(false);
      setIsLoading(false); // Also ensure isLoading is false on error
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        if (!isMountedEffect) return;

        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Fetch profile on these events to keep it fresh
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
  }, [fetchUserProfile]); // fetchUserProfile is stable due to its own useCallback with empty deps


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
    }
    return { error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      return { error };
    }
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
    // setUser(data.user); // No need to directly set user here, onAuthStateChange for USER_UPDATED will handle it
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
    // setUser(data.user); // No need to directly set user here, onAuthStateChange for USER_UPDATED will handle it
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
        ...profileData,
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
        // This ensures user_metadata in Supabase Auth is also updated, which then triggers onAuthStateChange
        // which in turn calls fetchUserProfile, keeping everything in sync.
        if (profileData.first_name || profileData.last_name) {
           const nameUpdateResult = await updateUserNames({
             firstName: profileData.first_name || profile?.first_name || currentUser.user_metadata.first_name || '',
             lastName: profileData.last_name || profile?.last_name || currentUser.user_metadata.last_name || ''
           });
           if (!nameUpdateResult.error) {
             toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
           }
           // If updateUserNames has an error, it will show its own toast.
        } else {
           toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
        }
      }
      setIsLoadingProfile(false);
      return { error: null };
  }, [profile, updateUserNames]); // Added profile and updateUserNames to dependencies

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