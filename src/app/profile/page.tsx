
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2, Mail, KeyRound, Save, Loader2, ShieldAlert, ShieldCheck, Camera, UploadCloud, Home, Phone, Building, MapPin, Globe2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase/client'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ProfileFormData } from '@/types';
import { ProfileFormSchema } from '@/types';
import { Separator } from '@/components/ui/separator';

interface PasswordValidation {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

const initialPasswordValidation: PasswordValidation = {
  minLength: false,
  uppercase: false,
  lowercase: false,
  number: false,
};

const validatePassword = (password: string): PasswordValidation => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
};

const getPasswordStrength = (validation: PasswordValidation): number => {
  let strength = 0;
  if (validation.minLength) strength += 25;
  if (validation.uppercase) strength += 20;
  if (validation.lowercase) strength += 20;
  if (validation.number) strength += 20;
  return Math.min(100, strength > 25 ? strength : (validation.minLength ? 25 : 0));
};


export default function ProfilePage() {
  const { 
    user, 
    profile,
    updateUserEmail, 
    updateUserPassword, 
    updateUserNames, 
    updateUserAvatar, 
    updateUserProfile,
    fetchUserProfile,
    isLoading: authLoading, 
    isLoadingProfile,
    isAuthenticated 
  } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting: isSubmittingProfileForm } } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: '',
    }
  });
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>(initialPasswordValidation);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formError, setFormError] = useState<string | null>(null); // General form error

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth'); 
    }
    if (user && !profile && !isLoadingProfile) { // Fetch profile if user exists but profile doesn't
        fetchUserProfile();
    }
    if (user) {
      setEmail(user.email || '');
    }
    if (profile) {
      reset({ // Populate react-hook-form with profile data
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
      });
    }
  }, [user, profile, authLoading, isAuthenticated, isLoadingProfile, router, reset, fetchUserProfile]);

  const handlePasswordChange = (pass: string) => {
    setNewPassword(pass);
    const validation = validatePassword(pass);
    setPasswordValidation(validation);
    setPasswordStrength(getPasswordStrength(validation));
  };

  const onSubmitProfileForm = async (data: ProfileFormData) => {
    setFormError(null);
    const { error } = await updateUserProfile(data); // This function is now from AuthContext
    if (error) {
      setFormError(error.message || "Erreur lors de la mise à jour du profil.");
    } else {
      // Names in user_metadata are updated separately for navbar display consistency
      // if they are part of the 'profiles' table and need to be synced
      if (data.first_name !== undefined && data.last_name !== undefined && 
          (data.first_name !== profile?.first_name || data.last_name !== profile?.last_name)) {
        await updateUserNames({ firstName: data.first_name || '', lastName: data.last_name || '' });
      }
    }
  };

  const handleUpdateEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.email === email) return;
    setFormError(null);
    setIsUpdatingEmail(true);
    const { error } = await updateUserEmail(email);
    if (error) {
      setFormError(error.message || "Erreur lors de la mise à jour de l'e-mail.");
    } else {
      toast({ title: "Demande de changement d'e-mail envoyée", description: "Veuillez vérifier votre nouvelle adresse e-mail pour confirmer." });
    }
    setIsUpdatingEmail(false);
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    const currentPasswordValidation = validatePassword(newPassword);
    const allValid = Object.values(currentPasswordValidation).every(Boolean);

    if (!allValid) {
      setFormError("Le nouveau mot de passe ne respecte pas tous les critères de sécurité.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFormError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setFormError(null);
    setIsUpdatingPassword(true);
    const { error } = await updateUserPassword(newPassword);
    if (error) {
      setFormError(error.message || "Erreur lors de la mise à jour du mot de passe.");
    } else {
      toast({ title: "Mot de passe mis à jour !" });
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordValidation(initialPasswordValidation);
      setPasswordStrength(0);
    }
    setIsUpdatingPassword(false);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile || !user) {
      toast({ variant: "destructive", title: "Erreur", description: "Veuillez sélectionner une photo et être connecté."});
      return;
    }
    setIsUploadingPhoto(true);
    setFormError(null);

    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${user.id}/profile.${fileExt}`;
    const bucketName = 'avatars';

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      if (!publicURLData?.publicUrl) throw new Error("Impossible d'obtenir l'URL publique de l'image.");
      
      const { error: avatarUpdateError } = await updateUserAvatar(publicURLData.publicUrl);
      if (avatarUpdateError) throw avatarUpdateError;

      toast({ title: "Photo de profil mise à jour !" });
      setSelectedFile(null);
      setPreviewUrl(null);
      // Optionally re-fetch profile if avatar_url is part of profile state from 'profiles' table
      // await fetchUserProfile(); 
      // The onAuthStateChange USER_UPDATED event should handle profile refresh.

    } catch (error: any) {
      setFormError(error.message || "Erreur lors du téléchargement de la photo.");
      toast({ variant: "destructive", title: "Erreur de téléchargement", description: error.message });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const renderPasswordStrength = () => {
    if (!newPassword) return null;
    let strengthColor = 'bg-destructive';
    if (passwordStrength > 70) strengthColor = 'bg-green-500';
    else if (passwordStrength > 40) strengthColor = 'bg-yellow-500';

    return (
      <div className="mt-2 space-y-1">
        <Progress value={passwordStrength} className={`h-2 ${strengthColor}`} />
        <ul className="text-xs list-disc list-inside text-muted-foreground">
          <li className={passwordValidation.minLength ? 'text-green-600' : 'text-destructive'}>Au moins 8 caractères</li>
          <li className={passwordValidation.uppercase ? 'text-green-600' : 'text-destructive'}>Une lettre majuscule</li>
          <li className={passwordValidation.lowercase ? 'text-green-600' : 'text-destructive'}>Une lettre minuscule</li>
          <li className={passwordValidation.number ? 'text-green-600' : 'text-destructive'}>Un chiffre</li>
        </ul>
      </div>
    );
  };
  
  if (authLoading || !user || isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  const currentAvatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const avatarSeed = profile?.first_name || user.user_metadata?.first_name || profile?.last_name || user.user_metadata?.last_name || user.email?.split('@')[0] || 'User';
  const avatarFallback = (
    (profile?.first_name?.[0] || user.user_metadata?.first_name?.[0] || '') + 
    (profile?.last_name?.[0] || user.user_metadata?.last_name?.[0] || '') ||
    user.email?.[0] || 'U'
  ).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCircle2 className="h-7 w-7 text-primary" /> Mon Profil
          </CardTitle>
          <CardDescription>Gérez les informations de votre compte MaisonMate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Erreur de mise à jour</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {/* Photo Section */}
          <section className="p-4 border rounded-md space-y-4 bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Camera className="h-5 w-5 text-primary" />Photo de Profil</h3>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-2 border-primary shadow-md">
                <AvatarImage src={previewUrl || currentAvatarUrl || (avatarSeed ? `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}` : undefined)} alt="Photo de profil" />
                <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              {previewUrl && <Image src={previewUrl} alt="Aperçu" width={100} height={100} className="rounded-md border object-cover" />}
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoSelect} className="max-w-xs text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {selectedFile && (
                <Button onClick={handlePhotoUpload} disabled={isUploadingPhoto} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isUploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  Télécharger la photo
                </Button>
              )}
            </div>
          </section>
          
          <Separator />

          {/* Personal & Address Information Form */}
          <form onSubmit={handleSubmit(onSubmitProfileForm)} className="space-y-6 p-4 border rounded-md bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2"><UserCircle2 className="h-5 w-5 text-primary" />Informations Personnelles et Adresse</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input id="first_name" {...register("first_name")} className={errors.first_name ? 'border-destructive' : ''} />
                {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input id="last_name" {...register("last_name")} className={errors.last_name ? 'border-destructive' : ''} />
                {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="phone"><Phone className="inline mr-1 h-4 w-4" />Téléphone</Label>
              <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? 'border-destructive' : ''} />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>

            <h4 className="text-md font-semibold pt-2 flex items-center gap-2"><Home className="h-5 w-5 text-muted-foreground" />Adresse de Livraison</h4>
            <div>
              <Label htmlFor="address_line1">Adresse (Ligne 1)</Label>
              <Input id="address_line1" {...register("address_line1")} className={errors.address_line1 ? 'border-destructive' : ''} />
              {errors.address_line1 && <p className="text-sm text-destructive mt-1">{errors.address_line1.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_line2">Adresse (Ligne 2) (Optionnel)</Label>
              <Input id="address_line2" {...register("address_line2")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city"><Building className="inline mr-1 h-4 w-4" />Ville</Label>
                <Input id="city" {...register("city")} className={errors.city ? 'border-destructive' : ''} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postal_code"><MapPin className="inline mr-1 h-4 w-4" />Code Postal</Label>
                <Input id="postal_code" {...register("postal_code")} className={errors.postal_code ? 'border-destructive' : ''} />
                {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country"><Globe2 className="inline mr-1 h-4 w-4" />Pays</Label>
              <Input id="country" {...register("country")} className={errors.country ? 'border-destructive' : ''} />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
            
            <Button type="submit" disabled={isSubmittingProfileForm || isLoadingProfile} className="bg-primary hover:bg-primary/90">
              {isSubmittingProfileForm || isLoadingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Mettre à jour le profil
            </Button>
          </form>
          
          <Separator />

          <form onSubmit={handleUpdateEmail} className="space-y-4 p-4 border rounded-md bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Adresse E-mail</h3>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isUpdatingEmail || user.email === email} className="bg-primary hover:bg-primary/90">
              {isUpdatingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Mettre à jour l'e-mail
            </Button>
          </form>
          
          <Separator />
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 p-4 border rounded-md bg-card">
            <h3 className="text-lg font-semibold flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary" />Changer le mot de passe</h3>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => handlePasswordChange(e.target.value)} required />
              {renderPasswordStrength()}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
              <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isUpdatingPassword} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Changer le mot de passe
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
