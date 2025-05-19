
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, KeyRound, LogIn, UserPlus, Loader2, ArrowLeft, Mail, UserCircle2, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { verifyPasswordAction } from '@/app/admin/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { Progress } from '@/components/ui/progress';

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth';

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
  return Math.min(100, strength > 25 ? strength : (validation.minLength ? 25: 0) ); 
};

export default function AuthPage() {
  const [view, setView] = useState<'select' | 'admin' | 'userSignin' | 'userSignup'>('select');
  
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>(initialPasswordValidation);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const handlePasswordChange = (pass: string) => {
    setPassword(pass);
    const validation = validatePassword(pass);
    setPasswordValidation(validation);
    setPasswordStrength(getPasswordStrength(validation));
  };

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
    const currentPasswordValidation = validatePassword(password);
    const allValid = Object.values(currentPasswordValidation).every(Boolean);

    if (!allValid) {
      setUserAuthError("Le mot de passe ne respecte pas tous les critères de sécurité.");
      return;
    }
    if (password !== confirmPassword) {
      setUserAuthError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsUserAuthLoading(true);
    setUserAuthError(null);

    const credentials = { 
      email, 
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    };

    const { error } = await signUpUser(credentials);
    setIsUserAuthLoading(false);
    if (error) {
      setUserAuthError(error.message || "Erreur lors de l'inscription.");
    } else {
      toast({ title: "Inscription demandée", description: "Veuillez vérifier votre e-mail pour confirmer votre compte."});
      setView('userSignin'); 
      setEmail(''); setPassword(''); setConfirmPassword(''); setFirstName(''); setLastName('');
      setPasswordValidation(initialPasswordValidation); setPasswordStrength(0);
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
      router.push('/');
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

  const renderPasswordStrength = () => {
    if (!password) return null; 
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signup-firstname"><UserCircle2 className="inline mr-1 h-4 w-4" />Prénom</Label>
              <Input id="signup-firstname" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Ex: Jean" />
            </div>
            <div>
              <Label htmlFor="signup-lastname"><UserCircle2 className="inline mr-1 h-4 w-4" />Nom</Label>
              <Input id="signup-lastname" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Ex: Dupont" />
            </div>
          </div>
          <div>
            <Label htmlFor="signup-email"><Mail className="inline mr-1 h-4 w-4" />E-mail</Label>
            <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
          </div>
          <div>
            <Label htmlFor="signup-password"><KeyRound className="inline mr-1 h-4 w-4" />Mot de passe</Label>
            <Input id="signup-password" type="password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} required placeholder="********" />
            {renderPasswordStrength()}
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20"> {/* Increased pt-8 to pt-20 */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20"> {/* Increased pt-8 to pt-20 */}
      {view === 'select' && renderSelection()}
      {view === 'admin' && renderAdminLogin()}
      {view === 'userSignup' && renderUserSignUpForm()}
      {view === 'userSignin' && renderUserSignInForm()}
    </div>
  );
}
