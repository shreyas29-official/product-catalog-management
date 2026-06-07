import { formatDate } from '../../utils/formatters';
import Button from '../ui/Button';

const typeIcons = {
  order_created: '🛒',
  order_approved: '✅',
  order_rejected: '❌',
  general: '📢',
};

export default function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
}) {
  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onMarkAllRead}>
          Mark all as read
        </Button>
      </div>
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className={`rounded-xl border p-4 transition-colors ${
            notif.isRead ? 'border-gray-200 bg-white' : 'border-primary-200 bg-primary-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{typeIcons[notif.type] || '📢'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-gray-900">{notif.title}</h4>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(notif.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
              <div className="mt-2 flex gap-2">
                {!notif.isRead && (
                  <Button variant="outline" size="sm" onClick={() => onMarkRead(notif._id)}>
                    Mark read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => onDelete(notif._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
