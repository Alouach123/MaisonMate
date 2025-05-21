
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
  const [isLoading, setIsLoading] = useState(true); //isLoading reflects initial auth check
  const [isLoadingProfile, setIsLoadingProfile] = useState(false); // Start false, true only during fetch

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
  }, []); // Empty dependency array, function reference is stable

  useEffect(() => {
    let isMountedEffect = true;

    const getInitialAuthData = async () => {
      let sessionUser: User | null = null;
      try {
        // Fetch initial session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMountedEffect) return;

        if (sessionError) {
          console.error("Error fetching initial Supabase session:", sessionError);
        } else {
          setSession(currentSession);
          sessionUser = currentSession?.user ?? null;
          setUser(sessionUser);
        }
        
        // Fetch profile if user exists, but don't let it block setIsLoading(false)
        if (sessionUser) {
            await fetchUserProfile();
        } else {
            setProfile(null);
            // No profile to load, so profile loading is effectively "done"
            setIsLoadingProfile(false); 
        }

      } catch (error) {
        if (isMountedEffect) {
          console.error("Exception during initial auth data fetch:", error);
        }
      } finally {
        // This is critical: ensure isLoading is set to false after initial setup attempts.
        if (isMountedEffect) {
          setIsLoading(false);
        }
      }
    };

    getInitialAuthData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, sessionState: Session | null) => {
        if (!isMountedEffect) return;

        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);
        
        // Do NOT set setIsLoading(false) here as it's for initial load only.

        if (currentUser) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
             await fetchUserProfile();
          }
          // For INITIAL_SESSION, profile is already fetched by getInitialAuthData
        } else { // SIGNED_OUT or no user
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
    // Supabase handles user creation and `onAuthStateChange` will update context.
    // The trigger on auth.users should create a profile row.
    return { data, error: null };
  }, []);

  const signInUser = useCallback(async (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => {
    const { error } = await supabase.auth.signInWithPassword(credentials); // Removed data variable as it's not used
    if (error) {
      console.error("Sign in error:", error.message);
      return { error };
    }
    // `onAuthStateChange` will handle setting user and session, and fetching profile.
    toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
    return { error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    // Explicitly clear local state for immediate UI update,
    // `onAuthStateChange` will also fire with SIGNED_OUT.
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsLoadingProfile(false); 

    if (error) {
      console.error("Sign out error:", error.message);
      toast({ variant: "destructive", title: "Erreur de déconnexion", description: error.message });
      return { error };
    }
    
    toast({ title: "Déconnexion réussie.", description: "À bientôt !" });
    return { error: null };
  }, []);

  const updateUserEmail = useCallback(async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail }); // Removed data variable
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { error };
    }
    // `onAuthStateChange` with 'USER_UPDATED' event should trigger profile refresh if needed.
    // Supabase will handle sending confirmation emails.
    toast({ title: "Email mis à jour", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer le changement." });
    return { error: null };
  }, []);

  const updateUserPassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword }); // Removed data variable
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
    const { error } = await supabase.auth.updateUser(attributes); // Removed data variable
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour des noms", description: error.message });
      return { error };
    }
    // `onAuthStateChange` with 'USER_UPDATED' will trigger profile re-fetch.
    // The trigger on auth.users should also update the profiles table.
    return { error: null };
  }, []);

  const updateUserAvatar = useCallback(async (avatarUrl: string) => {
    const { error } = await supabase.auth.updateUser({ // Removed data variable
      data: {
        avatar_url: avatarUrl,
      },
    });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour de l'avatar", description: error.message });
      return { error };
    }
    // `onAuthStateChange` with 'USER_UPDATED' will trigger profile re-fetch.
    // The trigger on auth.users should also update the profiles table.
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

      // Update the profiles table
      const { data: updatedProfileData, error: profileUpdateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (profileUpdateError) {
        console.error("Error updating profile in DB:", profileUpdateError);
        toast({ variant: "destructive", title: "Erreur de profil", description: `Impossible de mettre à jour le profil: ${profileUpdateError.message}` });
        setIsLoadingProfile(false);
        return { error: profileUpdateError };
      }
      
      if (updatedProfileData) {
        setProfile(updatedProfileData as Profile);
      }

      // If names were part of profileData, update user_metadata as well
      // This ensures consistency and triggers on_auth_user_meta_data_updated if names changed
      if (profileData.first_name !== undefined || profileData.last_name !== undefined) {
         const nameUpdateResult = await updateUserNames({
           firstName: profileData.first_name || profile?.first_name || currentUser.user_metadata.first_name || '',
           lastName: profileData.last_name || profile?.last_name || currentUser.user_metadata.last_name || ''
         });
         if (!nameUpdateResult.error) {
           toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
         } else {
            // Name update in metadata failed, but profile table might be updated.
            // Toast for profile table update already shown if successful.
         }
      } else {
         toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
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
