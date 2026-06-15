import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
 
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
 
httpClient.interceptors.request.use(async (config) => {
  // En MVP local, no hay token JWT. Se puede añadir cuando el backend lo implemente.
  return config;
});
 
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);