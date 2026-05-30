// /tests/unit/services/authService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, logoutUser } from '@/services/authService';
 
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
}));
 
import { signInWithEmailAndPassword } from 'firebase/auth';
 
describe('loginUser', () => {
  beforeEach(() => vi.clearAllMocks());
 
  it('debe llamar a signInWithEmailAndPassword con email y password', async () => {
    (signInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      user: { uid: 'abc123', email: 'test@jica.com' },
    });
 
    await loginUser('test@jica.com', 'Segura123!');
 
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@jica.com',
      'Segura123!'
    );
  });
 
  it('debe propagar el error si Firebase falla', async () => {
    (signInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('auth/user-not-found')
    );
 
    await expect(loginUser('noexiste@jica.com', 'pass')).rejects.toThrow('auth/user-not-found');
  });
});