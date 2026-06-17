import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { setupAuthInterceptor } from '@/services/httpClient';
import { useAuthStore } from '@/store/authStore';
import '@/styles/global.css';

setupAuthInterceptor({
  getInvestorId: () => useAuthStore.getState().user?.investorId,
  onUnauthorized: () => useAuthStore.getState().clearSession(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
