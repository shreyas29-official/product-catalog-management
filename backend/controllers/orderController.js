import * as orderService from '../services/orderService.js';
import catchAsync from '../utilities/catchAsync.js';

export const placeOrder = catchAsync(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id);
  res.status(201).json({ success: true, data: order });
});

export const getOrders = catchAsync(async (req, res) => {
  const result = await orderService.getOrders({
    userId: req.user._id,
    role: req.user.role,
    ...req.query,
  });
  res.json({ success: true, data: result });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  res.json({ success: true, data: order });
});

export const approveOrder = catchAsync(async (req, res) => {
  const order = await orderService.approveOrder(req.params.id, req.user._id);
  res.json({ success: true, data: order });
});

export const rejectOrder = catchAsync(async (req, res) => {
  const order = await orderService.rejectOrder(
    req.params.id,
    req.user._id,
    req.body.rejectionReason
  );
  res.json({ success: true, data: order });
});

export const getOrderStats = catchAsync(async (req, res) => {
  const stats = await orderService.getOrderStats(req.user._id);
  res.json({ success: true, data: stats });
});
