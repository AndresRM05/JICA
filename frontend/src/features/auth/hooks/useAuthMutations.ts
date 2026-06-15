import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginInvestor, registerInvestor } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';
import type { LoginResponse, RegisterResponse } from '../types/auth.types';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';

export function useAuthMutations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const registerMutation = useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: registerInvestor,
    retry: 0,
    onSuccess: (data) => {
      setUser({
        uid: data.id,
        email: data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        role: data.role,
      });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      return;
    },
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: loginInvestor,
    retry: 0,
    onSuccess: (data) => {
      setUser({
        uid: data.id,
        email: data.email,
        fullName: `${data.firstName} ${data.lastName}`,
        role: data.role,
      });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      return;
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
}
