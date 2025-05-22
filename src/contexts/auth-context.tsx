
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User, SignUpWithPasswordCredentials, UpdateUserAttributes } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import type { Profile, ProfileFormData } from '@/types';
import { useRouter } from 'next/navigation';

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
  isLoading: boolean; // For initial auth check
  isLoadingProfile: boolean; // For profile-specific loading
  signUpUser: (credentials: ExtendedSignUpCredentials) => Promise<{ data: { user: User | null; session: Session | null; } | null, error: any | null }>;
  signInUser: (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => Promise<{ data: { user: User | null; session: Session | null; } | null, error: any | null }>;
  signOutUser: () => Promise<{ error: any | null }>;
  updateUserEmail: (newEmail: string) => Promise<{ data: { user: User | null } | null, error: any | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ data: { user: User | null } | null, error: any | null }>; // Removed currentPasswordMaybe
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
  const isMountedEffect = useRef(false);
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    const { data: { user: currentUserFromAuth } } = await supabase.auth.getUser();

    if (!currentUserFromAuth) {
      if (isMountedEffect.current) setProfile(null);
      setIsLoadingProfile(false);
      return;
    }
    if (isMountedEffect.current) setIsLoadingProfile(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserFromAuth.id)
        .single();

      if (!isMountedEffect.current) return;

      if (error && status !== 406) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      if (isMountedEffect.current) {
        console.error("Exception while fetching profile:", error);
        setProfile(null);
      }
    } finally {
      if (isMountedEffect.current) setIsLoadingProfile(false);
    }
  }, []);


  useEffect(() => {
    isMountedEffect.current = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, sessionState) => {
        if (!isMountedEffect.current) return;

        const currentSession = sessionState;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          // Fetch profile if user is signed in or session is refreshed/user updated
          if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'USER_UPDATED') {
            await fetchUserProfile();
          }
        } else {
          // If no user (e.g., SIGNED_OUT, or session becomes null)
          setProfile(null);
        }
      }
    );

    // Initial auth state check
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMountedEffect.current) return;

        setSession(initialSession);
        const initialUser = initialSession?.user ?? null;
        setUser(initialUser);

        if (initialUser) {
          await fetchUserProfile();
        } else {
          setProfile(null);
        }
      } catch (error) {
        if (isMountedEffect.current) {
          console.error("Error fetching initial session:", error);
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (isMountedEffect.current) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      isMountedEffect.current = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile]); // fetchUserProfile is memoized

  const signUpUser = useCallback(async (credentials: ExtendedSignUpCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
    // onAuthStateChange will handle user, session and profile updates
    return { data, error: null };
  }, []);

  const signInUser = useCallback(async (credentials: Pick<SignUpWithPasswordCredentials, 'email' | 'password'>) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error("Sign in error:", error.message);
      toast({ variant: "destructive", title: "Erreur de Connexion", description: error.message });
      return { data: null, error };
    }
    // onAuthStateChange will handle setting user, session, and fetching profile
    toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
    return { data, error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    // onAuthStateChange listener is responsible for setting user, session, profile to null.
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
    toast({ title: "Demande de changement d'e-mail envoyée", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer." });
    // onAuthStateChange with USER_UPDATED may trigger profile refresh or UI updates
    return { data, error: null };
  }, []);

  const updateUserPassword = useCallback(async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour du mot de passe", description: error.message });
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
    // onAuthStateChange with USER_UPDATED should trigger profile refresh.
    // Also, locally update user metadata for immediate UI feedback if needed.
    if (data.user && isMountedEffect.current) {
      setUser(prevUser => prevUser ? { ...prevUser, user_metadata: { ...prevUser.user_metadata, first_name: firstName, last_name: lastName } } : null);
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
    if (data.user && isMountedEffect.current) {
      setUser(prevUser => prevUser ? { ...prevUser, user_metadata: { ...prevUser.user_metadata, avatar_url: avatarUrl } } : null);
    }
    return { data, error: null };
  }, []);
  
  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        return { data: null, error: { message: "User not authenticated" }};
      }
      
      if(isMountedEffect.current) setIsLoadingProfile(true);
      
      const { first_name: formFirstName, last_name: formLastName, ...addressFields } = profileData;
      const profileUpdatePayload: Partial<Profile> = {
          ...addressFields, // phone, address_line1, city, etc.
          updated_at: new Date().toISOString(),
      };

      const { data: updatedProfileData, error: profileUpdateError } = await supabase
        .from('profiles')
        .update(profileUpdatePayload)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (!isMountedEffect.current) {
          if (profileUpdateError) setIsLoadingProfile(false); // if unmounted during await
          return { data: null, error: { message: "Component unmounted" }};
      }

      if (profileUpdateError) {
        console.error("Error updating profile in DB:", profileUpdateError);
        toast({ variant: "destructive", title: "Erreur de profil", description: `Impossible de mettre à jour le profil: ${profileUpdateError.message}` });
        setIsLoadingProfile(false);
        return { data: null, error: profileUpdateError };
      }
      
      if (updatedProfileData) {
        setProfile(updatedProfileData as Profile);
      }

      const currentMetaFirstName = profile?.first_name || currentUser.user_metadata?.first_name;
      const currentMetaLastName = profile?.last_name || currentUser.user_metadata?.last_name;

      if ((formFirstName !== undefined && formFirstName !== currentMetaFirstName) || 
          (formLastName !== undefined && formLastName !== currentMetaLastName)) {
         await updateUserNames({
           firstName: formFirstName || currentMetaFirstName || '',
           lastName: formLastName || currentMetaLastName || ''
         });
      }
      toast({ title: "Profil mis à jour !", description: "Vos informations de profil ont été sauvegardées." });
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

    