
'use server';

import { connectToDatabase, toObjectId } from '@/lib/mongodb';
import type { Product, ProductFormData, ProductDocument, AdminUserView } from '@/types';
import { ProductSchema } from '@/types';
import { ObjectId } from 'mongodb';
import { createClient, type User } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


export async function verifyPasswordAction(password: string): Promise<{ success: boolean }> {
  return { success: password === ADMIN_PASSWORD };
}

export async function getProductsAction(filters: { category?: string } = {}): Promise<Product[]> {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection<ProductDocument>('products');
    
    const query: any = {};
    if (filters.category) {
      query.category = filters.category;
    }

    const productDocs = await productsCollection.find(query).sort({ createdAt: -1 }).toArray();
    return productDocs.map(doc => ({
      ...doc,
      id: doc._id.toString(),
      shortDescription: doc.shortDescription, 
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductByIdAction(productId: string): Promise<Product | null> {
  if (!ObjectId.isValid(productId)) {
    console.error("Invalid product ID format for getProductByIdAction:", productId);
    return null;
  }
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection<ProductDocument>('products');
    const productDoc = await productsCollection.findOne({ _id: toObjectId(productId) });
    if (!productDoc) {
      return null;
    }
    return {
      ...productDoc,
      id: productDoc._id.toString(),
      shortDescription: productDoc.shortDescription, 
    };
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    return null;
  }
}


export async function addProductAction(data: ProductFormData): Promise<{ success: boolean; product?: Product; error?: string }> {
  const validation = ProductSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection<Omit<ProductDocument, '_id'>>('products');
    
    const newProductData: Omit<ProductDocument, '_id'> = {
      ...validation.data,
      shortDescription: validation.data.shortDescription || undefined,
      imageUrl: validation.data.imageUrl || 'https://placehold.co/600x400.png',
      colors: validation.data.colors ?? [],
      materials: validation.data.materials ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if ('id' in newProductData) delete (newProductData as any).id;


    const result = await productsCollection.insertOne(newProductData);
    
    if (!result.insertedId) {
        return { success: false, error: "Failed to insert product into database." };
    }

    const insertedProduct: Product = {
      ...(newProductData as Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt'> & { createdAt: Date, updatedAt: Date }),
      id: result.insertedId.toString(),
    };
    
    return { success: true, product: insertedProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "An error occurred while adding the product." };
  }
}

export async function updateProductAction(data: ProductFormData): Promise<{ success: boolean; product?: Product; error?: string }> {
  if (!data.id || !ObjectId.isValid(data.id)) {
    return { success: false, error: "Product ID is missing or invalid for update." };
  }
  const validation = ProductSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection<ProductDocument>('products');
    
    const productId = toObjectId(data.id);
    
    const { id: formId, ...updateData } = validation.data;
    const productToUpdate = {
      ...updateData,
      shortDescription: updateData.shortDescription || undefined,
      imageUrl: updateData.imageUrl || 'https://placehold.co/600x400.png',
      colors: updateData.colors ?? [],
      materials: updateData.materials ?? [],
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { _id: productId },
      { $set: productToUpdate }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Product not found." };
    }
    
    const updatedDoc = await productsCollection.findOne({ _id: productId });
    if (!updatedDoc) {
         return { success: false, error: "Failed to retrieve updated product." };
    }

    return { success: true, product: { ...updatedDoc, id: updatedDoc._id.toString(), shortDescription: updatedDoc.shortDescription } };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "An error occurred while updating the product." };
  }
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; error?: string }> {
   if (!ObjectId.isValid(productId)) {
    return { success: false, error: "Invalid product ID format." };
  }
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection<ProductDocument>('products');
    const result = await productsCollection.deleteOne({ _id: toObjectId(productId) });

    if (result.deletedCount === 0) {
      return { success: false, error: "Product not found or already deleted." };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "An error occurred while deleting the product." };
  }
}

export async function getUsersAction(): Promise<AdminUserView[]> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL or Service Role Key is not configured.");
    throw new Error("Supabase configuration missing for admin actions.");
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      // You can add pagination options here if needed, e.g., page: 1, perPage: 50
    });

    if (error) {
      console.error("Error fetching users from Supabase:", error.message);
      throw error;
    }

    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function deleteUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { success: false, error: "Supabase URL or Service Role Key is not configured for admin actions." };
  }
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Error deleting user from Supabase:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || "An unexpected error occurred while deleting the user." };
  }
}
