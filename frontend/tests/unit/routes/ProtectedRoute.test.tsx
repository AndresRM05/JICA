// /tests/unit/routes/ProtectedRoute.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
 
vi.mock('@/store/authStore');
 
describe('ProtectedRoute', () => {
  it('debe redirigir a /login si el usuario no está autenticado', () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
 
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
 
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });
 
  it('debe renderizar los children si el usuario está autenticado con el rol correcto', () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'investor' },
    });
 
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['investor']}>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
 
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});