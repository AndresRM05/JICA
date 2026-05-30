// /src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { getIdToken } from './authService';
 
let socket: Socket | null = null;
 
export async function connectSocket(): Promise<void> {
  const token = await getIdToken();
  if (!token) return;
 
  socket = io(import.meta.env.VITE_API_BASE_URL, {
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