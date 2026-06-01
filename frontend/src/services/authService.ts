// /src/services/authService.ts
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { loginRequest, tokenRequest } from './msalConfig';
 
export async function loginUser(msalInstance: PublicClientApplication): Promise<void> {
  await msalInstance.loginRedirect(loginRequest);
}
 
export async function logoutUser(msalInstance: PublicClientApplication): Promise<void> {
  await msalInstance.logoutRedirect();
}
 
export async function getAccessToken(
  msalInstance: PublicClientApplication,
  account: AccountInfo
): Promise<string> {
  const response = await msalInstance.acquireTokenSilent({
    ...tokenRequest,
    account,
  });
  return response.accessToken;
}