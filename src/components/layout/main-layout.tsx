
"use client"; // Required for hooks like usePathname, useEffect, useRef

import Navbar from './navbar';
import Footer from './footer';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth';
const ADMIN_ACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const adminActivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isAdminAuth = typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_KEY) === 'true';

    // Clear any existing timer when path changes or if admin logs out elsewhere
    if (adminActivityTimerRef.current) {
      clearTimeout(adminActivityTimerRef.current);
      adminActivityTimerRef.current = null;
    }

    if (isAdminAuth && pathname !== '/admin') {
      // console.log(`Admin is on a non-admin page (${pathname}). Starting 5-min logout timer.`);
      adminActivityTimerRef.current = setTimeout(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
          // console.log('Admin inactivity timer expired. Logging out admin.');
          localStorage.removeItem(ADMIN_AUTH_KEY);
          // Optionally remove other admin-related local storage items if any
          toast({
            title: "Session Admin Expirée",
            description: "Vous avez été déconnecté automatiquement pour inactivité en dehors de la page admin.",
            variant: "default", // Changed from destructive to default for less alarm
          });
          // No need to router.push, other components should react to auth state.
          // If you have a global state for admin auth, update it here.
        }
      }, ADMIN_ACTIVITY_TIMEOUT);
    } else if (pathname === '/admin' && adminActivityTimerRef.current) {
      // If admin navigates back to /admin, clear the timer.
      // console.log('Admin returned to /admin page. Clearing inactivity timer.');
      clearTimeout(adminActivityTimerRef.current);
      adminActivityTimerRef.current = null;
    }

    // Cleanup function for when the component unmounts or before the effect runs again
    return () => {
      if (adminActivityTimerRef.current) {
        // console.log('Cleaning up admin inactivity timer.');
        clearTimeout(adminActivityTimerRef.current);
      }
    };
  }, [pathname]); // Rerun effect if pathname changes

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
