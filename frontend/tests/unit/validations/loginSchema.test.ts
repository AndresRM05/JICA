// /tests/unit/validations/loginSchema.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/validations/loginSchema';
 
describe('loginSchema', () => {
  it('debe ser válido con email y contraseña correctos', () => {
    const result = loginSchema.safeParse({ email: 'test@jica.com', password: 'Segura123!' });
    expect(result.success).toBe(true);
  });
 
  it('debe fallar si el email no tiene formato válido', () => {
    const result = loginSchema.safeParse({ email: 'no-es-email', password: 'Segura123!' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('email');
  });
 
  it('debe fallar si la contraseña tiene menos de 8 caracteres', () => {
    const result = loginSchema.safeParse({ email: 'test@jica.com', password: '123' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('password');
  });
});