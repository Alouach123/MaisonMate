
"use client";

import CartItemCard from '@/components/cart/cart-item-card';
import { useCart } from '@/hooks/use-cart-context';
import { useAuth } from '@/hooks/use-auth-context'; // Import useAuth
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, Trash2, CreditCard, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, clearCart, getSubtotal, getTotalItems } = useCart();
  const { isAuthenticated, login } = useAuth(); // Get isAuthenticated state and login function
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion Requise",
        description: "Veuillez vous connecter ou vous inscrire pour continuer.",
        variant: "default",
        action: ( // Example: Add a login button to the toast
          <Button onClick={login} size="sm">
            Se connecter
          </Button>
        ),
      });
      return;
    }
    // Placeholder for actual checkout logic
    toast({
      title: "Fonctionnalité en cours de développement",
      description: "Le passage à la caisse n'est pas encore implémenté.",
    });
  };

  if (totalItems === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <ShoppingCart className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Votre Panier est Vide</h1>
        <p className="text-muted-foreground mb-8">Il semble que vous n'ayez encore rien ajouté à votre panier.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 transform rotate-180" /> Continuer vos achats
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Cart Items Section */}
        <section className="w-full lg:w-2/3 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-primary">Votre Panier ({totalItems} article{totalItems > 1 ? 's' : ''})</h1>
            {cartItems.length > 0 && (
              <Button variant="outline" onClick={clearCart} className="text-sm text-destructive hover:border-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Vider le panier
              </Button>
            )}
          </div>
          {cartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </section>

        {/* Order Summary Section */}
        <aside className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <Card className="shadow-xl rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Récapitulatif de la Commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-md">
                <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frais de port</span>
                <span>Calculés à la prochaine étape</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold text-foreground">
                <span>Total Estimé</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                onClick={handleProceedToCheckout}
              >
                <CreditCard className="mr-2 h-5 w-5" /> Passer à la caisse
              </Button>
              <Button asChild variant="outline" className="w-full">
                  <Link href="/" className="flex items-center gap-2">
                     <ArrowRight className="h-4 w-4 transform rotate-180" /> Continuer vos achats
                  </Link>
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
