
import ProductCard from '@/components/products/product-card';
import FilterSidebar from '@/components/products/filter-sidebar';
import { mockProducts } from '@/data/mock-products';
import type { Product } from '@/types';

export default function HomePage() {
  // In a real app, products would be fetched and filtered based on sidebar state.
  const products: Product[] = mockProducts;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-72 xl:w-80">
        <FilterSidebar />
      </aside>
      <section className="w-full lg:flex-1">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to <span className="text-primary">MaisonMate</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Explore our curated collection and transform your space with quality items at competitive prices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No products found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
}
