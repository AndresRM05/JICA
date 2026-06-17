import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const investorId = useAuthStore.getState().user?.investorId;

  if (investorId) {
    config.headers.set('x-investor-id', investorId);
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);
