import * as cartService from '../services/cartService.js';
import catchAsync from '../utilities/catchAsync.js';

export const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.json({ success: true, data: cart });
});

export const addToCart = catchAsync(async (req, res) => {
  const cart = await cartService.addToCart(
    req.user._id,
    req.body.productId,
    req.body.quantity || 1
  );
  res.json({ success: true, data: cart });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const cart = await cartService.updateCartItem(
    req.user._id,
    req.params.productId,
    req.body.quantity
  );
  res.json({ success: true, data: cart });
});

export const removeFromCart = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
  res.json({ success: true, data: cart });
});

export const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json({ success: true, data: cart });
});
