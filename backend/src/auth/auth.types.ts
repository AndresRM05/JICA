// /backend/src/auth/auth.types.ts
export type UserRole = 'investor' | 'business' | 'admin';
 
export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
}