// /src/utils/errorMessages.ts
// Mapeo de códigos de error del backend y frontend a mensajes para el usuario

import type { ApiError } from '@/types/api.types';

export const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'No se pudo conectar con el servidor. Intente nuevamente.',
  UNAUTHORIZED: 'Su sesión expiró. Inicie sesión nuevamente.',
  FORBIDDEN: 'No tienes permiso para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Revise los datos ingresados e intente nuevamente.',
  INTERNAL_ERROR: 'Ocurrió un error inesperado. Intente más tarde.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Intente nuevamente.',

  INVESTMENT_LIMIT_EXCEEDED: 'Has alcanzado el límite de inversión permitido.',
  BUSINESS_NOT_APPROVED: 'Este negocio aún no ha sido aprobado por el equipo de JICA.',
  INSUFFICIENT_FUNDS: 'El monto ingresado supera el disponible en tu perfil.',

  DEFAULT: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.DEFAULT;
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = error as Partial<ApiError>;

  if (apiError.code) {
    return getErrorMessage(apiError.code);
  }

  if (apiError.statusCode === 400) return ERROR_MESSAGES.VALIDATION_ERROR;
  if (apiError.statusCode === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (apiError.statusCode === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (apiError.statusCode === 404) return ERROR_MESSAGES.NOT_FOUND;

  if (apiError.statusCode && apiError.statusCode >= 500) {
    return ERROR_MESSAGES.INTERNAL_ERROR;
  }

  return ERROR_MESSAGES.DEFAULT;
}