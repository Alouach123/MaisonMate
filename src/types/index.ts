
import { z } from 'zod';
import type { ObjectId } from 'mongodb';

// Interface for data coming from MongoDB (includes _id)
export interface ProductDocument {
  _id: ObjectId;
  name: string;
  description: string;
  shortDescription?: string; // New field
  price: number;
  imageUrl: string;
  category: string;
  style?: string;
  rating?: number;
  stock?: number;
  colors?: string[];
  materials?: string[];
  dimensions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Product used in the application (maps _id to id string)
export interface Product {
  id: string; // Changed from _id: ObjectId
  name: string;
  description: string;
  shortDescription?: string; // New field
  price: number;
  imageUrl: string;
  category: string;
  style?: string;
  rating?: number;
  stock?: number;
  colors?: string[];
  materials?: string[];
  dimensions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WishlistItem extends Product {
  addedAt: string;
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

// Zod schema for product form data and validation
export const ProductSchema = z.object({
  id: z.string().optional(), // id is a string in the app, will be mapped to _id for DB ops
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  shortDescription: z.string().max(150, { message: "La description courte ne doit pas dépasser 150 caractères." }).optional().nullable(), // New field
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  imageUrl: z.string().url({ message: "L'URL de l'image doit être valide." }).default('https://placehold.co/600x400.png'),
  category: z.string().min(1, { message: "La catégorie est requise." }),
  style: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  stock: z.coerce.number().int().min(0).optional().nullable(),
  colors: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(val) ? val : [])),
    z.array(z.string()).optional()
  ),
  materials: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(val) ? val : [])),
    z.array(z.string()).optional()
  ),
  dimensions: z.string().optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;

// Helper function to transform ProductDocument from DB to Product for app use
export function fromProductDocument(doc: ProductDocument): Product {
  return {
    ...doc,
    id: doc._id.toString(), // Convert ObjectId to string
    shortDescription: doc.shortDescription, // Ensure mapping
  };
}

// Type for displaying users in the admin panel
export interface AdminUserView {
  id: string;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  createdAt: string | undefined;
  lastSignInAt: string | undefined;
}
