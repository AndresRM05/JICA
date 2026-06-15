// /src/store/authStore.ts
import { create } from 'zustand';
import type { UserRole } from '@/types/auth.types';
 
export interface AuthenticatedUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
}
 
interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthenticatedUser) => void;
  clearSession: () => void;
}
 
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}));
