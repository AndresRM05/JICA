// /src/services/httpClient.ts
import axios, { AxiosError } from 'axios';
import { firebaseAuth } from '@/services/firebase';
import type { ApiError } from '@/types/api.types';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalizedError: ApiError = {
      statusCode: error.response?.status ?? 0,
      code: getErrorCode(error),
      message: getErrorMessage(error),
      fieldErrors: getFieldErrors(error),
    };

    return Promise.reject(normalizedError);
  }
);

function getErrorCode(error: AxiosError): string {
  if (!error.response) {
    return 'NETWORK_ERROR';
  }

  const status = error.response.status;

  if (status === 400) return 'VALIDATION_ERROR';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'INTERNAL_ERROR';

  return 'UNKNOWN_ERROR';
}

function getErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data as Partial<ApiError> | undefined;

  return responseData?.message ?? 'Ocurrió un error al procesar la solicitud.';
}

function getFieldErrors(error: AxiosError): Record<string, string> | undefined {
  const responseData = error.response?.data as Partial<ApiError> | undefined;

  return responseData?.fieldErrors;
}