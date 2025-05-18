
"use client";
// Removed useState as state is now managed by HomePage
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// Input is not used directly for filtering, Slider is used for price
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { productCategories, productStyles } from '@/data/mock-products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedStyles: string[];
  onStyleChange: (style: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedCategories,
  onCategoryChange,
  selectedStyles,
  onStyleChange,
  onClearFilters
}: FilterSidebarProps) {
  // Local state is removed, props are used directly.

  return (
    <Card className="shadow-lg rounded-lg sticky top-20">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filter Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4"> {/* Removed space-y-6 from here */}
        <ScrollArea className="h-[calc(100vh-14rem)]"> {/* Adjust height as needed. 14rem estimates: 5rem sticky offset + 4rem CardHeader + 4rem CardContent padding + 1rem buffer */}
          <div className="space-y-6"> {/* Added a div for spacing inside ScrollArea */}
            <Accordion type="multiple" defaultValue={['category', 'price', 'style']} className="w-full">
              
              <AccordionItem value="category">
                <AccordionTrigger className="text-md font-medium">Category</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {productCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => onCategoryChange(category)}
                        aria-label={`Filter by category: ${category}`}
                      />
                      <Label htmlFor={`cat-${category}`} className="font-normal text-sm cursor-pointer hover:text-primary">
                        {category}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger className="text-md font-medium">Price Range</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <Slider
                    min={0}
                    max={10000} 
                    step={100} 
                    value={priceRange}
                    onValueChange={onPriceRangeChange}
                    className="[&_[role=slider]]:bg-primary"
                    aria-label="Price range slider"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {productStyles.length > 0 && (
                <AccordionItem value="style">
                  <AccordionTrigger className="text-md font-medium">Style</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2">
                    {productStyles.map(style => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox
                          id={`style-${style}`}
                          checked={selectedStyles.includes(style)}
                          onCheckedChange={() => onStyleChange(style)}
                          aria-label={`Filter by style: ${style}`}
                        />
                        <Label htmlFor={`style-${style}`} className="font-normal text-sm cursor-pointer hover:text-primary">
                          {style}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <Button onClick={onClearFilters} variant="outline" className="w-full"> {/* Removed mt-4 as space-y-6 handles it */}
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

