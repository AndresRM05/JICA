import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { InvestmentDetailsPage } from '@/pages/InvestmentDetailsPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
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
