
"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { productCategories } from '@/data/mock-products';
import { 
  Sofa, BedDouble, Lamp, Armchair, Table, ShoppingBasket, 
  GalleryVerticalEnd, BookOpen, AppWindow, Layers
} from 'lucide-react';

// Define a mapping for category details including icons and thematic colors
const categoryDetailsList = [
  { name: 'Lits', icon: BedDouble, themeColor: 'green' },
  { name: 'Chaises', icon: Armchair, themeColor: 'yellow' },
  { name: 'Lampes', icon: Lamp, themeColor: 'red' },
  { name: 'Canapés', icon: Sofa, themeColor: 'blue' },
  { name: 'Tables', icon: Table, themeColor: 'purple' },
  { name: 'Armoires', icon: GalleryVerticalEnd, themeColor: 'indigo' },
  { name: 'Étagères', icon: BookOpen, themeColor: 'pink' },
  { name: 'Décorations', icon: ShoppingBasket, themeColor: 'orange' },
  { name: 'Mirroirs', icon: AppWindow, themeColor: 'teal' },
  { name: 'Tapis', icon: Layers, themeColor: 'cyan' },
];

const defaultCategoryDetail = { icon: ShoppingBasket, themeColor: 'gray' };

const categoriesToDisplay = productCategories.map(catName => {
  const detail = categoryDetailsList.find(d => d.name === catName) || defaultCategoryDetail;
  return {
    name: catName,
    icon: detail.icon,
    href: `/products?category=${encodeURIComponent(catName)}`,
    themeColor: detail.themeColor,
  };
});

export default function FeaturedCategories() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-primary">
            Explore Our Categories
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need for your home.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesToDisplay.map((category) => {
            // Default state classes for the card wrapper
            const defaultCardWrapperShadow = 'shadow-sm';
            
            // Default icon color
            const defaultIconColorClass = 'text-slate-500 dark:text-slate-400';

            // Hover state classes for the card wrapper (border and shadow glow)
            const cardHoverClasses = `hover:border-${category.themeColor}-500 hover:shadow-2xl hover:shadow-${category.themeColor}-500/40`;
            
            // Hover state for the icon itself (changes to theme color)
            const iconHoverClasses = `group-hover:text-${category.themeColor}-500 dark:group-hover:text-${category.themeColor}-400`;
            
            // Hover state for the category name text
            const textHoverClasses = `group-hover:text-${category.themeColor}-700 dark:group-hover:text-${category.themeColor}-300`;

            return (
              <Link href={category.href} key={category.name} legacyBehavior>
                <a className={`group block p-0.5 rounded-xl ${defaultCardWrapperShadow} transition-all duration-300 ease-in-out 
                             transform hover:-translate-y-1 hover:scale-[1.03] 
                             border border-transparent 
                             ${cardHoverClasses}
                           `}>
                  <Card className="h-full text-center border-0 shadow-none bg-card rounded-[10px]">
                    <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                      <category.icon className={`h-10 w-10 md:h-12 md:w-12 mb-3 
                                                 ${defaultIconColorClass} 
                                                 ${iconHoverClasses} 
                                                 transition-colors duration-300`} strokeWidth={1.5} />
                      <h3 className={`text-sm md:text-md font-semibold text-center text-foreground 
                                     ${textHoverClasses} 
                                     transition-colors duration-300`}>
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
