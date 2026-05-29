// /src/store/authStore.ts
import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserRole } from '@/types/auth.types';

interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  emailVerified: boolean;
}

interface AuthState {
  firebaseUser: User | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setFirebaseUser: (firebaseUser: User | null, user: AuthenticatedUser | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setFirebaseUser: (firebaseUser, user) =>
    set({ firebaseUser, user, isAuthenticated: !!firebaseUser, isLoading: false }),
  clearSession: () =>
    set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false }),
}));