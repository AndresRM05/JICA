import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginFormData } from '@/validations/loginSchema';
import type { RegisterFormData } from '@/validations/registerSchema';

export function useAuthMutations() {
  const setSession = useAuthStore((state) => state.setSession);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => loginUser(data),
    retry: 0,
    onSuccess: (response) => {
      setSession(response.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    retry: 0,
    onSuccess: (response) => {
      setSession(response.user);
    },
  });

  return { loginMutation, registerMutation };
}
