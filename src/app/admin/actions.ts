
'use server';

import { connectToDatabase, toObjectId } from '@/lib/mongodb';
import type { Product, ProductFormData, ProductDocument } from '@/types';
import { ProductSchema } from '@/types';
import { ObjectId } from 'mongodb';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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
    
    const newProductData = {
      ...validation.data,
      imageUrl: validation.data.imageUrl || 'https://placehold.co/600x400.png',
      colors: validation.data.colors ?? [],
      materials: validation.data.materials ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Remove id if present, as MongoDB will generate _id
    if ('id' in newProductData) delete (newProductData as any).id;


    const result = await productsCollection.insertOne(newProductData);
    
    if (!result.insertedId) {
        return { success: false, error: "Failed to insert product into database." };
    }

    const insertedProduct: Product = {
      ...newProductData,
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
    
    // Prepare data for update, excluding id and _id
    const { id: formId, ...updateData } = validation.data;
    const productToUpdate = {
      ...updateData,
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

    return { success: true, product: { ...updatedDoc, id: updatedDoc._id.toString() } };
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
