import { httpClient } from '@/services/httpClient';
import { unwrapApiData } from '@/services/apiUtils';
import type { AuthenticatedUser, LoginResponse, RegisterResponse } from '@/types/auth.types';
import type { LoginFormData } from '@/validations/loginSchema';
import type { RegisterFormData } from '@/validations/registerSchema';

interface AuthApiResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'investor' | 'business' | 'admin';
  investorId: string;
}

function mapAuthApiResponse(response: AuthApiResponse): LoginResponse {
  const user: AuthenticatedUser = {
    id: response.id,
    email: response.email,
    fullName: `${response.firstName} ${response.lastName}`,
    role: response.role,
    investorId: response.investorId,
  };

  return { user };
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const response = await httpClient.post<AuthApiResponse | { data: AuthApiResponse }>('/auth/login', data);
  return mapAuthApiResponse(unwrapApiData(response.data));
}

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
  const response = await httpClient.post<AuthApiResponse | { data: AuthApiResponse }>('/auth/register', data);
  return mapAuthApiResponse(unwrapApiData(response.data));
}
