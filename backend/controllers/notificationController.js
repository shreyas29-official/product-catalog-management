import * as notificationService from '../services/notificationService.js';
import catchAsync from '../utilities/catchAsync.js';

export const getNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.getNotifications(req.user._id, req.query);
  res.json({ success: true, data: result });
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user._id
  );
  res.json({ success: true, data: notification });
});

export const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

export const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  res.json({ success: true, message: 'Notification deleted' });
});
