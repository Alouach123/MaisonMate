
import { z } from 'zod';
import type { ObjectId } from 'mongodb';

// Interface for data coming from MongoDB (includes _id)
export interface ProductDocument {
  _id: ObjectId;
  name: string;
  description: string;
  shortDescription?: string;
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
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
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

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  shortDescription: z.string().max(150, { message: "La description courte ne doit pas dépasser 150 caractères." }).optional().nullable(),
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

export function fromProductDocument(doc: ProductDocument): Product {
  return {
    ...doc,
    id: doc._id.toString(),
    shortDescription: doc.shortDescription,
  };
}

export interface AdminUserView {
  id: string;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  createdAt: string | undefined;
  lastSignInAt: string | undefined;
}

// Profile type to match the 'profiles' table in Supabase
export interface Profile {
  id: string; // Corresponds to auth.users.id
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
}

// Zod schema for profile form data
export const ProfileFormSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis.").optional().or(z.literal('')),
  last_name: z.string().min(1, "Le nom est requis.").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address_line1: z.string().optional().or(z.literal('')),
  address_line2: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;


// Type for Order (to be stored in MongoDB)
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: ObjectId; // For MongoDB
  id?: string; // For app use
  userId: string; // Supabase user ID
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  phone: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Date;
  updatedAt?: Date;
}

export const ShippingAddressSchema = z.object({
  address_line1: z.string().min(1, "L'adresse (ligne 1) est requise."),
  address_line2: z.string().optional(),
  city: z.string().min(1, "La ville est requise."),
  postal_code: z.string().min(1, "Le code postal est requis."),
  country: z.string().min(1, "Le pays est requis."),
  phone: z.string().min(1, "Le numéro de téléphone est requis."),
});

export type ShippingFormData = z.infer<typeof ShippingAddressSchema>;

