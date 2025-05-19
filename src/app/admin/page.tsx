
"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { useRouter } from 'next/navigation'; 
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
      setIsAuthenticated(false); 
      router.replace('/auth'); 
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    router.push('/auth'); 
  }, [router]);

  if (isAuthenticated === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20"> {/* Increased pt-8 to pt-20 */}
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
    return (
         <div className="flex items-center justify-center min-h-screen pt-20"> {/* Increased pt-8 to pt-20 */}
            <p>Redirection vers la page de connexion...</p>
         </div>
    );
  }

  return (
    <div className="pt-20"> {/* Increased pt-8 to pt-20 wrapper */}
      <AdminDashboard onLogout={handleLogout} />
    </div>
  );
}
