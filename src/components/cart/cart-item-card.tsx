
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart-context';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateItemQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // Ensure quantity is not negative
    if (quantity === 0) {
      removeFromCart(item.id);
    } else {
      updateItemQuantity(item.id, quantity);
    }
  };
  
  const hintKeywords: string[] = [];
  if (item.category) {
    hintKeywords.push(item.category.toLowerCase().split(' ')[0]);
  }
  if (item.style) {
    hintKeywords.push(item.style.toLowerCase().split(' ')[0]);
  }
  const uniqueHintKeywords = [...new Set(hintKeywords)];
  const aiHint = uniqueHintKeywords.slice(0, 2).join(' ') || 'item';

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row rounded-lg border border-border/60">
      <Link href={`/products/${item.id}`} className="sm:w-1/4 block relative aspect-square sm:aspect-auto">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-full object-cover"
          data-ai-hint={aiHint}
        />
      </Link>
      <div className="flex flex-col justify-between sm:w-3/4">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <Link href={`/products/${item.id}`}>
              <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
                {item.name}
              </CardTitle>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive -mt-1 -mr-1"
              onClick={() => removeFromCart(item.id)}
              aria-label="Retirer du panier"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{item.category}{item.style ? ` - ${item.style}` : ''}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 0)} 
                className="w-16 h-8 text-center"
                min="1"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-lg font-semibold text-primary">
              ${(item.price * item.quantity).toFixed(2)}
              {item.quantity > 1 && <span className="text-xs text-muted-foreground ml-1">(${item.price.toFixed(2)}/unité)</span>}
            </p>
          </div>
        </CardContent>
         <CardFooter className="p-4 border-t sm:hidden"> {/* Mobile only quick delete */}
            <Button variant="outline" size="sm" className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Retirer
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
