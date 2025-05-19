
"use client";

import WelcomeHero from '@/components/layout/welcome-hero';
// Product listing and filtering components are removed from the homepage

export default function HomePage() {
  // The state and logic for product filtering are moved to /products/page.tsx
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <WelcomeHero />
      {/* 
        You can add other sections here for the homepage, like:
        - New Arrivals
        - Special Promotions
        - Featured Categories
        - Blog Posts / Articles
      */}
    </div>
  );
}
