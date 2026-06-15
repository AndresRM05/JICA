// /src/routes/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';
 
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage'));
 
export function AppRouter() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
}
