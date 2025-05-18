
import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // e.g., "Sofas", "Chairs", "Tables"
  style?: string; // e.g., "Modern", "Classic", "Minimalist"
  rating?: number; // Optional rating 1-5
  stock?: number; // Optional stock count
  colors?: string[]; // Available colors
  materials?: string[]; // E.g. "Wood", "Metal", "Fabric"
  dimensions?: string; // E.g. "120cm x 80cm x 75cm"
}

export interface WishlistItem extends Product {
  addedAt: string; // ISO date string
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StyleSuggestion {
  id: string;
  name: string;
  imageUrl: string;
  reason?: string;
}

export const ProductSchema = z.object({
  id: z.string().optional(), // Optional: will be generated for new products or present for existing
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  imageUrl: z.string().url({ message: "L'URL de l'image doit être valide." }).default('https://placehold.co/600x400.png'),
  category: z.string().min(1, { message: "La catégorie est requise." }),
  style: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  stock: z.coerce.number().int().min(0).optional().nullable(),
  colors: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()) : []),
    z.array(z.string()).optional()
  ),
  materials: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()) : []),
    z.array(z.string()).optional()
  ),
  dimensions: z.string().optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
