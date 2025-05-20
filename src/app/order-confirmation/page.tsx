
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Home, Phone, Mail, ArrowLeft } from 'lucide-react';
import type { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const ORDER_CONFIRMATION_SESSION_KEY = 'maisonmate-order-confirmation';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth'); // Redirect if not authenticated
      return;
    }

    if (typeof window !== 'undefined') {
      const orderDataString = sessionStorage.getItem(ORDER_CONFIRMATION_SESSION_KEY);
      if (orderDataString) {
        try {
          const parsedOrder: Order = JSON.parse(orderDataString);
          setOrder(parsedOrder);
          // Optional: Remove item from sessionStorage after retrieving to prevent re-display on refresh
          // sessionStorage.removeItem(ORDER_CONFIRMATION_SESSION_KEY); 
        } catch (e) {
          console.error("Error parsing order data from sessionStorage:", e);
          router.replace('/'); // Or to cart page if order data is corrupted
        }
      } else if (!authLoading && user) { 
        // No order data found, but user is logged in, maybe they refreshed or came directly
        // router.replace('/'); // Redirect to home if no order data
      }
      setIsLoading(false);
    }
  }, [authLoading, user, router]);

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de la confirmation...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 pt-20 text-center">
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <CardTitle className="text-2xl font-bold">Aucune information de commande</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Nous n'avons pas pu trouver les détails de votre commande. Cela peut arriver si vous avez actualisé cette page ou y êtes arrivé directement.</p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retourner aux produits
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const { items, totalAmount, shippingAddress, orderDate, userEmail } = order;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">
      <Card className="shadow-xl rounded-lg">
        <CardHeader className="text-center bg-primary/10 p-6 rounded-t-lg">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Merci pour votre commande !</CardTitle>
          <CardDescription className="text-md text-foreground/80 mt-1">
            Votre commande a été reçue et sera traitée prochainement.
            Le paiement s'effectuera à la livraison.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-sm text-muted-foreground">
            Date de la commande: {new Date(orderDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>

          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2 flex items-center gap-2"><Package className="h-5 w-5 text-primary"/>Articles Commandés</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded object-cover aspect-square"/>
                    <div className="min-w-0">
                        <p className="font-medium truncate" title={item.name}>{item.name}</p>
                        <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium ml-2">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4"/>
            <div className="flex justify-end font-bold text-xl text-primary">
              <span>Total à payer à la livraison:</span>
              <span className="ml-2">${totalAmount.toFixed(2)}</span>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2 flex items-center gap-2"><Home className="h-5 w-5 text-primary"/>Adresse de Livraison</h3>
            <div className="space-y-1 text-sm text-foreground/90 bg-muted/30 p-4 rounded-md">
              <p className="font-medium">{shippingAddress.first_name} {shippingAddress.last_name}</p>
              <p>{shippingAddress.address_line1}</p>
              {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
              <p>{shippingAddress.postal_code} {shippingAddress.city}</p>
              <p>{shippingAddress.country}</p>
              <p className="flex items-center gap-1.5 pt-1"><Phone size={14} className="text-muted-foreground"/> {shippingAddress.phone}</p>
              {userEmail && <p className="flex items-center gap-1.5 pt-1"><Mail size={14} className="text-muted-foreground"/> {userEmail}</p>}
            </div>
          </section>
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Un e-mail de confirmation (simulation) vous a été envoyé. Notre équipe vous contactera pour confirmer les détails de la livraison.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/products">
                 <ArrowLeft className="mr-2 h-5 w-5" /> Continuer vos achats
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Added a simple Loader2 component for use during loading states if not already available globally
const Loader2 = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
