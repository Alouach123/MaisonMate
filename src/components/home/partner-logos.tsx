
"use client";

import Image from 'next/image';

const partnersFullList = [
  { name: "IKEA", logoUrl: "https://static.dezeen.com/uploads/2019/04/ikea-logo-new-hero-1.jpg", dataAiHint: "company logo" },
  { name: "Herman Miller", logoUrl: "https://imjustcreative.com/wp-content/uploads/2019/06/Herman-MIller-Logo-Design.jpg", dataAiHint: "company logo" },
  { name: "JYSK", logoUrl: "https://jyskblueline.com/sites/default/files/inline-files/logo-JYSK-jpg.jpg", dataAiHint: "company logo" },
  { name: "Kinnarps", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Kinnarps_logo.svg/2560px-Kinnarps_logo.svg.png", dataAiHint: "company logo" },
  { name: "Höffner", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/H%C3%B6ffner.svg/2560px-H%C3%B6ffner.svg.png", dataAiHint: "company logo" },
];

// Displaying all 5 provided partners
const partnersToDisplay = partnersFullList.slice(0, 5); 

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
              <div style={{ width: '150px', height: '60px' }} className="relative"> 
                <Image
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  width={150} 
                  height={60} 
                  className="object-cover" 
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
