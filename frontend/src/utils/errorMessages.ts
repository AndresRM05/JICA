import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api.types';

export function getUserFriendlyErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const responseMessage = axiosError.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (responseMessage) {
    return responseMessage;
  }

  if (axiosError.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con el servidor local. Verifique que esté corriendo en http://localhost:3000.';
  }

  return 'Ocurrió un error inesperado. Intente nuevamente.';
}
