// /src/routes/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';
 
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const InvestmentDetailsPage = lazy(() => import('@/pages/InvestmentDetailsPage'));
const SimulationPage = lazy(() => import('@/pages/SimulationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
 
export function AppRouter() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/investments/:id" element={<InvestmentDetailsPage />} />
        <Route path="/simulate" element={<SimulationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}