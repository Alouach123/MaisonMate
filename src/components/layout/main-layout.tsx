
import Navbar from './navbar';
import Footer from './footer';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-grow"> {/* Removed container mx-auto and padding classes */}
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
