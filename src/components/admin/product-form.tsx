
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, type ProductFormData, type Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFormProps {
  productToEdit?: Product | null;
  onFormSubmit: (data: ProductFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProductForm({ productToEdit, onFormSubmit, onCancel, isLoading }: ProductFormProps) {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: productToEdit ? {
      ...productToEdit,
      colors: productToEdit.colors?.join(', ') || '',
      materials: productToEdit.materials?.join(', ') || '',
    } : {
      name: '',
      description: '',
      price: 0,
      imageUrl: 'https://placehold.co/600x400.png',
      category: '',
      style: '',
      rating: null, // Use null for optional numbers
      stock: null,  // Use null for optional numbers
      colors: '',
      materials: '',
      dimensions: '',
    },
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        ...productToEdit,
        colors: productToEdit.colors?.join(', ') || '',
        materials: productToEdit.materials?.join(', ') || '',
        rating: productToEdit.rating ?? null,
        stock: productToEdit.stock ?? null,
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        imageUrl: 'https://placehold.co/600x400.png',
        category: '',
        style: '',
        rating: null,
        stock: null,
        colors: '',
        materials: '',
        dimensions: '',
      });
    }
  }, [productToEdit, reset]);

  const processSubmit: SubmitHandler<ProductFormData> = async (data) => {
    // Transform comma-separated strings back to arrays before submitting
    const dataToSubmit = {
        ...data,
        colors: typeof data.colors === 'string' ? data.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
        materials: typeof data.materials === 'string' ? data.materials.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    const result = await onFormSubmit(dataToSubmit);
    if (result.success) {
      toast({ title: productToEdit ? "Produit mis à jour !" : "Produit ajouté !", description: "L'opération a été complétée avec succès." });
      reset(); // Reset form after successful submission
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.error || "Une erreur est survenue." });
    }
  };
  
  const formFields: Array<{name: keyof ProductFormData, label: string, type?: string, placeholder?: string, component?: 'textarea'}> = [
    { name: 'name', label: 'Nom du produit', placeholder: 'Ex: Chaise Moderne' },
    { name: 'description', label: 'Description', component: 'textarea', placeholder: 'Description détaillée du produit...' },
    { name: 'price', label: 'Prix', type: 'number', placeholder: 'Ex: 99.99' },
    { name: 'imageUrl', label: 'URL de l\'image', placeholder: 'https://...' },
    { name: 'category', label: 'Catégorie', placeholder: 'Ex: Chaises' },
    { name: 'style', label: 'Style (optionnel)', placeholder: 'Ex: Scandinave' },
    { name: 'rating', label: 'Note (0-5, optionnel)', type: 'number', placeholder: 'Ex: 4.5' },
    { name: 'stock', label: 'Stock (optionnel)', type: 'number', placeholder: 'Ex: 100' },
    { name: 'colors', label: 'Couleurs (séparées par virgule, optionnel)', placeholder: 'Ex: Rouge, Vert, Bleu' },
    { name: 'materials', label: 'Matériaux (séparés par virgule, optionnel)', placeholder: 'Ex: Bois, Métal' },
    { name: 'dimensions', label: 'Dimensions (optionnel)', placeholder: 'Ex: 100cm x 50cm x 75cm' },
  ];


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {productToEdit ? <Save className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
          {productToEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
        </CardTitle>
        <CardDescription>
          {productToEdit ? 'Mettez à jour les informations du produit.' : 'Remplissez les informations pour ajouter un nouveau produit.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <ScrollArea className="h-[calc(100vh-400px)] pr-6"> {/* Adjust height as needed */}
            <div className="space-y-4">
            {formFields.map(field => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.component === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={errors[field.name] ? 'border-destructive' : ''}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    step={field.type === 'number' ? '0.01' : undefined}
                    {...register(field.name, {
                      setValueAs: (value) => {
                        if (field.type === 'number') {
                          // Allow empty string to be treated as null/undefined for optional numbers
                          if (value === '') return null; 
                          const num = parseFloat(value);
                          return isNaN(num) ? null : num;
                        }
                        return value;
                      }
                    })}
                    placeholder={field.placeholder}
                    className={errors[field.name] ? 'border-destructive' : ''}
                  />
                )}
                {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]?.message}</p>}
              </div>
            ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (productToEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
              {productToEdit ? 'Sauvegarder' : 'Ajouter le produit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
