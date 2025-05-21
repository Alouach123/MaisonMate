
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
  isLoading: boolean; 
  isLoadingProfile: boolean; 
  signUpUser: (credentials: ExtendedSignUpCredentials) => Promise<{ data: { user: User | null; session: Session | null; } | null, error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ data: { user: User | null; session: Session | null; } | null, error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
  updateUserEmail: (newEmail: string) => Promise<{ data: { user: User | null } | null, error: any | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ data: { user: User | null } | null, error: any | null }>;
  updateUserNames: (payload: UpdateUserNamesPayload) => Promise<{ data: { user: User | null } | null, error: any | null }>;
  updateUserAvatar: (avatarUrl: string) => Promise<{ data: { user: User | null }| null, error: any | null }>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<ProfileFormData>) => Promise<{ data: Profile | null, error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session: currentSession }, error: sessionError }) => {
      if (!isMounted) return;

      if (sessionError) {
        console.error("Error fetching initial Supabase session:", sessionError);
      } else {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchUserProfile(); 
        } else {
          setProfile(null);
        }
      }
      setIsLoading(false); // Set loading to false after initial session check completes
    }).catch(error => {
        if (isMounted) {
            console.error("Exception during initial Supabase session fetch promise:", error);
            setIsLoading(false); 
        }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, sessionState) => {
        if (!isMounted) return;

        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);

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
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile]); 

  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    return { data, error: null };
  }, []);

  const signInUser = useCallback(async (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error("Sign in error:", error.message);
      toast({ variant: "destructive", title: "Erreur de Connexion", description: error.message });
      return { data: null, error };
    }
    toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
    return { data, error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
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
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { data: null, error };
    }
    toast({ title: "Email mis à jour", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer le changement." });
    return { data, error: null };
  }, []);

  const updateUserPassword = useCallback(async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { data: null, error };
    }
    toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été modifié avec succès." });
    return { data, error: null };
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
      toast({ variant: "destructive", title: "Erreur de mise à jour des noms", description: error.message });
      return { data: null, error };
    }
    return { data, error: null };
  }, []);

  const updateUserAvatar = useCallback(async (avatarUrl: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
      },
    });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour de l'avatar", description: error.message });
      return { data: null, error };
    }
    return { data, error: null };
  }, []);

  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        return { data: null, error: { message: "User not authenticated" }};
      }
      setIsLoadingProfile(true);
      const updatePayload: Partial<Profile> = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

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
        return { data: null, error: profileUpdateError };
      }
      
      if (updatedProfileData) {
        setProfile(updatedProfileData as Profile);
      }

      if (profileData.first_name !== undefined || profileData.last_name !== undefined) {
         const nameUpdateResult = await updateUserNames({
           firstName: profileData.first_name || profile?.first_name || currentUser.user_metadata.first_name || '',
           lastName: profileData.last_name || profile?.last_name || currentUser.user_metadata.last_name || ''
         });
         if (!nameUpdateResult.error) {
           toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
         }
      } else {
         toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
      }
      setIsLoadingProfile(false);
      return { data: updatedProfileData as Profile, error: null };
  }, [profile, updateUserNames]);


  const isAuthenticated = !!user && !!session;

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
