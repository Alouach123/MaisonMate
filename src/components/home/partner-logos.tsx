
"use client";

import Image from 'next/image';

// Representing real partner brands using placehold.co for visual placeholders
const partners = [
  { name: "IKEA", logoUrl: "https://placehold.co/150x60.png?text=IKEA", dataAiHint: "company logo" },
  { name: "Roche Bobois", logoUrl: "https://placehold.co/150x60.png?text=Roche+Bobois", dataAiHint: "company logo" },
  { name: "Kartell", logoUrl: "https://placehold.co/150x60.png?text=Kartell", dataAiHint: "company logo" },
  { name: "Vitra", logoUrl: "https://placehold.co/150x60.png?text=Vitra", dataAiHint: "company logo" },
  { name: "Herman Miller", logoUrl: "https://placehold.co/150x60.png?text=Herman+Miller", dataAiHint: "company logo" },
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
