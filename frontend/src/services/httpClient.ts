import axios from 'axios';
import { msalInstance } from '@/main';
import { useAuthStore } from '@/store/authStore';
import { getAccessToken } from './authService';
 
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
 
httpClient.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const token = await getAccessToken(msalInstance, accounts[0]);
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
 
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      await msalInstance.logoutRedirect();
    }
    return Promise.reject(error);
  }
);