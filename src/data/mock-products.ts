
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
  },
  {
    id: '4',
    name: 'IKEA Soderhamn Sofa',
    description: 'Modulable et confortable, le canapé Soderhamn d\'IKEA offre une assise profonde et des coussins moelleux. Son design épuré s\'intègre facilement à divers styles d\'intérieurs.',
    price: 799.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/IKEA/094_IKEA_Soderhamn_Sofa/IKEA_Soderhamn_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Scandinave',
    rating: 4.3,
    stock: 35,
    colors: ['Gris Foncé', 'Turquoise', 'Blanc Cassé'],
    materials: ['Polyester', 'Contreplaqué', 'Acier'],
    dimensions: '198cm L x 99cm P x 83cm H',
  },
  {
    id: '5',
    name: 'Ethnicraft N701 Sofa',
    description: 'Le canapé N701 d\'Ethnicraft se distingue par ses lignes minimalistes et son design modulaire. Disponible en plusieurs éléments pour créer une configuration personnalisée.',
    price: 2450.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Ethnicraft/001_Ethnicraft_N701_Sofa/Ethnicraft_N701_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Minimaliste',
    rating: 4.6,
    stock: 12,
    colors: ['Beige', 'Gris Anthracite', 'Bleu Nuit'],
    materials: ['Tissu de lin', 'Bois Massif'],
    dimensions: '210cm L x 91cm P x 76cm H (pour le 3 places)',
  },
  {
    id: '6',
    name: 'BoConcept Bergamo Sofa',
    description: 'Le canapé Bergamo de BoConcept allie design italien et confort exceptionnel. Ses lignes organiques et ses détails raffinés en font une pièce maîtresse de votre salon.',
    price: 3200.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/BoConcept/023_BoConcept_Bergamo_Sofa/BoConcept_Bergamo_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Contemporain',
    rating: 4.9,
    stock: 8,
    colors: ['Cuir Camel', 'Tissu Gris Chiné', 'Velours Vert Forêt'],
    materials: ['Cuir', 'Tissu', 'Piètement Métal'],
    dimensions: '240cm L x 105cm P x 70cm H',
  },
  {
    id: '7',
    name: 'Sarah Ellison Muse Sofa',
    description: 'Avec ses courbes douces et son allure sculpturale, le canapé Muse de Sarah Ellison est une invitation à la relaxation. Un design australien contemporain et élégant.',
    price: 2950.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Sarah-Ellison/001_Sarah-Ellison_Muse_Sofa/Sarah-Ellison_Muse_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Moderne',
    rating: 4.7,
    stock: 10,
    colors: ['Crème Bouclette', 'Velours Terracotta', 'Lin Naturel'],
    materials: ['Tissu Bouclette', 'Velours', 'Lin'],
    dimensions: '220cm L x 100cm P x 75cm H',
  },
  {
    id: '8',
    name: 'IKEA Friheten Sofa',
    description: 'Le canapé convertible Friheten d\'IKEA est une solution pratique et polyvalente. Il se transforme facilement en lit et dispose d\'un espace de rangement intégré.',
    price: 549.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/IKEA/110_IKEA_Friheten_Sofa/IKEA_Friheten_Sofa_1000_0001-551x551.webp',
    category: 'Canapés',
    style: 'Fonctionnel',
    rating: 4.1,
    stock: 40,
    colors: ['Gris Skiftebo', 'Noir Hyllie', 'Beige Foncé'],
    materials: ['Polyester', 'Bois Massif', 'Panneau de particules'],
    dimensions: '230cm L x 151cm P (méridienne) x 66cm H',
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
  "Contemporain",
  "Fonctionnel" // Ajouté pour le canapé Friheten
];
    

    