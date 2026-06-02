// /src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { PublicClientApplication } from '@azure/msal-browser';
import { getAccessToken } from './authService';

let socket: Socket | null = null;

export async function connectSocket(msalInstance: PublicClientApplication): Promise<void> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return;
  const token = await getAccessToken(msalInstance, accounts[0]);
  if (!token) return;

  socket = io(import.meta.env.VITE_SOCKET_URL,  {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
}
 
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
 
export function getSocket(): Socket | null {
  return socket;
}