
"use client";

import { useState, type FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// SIMULATED OTP - In a real app, this would be generated, sent, and verified against a backend/cache.
const SIMULATED_CORRECT_OTP = "000000";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call for OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === SIMULATED_CORRECT_OTP) {
      toast({
        title: "Vérification Réussie !",
        description: "Votre compte est maintenant vérifié (simulation). Veuillez vous connecter.",
        variant: "default",
      });
      router.push('/auth'); // Redirect to login view within auth page
    } else {
      setError("Code OTP incorrect. Veuillez réessayer.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-xl">Vérifier votre compte</CardTitle>
          <CardDescription>
            Un code de vérification (simulé) a été "envoyé" à {email ? <strong>{email}</strong> : "votre adresse e-mail"}.
            Entrez le code ci-dessous. (Pour tester, utilisez : {SIMULATED_CORRECT_OTP})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erreur de vérification</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp">Code OTP (6 chiffres)</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Allow only digits, max 6
                required
                placeholder="000000"
                maxLength={6}
                pattern="\d{6}"
                title="Veuillez entrer un code à 6 chiffres."
              />
            </div>
            <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Vérifier le Code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <VerifyOtpContent />
        </Suspense>
    )
}
