
"use client"; // Required for onClick and useToast

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Globe } from 'lucide-react'; // Added Globe
import { Button } from '@/components/ui/button'; // Added Button
import { useToast } from '@/hooks/use-toast'; // Added useToast

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Use current year dynamically
  const { toast } = useToast(); // Initialize toast

  const handleLanguageSwitch = () => {
    toast({
      title: "Changement de Langue (Simulation)",
      description: "Cette fonctionnalité est en cours de développement. Le site serait normalement affiché en anglais.",
      variant: "default",
    });
  };

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-semibold text-foreground mb-2">MaisonMate</h3>
            <p>&copy; {currentYear} MaisonMate. Tous droits réservés.</p>
            <p>Votre destination pour des fournitures de maison de qualité.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Liens Rapides</h3>
            <ul className="space-y-1">
              <li><Link href="/products" className="hover:text-primary">Produits</Link></li>
              <li><Link href="/support" className="hover:text-primary">Support Client</Link></li>
              <li><Link href="/admin" className="hover:text-primary">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Suivez-nous</h3>
            <div className="flex justify-center md:justify-start gap-4 mb-3">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs italic">
              Projet éducatif réalisé par ALOUACH Abdennour et ELGARRAB Idris.
              <br />
              Encadrement pédagogique : Prof. BOUROUMANE Farida.
            </p>
          </div>
        </div>

        {/* Language Switcher Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" size="sm" onClick={handleLanguageSwitch}>
            <Globe className="mr-2 h-4 w-4" />
            Passer en Anglais
          </Button>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center text-xs">
          <p>MaisonMate - Conçu avec passion pour la maison.</p>
        </div>
      </div>
    </footer>
  );
}
