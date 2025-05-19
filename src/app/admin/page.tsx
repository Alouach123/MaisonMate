
"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { Skeleton } from '@/components/ui/skeleton'; 

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      // If not authenticated, redirect to the new auth page for admin login
      router.replace('/auth'); 
      //setIsAuthenticated(false); // Not strictly needed as redirect will happen
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    router.push('/auth'); // Redirect to auth page on logout
  }, [router]);

  if (isAuthenticated === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 p-8 rounded-lg shadow-xl bg-card w-full max-w-md">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // If isAuthenticated is false (shouldn't happen if redirect works, but as a fallback)
  // or if redirection is in progress, this condition might briefly be met.
  // The main gatekeeping is now the redirect.
  if (!isAuthenticated) {
    // This content won't be shown if redirection is successful and quick.
    // It acts as a fallback or if the redirect hasn't completed yet.
    return (
         <div className="flex items-center justify-center min-h-screen">
            <p>Redirection vers la page de connexion...</p>
         </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
