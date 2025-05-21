
// src/components/home/hero-slideshow.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const slidesData = [
  {
    imageSrc: "https://i.pinimg.com/736x/31/de/35/31de35d6177adac97be1df59b93e2f01.jpg",
    imageAlt: "Comfortable sectional sofa with a lit candle on a round coffee table",
    aiHint: "cozy sofa",
    headline: "Cozy Corners, Lasting Comfort.",
    subheadline: "Find the perfect sectional sofa to create inviting spaces for relaxation and gatherings.",
    ctaText: "View Sectionals",
    ctaLink: "/products?category=Canapés",
  },
  {
    imageSrc: "https://i.pinimg.com/736x/67/42/c9/6742c98b351f71342b092fc79fc41c9b.jpg",
    imageAlt: "Stylishly arranged room featuring a comfortable couch and accent table",
    aiHint: "living room",
    headline: "Curated Living Spaces.",
    subheadline: "Discover furniture collections that bring harmony and style to every room.",
    ctaText: "Inspire Your Home",
    ctaLink: "/products",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=85&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Modern living room with a stylish blue sofa",
    aiHint: "modern sofa",
    headline: "Elevate Your Living Space.",
    subheadline: "Discover sophisticated designs that blend comfort and elegance seamlessly.",
    ctaText: "Explore Furniture",
    ctaLink: "/products?category=Canapés",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=85&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Cozy bedroom with a well-made bed and warm lighting",
    aiHint: "cozy bedroom",
    headline: "Dream in Style.",
    subheadline: "Create your perfect sanctuary with our collection of luxurious beds and bedroom essentials.",
    ctaText: "Shop Bedroom",
    ctaLink: "/products?category=Lits",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Bright dining area with a wooden table and modern chairs",
    aiHint: "dining room",
    headline: "Gather Around Beauty.",
    subheadline: "From intimate dinners to grand feasts, find the perfect dining set for every occasion.",
    ctaText: "Discover Dining",
    ctaLink: "/products?category=Tables",
  },
];


export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  useEffect(() => {
    const timer = setTimeout(goToNext, 7000); 
    return () => clearTimeout(timer); 
  }, [currentIndex, goToNext]);

  const currentSlide = slidesData[currentIndex];

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {slidesData.map((slide, index) => (
        <Image
          key={slide.imageSrc + index}
          src={slide.imageSrc}
          alt={slide.imageAlt}
          fill
          priority={index === 0} 
          className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
          data-ai-hint={slide.aiHint}
          quality={85}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent z-10"></div>
      
      <div className="absolute inset-0 flex items-center justify-start text-left z-20">
        <div className="max-w-lg md:max-w-xl space-y-6 container mx-auto px-6 sm:px-8 md:pl-12 lg:pl-16 xl:pl-24 pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            {currentSlide.headline}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed drop-shadow-sm">
            {currentSlide.subheadline}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group text-base px-8 py-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href={currentSlide.ctaLink}>
              {currentSlide.ctaText}
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slidesData.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-3 w-3 md:h-3.5 md:w-3.5 rounded-full transition-all duration-300 ease-in-out
                        ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
