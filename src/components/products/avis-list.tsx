
"use client";

import { useEffect, useState } from 'react';
import type { Avis } from '@/types';
import { getAvisForProductAction } from '@/app/actions/avisActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserCircle, CalendarDays, MessageSquareText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

interface AvisListProps {
  productId: string;
  refreshKey?: number; // Optional key to trigger re-fetch
}

export default function AvisList({ productId, refreshKey }: AvisListProps) {
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvis = async () => {
      setIsLoading(true);
      setError(null);
      setAvisList([]); // Explicitly clear the list before fetching

      try {
        const fetchedAvis = await getAvisForProductAction(productId);
        setAvisList(fetchedAvis);
      } catch (err) {
        console.error("Error fetching avis:", err);
        setError("Impossible de charger les avis pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) { // Only fetch if productId is valid
      fetchAvis();
    } else {
      // If no productId, clear the list and stop loading
      setAvisList([]);
      setIsLoading(false);
      setError("Product ID is missing for fetching reviews.");
    }
  }, [productId, refreshKey]); // Re-fetch if productId or refreshKey changes

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="shadow-sm rounded-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/5" />
              </div>
              <Skeleton className="h-4 w-1/6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="mt-6 text-destructive">{error}</p>;
  }

  if (avisList.length === 0) {
    return (
      <div className="mt-8 text-center py-6 bg-muted/50 rounded-lg">
        <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Aucun avis pour ce produit pour le moment.</p>
        <p className="text-sm text-muted-foreground">Soyez le premier à laisser un commentaire !</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-semibold text-foreground border-b pb-2">
        Avis des clients ({avisList.length})
      </h3>
      {avisList.map((avis) => (
        <Card key={avis.id} className="shadow-md rounded-lg border border-border/60">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-primary" />
                <CardTitle className="text-md font-semibold">{avis.userName}</CardTitle>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarDays size={14} />
                <span>{formatDistanceToNow(new Date(avis.createdAt), { addSuffix: true, locale: fr })}</span>
              </div>
            </div>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < avis.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">{avis.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
