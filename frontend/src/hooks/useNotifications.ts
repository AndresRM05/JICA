// /src/hooks/useNotifications.ts
import { useEffect } from 'react';
import { getSocket } from '@/services/socketService';
import { useNotificationStore } from '@/store/notificationStore';
 
export function useNotifications() {
  const { addNotification } = useNotificationStore();
 
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
 
    socket.on('investment:confirmed', (data) => {
      addNotification({ type: 'success', message: 'Tu inversión fue confirmada', data });
    });
 
    socket.on('project:funded', (data) => {
      addNotification({ type: 'info', message: 'Un proyecto alcanzó su meta', data });
    });
 
    socket.on('business:approved', (data) => {
      addNotification({ type: 'success', message: 'Tu negocio fue aprobado', data });
    });
 
    socket.on('business:rejected', (data) => {
      addNotification({ type: 'error', message: 'Tu negocio fue rechazado', data });
    });
 
    return () => {
      socket.off('investment:confirmed');
      socket.off('project:funded');
      socket.off('business:approved');
      socket.off('business:rejected');
    };
  }, []);
}