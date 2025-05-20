
"use client";

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2, Mail, KeyRound, Save, Loader2, ShieldAlert, ShieldCheck, Camera, UploadCloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase/client'; // Import supabase client for storage

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
  const { user, updateUserEmail, updateUserPassword, updateUserNames, updateUserAvatar, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>(initialPasswordValidation);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [isUpdatingNames, setIsUpdatingNames] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth'); 
    }
    if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
      setEmail(user.email || '');
    }
  }, [user, authLoading, isAuthenticated, router]);

  const handlePasswordChange = (pass: string) => {
    setNewPassword(pass);
    const validation = validatePassword(pass);
    setPasswordValidation(validation);
    setPasswordStrength(getPasswordStrength(validation));
  };

  const handleUpdateNames = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdateError(null);
    setIsUpdatingNames(true);
    const { error } = await updateUserNames({ firstName, lastName });
    if (error) {
      setUpdateError(error.message || "Erreur lors de la mise à jour du nom.");
    } else {
      toast({ title: "Noms mis à jour !" });
    }
    setIsUpdatingNames(false);
  };

  const handleUpdateEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.email === email) return;
    setUpdateError(null);
    setIsUpdatingEmail(true);
    const { error } = await updateUserEmail(email);
    if (error) {
      setUpdateError(error.message || "Erreur lors de la mise à jour de l'e-mail.");
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
      setUpdateError("Le nouveau mot de passe ne respecte pas tous les critères de sécurité.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setUpdateError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setUpdateError(null);
    setIsUpdatingPassword(true);
    const { error } = await updateUserPassword(newPassword);
    if (error) {
      setUpdateError(error.message || "Erreur lors de la mise à jour du mot de passe.");
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
    setUpdateError(null);

    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${user.id}/profile.${fileExt}`;
    const bucketName = 'avatars';

    console.log("Attempting to upload photo...");
    console.log("User ID:", user.id);
    console.log("File Path:", filePath);
    console.log("Bucket Name:", bucketName);
    console.log("Selected File:", selectedFile);


    try {
      const { error: uploadError } = await supabase.storage
        .from(bucketName) // Make sure this bucket name matches your Supabase bucket
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file already exists
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw uploadError;
      }

      const { data: publicURLData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      console.log("Public URL Data from Supabase:", publicURLData);


      if (!publicURLData?.publicUrl) {
        console.error("Failed to get public URL after upload.");
        throw new Error("Impossible d'obtenir l'URL publique de l'image.");
      }
      
      const { error: avatarUpdateError } = await updateUserAvatar(publicURLData.publicUrl);
      if (avatarUpdateError) {
        console.error("Error updating user avatar metadata:", avatarUpdateError);
        throw avatarUpdateError;
      }

      toast({ title: "Photo de profil mise à jour !" });
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (error: any) {
      console.error("Full error in handlePhotoUpload:", error);
      setUpdateError(error.message || "Erreur lors du téléchargement de la photo.");
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
  
  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  const currentAvatarUrl = user.user_metadata?.avatar_url;
  const avatarSeed = user.user_metadata?.first_name || user.user_metadata?.last_name || user.email?.split('@')[0] || 'User';
  const avatarFallback = (
    (user.user_metadata?.first_name?.[0] || '') + (user.user_metadata?.last_name?.[0] || '') ||
    user.email?.[0] || 'U'
  ).toUpperCase();


  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCircle2 className="h-7 w-7 text-primary" /> Mon Profil
          </CardTitle>
          <CardDescription>Gérez les informations de votre compte MaisonMate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {updateError && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Erreur de mise à jour</AlertTitle>
              <AlertDescription>{updateError}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 border rounded-md space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Camera className="h-5 w-5" />Photo de Profil</h3>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-2 border-primary">
                <AvatarImage src={previewUrl || currentAvatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`} alt="Photo de profil" />
                <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              {previewUrl && <Image src={previewUrl} alt="Aperçu" width={100} height={100} className="rounded-md border" />}
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoSelect} className="max-w-xs" />
              {selectedFile && (
                <Button onClick={handlePhotoUpload} disabled={isUploadingPhoto} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isUploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  Télécharger la photo
                </Button>
              )}
            </div>
          </div>


          <form onSubmit={handleUpdateNames} className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold flex items-center gap-2"><UserCircle2 className="h-5 w-5" />Informations Personnelles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <Button type="submit" disabled={isUpdatingNames} className="bg-primary hover:bg-primary/90">
              {isUpdatingNames ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Mettre à jour les noms
            </Button>
          </form>

          <form onSubmit={handleUpdateEmail} className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Mail className="h-5 w-5" />Adresse E-mail</h3>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isUpdatingEmail || user.email === email} className="bg-primary hover:bg-primary/90">
              {isUpdatingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Mettre à jour l'e-mail
            </Button>
          </form>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold flex items-center gap-2"><KeyRound className="h-5 w-5" />Changer le mot de passe</h3>
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

    