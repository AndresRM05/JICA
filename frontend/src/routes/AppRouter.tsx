import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage, RegisterPage } from '@/features/auth';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { InvestmentDetailsPage } from '@/pages/InvestmentDetailsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SimulationPage } from '@/pages/SimulationPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities/:opportunityId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InvestmentDetailsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities/:opportunityId/simulate"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SimulationPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulations/:simulationId/confirmation"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ConfirmationPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
