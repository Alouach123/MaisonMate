
import type { Product } from '@/types';

// Changed from const to let to allow modification
export let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Velvet Sofa',
    description: 'A luxurious velvet sofa that adds a touch of elegance to any living room. Features plush cushioning and a sturdy wooden frame.',
    price: 699.99,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1007691_1_1.jpg', // Kept from previous update
    category: 'Sofas',
    style: 'Modern',
    rating: 4.5,
    colors: ['Deep Blue', 'Forest Green', 'Dusty Rose'],
    materials: ['Velvet', 'Wood'],
    dimensions: '200cm x 90cm x 85cm',
  },
  {
    id: '2',
    name: 'Minimalist Oak Chair',
    description: 'A sleek and minimalist chair crafted from solid oak. Perfect for dining rooms or as an accent piece.',
    price: 129.99,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009083_1_1.jpg', // Kept from previous update
    category: 'Chairs',
    style: 'Minimalist',
    rating: 4.8,
    materials: ['Oak Wood'],
    dimensions: '45cm x 50cm x 80cm',
  },
  {
    id: '3',
    name: 'Rustic Farmhouse Cabinet',
    description: 'A charming rustic cabinet with ample storage space. Made from reclaimed wood, perfect for a farmhouse aesthetic.',
    price: 349.50,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1011311_1_1.jpg', // Kept from previous update
    category: 'Cabinets',
    style: 'Rustic',
    rating: 4.2,
    materials: ['Reclaimed Wood', 'Metal'],
    dimensions: '100cm x 40cm x 120cm',
  },
  {
    id: '4',
    name: 'Scandinavian Coffee Table',
    description: 'A light and airy coffee table with clean lines, embodying Scandinavian design principles. Features a white lacquered top and tapered wooden legs.',
    price: 189.00,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009070_1_1.jpg', // Updated
    category: 'Tables',
    style: 'Scandinavian',
    rating: 4.6,
    colors: ['White', 'Natural Wood'],
    materials: ['MDF', 'Pine Wood'],
    dimensions: '110cm x 60cm x 45cm',
  },
  {
    id: '5',
    name: 'Industrial Bookshelf',
    description: 'A sturdy bookshelf combining metal and wood for an industrial-chic look. Offers five spacious shelves for books and decor.',
    price: 259.99,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009094_1_1.jpg', // Updated
    category: 'Cabinets',
    style: 'Industrial',
    rating: 4.3,
    materials: ['Metal', 'Particle Board'],
    dimensions: '80cm x 30cm x 180cm',
  },
  {
    id: '6',
    name: 'Bohemian Rattan Lounge Chair',
    description: 'Relax in style with this comfortable rattan lounge chair, perfect for a bohemian-inspired living space or patio.',
    price: 299.00,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009084_1_1.jpg', // Updated
    category: 'Chairs',
    style: 'Bohemian',
    rating: 4.7,
    materials: ['Rattan', 'Cotton Cushion'],
    dimensions: '70cm x 80cm x 75cm',
  },
   {
    id: '7',
    name: 'Classic Chesterfield Armchair',
    description: 'Timeless design meets ultimate comfort in this classic Chesterfield armchair, upholstered in rich faux leather.',
    price: 450.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Sofas-and-Armchairs/003_Baker_Kara_Mann_Milling_Road_Claremont_Lounge_Chair/Baker_Kara_Mann_Milling_Road_Claremont_Lounge_Chair_1000_0001.jpg', // Updated
    category: 'Chairs',
    style: 'Classic',
    rating: 4.9,
    colors: ["Brown", "Black"],
    materials: ["Faux Leather", "Wood"],
    dimensions: "110cm x 90cm x 75cm",
  },
  {
    id: '8',
    name: 'Modern Glass Dining Table',
    description: 'A sleek modern dining table with a tempered glass top and chrome-finished metal legs. Seats up to six people comfortably.',
    price: 399.99,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Tables/001_Reflex_Angelo_Velo_72_Dining_Table/Reflex_Angelo_Velo_72_Dining_Table_1000_0001.jpg', // Updated
    category: 'Tables',
    style: 'Modern',
    rating: 4.4,
    materials: ["Tempered Glass", "Metal"],
    dimensions: "160cm x 90cm x 76cm",
  },
  {
    id: '9',
    name: 'Art Deco Table Lamp',
    description: 'A stunning table lamp with geometric brass details and a frosted glass shade, adding a touch of Art Deco glamour to your space.',
    price: 159.99,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009150_1_1.jpg', // Updated
    category: 'Lighting',
    style: 'Art Deco',
    rating: 4.7,
    colors: ['Brass', 'White'],
    materials: ['Metal', 'Glass'],
    dimensions: '30cm (W) x 55cm (H)',
  },
  {
    id: '10',
    name: 'Plush Geometric Area Rug',
    description: 'Soft and luxurious area rug with a modern geometric pattern in soothing colors. Adds warmth, comfort, and style to any room.',
    price: 289.00,
    imageUrl: 'https://3dmodels.org/imgfiles/prod_1009160_1_1.jpg', // Updated
    category: 'Rugs',
    style: 'Modern',
    rating: 4.5,
    colors: ['Grey', 'Cream', 'Blue'],
    materials: ['Polypropylene'],
    dimensions: '200cm x 300cm',
  },
  {
    id: '11',
    name: 'Upholstered Platform Bed',
    description: 'A stylish upholstered platform bed featuring a tufted headboard and sturdy wooden slats. Provides a comfortable and elegant centerpiece for your bedroom.',
    price: 599.00,
    imageUrl: 'https://cdn.3dmodels.org/wp-content/uploads/Furniture/Beds/002_Poliform_Chloe_Bed/Poliform_Chloe_Bed_1000_0001.jpg', // Updated
    category: 'Beds',
    style: 'Contemporary',
    rating: 4.6,
    colors: ['Charcoal Grey', 'Beige'],
    materials: ['Fabric', 'Wood', 'Metal Frame'],
    dimensions: 'Queen Size: 160cm (W) x 205cm (L) x 110cm (Headboard H)',
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// These will reflect the initial state of mockProducts.
// For a dynamic admin panel, these might need to be updated or fetched differently.
export const productCategories: string[] = Array.from(new Set(mockProducts.map(p => p.category)));
export const productStyles: string[] = Array.from(new Set(mockProducts.map(p => p.style).filter(s => s !== undefined) as string[]));

