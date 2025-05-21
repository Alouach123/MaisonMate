
"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <section className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-xl mx-auto shadow-xl rounded-xl overflow-hidden bg-card border border-border/30">
          <CardHeader className="text-center p-6 md:p-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-accent/10 mb-6 shadow-md">
                <Mail className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary mb-2">Restez Informé</CardTitle>
            <CardDescription className="text-muted-foreground text-md sm:text-lg leading-relaxed">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, nouveautés et conseils déco.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0 sm:pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base ring-1 ring-border focus:ring-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md py-3"
                aria-label="Adresse e-mail pour la newsletter"
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading} 
                className="w-full h-12 text-base bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-300 py-3"
              >
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
