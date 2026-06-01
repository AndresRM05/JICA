// /src/services/msalConfig.ts
import { Configuration, LogLevel } from '@azure/msal-browser';
 
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    postLogoutRedirectUri: '/login',
  },
  cache: {
    cacheLocation: 'sessionStorage', // sessionStorage por seguridad; no usar localStorage
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (import.meta.env.MODE === 'development') console.log(message);
      },
      logLevel: LogLevel.Warning,
    },
  },
};
 
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', import.meta.env.VITE_AZURE_API_SCOPE],
};
 
export const tokenRequest = {
  scopes: [import.meta.env.VITE_AZURE_API_SCOPE],
};