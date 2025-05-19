
"use client"; 

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react'; 


export default function Footer() {
  const currentYear = new Date().getFullYear(); 

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
              <li><Link href="/auth" className="hover:text-primary">Admin/Connexion</Link></li> {/* Updated link */}
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

        {/* Language Switcher Button removed from here */}

        <div className="mt-8 border-t border-border/30 pt-6 text-center text-xs">
          <p>MaisonMate - Conçu avec passion pour la maison.</p>
        </div>
      </div>
    </footer>
  );
}
