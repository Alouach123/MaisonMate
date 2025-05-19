
"use client";

import Image from 'next/image';

// Placeholder partner logos (replace with actual logos and links)
const partners = [
  { name: "BrandA", logoUrl: "https://placehold.co/150x60.png?text=Marque+A", dataAiHint: "company logo" },
  { name: "BrandB", logoUrl: "https://placehold.co/150x60.png?text=Marque+B", dataAiHint: "company logo" },
  { name: "BrandC", logoUrl: "https://placehold.co/150x60.png?text=Marque+C", dataAiHint: "company logo" },
  { name: "BrandD", logoUrl: "https://placehold.co/150x60.png?text=Marque+D", dataAiHint: "company logo" },
  { name: "BrandE", logoUrl: "https://placehold.co/150x60.png?text=Marque+E", dataAiHint: "company logo" },
];

export default function PartnerLogos() {
  return (
    <section className="py-8 md:py-12 bg-muted/30 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
          Nos Marques Partenaires
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div key={partner.name} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={150}
                height={60}
                className="object-contain"
                data-ai-hint={partner.dataAiHint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
