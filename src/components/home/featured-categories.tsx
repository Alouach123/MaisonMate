
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

// Ensure all productCategories have a detail entry, falling back if necessary
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
            Discover a wide range of high-quality furniture and decor to bring your vision to life.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesToDisplay.map((category) => {
            const iconColorClass = `text-${category.themeColor}-600 dark:text-${category.themeColor}-400`;
            const iconBgClass = `bg-${category.themeColor}-100 dark:bg-${category.themeColor}-500/20`;
            const hoverBorderClass = `hover:border-${category.themeColor}-500/50 dark:hover:border-${category.themeColor}-400/50`;
            const hoverBgClass = `hover:bg-${category.themeColor}-500/5 dark:hover:bg-${category.themeColor}-400/5`;
            const hoverTextColorClass = `group-hover:text-${category.themeColor}-700 dark:group-hover:text-${category.themeColor}-300`;

            return (
              <Link href={category.href} key={category.name} legacyBehavior>
                <a className={`group block p-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out 
                             transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl 
                             bg-card border-2 border-border/20 
                             ${hoverBorderClass} ${hoverBgClass}
                           `}>
                  <Card className="h-full text-center border-0 shadow-none bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center p-2">
                      <div className={`p-3 rounded-full mb-3 ${iconBgClass} transition-colors duration-300`}>
                        <category.icon className={`h-7 w-7 ${iconColorClass} transition-colors duration-300`} strokeWidth={1.5} />
                      </div>
                      <h3 className={`text-sm font-semibold text-center text-foreground transition-colors duration-300 ${hoverTextColorClass}`}>
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
