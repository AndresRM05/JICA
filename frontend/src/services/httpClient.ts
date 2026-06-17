import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AuthInterceptorConfig {
  getInvestorId: () => string | undefined;
  onUnauthorized?: () => void;
}

const authInterceptorConfig: AuthInterceptorConfig = {
  getInvestorId: () => undefined,
};

export function setupAuthInterceptor(config: AuthInterceptorConfig) {
  authInterceptorConfig.getInvestorId = config.getInvestorId;
  authInterceptorConfig.onUnauthorized = config.onUnauthorized;
}

httpClient.interceptors.request.use((config) => {
  const investorId = authInterceptorConfig.getInvestorId();

  if (investorId) {
    config.headers.set('x-investor-id', investorId);
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authInterceptorConfig.onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
