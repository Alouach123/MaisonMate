
// This file will no longer hold the main product data.
// It can still be used for static lists like categories or styles if they aren't moved to the DB.

// export let mockProducts: Product[] = [ ... ]; // This array is now removed.

// The getProductById function is also removed as data fetching is now through DB.
// export const getProductById = (id: string): Product | undefined => { ... };

// Keep these as static lists for filter options,
// unless you plan to manage categories and styles in the database as well.
export const productCategories: string[] = [
  "Lits",
  "Chaises",
  "Lampes",
  "Canapés",
  "Tables",
  "Armoires",
  "Étagères",
  "Décorations",
  "Mirroirs",
  "Tapis"
];

export const productStyles: string[] = [
  "Moderne",
  "Scandinave",
  "Industriel",
  "Vintage",
  "Minimaliste",
  "Classique",
  "Bohème",
  "Contemporain",
  "Fonctionnel",
  "Ergonomique",
  "Rustique",
  "Côtier" 
];
