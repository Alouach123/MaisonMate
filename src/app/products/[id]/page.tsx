
import Image from 'next/image';
import { getProductById } from '@/data/mock-products';
import { notFound } from 'next/navigation';
import StyleSuggestions from '@/components/products/style-suggestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Palette, Package, Ruler } from 'lucide-react';
import AddToWishlistButton from '@/components/products/add-to-wishlist-button'; // Separate client component for wishlist button

export async function generateStaticParams() {
  // In a real app, fetch all product IDs to pre-render pages
  // For mock data, you might not need this if using dynamic rendering or few products
  // const products = await fetch('/api/products').then(res => res.json())
  // return products.map(product => ({ id: product.id }))
  return [{ id: '1' }, { id: '2' }, { id: '3' }]; // Example
}

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const hintKeywords: string[] = [];
  if (product.category) {
    hintKeywords.push(product.category.toLowerCase().split(' ')[0]);
  }
  if (product.style) {
    hintKeywords.push(product.style.toLowerCase().split(' ')[0]);
  }
  const uniqueHintKeywords = [...new Set(hintKeywords)];
  const aiHint = uniqueHintKeywords.slice(0, 2).join(' ') || 'item';


  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="md:sticky md:top-24">
          <Card className="overflow-hidden shadow-xl rounded-lg">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-auto object-contain aspect-[4/3]"
              priority // Prioritize loading of the main product image
              data-ai-hint={aiHint}
            />
          </Card>
          {/* Small gallery images could go here */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  {product.category && <Badge variant="outline" className="mb-2 text-sm">{product.category}</Badge>}
                  <CardTitle className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</CardTitle>
                </div>
                 {/* Add to Wishlist Button - Client Component */}
                <AddToWishlistButton product={product} />
              </div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">({product.rating.toFixed(1)} rating)</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
              <CardDescription className="text-base text-foreground/80 leading-relaxed">{product.description}</CardDescription>
              
              {/* Product Attributes */}
              <div className="space-y-3 pt-3 border-t">
                {product.style && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="font-medium">Style: {product.style}</Badge>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Colors:</span>
                    {product.colors.map(color => <Badge key={color} variant="outline" style={{backgroundColor: color, color: '#fff', borderColor: '#ccc'}}>{color}</Badge>)}
                  </div>
                )}
                 {product.materials && product.materials.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Materials:</span>
                    <span className="text-foreground/80">{product.materials.join(', ')}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-foreground/80">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons - Add to Cart could go here */}
            </CardContent>
          </Card>
          
          {/* Style Suggestions */}
          <StyleSuggestions productDescription={product.description} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
