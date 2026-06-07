// Socket events are handled in config/socket.js and emitted from services.
// Event reference:
// - notification-received: sent to specific user when a notification is created
// - order-created: sent to admins room when client places order
// - order-approved: sent to client and admins when order is approved
// - order-rejected: sent to client and admins when order is rejected

export const SOCKET_EVENTS = {
  NOTIFICATION_RECEIVED: 'notification-received',
  ORDER_CREATED: 'order-created',
  ORDER_APPROVED: 'order-approved',
  ORDER_REJECTED: 'order-rejected',
};
