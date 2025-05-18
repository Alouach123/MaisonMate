
import type { Product } from '@/types';

// Changed from const to let to allow modification
export let mockProducts: Product[] = [];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// These will reflect the initial state of mockProducts.
// For a dynamic admin panel, these might need to be updated or fetched differently.
export const productCategories: string[] = Array.from(new Set(mockProducts.map(p => p.category)));
export const productStyles: string[] = Array.from(new Set(mockProducts.map(p => p.style).filter(s => s !== undefined) as string[]));
