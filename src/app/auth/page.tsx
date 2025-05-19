
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, KeyRound, LogIn, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { verifyPasswordAction } from '@/app/admin/actions'; // Re-use admin action
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth'; // Key for admin auth status

export default function AuthPage() {
  const [view, setView] = useState<'select' | 'admin' | 'user'>('select');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const router = useRouter();
  const { signIn, signUp, isAuthenticated: isUserAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect from /auth to homepage
    if (isUserAuthenticated && view === 'user') {
      router.push('/');
    }
    // If admin is already authenticated and tries to access admin login, redirect to dashboard
    if (typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_KEY) === 'true' && view === 'admin') {
      router.push('/admin');
    }
  }, [isUserAuthenticated, view, router]);


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

  const handleUserSignUp = () => {
    signUp();
    router.push('/'); // Or to a specific post-signup page
  };

  const handleUserSignIn = () => {
    signIn();
    router.push('/'); // Or to a specific post-signin page
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
            {isAdminLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
              </>
            ) : (
              'Se Connecter en tant qu\'Admin'
            )}
          </Button>
          <Button variant="outline" onClick={() => setView('select')} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderUserActions = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-6 w-6 text-primary" /> Espace Utilisateur
        </CardTitle>
        <CardDescription>Connectez-vous ou créez un compte pour une meilleure expérience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleUserSignIn} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <LogIn className="mr-2 h-4 w-4" /> Se Connecter
        </Button>
        <Button onClick={handleUserSignUp} variant="secondary" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" /> S'inscrire
        </Button>
        <Button variant="outline" onClick={() => setView('select')} className="w-full mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
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
        <Button size="lg" onClick={() => setView('user')} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <User className="mr-2 h-5 w-5" /> Espace Utilisateur (Connexion/Inscription)
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      {view === 'select' && renderSelection()}
      {view === 'admin' && renderAdminLogin()}
      {view === 'user' && renderUserActions()}
    </div>
  );
}
