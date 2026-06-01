// /src/hooks/useInactivityLogout.ts
import { useEffect, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { useAuthStore } from '@/store/authStore';
 
const INACTIVITY_LIMIT_MS = Number(import.meta.env.VITE_INACTIVITY_TIMEOUT_MS);
const TRACKED_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
 
export function useInactivityLogout() {
  const { instance } = useMsal();
  const { clearSession } = useAuthStore();
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
 
  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        clearSession();
        await instance.logoutRedirect();
      }, INACTIVITY_LIMIT_MS);
    };
 
    TRACKED_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
 
    return () => {
      if (timer.current) clearTimeout(timer.current);
      TRACKED_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [instance, clearSession]);
}const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos

// Eventos a escuchar: mousemove, keydown, click, scroll, touchstart
// Al cumplir el tiempo: logoutUser() + clearSession() + redirect '/login'
// Al desmontar: limpiar todos los listeners y el timer