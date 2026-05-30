import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// /src/main.tsx
import * as Sentry from '@sentry/react';
 
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: import.meta.env.MODE !== 'development',
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2, // capturar 20% de transacciones para performance
  beforeSend(event) {
    // Nunca enviar datos sensibles a Sentry
    delete event.user?.email;
    return event;
  },
});