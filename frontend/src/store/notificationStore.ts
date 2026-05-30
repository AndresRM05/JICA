// /src/store/notificationStore.ts
interface Notification {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
  read: boolean;
  createdAt: Date;
}
 
interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}