import { httpClient } from '@/services/httpClient';
import { unwrapApiData } from '@/services/apiUtils';
import type { LoginResponse, AuthenticatedUser } from '@/types/auth.types';
import type { LoginFormData } from '@/validations/loginSchema';
import type { RegisterFormData } from '@/validations/registerSchema';

interface BackendAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'investor' | 'business' | 'admin';
  investorId?: string;
  accessToken?: string;
  user?: AuthenticatedUser;
}

function mapBackendAuthResponse(response: BackendAuthResponse): LoginResponse {
  if (response.user && response.accessToken) {
    return {
      accessToken: response.accessToken,
      user: response.user,
    };
  }

  return {
    accessToken: response.accessToken ?? 'local-mvp-token',
    user: {
      id: response.id,
      email: response.email,
      fullName: `${response.firstName} ${response.lastName}`,
      role: response.role,
      investorId: response.investorId,
    },
  };
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const response = await httpClient.post<BackendAuthResponse | { data: BackendAuthResponse }>('/auth/login', data);
  return mapBackendAuthResponse(unwrapApiData(response.data));
}

export async function registerUser(data: RegisterFormData): Promise<LoginResponse> {
  const response = await httpClient.post<BackendAuthResponse | { data: BackendAuthResponse }>('/auth/register', data);
  return mapBackendAuthResponse(unwrapApiData(response.data));
}
