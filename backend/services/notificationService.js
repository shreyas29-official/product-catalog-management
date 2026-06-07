import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';

export const createNotification = async ({ receiver, title, message, type = 'general', relatedOrder = null }) => {
  const notification = await Notification.create({
    receiver,
    title,
    message,
    type,
    relatedOrder,
  });

  try {
    const io = getIO();
    io.to(receiver.toString()).emit('notification-received', {
      notification: await notification.populate('relatedOrder'),
    });
  } catch (error) {
    console.error('Socket emit failed:', error.message);
  }

  return notification;
};

export const getNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const query = { receiver: userId };
  if (unreadOnly) query.isRead = false;

  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedOrder'),
    Notification.countDocuments(query),
    Notification.countDocuments({ receiver: userId, isRead: false }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    unreadCount,
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, receiver: userId },
    { isRead: true },
    { new: true }
  );
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ receiver: userId, isRead: false }, { isRead: true });
};

export const deleteNotification = async (notificationId, userId) => {
  return Notification.findOneAndDelete({ _id: notificationId, receiver: userId });
};
