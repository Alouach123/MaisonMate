
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // e.g., "Sofas", "Chairs", "Tables"
  style?: string; // e.g., "Modern", "Classic", "Minimalist"
  rating?: number; // Optional rating 1-5
  stock?: number; // Optional stock count
  colors?: string[]; // Available colors
  materials?: string[]; // E.g. "Wood", "Metal", "Fabric"
  dimensions?: string; // E.g. "120cm x 80cm x 75cm"
}

export interface WishlistItem extends Product {
  addedAt: string; // ISO date string
}

export interface StyleSuggestion {
  id: string;
  name: string;
  imageUrl: string;
  reason?: string;
}
