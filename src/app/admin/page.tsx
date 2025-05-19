
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
      setIsAuthenticated(false); // Explicitly set to false before redirecting
      router.replace('/auth'); 
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

  if (!isAuthenticated) {
    // This content might be briefly shown if redirection is not instantaneous.
    return (
         <div className="flex items-center justify-center min-h-screen">
            <p>Redirection vers la page de connexion...</p>
         </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
