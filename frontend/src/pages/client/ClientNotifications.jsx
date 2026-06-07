import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationList from '../../components/notifications/NotificationList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { clientLinks } from '../../config/navigation';
import * as notificationService from '../../services/notificationService';
import { useSocket } from '../../context/SocketContext';

export default function ClientNotifications() {
  const { notifications, unreadCount, setInitialNotifications, markNotificationRead, markAllRead } = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationService.getNotifications({ limit: 50 });
        setInitialNotifications(data.data.notifications, data.data.unreadCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [setInitialNotifications]);

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    markNotificationRead(id);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    markAllRead();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    const { data } = await notificationService.getNotifications({ limit: 50 });
    setInitialNotifications(data.data.notifications, data.data.unreadCount);
  };

  if (loading) return <DashboardLayout links={clientLinks}><LoadingSpinner size="lg" className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout links={clientLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <NotificationList
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
