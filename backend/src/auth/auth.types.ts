import type { Request } from 'express';

export type UserRole = 'investor' | 'business' | 'admin';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
  role?: UserRole;
  investorId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface AuthenticatedInvestorRequest extends Request {
  user: AuthenticatedUser & { investorId: string };
}
