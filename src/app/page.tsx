
"use client";

import WelcomeHero from '@/components/layout/welcome-hero';
import FeaturedCategories from '@/components/home/featured-categories';
import PopularProducts from '@/components/home/popular-products';
import ServiceHighlights from '@/components/home/service-highlights';
import Testimonials from '@/components/home/testimonials';
import NewsletterSignup from '@/components/home/newsletter-signup';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
      <WelcomeHero />
      
      <ServiceHighlights />

      <Separator className="my-4 md:my-6" />

      <FeaturedCategories />

      <Separator className="my-4 md:my-6" />

      <PopularProducts />
      
      <Separator className="my-4 md:my-6" />

      <Testimonials />

      <Separator className="my-4 md:my-6" />
      
      <NewsletterSignup />
    </div>
  );
}
