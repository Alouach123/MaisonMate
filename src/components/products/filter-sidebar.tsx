
"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { productCategories, productStyles } from '@/data/mock-products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, X } from 'lucide-react';

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };
  
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedStyles([]);
  };


  // In a real app, these filters would trigger a search/refetch of products.
  // For now, they just update local state.

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
            <AccordionContent className="space-y-2 pt-2">
              {productCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
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
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
                className="[&_[role=slider]]:bg-primary"
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
                      onCheckedChange={() => handleStyleChange(style)}
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

        <Button onClick={clearFilters} variant="outline" className="w-full mt-4">
          <X className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
