
"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { productCategories } from '@/data/mock-products';
import { 
  Sofa, BedDouble, Lamp, Armchair, Table, ShoppingBasket, 
  GalleryVerticalEnd, BookOpen, AppWindow, Layers // Remplacé Wardrobe par GalleryVerticalEnd
} from 'lucide-react';

// Define a mapping for category details including icons and styling
const categoryDetailsList = [
  { name: 'Lits', icon: BedDouble, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50' },
  { name: 'Chaises', icon: Armchair, iconColorClass: 'text-yellow-500', bgColorClass: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50' },
  { name: 'Lampes', icon: Lamp, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50' },
  { name: 'Canapés', icon: Sofa, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50' },
  { name: 'Tables', icon: Table, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50' },
  { name: 'Armoires', icon: GalleryVerticalEnd, iconColorClass: 'text-indigo-500', bgColorClass: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50' }, // Remplacé Wardrobe
  { name: 'Étagères', icon: BookOpen, iconColorClass: 'text-pink-500', bgColorClass: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/30 dark:hover:bg-pink-800/50' },
  { name: 'Décorations', icon: ShoppingBasket, iconColorClass: 'text-orange-500', bgColorClass: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-800/50' },
  { name: 'Mirroirs', icon: AppWindow, iconColorClass: 'text-teal-500', bgColorClass: 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-800/50' },
  { name: 'Tapis', icon: Layers, iconColorClass: 'text-cyan-500', bgColorClass: 'bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:hover:bg-cyan-800/50' },
  { name: 'default', icon: ShoppingBasket, iconColorClass: 'text-gray-500', bgColorClass: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-600/50'} // Fallback
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
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Nos Catégories</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
          Explorez notre vaste sélection de meubles et décorations.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesToDisplay.map((category) => (
            <Link href={category.href} key={category.name} legacyBehavior>
              <a className={`block p-1 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${category.bgColorClass}`}>
                <Card className="h-full text-center border-0 shadow-none bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                    <category.icon className={`h-10 w-10 md:h-12 md:w-12 mb-3 ${category.iconColorClass}`} strokeWidth={1.5} />
                    {/* Category name now uses default foreground color for better dark mode visibility */}
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
