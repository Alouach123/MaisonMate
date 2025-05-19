
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie L.",
    avatarFallback: "SL",
    // Using Unsplash for placeholder avatar
    avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Paris, France",
    rating: 5,
    quote: "J'ai trouvé le canapé parfait pour mon salon chez MaisonMate. La qualité est incroyable et le service client était au top !"
  },
  {
    name: "Ahmed B.",
    avatarFallback: "AB",
    avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Lyon, France",
    rating: 5,
    quote: "Ma nouvelle table à manger est magnifique. Le processus de commande était simple et la livraison rapide. Je recommande vivement."
  },
  {
    name: "Chloé M.",
    avatarFallback: "CM",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Marseille, France",
    rating: 4,
    quote: "Beaucoup de choix et des designs très sympas. J'ai redécoré ma chambre et je suis ravie du résultat. Juste un petit retard de livraison."
  },
];

export default function Testimonials() {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Ce que nos clients disent</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
          Découvrez les témoignages de nos clients satisfaits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-xl rounded-xl flex flex-col">
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
                <blockquote className="text-foreground/80 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
