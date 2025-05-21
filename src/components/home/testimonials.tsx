
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonialsData = [
  {
    name: "Fatima Z.",
    avatarFallback: "FZ",
    avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Casablanca, Maroc",
    rating: 5,
    quote: "J'ai trouvé le canapé parfait pour mon salon chez MaisonMate. La qualité est incroyable et le service client était au top !"
  },
  {
    name: "Youssef A.",
    avatarFallback: "YA",
    avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Rabat, Maroc",
    rating: 5,
    quote: "Ma nouvelle table à manger est magnifique. Le processus de commande était simple et la livraison rapide. Je recommande vivement."
  },
  {
    name: "Amina K.",
    avatarFallback: "AK",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Marrakech, Maroc",
    rating: 4,
    quote: "Beaucoup de choix et des designs très sympas. J'ai redécoré ma chambre et je suis ravie du résultat. Juste un petit retard de livraison."
  },
  {
    name: "Karim B.",
    avatarFallback: "KB",
    avatarImage: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=150&h=150&auto=format&fit=crop",
    location: "Fès, Maroc",
    rating: 5,
    quote: "Service client exceptionnel ! Ils m'ont aidé à choisir l'éclairage parfait pour mon bureau. Très professionnels et à l'écoute."
  },
  {
    name: "Layla S.",
    avatarFallback: "LS",
    avatarImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=150&h=150&auto=format&fit=crop",
    location: "Tanger, Maroc",
    rating: 4,
    quote: "Les étagères que j'ai commandées sont arrivées rapidement et sont de très bonne qualité. Le montage était facile."
  }
];

export default function Testimonials() {
  // Duplicate testimonials for a seamless loop effect
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Ce que nos clients disent</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
          Découvrez les témoignages de nos clients satisfaits qui ont transformé leur intérieur avec nos produits.
        </p>
        <div className="overflow-hidden w-full group"> {/* Outer container to hide overflow */}
          <div className="flex w-max animate-scroll-testimonials group-hover:pause-animation"> {/* Inner container for flex items and animation */}
            {duplicatedTestimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl rounded-xl flex flex-col mx-3 flex-none w-80 sm:w-96 h-full"> {/* Fixed width and margin for spacing */}
                <CardContent className="p-6 flex-grow">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatarImage} alt={testimonial.name} data-ai-hint="person portrait"/>
                      <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <blockquote className="text-foreground/80 italic leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
