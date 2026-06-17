import { create } from 'zustand';
import type { AuthenticatedUser } from '@/types/auth.types';

const AUTH_STORAGE_KEY = 'jica:auth_user';

interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthenticatedUser) => void;
  clearSession: () => void;
}

function getStoredUser(): AuthenticatedUser | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthenticatedUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser?.investorId),
  setSession: (user) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));
