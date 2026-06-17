export type UserRole = 'investor' | 'business' | 'admin';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  investorId: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
}

export type RegisterResponse = LoginResponse;
