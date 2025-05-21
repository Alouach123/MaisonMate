
'use server';
import { getStyleSuggestions as getStyleSuggestionsFlow, type StyleSuggestionsInput, type StyleSuggestionsOutput } from '@/ai/flows/style-suggestions';
// import { Product, getProductById, mockProducts } from '@/data/mock-products'; // Commented out as mockProducts are no longer used here

export async function fetchStyleSuggestionsAction(input: StyleSuggestionsInput): Promise<StyleSuggestionsOutput> {
  try {
    // You might want to add more sophisticated error handling or logging here
    const result = await getStyleSuggestionsFlow(input);
    
    // Potentially enrich suggestions with more product details if needed
    // For now, assuming the flow returns names and we might map them to full product objects or image URLs if available
    return result;

  } catch (error) {
    console.error("Error fetching style suggestions via action:", error);
    // Consider returning a structured error or re-throwing a custom error
    // For simplicity, re-throwing the original error or a generic one.
    throw new Error("Failed to fetch style suggestions. Please try again later.");
  }
}

// Example: Action to get related products (not AI, just for demonstration)
// This function needs to be reimplemented to fetch from the database if 'related products' functionality is required.
/*
export async function getRelatedProductsAction(productId: string, count: number = 3): Promise<Product[]> {
  const currentProduct = await getProductByIdAction(productId); // Needs to use getProductByIdAction from admin/actions
  if (!currentProduct) return [];

  // Logic to find related products from the database based on category, style, etc.
  // For now, returning an empty array.
  // Example placeholder:
  // const related = await getProductsAction({
  //   filters: { category: currentProduct.category },
  //   limit: count + 1, // Fetch one more to exclude current product
  // });
  // return related.filter(p => p.id !== productId).slice(0, count);
  return [];
}
*/

