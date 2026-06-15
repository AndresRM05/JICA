// /src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/auth.types';
 
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}
 
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
 
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
 
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
 
  return <>{children}</>;
}