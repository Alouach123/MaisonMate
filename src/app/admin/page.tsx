
"use client";

import { useState, useEffect, useCallback } from 'react';
import LoginForm from '@/components/admin/login-form';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { verifyPasswordAction } from './actions'; // Server action for password verification
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

const ADMIN_AUTH_KEY = 'maisonmate-admin-auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined); // undefined for initial loading state

  // Check localStorage for auth status on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  // Show loading state while checking localStorage
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
    return <LoginForm onLoginSuccess={handleLoginSuccess} verifyPasswordAction={verifyPasswordAction} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
