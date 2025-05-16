
'use server';

import { mockProducts } from '@/data/mock-products';
import type { Product, ProductFormData } from '@/types';
import { ProductSchema } from '@/types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function verifyPasswordAction(password: string): Promise<{ success: boolean }> {
  return { success: password === ADMIN_PASSWORD };
}

export async function getProductsAction(): Promise<Product[]> {
  return mockProducts;
}

export async function addProductAction(data: ProductFormData): Promise<{ success: boolean; product?: Product; error?: string }> {
  const validation = ProductSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const newProduct: Product = {
    ...validation.data,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 7), // Generate unique ID
    imageUrl: validation.data.imageUrl || 'https://placehold.co/600x400.png',
    // Ensure all fields from Product interface are present, optional ones can be undefined
    rating: validation.data.rating ?? undefined,
    stock: validation.data.stock ?? undefined,
    colors: validation.data.colors ?? [],
    materials: validation.data.materials ?? [],
    dimensions: validation.data.dimensions ?? undefined,
    style: validation.data.style ?? undefined,
  };
  mockProducts.unshift(newProduct); // Add to the beginning of the array
  return { success: true, product: newProduct };
}

export async function updateProductAction(data: ProductFormData): Promise<{ success: boolean; product?: Product; error?: string }> {
  if (!data.id) {
    return { success: false, error: "Product ID is missing for update." };
  }
  const validation = ProductSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const productIndex = mockProducts.findIndex(p => p.id === data.id);
  if (productIndex === -1) {
    return { success: false, error: "Product not found." };
  }

  const updatedProduct: Product = {
    ...mockProducts[productIndex],
    ...validation.data,
    id: data.id, // Ensure ID is not changed
    // Ensure all fields from Product interface are present
    rating: validation.data.rating ?? undefined,
    stock: validation.data.stock ?? undefined,
    colors: validation.data.colors ?? [],
    materials: validation.data.materials ?? [],
    dimensions: validation.data.dimensions ?? undefined,
    style: validation.data.style ?? undefined,
  };
  mockProducts[productIndex] = updatedProduct;
  return { success: true, product: updatedProduct };
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; error?: string }> {
  const initialLength = mockProducts.length;
  // This reassigns mockProducts to a new array without the specified product
  const newMockProducts = mockProducts.filter(p => p.id !== productId);
  
  if (newMockProducts.length === initialLength) {
     return { success: false, error: "Product not found or already deleted." };
  }
  
  // To effectively modify the original array exported from mock-products.ts,
  // we need to clear it and push the new items, or replace its contents.
  // Simplest way for in-memory array is to splice.
  mockProducts.length = 0; // Clear the array
  mockProducts.push(...newMockProducts); // Add filtered products back

  return { success: true };
}
