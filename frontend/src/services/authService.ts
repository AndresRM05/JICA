import { httpClient } from '@/services/httpClient';
import { unwrapApiData } from '@/services/apiUtils';
import type { AuthenticatedUser, LoginResponse, RegisterResponse } from '@/types/auth.types';
import type { LoginFormData } from '@/validations/loginSchema';
import type { RegisterFormData } from '@/validations/registerSchema';

interface BackendAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'investor' | 'business' | 'admin';
  investorId: string;
}

function mapBackendAuthResponse(response: BackendAuthResponse): LoginResponse {
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
  const response = await httpClient.post<BackendAuthResponse | { data: BackendAuthResponse }>('/auth/login', data);
  return mapBackendAuthResponse(unwrapApiData(response.data));
}

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
  const response = await httpClient.post<BackendAuthResponse | { data: BackendAuthResponse }>('/auth/register', data);
  return mapBackendAuthResponse(unwrapApiData(response.data));
}
