
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, KeyRound, LogIn, UserPlus, Loader2, ArrowLeft, Mail, Phone, CalendarDays, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { verifyPasswordAction } from '@/app/admin/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth';

export default function AuthPage() {
  const [view, setView] = useState<'select' | 'admin' | 'userSignin' | 'userSignup'>('select');
  
  // Admin state
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // User Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Additional sign-up fields (optional for now, can be expanded)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');


  const [isUserAuthLoading, setIsUserAuthLoading] = useState(false);
  const [userAuthError, setUserAuthError] = useState<string | null>(null);

  const router = useRouter();
  const { user, signUpUser, signInUser, isAuthenticated: isUserAuthenticated, isLoading: isAuthContextLoading } = useAuth();

  useEffect(() => {
    if (!isAuthContextLoading && isUserAuthenticated && (view === 'userSignin' || view === 'userSignup')) {
      router.push('/');
    }
    if (typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_KEY) === 'true' && view === 'admin') {
      router.push('/admin');
    }
  }, [isUserAuthenticated, isAuthContextLoading, view, router]);


  const handleAdminLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsAdminLoading(true);
    setAdminError(null);
    try {
      const result = await verifyPasswordAction(adminPassword);
      if (result.success) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        router.push('/admin');
      } else {
        setAdminError("Mot de passe administrateur incorrect.");
      }
    } catch (err) {
      setAdminError("Une erreur est survenue lors de la vérification.");
      console.error(err);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleUserSignUpSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setUserAuthError("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsUserAuthLoading(true);
    setUserAuthError(null);

    const credentials: SignUpWithPasswordCredentials = { email, password };
    // For additional data with Supabase, use options.data
    // This requires your 'users' table or a related 'profiles' table to have these columns.
    // Example:
    // credentials.options = {
    //   data: {
    //     first_name: firstName,
    //     last_name: lastName,
    //     phone_number: phoneNumber,
    //     birth_date: birthDate,
    //   }
    // };

    const { error } = await signUpUser(credentials);
    setIsUserAuthLoading(false);
    if (error) {
      setUserAuthError(error.message || "Erreur lors de l'inscription.");
    } else {
      // Supabase sends a confirmation email. User will be redirected after confirming or if auto-confirm is on.
      // No immediate redirect here unless you handle post-signup flow differently.
      toast({ title: "Inscription demandée", description: "Veuillez vérifier votre e-mail pour confirmer votre compte."});
      setView('userSignin'); // Optionally switch to signin view
      setEmail(''); setPassword(''); setConfirmPassword(''); // Clear fields
    }
  };

  const handleUserSignInSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsUserAuthLoading(true);
    setUserAuthError(null);
    const { error } = await signInUser({ email, password });
    setIsUserAuthLoading(false);
    if (error) {
      setUserAuthError(error.message || "Erreur lors de la connexion.");
    } else {
      router.push('/'); // Redirect to homepage on successful sign-in
    }
  };

  const renderAdminLogin = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <KeyRound className="h-6 w-6 text-primary" /> Accès Administrateur
        </CardTitle>
        <CardDescription>Veuillez entrer le mot de passe administrateur.</CardDescription>
      </CardHeader>
      <CardContent>
        {adminError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{adminError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <Label htmlFor="admin-password">Mot de passe</Label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          <Button type="submit" disabled={isAdminLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isAdminLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Se Connecter en tant qu\'Admin'}
          </Button>
          <Button variant="outline" onClick={() => setView('select')} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderUserSignUpForm = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="h-6 w-6 text-primary" /> Créer un Compte
        </CardTitle>
        <CardDescription>Rejoignez MaisonMate pour une expérience personnalisée.</CardDescription>
      </CardHeader>
      <CardContent>
        {userAuthError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur d'Inscription</AlertTitle>
            <AlertDescription>{userAuthError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleUserSignUpSubmit} className="space-y-4">
          {/* 
          <p className="text-sm text-muted-foreground mb-3">
            Champs requis pour l'inscription : Nom, Prénom, E-mail, Mot de passe, Téléphone, Date de naissance.
            Pour cette démo, nous n'utilisons que l'e-mail et le mot de passe.
          </p>
          */}
          <div>
            <Label htmlFor="signup-email"><Mail className="inline mr-1 h-4 w-4" />E-mail</Label>
            <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
          </div>
          <div>
            <Label htmlFor="signup-password"><KeyRound className="inline mr-1 h-4 w-4" />Mot de passe</Label>
            <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="********" />
          </div>
           <div>
            <Label htmlFor="signup-confirm-password"><KeyRound className="inline mr-1 h-4 w-4" />Confirmer le mot de passe</Label>
            <Input id="signup-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="********" />
          </div>
          <Button type="submit" disabled={isUserAuthLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isUserAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'S\'inscrire'}
          </Button>
          <p className="text-sm text-center">
            Déjà un compte ? <Button variant="link" className="p-0 h-auto" onClick={() => setView('userSignin')}>Se connecter</Button>
          </p>
          <Button variant="outline" onClick={() => setView('select')} className="w-full mt-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la sélection
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderUserSignInForm = () => (
     <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LogIn className="h-6 w-6 text-primary" /> Se Connecter
        </CardTitle>
        <CardDescription>Accédez à votre compte MaisonMate.</CardDescription>
      </CardHeader>
      <CardContent>
        {userAuthError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur de Connexion</AlertTitle>
            <AlertDescription>{userAuthError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleUserSignInSubmit} className="space-y-4">
          <div>
            <Label htmlFor="signin-email"><Mail className="inline mr-1 h-4 w-4" />E-mail</Label>
            <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
          </div>
          <div>
            <Label htmlFor="signin-password"><KeyRound className="inline mr-1 h-4 w-4" />Mot de passe</Label>
            <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="********" />
          </div>
          <Button type="submit" disabled={isUserAuthLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isUserAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Se Connecter'}
          </Button>
           <p className="text-sm text-center">
            Pas encore de compte ? <Button variant="link" className="p-0 h-auto" onClick={() => setView('userSignup')}>S'inscrire</Button>
          </p>
          <Button variant="outline" onClick={() => setView('select')} className="w-full mt-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la sélection
          </Button>
        </form>
      </CardContent>
    </Card>
  );


  const renderSelection = () => (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Bienvenue sur MaisonMate</CardTitle>
        <CardDescription>Comment souhaitez-vous continuer ?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <Button size="lg" onClick={() => setView('admin')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Shield className="mr-2 h-5 w-5" /> Accéder au Panel Admin
        </Button>
        <Button size="lg" onClick={() => setView('userSignin')} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <User className="mr-2 h-5 w-5" /> Espace Utilisateur (Connexion/Inscription)
        </Button>
      </CardContent>
    </Card>
  );

  if (isAuthContextLoading && !user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de l'authentification...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      {view === 'select' && renderSelection()}
      {view === 'admin' && renderAdminLogin()}
      {view === 'userSignup' && renderUserSignUpForm()}
      {view === 'userSignin' && renderUserSignInForm()}
    </div>
  );
}
