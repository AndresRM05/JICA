export type AuthTab = 'login' | 'register';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'investor';
  investorId?: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'investor';
  investorId?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'investor';
}

export type UserRole = 'investor' | 'business' | 'admin';

