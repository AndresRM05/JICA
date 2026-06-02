// /tests/unit/services/authService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, getAccessToken } from '@/services/authService';
import { PublicClientApplication } from '@azure/msal-browser';

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn().mockImplementation(() => ({
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    acquireTokenSilent: vi.fn(),
    getAllAccounts: vi.fn().mockReturnValue([]),
  })),
}));

describe('loginUser', () => {
  let msalInstance: PublicClientApplication;

  beforeEach(() => {
    msalInstance = new PublicClientApplication({} as any);
    vi.clearAllMocks();
  });

  it('debe llamar a loginRedirect al iniciar sesión', async () => {
    await loginUser(msalInstance);
    expect(msalInstance.loginRedirect).toHaveBeenCalled();
  });
});

describe('getAccessToken', () => {
  let msalInstance: PublicClientApplication;

  beforeEach(() => {
    msalInstance = new PublicClientApplication({} as any);
    vi.clearAllMocks();
  });

  it('debe retornar el accessToken si acquireTokenSilent es exitoso', async () => {
    (msalInstance.acquireTokenSilent as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      accessToken: 'mock-token-xyz',
    });

    const account = { localAccountId: 'abc123' } as any;
    const token = await getAccessToken(msalInstance, account);

    expect(token).toBe('mock-token-xyz');
  });

  it('debe propagar el error si acquireTokenSilent falla', async () => {
    (msalInstance.acquireTokenSilent as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('InteractionRequired')
    );

    const account = { localAccountId: 'abc123' } as any;
    await expect(getAccessToken(msalInstance, account)).rejects.toThrow('InteractionRequired');
  });
});