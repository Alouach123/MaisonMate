
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedStyles: string[];
  onStyleChange: (style: string) => void;
  onClearFilters: () => void;
  availableCategories: string[]; // Added prop for categories
  availableStyles: string[]; // Added prop for styles
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedCategories,
  onCategoryChange,
  selectedStyles,
  onStyleChange,
  onClearFilters,
  availableCategories, // Use passed categories
  availableStyles    // Use passed styles
}: FilterSidebarProps) {

  return (
    <Card className="shadow-lg rounded-lg sticky top-20">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filter Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <Accordion type="multiple" defaultValue={['category', 'price', 'style']} className="w-full">
          
          <AccordionItem value="category">
            <AccordionTrigger className="text-md font-medium">Category</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2 max-h-60 overflow-y-auto">
              {availableCategories.map(category => (
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
          
          {availableStyles.length > 0 && (
            <AccordionItem value="style">
              <AccordionTrigger className="text-md font-medium">Style</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                {availableStyles.map(style => (
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

        <Button onClick={onClearFilters} variant="outline" className="w-full">
          <X className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
