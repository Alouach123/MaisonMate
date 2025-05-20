
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Linkedin, Copyright, Send } from 'lucide-react'; 
import { Armchair } from 'lucide-react'; 

export default function Footer() {
  const currentYear = new Date().getFullYear(); 

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for newsletter submission logic
    alert("Merci de vous être abonné à notre newsletter ! (Simulation)");
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <footer className="border-t border-border/40 bg-card text-card-foreground pt-12 pb-8 mt-16"> {/* Added mt-16 */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/80 transition-colors mb-2">
              <Armchair className="h-7 w-7" />
              <span className="font-bold">MaisonMate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre destination unique pour des meubles et décorations d'intérieur élégants et de qualité.
            </p>
             <div className="text-xs text-muted-foreground pt-2"> {/* Made credits slightly more distinct */}
              <p className="font-semibold">Projet Éducatif :</p>
              <p>Réalisé par ALOUACH Abdennour & ELGARRAB Idris.</p>
              <p>Encadrement pédagogique : Prof. BOUROUMANE Farida.</p>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Tous les Produits</Link></li>
              <li><Link href="/products?category=Canapés" className="text-muted-foreground hover:text-primary">Canapés</Link></li>
              <li><Link href="/products?category=Lits" className="text-muted-foreground hover:text-primary">Lits</Link></li>
              <li><Link href="/products?category=Chaises" className="text-muted-foreground hover:text-primary">Chaises</Link></li>
              <li><Link href="/products?category=Tables" className="text-muted-foreground hover:text-primary">Tables</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Service Client</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="text-muted-foreground hover:text-primary">Contactez-nous</Link></li>
              <li><Link href="/support#faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li> {/* Assuming FAQ section might have an ID */}
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Politique de Retour</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Suivi de Commande</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-4">Restez Connecté</h3>
            <p className="text-sm text-muted-foreground mb-3">Recevez nos dernières offres et nouveautés.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 mb-4">
              <Input type="email" placeholder="Votre e-mail" className="bg-background flex-grow h-10" required />
              <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <h4 className="text-sm font-medium text-foreground mb-2">Suivez-nous</h4>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
          <p className="flex items-center">
            <Copyright className="h-4 w-4 mr-1.5" /> {currentYear} MaisonMate. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:text-primary">Termes & Conditions</Link>
            <Link href="#" className="hover:text-primary">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
