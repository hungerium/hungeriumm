import { useState, useCallback } from 'react';
import Notification from '../components/Notification';

export default function useNotification() {
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, duration }
    ]);
    
    return id;
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const notificationElements = notifications.map(notification => (
    <Notification
      key={notification.id}
      message={notification.message}
      type={notification.type}
      duration={notification.duration}
      onClose={() => removeNotification(notification.id)}
    />
  ));
  
  return {
    showNotification,
    removeNotification,
    notificationElements
  };
}
