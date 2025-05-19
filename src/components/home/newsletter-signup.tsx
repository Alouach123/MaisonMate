
"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Inscription réussie !",
      description: "Merci de vous être inscrit à notre newsletter.",
    });
    setEmail('');
  };

  return (
    <section className="py-8 md:py-12 bg-primary/10 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-foreground">Restez Informé</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-lg">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, nouveautés et conseils déco.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow h-12 text-base bg-card"
              aria-label="Adresse e-mail pour la newsletter"
            />
            <Button type="submit" size="lg" disabled={isLoading} className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  S'inscrire
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
