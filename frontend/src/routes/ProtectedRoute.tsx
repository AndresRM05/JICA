// /src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth.types';
 
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}
 
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const { user } = useAuthStore();
 
  if (!isAuthenticated) return <Navigate to="/login" replace />;
 
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
 
  return <>{children}</>;
}