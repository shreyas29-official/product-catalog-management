import api from './api';

export const placeOrder = () => api.post('/orders');
export const getOrders = (params) => api.get('/orders', { params });
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const approveOrder = (id) => api.patch(`/orders/${id}/approve`);
export const rejectOrder = (id, rejectionReason) =>
  api.patch(`/orders/${id}/reject`, { rejectionReason });
export const getOrderStats = () => api.get('/orders/stats');
