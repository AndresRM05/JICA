import { httpClient } from '@/services/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';
import type { LoginResponse, RegisterResponse } from '../types/auth.types';

export async function registerInvestor(
  request: RegisterFormData,
): Promise<RegisterResponse> {
  const response = await httpClient.post<ApiResponse<RegisterResponse>>(
    '/auth/register',
    request,
  );

  return response.data.data;
}

export async function loginInvestor(
  request: LoginFormData,
): Promise<LoginResponse> {
  const response = await httpClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    request,
  );

  return response.data.data;
}
