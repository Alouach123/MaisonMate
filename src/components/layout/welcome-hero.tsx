
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <section className="mb-10 sm:mb-12 md:mb-16">
      <div className="bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-center">
          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
              Bienvenue chez <span className="text-accent">MaisonMate</span>!
            </h1>
            <p className="text-md sm:text-lg text-muted-foreground">
              Découvrez nos dernières nouveautés et promotions exclusives. Transformez votre intérieur avec style et élégance grâce à notre collection soigneusement sélectionnée.
            </p>
            <p className="text-md sm:text-lg text-muted-foreground hidden sm:block">
              Des meubles uniques aux accessoires décoratifs, trouvez l'inspiration pour chaque pièce de votre maison.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group mt-2 sm:mt-4">
              <Link href="#products-section" className="flex items-center">
                Explorer la Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <div className="relative rounded-lg overflow-hidden shadow-md group/image">
              <Image 
                src="https://placehold.co/450x600.png" 
                alt="Décoration intérieure élégante" 
                fill
                sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 200px"
                className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                data-ai-hint="elegant decor"
                priority
              />
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md group/image">
               <Image 
                src="https://placehold.co/450x600.png" 
                alt="Salon moderne et lumineux" 
                fill
                sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 200px"
                className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                data-ai-hint="modern living"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
