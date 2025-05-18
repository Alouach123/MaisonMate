
import type { Product } from '@/types';

// La liste des produits est maintenant vide, prête à être remplie manuellement.
export let mockProducts: Product[] = [];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Conserver une liste statique de catégories pour les filtres,
// même si la liste de produits est initialement vide.
export const productCategories: string[] = [
  "Chaises",
  "Tables",
  "Canapés",
  "Lits",
  "Luminaires",
  "Rangements",
  "Décoration"
];

// Conserver une liste statique de styles pour les filtres.
export const productStyles: string[] = [
  "Moderne",
  "Scandinave",
  "Industriel",
  "Vintage",
  "Minimaliste",
  "Classique",
  "Bohème"
];
