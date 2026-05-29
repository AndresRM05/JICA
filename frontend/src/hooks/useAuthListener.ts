// /src/hooks/useAuthListener.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/services/userService';

export function useAuthListener() {
  const { setFirebaseUser, clearSession } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener perfil del usuario (incluye role desde el backend)
        const profile = await getUserProfile(firebaseUser);
        setFirebaseUser(firebaseUser, profile);
      } else {
        clearSession();
      }
    });

    return () => unsubscribe();
  }, []);
}