
"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User, SignUpWithPasswordCredentials, UpdateUserAttributes } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import type { Profile, ProfileFormData } from '@/types';
import { useRouter } from 'next/navigation'; // Import useRouter if you need programmatic navigation

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
  updateUserPassword: (currentPasswordMaybe: string, newPassword: string) => Promise<{ data: { user: User | null } | null, error: any | null }>;
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
  const [isLoading, setIsLoading] = useState(true); // Key state for Navbar button
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const router = useRouter();

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

      if (error && status !== 406) { // 406 means no rows found, which is not an error here
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception while fetching profile:", error);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);


  useEffect(() => {
    let isMounted = true;

    // Listener for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, sessionState) => {
        if (!isMounted) return;

        setSession(sessionState);
        const currentUser = sessionState?.user ?? null;
        setUser(currentUser);

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          // Optionally redirect after sign out: router.push('/auth');
        } else if (currentUser && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
          await fetchUserProfile(); 
        } else if (!currentUser) {
          setProfile(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession()
      .then(({ data: { session: currentSession }, error: sessionError }) => {
        if (!isMounted) return;
        if (sessionError) {
          console.error("Error fetching initial Supabase session:", sessionError);
          setUser(null);
          setSession(null);
          setProfile(null);
        } else {
          setSession(currentSession);
          const userFromSession = currentSession?.user ?? null;
          setUser(userFromSession);
          if (userFromSession) {
            fetchUserProfile(); // Fetch profile, but don't let it block setIsLoading(false)
          } else {
            setProfile(null);
          }
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Exception during initial Supabase session fetch:", error);
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      })
      .finally(() => {
        // This is crucial: set loading to false after initial check is done
        if (isMounted) {
          setIsLoading(false);
        }
      });

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
    // Supabase now often returns user and session on successful signUp if email confirmation is off or auto-confirmed
    if (data.user) {
        // onAuthStateChange will handle user and session updates
        // And trigger profile fetch if needed.
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
    // onAuthStateChange will handle setting user, session, and fetching profile
    toast({ title: "Connexion réussie !", description: "Bienvenue sur MaisonMate !" });
    return { data, error: null };
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    // Explicitly clear local state, onAuthStateChange will also fire to confirm
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
    // Supabase typically requires email change confirmation
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ variant: "destructive", title: "Erreur de mise à jour", description: error.message });
      return { data: null, error };
    }
    toast({ title: "Demande de changement d'e-mail envoyée", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer." });
    return { data, error: null };
  }, []);

  const updateUserPassword = useCallback(async (currentPasswordMaybe: string, newPassword: string) => {
    // Note: Supabase doesn't require currentPassword for updateUser if session is valid.
    // If you want to enforce it, you'd need a custom backend check.
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
    // onAuthStateChange with USER_UPDATED should trigger profile refresh or local user state update
    if (data.user) {
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
    if (data.user) {
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
      
      setIsLoadingProfile(true);
      const updatePayload: Partial<Profile> = {
        ...profileData, // address_line1, city, etc.
        updated_at: new Date().toISOString(),
        // first_name and last_name will be updated via updateUserNames if changed
      };

      // Ensure we don't try to update first_name/last_name directly in profiles table if they come from user_metadata
      const { first_name: formFirstName, last_name: formLastName, ...addressFields } = profileData;
      const profileUpdatePayload: Partial<Profile> = {
          ...addressFields,
          updated_at: new Date().toISOString(),
      };


      const { data: updatedProfileData, error: profileUpdateError } = await supabase
        .from('profiles')
        .update(profileUpdatePayload)
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

      // Update names in auth.users.user_metadata separately if they have changed
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

