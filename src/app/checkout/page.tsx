
"use client";

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-context';
import { useCart } from '@/hooks/use-cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, Phone, Building, MapPin, Globe2, UserCircle, AlertCircle, Loader2, ShoppingBag, CheckCircle, CreditCard } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ShippingFormData, OrderForConfirmation, CartItem, ProfileFormData } from '@/types'; // Updated Order to OrderForConfirmation
import { ShippingAddressSchema } from '@/types';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { addOrderAction } from '@/app/actions/orderActions'; // Import the new action

const ORDER_CONFIRMATION_SESSION_KEY = 'maisonmate-order-confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, fetchUserProfile } = useAuth();
  const { cartItems, getSubtotal, getTotalItems, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: '',
    }
  });

  useEffect(() => {
    if (!authLoading && !user && isMounted) {
      toast({ title: "Authentification requise", description: "Veuillez vous connecter pour passer à la caisse.", variant: "destructive" });
      router.push('/auth');
    }
    if (user && !profile && isMounted && !authLoading) { // Added !authLoading to ensure user state is stable
        fetchUserProfile();
    }
  }, [authLoading, user, router, profile, fetchUserProfile, isMounted]);

  useEffect(() => {
    if (profile && isMounted) {
      reset({
        first_name: profile.first_name || user?.user_metadata?.first_name || '',
        last_name: profile.last_name || user?.user_metadata?.last_name || '',
        phone: profile.phone || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
      });
    } else if (user && !profile && isMounted) { // If profile is null but user exists
        reset({
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            phone: '', // Keep these empty if not in profile yet
            address_line1: '', address_line2: '', city: '', postal_code: '', country: '',
        });
    }
  }, [profile, user, reset, isMounted]);

  const onSubmit: SubmitHandler<ShippingFormData> = async (data) => {
    setIsPlacingOrder(true);
    
    const orderPayload = {
      currentUser: user, // Pass the Supabase user object
      cartItems: cartItems,
      totalAmount: getSubtotal(),
      shippingAddress: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
      },
    };

    const result = await addOrderAction(orderPayload);

    if (result.success && result.orderId) {
      const orderForConfirmation: OrderForConfirmation = { // Use OrderForConfirmation type
        orderId: result.orderId,
        userEmail: user?.email,
        items: cartItems,
        totalAmount: getSubtotal(),
        shippingAddress: orderPayload.shippingAddress,
        orderDate: new Date(), // orderDate is set on server, but we can use current for session
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ORDER_CONFIRMATION_SESSION_KEY, JSON.stringify(orderForConfirmation));
      }
      
      clearCart(); 
      router.push('/order-confirmation');
    } else {
      toast({ variant: "destructive", title: "Erreur de commande", description: result.error || "Impossible de passer la commande." });
      setIsPlacingOrder(false);
    }
  };

  if (!isMounted || authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement de la caisse...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && !isPlacingOrder) {
    return (
      <div className="text-center py-20 max-w-md mx-auto pt-20">
        <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">Ajoutez des articles à votre panier avant de passer à la caisse.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">Continuer vos achats</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pt-20">
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-primary" /> Passage à la caisse
          </CardTitle>
          <CardDescription>Veuillez confirmer vos informations de livraison. Le paiement s'effectuera à la livraison.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-3">Récapitulatif de votre commande</h3>
            <div className="space-y-3 pr-2 border rounded-md p-3 bg-muted/30 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded object-cover aspect-square"/>
                    <div>
                        <p className="font-medium">{item.name} (x{item.quantity})</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4"/>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total ({getTotalItems()} articles):</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
             <p className="text-sm text-muted-foreground mt-1">Vous paierez ce montant à la livraison.</p>
          </section>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-semibold">Informations de livraison</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name"><UserCircle className="inline mr-1 h-4 w-4" />Prénom</Label>
                <Input id="first_name" {...register("first_name")} className={errors.first_name ? 'border-destructive' : ''} />
                {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="last_name"><UserCircle className="inline mr-1 h-4 w-4" />Nom</Label>
                <Input id="last_name" {...register("last_name")} className={errors.last_name ? 'border-destructive' : ''} />
                {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="phone"><Phone className="inline mr-1 h-4 w-4" />Téléphone</Label>
              <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? 'border-destructive' : ''} placeholder="Pour la confirmation de livraison"/>
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="address_line1"><Home className="inline mr-1 h-4 w-4" />Adresse (Ligne 1)</Label>
              <Input id="address_line1" {...register("address_line1")} className={errors.address_line1 ? 'border-destructive' : ''} placeholder="Numéro et nom de rue"/>
              {errors.address_line1 && <p className="text-sm text-destructive mt-1">{errors.address_line1.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_line2">Adresse (Ligne 2) (Optionnel)</Label>
              <Input id="address_line2" {...register("address_line2")} placeholder="Appartement, étage, etc."/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city"><Building className="inline mr-1 h-4 w-4" />Ville</Label>
                <Input id="city" {...register("city")} className={errors.city ? 'border-destructive' : ''} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postal_code"><MapPin className="inline mr-1 h-4 w-4" />Code Postal</Label>
                <Input id="postal_code" {...register("postal_code")} className={errors.postal_code ? 'border-destructive' : ''} />
                {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country"><Globe2 className="inline mr-1 h-4 w-4" />Pays</Label>
              <Input id="country" {...register("country")} className={errors.country ? 'border-destructive' : ''} />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
            
            {Object.keys(errors).length > 0 && (
                 <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle size={16}/> Veuillez corriger les erreurs ci-dessus.</p>
            )}

            <CardFooter className="p-0 pt-6">
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPlacingOrder}>
                {isPlacingOrder ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                Confirmer la commande (Paiement à la livraison)
                </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
