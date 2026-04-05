import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Deprecated - use UserProtectedRoute.tsx or AdminProtectedRoute.tsx instead
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

