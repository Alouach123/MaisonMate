
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, MessageSquare, Star as StarIcon, User as UserIcon } from 'lucide-react'; // Renamed Star to StarIcon
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-context';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AvisSchema, type AvisFormData } from '@/types';
import StarRatingInput from '../ui/star-rating-input';
import { addAvisAction } from '@/app/actions/avisActions';

interface ReviewFormProps {
  productId: string;
  productName: string; // To display in the title
  onReviewSubmitted: () => void; // Callback after submission
}

export default function StyleSuggestions({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [currentRating, setCurrentRating] = useState(0);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<AvisFormData>({
    resolver: zodResolver(AvisSchema),
    defaultValues: {
      productId: productId,
      userName: '',
      rating: 0,
      comment: '',
      userId: undefined,
    },
  });

  useEffect(() => {
    setValue('productId', productId); // Ensure productId is set if it changes
    if (isAuthenticated && user) {
      const name = (user.user_metadata?.first_name && user.user_metadata?.last_name)
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.user_metadata?.first_name || user.email?.split('@')[0] || 'Utilisateur Anonyme';
      setValue('userName', name);
      setValue('userId', user.id);
    } else {
      setValue('userName', '');
      setValue('userId', undefined);
    }
  }, [isAuthenticated, user, setValue, productId]);

  useEffect(() => {
    setValue('rating', currentRating);
  }, [currentRating, setValue]);

  const processSubmit: SubmitHandler<AvisFormData> = async (data) => {
    if (data.rating === 0) {
      toast({ variant: "destructive", title: "Note requise", description: "Veuillez sélectionner une note." });
      return;
    }
    
    const result = await addAvisAction(data);
    if (result.success) {
      toast({ title: "Avis soumis !", description: "Merci pour votre retour." });
      reset({
        productId: productId,
        userName: isAuthenticated && user ? ( (user.user_metadata?.first_name && user.user_metadata?.last_name)
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.user_metadata?.first_name || user.email?.split('@')[0] || '') : '',
        rating: 0,
        comment: '',
        userId: isAuthenticated && user ? user.id : undefined,
      });
      setCurrentRating(0);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.error || "Impossible de soumettre l'avis." });
    }
  };

  return (
    <Card className="mt-8 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Votre avis sur "{productName}"
        </CardTitle>
        <CardDescription>
          Partagez votre expérience avec ce produit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="reviewUserName" className="flex items-center gap-1.5"><UserIcon size={16} />Nom</Label>
            <Input
              id="reviewUserName"
              {...register("userName")}
              placeholder="Votre nom ou pseudo"
              className={errors.userName ? 'border-destructive' : ''}
              disabled={isAuthenticated && !!user?.user_metadata?.first_name}
            />
            {errors.userName && <p className="text-sm text-destructive mt-1">{errors.userName.message}</p>}
          </div>

          <div>
            <Label className="flex items-center gap-1.5 mb-1"><StarIcon size={16} />Votre note</Label>
            <StarRatingInput rating={currentRating} setRating={setCurrentRating} />
            {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
            <input type="hidden" {...register("rating")} />
          </div>

          <div>
            <Label htmlFor="reviewComment">Votre commentaire</Label>
            <Textarea
              id="reviewComment"
              {...register("comment")}
              placeholder="Écrivez votre commentaire ici..."
              className={errors.comment ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
          </div>
          
          <input type="hidden" {...register("productId")} />
          {isAuthenticated && user && <input type="hidden" {...register("userId")} />}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Soumettre l'avis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
