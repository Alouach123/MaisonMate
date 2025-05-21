// src/components/layout/mounted-client-content.tsx
"use client";

import { useState, useEffect, type ReactNode } from 'react';

export default function MountedClientContent({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can return a minimal loader here if needed, but null is often best to avoid further hydration issues
    // For example: return <div className="app-loading-placeholder">Loading...</div>;
    return null; 
  }

  return <>{children}</>;
}
