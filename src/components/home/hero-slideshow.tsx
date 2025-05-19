
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlayCircle } from 'lucide-react'; 

const heroData = {
  imageSrc: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  imageAlt: "Salon moderne et élégant avec un canapé confortable",
  aiHint: "modern living room",
  headline: "Transformez Votre Intérieur, Vivez Mieux.",
  subheadline: "Découvrez notre nouvelle collection de meubles et décorations conçus pour inspirer et embellir chaque espace de votre maison.",
  ctaText: "Explorer la Collection",
  ctaLink: "/products",
};

export default function HeroSlideshow() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden"> {/* Changed height and removed rounded-xl shadow-2xl */}
      <Image
        src={heroData.imageSrc}
        alt={heroData.imageAlt}
        fill
        priority
        className="object-cover"
        data-ai-hint={heroData.aiHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent"></div>
      
      <div className="absolute inset-0 flex items-center justify-center md:justify-start text-center md:text-left p-6 md:p-12 lg:p-16">
        <div className="max-w-lg md:max-w-xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight shadow-md">
            {heroData.headline}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed">
            {heroData.subheadline}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group text-base px-8 py-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href={heroData.ctaLink}>
              {heroData.ctaText}
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          {/* Optional: Secondary CTA or video link placeholder */}
          {/* 
          <Button variant="outline" size="lg" className="text-white border-white/70 hover:bg-white/10 group ml-4">
            <PlayCircle className="mr-2 h-5 w-5" /> Regarder la Vidéo
          </Button>
          */}
        </div>
      </div>
    </section>
  );
}
