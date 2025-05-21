
"use client";

import Image from 'next/image';

const partnersFullList = [
  { name: "IKEA", logoUrl: "https://www.ikea.com/global/assets/logos/brand/ikea.svg", dataAiHint: "company logo" },
  { name: "Roche Bobois", logoUrl: "https://placehold.co/150x60.png?text=Logo", dataAiHint: "company logo" },
  { name: "Kartell", logoUrl: "https://placehold.co/150x60.png?text=Logo", dataAiHint: "company logo" },
  { name: "Vitra", logoUrl: "https://placehold.co/150x60.png?text=Logo", dataAiHint: "company logo" },
  { name: "Herman Miller", logoUrl: "https://placehold.co/150x60.png?text=Logo", dataAiHint: "company logo" },
  { name: "Marjane", logoUrl: "https://talent-marjane.com/cvpmini-be/api/annonce-img/296", dataAiHint: "company logo" },
  { name: "App Store Partner", logoUrl: "https://play-lh.googleusercontent.com/tz1ySx3X4GXk-erElWv-lEeRBmPa68BwEFlffRNhWjPceC2TrfGXAoIHIsLpM_qZDO0", dataAiHint: "company logo" },
  { name: "Emploi.ma", logoUrl: "https://www.emploi.ma/sites/default/files/styles/medium/public/logo/photo-2022-08-03-09-29-46.jpg?itok=1C9yTP4w", dataAiHint: "company logo" },
];

const partnersToDisplay = partnersFullList.slice(0, 4); // Display only the first 4 partners

export default function PartnerLogos() {
  return (
    <section className="py-8 md:py-12 bg-muted/30 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
          Nos Marques Partenaires
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partnersToDisplay.map((partner) => (
            <div key={partner.name} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
              {/* The div containing the Image can also have fixed dimensions if needed for layout, but the Image component itself will enforce its own aspect ratio or object-fit behavior based on props */}
              <div style={{ width: '150px', height: '60px' }} className="relative"> {/* Added a wrapper div to strictly enforce container size if necessary, though next/image with width/height should suffice */}
                <Image
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  width={150} // Fixed width for the image rendering
                  height={60} // Fixed height for the image rendering
                  className="object-cover" // This ensures the image covers the 150x60 area, cropping if necessary
                  data-ai-hint={partner.dataAiHint}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
