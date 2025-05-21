
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ShieldCheck, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';

const highlights = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "Livraison gratuite pour toute commande supérieure à 300€.",
    themeColorName: "green", // For deriving Tailwind classes
    iconClasses: "text-green-600 dark:text-green-400",
    iconBgClasses: "bg-green-100 dark:bg-green-500/20",
    hoverRingClasses: "hover:ring-green-500 dark:hover:ring-green-400",
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction garantie",
    description: "Retours gratuits sous 30 jours si vous n'êtes pas satisfait.",
    themeColorName: "blue",
    iconClasses: "text-blue-600 dark:text-blue-400",
    iconBgClasses: "bg-blue-100 dark:bg-blue-500/20",
    hoverRingClasses: "hover:ring-blue-500 dark:hover:ring-blue-400",
  },
  {
    icon: LifeBuoy,
    title: "Support 24/7",
    description: "Une équipe à votre service pour répondre à toutes vos questions.",
    themeColorName: "purple",
    iconClasses: "text-purple-600 dark:text-purple-400",
    iconBgClasses: "bg-purple-100 dark:bg-purple-500/20",
    hoverRingClasses: "hover:ring-purple-500 dark:hover:ring-purple-400",
  },
];

export default function ServiceHighlights() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {highlights.map((highlight) => (
            <Card
              key={highlight.title}
              className={cn(
                "bg-card shadow-lg rounded-xl text-center transition-all duration-300 ease-in-out",
                "transform hover:-translate-y-1", // Lift effect
                "hover:shadow-xl", // Enhanced shadow on hover
                highlight.hoverRingClasses, // Thematic ring color on hover
                "hover:ring-2 hover:ring-offset-background hover:ring-offset-2" // Base ring styles
              )}
            >
              <CardContent className="p-6 md:p-8">
                <div className={cn(
                  "mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 shadow-md",
                  highlight.iconBgClasses 
                )}>
                  <highlight.icon className={cn("h-10 w-10", highlight.iconClasses)} strokeWidth={1.5}/>
                </div>
                <CardTitle className="text-xl lg:text-2xl font-semibold mb-2 text-foreground">{highlight.title}</CardTitle>
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
