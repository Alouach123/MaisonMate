
import type { Product } from '@/types';

// La liste des produits est maintenant remplie avec les canapés spécifiés.
export let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Roche Bobois Bubble Grand canapé',
    description: 'Un design iconique et ludique, offrant un confort enveloppant avec ses formes arrondies. Parfait pour un intérieur contemporain et audacieux. Un véritable appel à la détente.',
    price: 3499.99,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Roche-Bobois/003_Roche-Bobois_Bubble_Large_Sofa/Roche-Bobois_Bubble_Large_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Moderne',
    rating: 4.8,
    stock: 15,
    colors: ['Rose Poudré', 'Gris Perle', 'Bleu Canard'],
    materials: ['Tissu Techno 3D', 'Mousse HR'],
    dimensions: '248cm L x 132cm P x 77cm H',
  },
  {
    id: '2',
    name: 'Chesterfield Canapé',
    description: 'L\'élégance intemporelle du style Chesterfield, avec son capitonnage profond caractéristique et ses accoudoirs enroulés. Une pièce de caractère en cuir véritable.',
    price: 2190.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Tools/340_Chesterfield_Sofa/Chesterfield_Sofa_600_lq_0001-551x551.webp',
    category: 'Canapés',
    style: 'Classique',
    rating: 4.7,
    stock: 22,
    colors: ['Marron Chocolat', 'Vert Anglais', 'Bordeaux'],
    materials: ['Cuir Pleine Fleur', 'Bois Massif'],
    dimensions: '215cm L x 95cm P x 78cm H',
  },
  {
    id: '3',
    name: 'Canapé marocain',
    description: 'Un canapé d\'inspiration marocaine, invitant à la convivialité avec ses assises basses, ses coussins colorés et ses motifs orientaux. Parfait pour une ambiance chaleureuse.',
    price: 1750.50,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Generic/155_Generic_Moroccan_Sofa/Generic_Moroccan_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Bohème',
    rating: 4.5,
    stock: 18,
    colors: ['Rouge Carmin', 'Orange Safran', 'Bleu Majorelle', 'Multicolore'],
    materials: ['Tissu Damassé', 'Bois de Cèdre', 'Velours'],
    dimensions: '260cm L x 85cm P x 70cm H',
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Liste plus complète de catégories pour les filtres, définie par l'utilisateur.
export const productCategories: string[] = [
  "Lits",
  "Chaises",
  "Lampes",
  "Canapés",
  "Tables",
  "Armoires",
  "Étagères",
  "Décorations",
  "Mirroirs", // Assurez-vous que l'orthographe est cohérente si vous l'utilisez ailleurs
  "Tapis"
];

// Conserver une liste statique de styles pour les filtres.
export const productStyles: string[] = [
  "Moderne",
  "Scandinave",
  "Industriel",
  "Vintage",
  "Minimaliste",
  "Classique",
  "Bohème",
  "Contemporain"
];
    