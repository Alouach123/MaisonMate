
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sofa, BedDouble, Lamp, Armchair, Table, ShoppingBasket } from 'lucide-react'; // Added Armchair, Table, ShoppingBasket for more variety

const categories = [
  { name: 'Canapés', icon: Sofa, href: '/products?category=Canapés', color: 'text-blue-500', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Lits', icon: BedDouble, href: '/products?category=Lits', color: 'text-green-500', bgColor: 'bg-green-50 hover:bg-green-100' },
  { name: 'Chaises', icon: Armchair, href: '/products?category=Chaises', color: 'text-yellow-500', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Tables', icon: Table, href: '/products?category=Tables', color: 'text-purple-500', bgColor: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Lampes', icon: Lamp, href: '/products?category=Lampes', color: 'text-red-500', bgColor: 'bg-red-50 hover:bg-red-100' },
  { name: 'Décorations', icon: ShoppingBasket, href: '/products?category=Décorations', color: 'text-pink-500', bgColor: 'bg-pink-50 hover:bg-pink-100' },
];

export default function FeaturedCategories() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Nos Catégories</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
          Explorez notre vaste sélection de meubles et décorations.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} legacyBehavior>
              <a className={`block p-1 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${category.bgColor}`}>
                <Card className="h-full text-center border-0 shadow-none bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                    <category.icon className={`h-10 w-10 md:h-12 md:w-12 mb-3 ${category.color}`} strokeWidth={1.5} />
                    <h3 className="text-md md:text-lg font-semibold text-foreground">{category.name}</h3>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
