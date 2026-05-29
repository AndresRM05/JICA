export type UserRole = 'investor' | 'business' | 'admin';
 
export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  emailVerified: boolean;
}