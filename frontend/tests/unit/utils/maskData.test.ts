// /tests/unit/utils/maskData.test.ts
import { describe, it, expect } from 'vitest';
import { maskId, maskEmail, maskAccountNumber } from '@/utils/maskData';
 
describe('maskId', () => {
  it('debe ocultar todos los dígitos excepto los últimos 4', () => {
    expect(maskId('123456789')).toBe('***-***-6789');
  });
 
  it('debe retornar string vacío si recibe string vacío', () => {
    expect(maskId('')).toBe('');
  });
});
 
describe('maskEmail', () => {
  it('debe mostrar solo los primeros 2 caracteres del local y el dominio completo', () => {
    expect(maskEmail('juan@gmail.com')).toBe('ju***@gmail.com');
  });
});