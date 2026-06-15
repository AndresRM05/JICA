// /src/services/socketService.ts
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export async function connectSocket(token?: string): Promise<void> {
  if (!token) return;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
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