import { create } from 'zustand';
import type { AuthenticatedUser } from '@/types/auth.types';

interface AuthState {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, user: AuthenticatedUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setSession: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
  clearSession: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));
