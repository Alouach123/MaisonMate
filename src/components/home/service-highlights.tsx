
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ShieldCheck, LifeBuoy } from 'lucide-react';

const highlights = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "Livraison gratuite pour toute commande supérieure à 300€.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction garantie",
    description: "Retours gratuits sous 30 jours si vous n'êtes pas satisfait.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: LifeBuoy,
    title: "Support 24/7",
    description: "Une équipe à votre service pour répondre à toutes vos questions.",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
];

export default function ServiceHighlights() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {highlights.map((highlight) => (
            <Card key={highlight.title} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl ${highlight.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-card mb-5 shadow-md`}>
                  <highlight.icon className={`h-8 w-8 ${highlight.color}`} strokeWidth={1.5}/>
                </div>
                <CardTitle className="text-xl font-semibold mb-2 text-foreground">{highlight.title}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
