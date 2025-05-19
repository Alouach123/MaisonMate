
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
  {
    imageSrc: "https://i.pinimg.com/736x/31/de/35/31de35d6177adac97be1df59b93e2f01.jpg",
    imageAlt: "Luxurious modern interior scene with elegant furniture",
    aiHint: "luxury interior",
    headline: "Experience Unrivaled Comfort.",
    subheadline: "Discover our exclusive collection of designer pieces, crafted for ultimate relaxation and contemporary style.",
    ctaText: "Explore Collection",
    ctaLink: "/products",
  },
  {
    imageSrc: "https://i.pinimg.com/736x/67/42/c9/6742c98b351f71342b092fc79fc41c9b.jpg",
    imageAlt: "Sophisticated modern living space with designer furniture",
    aiHint: "designer furniture",
    headline: "Sleep in Serene Luxury.",
    subheadline: "Transform your space into a sanctuary with our premium furniture and opulent collections.",
    ctaText: "Discover Designs",
    ctaLink: "/products",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1503602642458-232111409258?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Stylish wooden accent chair with woven details in a chic, minimalist interior",
    aiHint: "designer chair",
    headline: "Statement Pieces, Timeless Design.",
    subheadline: "Elevate your space with our iconic chairs, blending artistic form with exceptional comfort.",
    ctaText: "View Chairs",
    ctaLink: "/products?category=Chaises",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1615875605825-5eb9bb5d5083?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Grand dining table made of rich dark wood, set for a luxurious meal in a spacious room",
    aiHint: "luxury dining",
    headline: "Gather in Grandeur.",
    subheadline: "Host memorable moments with our exquisite dining tables, the centerpiece of every celebration.",
    ctaText: "Explore Tables",
    ctaLink: "/products?category=Tables",
  }
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 7000); 
    return () => clearTimeout(timer); 
  }, [currentIndex]);


  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <Image
          key={slide.imageSrc} 
          src={slide.imageSrc}
          alt={slide.imageAlt}
          fill
          priority={index === currentIndex} 
          className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          data-ai-hint={slide.aiHint}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent z-20"></div>
      
      <div className="absolute inset-0 flex items-center justify-center md:justify-start text-center md:text-left px-6 pt-24 pb-6 md:px-12 md:pt-32 md:pb-12 lg:px-16 lg:pt-40 lg:pb-16 z-30">
        <div className="max-w-lg md:max-w-xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight shadow-md">
            {currentSlide.headline}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed">
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-40 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-40 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
        {slides.map((_, slideIndex) => (
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
