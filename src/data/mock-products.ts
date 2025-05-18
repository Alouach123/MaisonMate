
import type { Product } from '@/types';

// La liste des produits est maintenant vide, prête à être remplie manuellement.
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
  },
  {
    id: '4',
    name: 'IKEA Soderhamn Sofa',
    description: 'Un canapé modulaire et aérien, offrant une assise profonde et un confort personnalisable. Idéal pour un style épuré et contemporain, facile à adapter à votre espace.',
    price: 699.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/IKEA/094_IKEA_Soderhamn_Sofa/IKEA_Soderhamn_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Scandinave',
    rating: 4.3,
    stock: 45,
    colors: ['Gris Chiné', 'Beige Clair', 'Turquoise'],
    materials: ['Polyester', 'Coton', 'Acier'],
    dimensions: '198cm L x 99cm P x 83cm H',
  },
  {
    id: '5',
    name: 'Ethnicraft N701 Sofa',
    description: 'Design épuré et modulaire, le N701 combine confort et simplicité. Ses lignes claires et son rembourrage généreux s\'adaptent à tout intérieur moderne.',
    price: 2795.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Ethnicraft/001_Ethnicraft_N701_Sofa/Ethnicraft_N701_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Minimaliste',
    rating: 4.6,
    stock: 12,
    colors: ['Beige Sable', 'Gris Anthracite', 'Vert Olive'],
    materials: ['Tissu Bouclé', 'Bois Massif (structure)'],
    dimensions: '210cm L x 91cm P x 76cm H (pour un module 3 places)',
  },
  {
    id: '6',
    name: 'BoConcept Bergamo Sofa',
    description: 'Le canapé Bergamo allie luxe organique et confort exceptionnel avec ses lignes fluides et ses options de personnalisation. Un design danois sophistiqué pour un salon élégant.',
    price: 4150.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/BoConcept/023_BoConcept_Bergamo_Sofa/BoConcept_Bergamo_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Moderne',
    rating: 4.9,
    stock: 8,
    colors: ['Gris Velours', 'Cuir Camel', 'Bleu Nuit Tissu'],
    materials: ['Velours de Coton', 'Cuir Aniline', 'Structure en Acier'],
    dimensions: '244cm L x 105cm P x 72cm H',
  },
  {
    id: '7',
    name: 'Sarah Ellison Muse Sofa',
    description: 'Le canapé Muse se distingue par ses formes sculpturales et son allure contemporaine. Une pièce maîtresse douce, accueillante et résolument design.',
    price: 2999.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Sarah-Ellison/001_Sarah-Ellison_Muse_Sofa/Sarah-Ellison_Muse_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Moderne',
    rating: 4.7,
    stock: 10,
    colors: ['Crème Bouclé', 'Vert Sauge Velours', 'Terracotta Lin'],
    materials: ['Tissu Bouclé', 'Velours', 'Lin', 'Structure en Bois FSC'],
    dimensions: '220cm L x 100cm P x 70cm H',
  },
  {
    id: '8',
    name: 'IKEA Friheten Sofa',
    description: 'Un canapé d\'angle convertible pratique et compact, idéal pour les petits espaces. Se transforme facilement en lit et dispose d\'un espace de rangement intégré.',
    price: 549.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/IKEA/110_IKEA_Friheten_Sofa/IKEA_Friheten_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Moderne',
    rating: 4.1,
    stock: 50,
    colors: ['Gris Foncé Skiftebo', 'Noir Hyllie', 'Beige Hyllie'],
    materials: ['Polyester', 'Panneau de particules', 'Mousse Polyuréthane'],
    dimensions: '230cm L x 151cm P (méridienne) x 66cm H',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Conserver une liste statique de catégories pour les filtres,
// même si la liste de produits est initialement vide.
export const productCategories: string[] = [
  "Canapés"
  // "Chaises",
  // "Tables",
  // "Lits",
  // "Luminaires",
  // "Rangements",
  // "Décoration"
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
