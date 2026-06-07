import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import ApiError from '../utilities/ApiError.js';
import { createNotification } from './notificationService.js';
import { getIO } from '../config/socket.js';

export const placeOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      throw new ApiError(400, `Product "${product?.name || 'Unknown'}" is no longer available`);
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.name}". Available: ${product.quantity}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    status: 'PENDING',
  });

  cart.items = [];
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'name email')
    .populate('items.product', 'name price image');

  const admins = await User.find({ role: 'admin' }).select('_id');
  const client = await User.findById(userId);

  for (const admin of admins) {
    await createNotification({
      receiver: admin._id,
      title: 'New Purchase Request',
      message: `${client.name} placed a new order (#${order._id.toString().slice(-6)}) for $${totalAmount.toFixed(2)}`,
      type: 'order_created',
      relatedOrder: order._id,
    });
  }

  try {
    const io = getIO();
    io.to('admins').emit('order-created', { order: populatedOrder });
  } catch (error) {
    console.error('Socket emit failed:', error.message);
  }

  return populatedOrder;
};

export const getOrders = async ({
  userId,
  role,
  status,
  page = 1,
  limit = 10,
} = {}) => {
  const query = {};
  if (role === 'client') query.user = userId;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getOrderById = async (orderId, userId, role) => {
  const query = { _id: orderId };
  if (role === 'client') query.user = userId;

  const order = await Order.findOne(query)
    .populate('user', 'name email')
    .populate('items.product', 'name price image description');

  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

export const approveOrder = async (orderId, adminId) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'PENDING') {
    throw new ApiError(400, `Order is already ${order.status}`);
  }

  for (const item of order.items) {
    const productId = item.product?._id || item.product;
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(400, `Product not found for order item`);
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.name}"`);
    }
    product.quantity -= item.quantity;
    await product.save();
  }

  order.status = 'APPROVED';
  await order.save();

  await createNotification({
    receiver: order.user._id,
    title: 'Order Approved',
    message: `Your order #${order._id.toString().slice(-6)} has been approved! Total: $${order.totalAmount.toFixed(2)}`,
    type: 'order_approved',
    relatedOrder: order._id,
  });

  try {
    const io = getIO();
    io.to(order.user._id.toString()).emit('order-approved', { order });
    io.to('admins').emit('order-approved', { order });
  } catch (error) {
    console.error('Socket emit failed:', error.message);
  }

  return order;
};

export const rejectOrder = async (orderId, adminId, rejectionReason = '') => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'PENDING') {
    throw new ApiError(400, `Order is already ${order.status}`);
  }

  order.status = 'REJECTED';
  order.rejectionReason = rejectionReason || 'Order rejected by admin';
  await order.save();

  await createNotification({
    receiver: order.user._id,
    title: 'Order Rejected',
    message: `Your order #${order._id.toString().slice(-6)} was rejected. Reason: ${order.rejectionReason}`,
    type: 'order_rejected',
    relatedOrder: order._id,
  });

  try {
    const io = getIO();
    io.to(order.user._id.toString()).emit('order-rejected', { order });
    io.to('admins').emit('order-rejected', { order });
  } catch (error) {
    console.error('Socket emit failed:', error.message);
  }

  return order;
};

export const getOrderStats = async (adminId) => {
  const [total, pending, approved, rejected] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'PENDING' }),
    Order.countDocuments({ status: 'APPROVED' }),
    Order.countDocuments({ status: 'REJECTED' }),
  ]);
  return { total, pending, approved, rejected };
};
