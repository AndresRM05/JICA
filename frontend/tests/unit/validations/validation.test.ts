import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/validations/loginSchema';
import { simulationSchema } from '@/validations/simulationSchema';

describe('frontend validations', () => {
  it('accepts valid demo login credentials', () => {
    const result = loginSchema.safeParse({ email: 'demo@jica.local', password: 'Demo12345' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty simulation amount', () => {
    const result = simulationSchema.safeParse({ amount: 0 });
    expect(result.success).toBe(false);
  });
});
