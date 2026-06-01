// /src/hooks/useAuthListener.ts
import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth.types';
 
export function useAuthListener() {
  const { accounts, instance } = useMsal();
  const { setUser, clearSession } = useAuthStore();
 
  useEffect(() => {
    if (accounts.length === 0) {
      clearSession();
      return;
    }
 
    const account = accounts[0];
 
    // El rol viene en los App Roles del token de Entra ID
    const roles = account.idTokenClaims?.roles as UserRole[] | undefined;
    const role = roles?.[0] ?? null;
 
    if (!role) {
      clearSession();
      return;
    }
 
    setUser({
      uid: account.localAccountId,
      email: account.username,
      fullName: account.name ?? '',
      role,
    });
  }, [accounts]);
}