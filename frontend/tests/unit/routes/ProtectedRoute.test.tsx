import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

function renderProtectedRoute(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<p>Login requerido</p>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <p>Dashboard privado</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.getState().clearSession();
    });
  });

  it('redirects unauthenticated users to login', () => {
    renderProtectedRoute();

    expect(screen.getByText('Login requerido')).toBeInTheDocument();
  });

  it('renders children when the user has an active session', () => {
    act(() => {
      useAuthStore.getState().setSession('test-token', {
        id: 'user-1',
        email: 'demo@jica.local',
        fullName: 'Demo Investor',
        role: 'investor',
      });
    });

    renderProtectedRoute();

    expect(screen.getByText('Dashboard privado')).toBeInTheDocument();
  });
});
