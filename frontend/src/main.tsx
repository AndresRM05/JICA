// /src/main.tsx
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@/services/msalConfig';
import * as Sentry from '@sentry/react';
 
const msalInstance = new PublicClientApplication(msalConfig);
 
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: import.meta.env.MODE !== 'development',
  environment: import.meta.env.MODE,
});
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);