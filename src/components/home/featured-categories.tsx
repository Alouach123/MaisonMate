
"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { productCategories } from '@/data/mock-products';
import { 
  Sofa, BedDouble, Lamp, Armchair, Table, ShoppingBasket, 
  GalleryVerticalEnd, BookOpen, AppWindow, Layers
} from 'lucide-react';

const categoryDetailsList = [
  { name: 'Lits', icon: BedDouble, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50' },
  { name: 'Chaises', icon: Armchair, iconColorClass: 'text-yellow-500', bgColorClass: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50' },
  { name: 'Lampes', icon: Lamp, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50' },
  { name: 'Canapés', icon: Sofa, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50' },
  { name: 'Tables', icon: Table, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50' },
  { name: 'Armoires', icon: GalleryVerticalEnd, iconColorClass: 'text-indigo-500', bgColorClass: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50' },
  { name: 'Étagères', icon: BookOpen, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/30 dark:hover:bg-pink-800/50' },
  { name: 'Décorations', icon: ShoppingBasket, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-800/50' },
  { name: 'Mirroirs', icon: AppWindow, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-800/50' },
  { name: 'Tapis', icon: Layers, iconColorClass: 'text-cyan-500', bgColorClass: 'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/50' },
  { name: 'default', icon: ShoppingBasket, iconColorClass: 'text-gray-500', bgColorClass: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-600/50'}
];

const categoriesToDisplay = productCategories.map(catName => {
  const detail = categoryDetailsList.find(d => d.name === catName) || categoryDetailsList.find(d => d.name === 'default')!;
  return {
    name: catName,
    icon: detail.icon,
    href: `/products?category=${encodeURIComponent(catName)}`,
    iconColorClass: detail.iconColorClass,
    bgColorClass: detail.bgColorClass
  };
});

export default function FeaturedCategories() {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-foreground">Explore Our Categories</h2>
        <p className="text-center text-muted-foreground mb-6 md:mb-8 text-md sm:text-lg">
          Find exactly what you need for your home.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
          {categoriesToDisplay.map((category) => (
            <Link href={category.href} key={category.name} legacyBehavior>
              <a className={`block p-1 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${category.bgColorClass}`}>
                <Card className="h-full text-center border-0 shadow-none bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center p-3 md:p-4">
                    <category.icon className={`h-8 w-8 sm:h-10 sm:w-10 mb-2 ${category.iconColorClass}`} strokeWidth={1.5} />
                    <h3 className="text-xs sm:text-sm font-medium text-foreground text-center">{category.name}</h3>
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

