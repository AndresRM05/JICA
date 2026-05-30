// /src/utils/errorMessages.ts
// Mapeo de códigos de error del backend a mensajes para el usuario
 
export const ERROR_MESSAGES: Record<string, string> = {
  'INVESTMENT_LIMIT_EXCEEDED': 'Has alcanzado el límite de inversión permitido.',
  'BUSINESS_NOT_APPROVED': 'Este negocio aún no ha sido aprobado por el equipo de JICA.',
  'INSUFFICIENT_FUNDS': 'El monto ingresado supera el disponible en tu perfil.',
  'DEFAULT': 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
};
 
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES['DEFAULT'];
}