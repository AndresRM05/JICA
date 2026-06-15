// /src/hooks/useAuthListener.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
 
export function useAuthListener() {
  const { user, clearSession } = useAuthStore();
 
  useEffect(() => {
    if (!user) {
      clearSession();
    }
  }, [user, clearSession]);
}
