import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utilities/ApiError.js';

const populateCart = (cart) =>
  Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price quantity image description isActive',
  });

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price quantity image description isActive',
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await populateCart(cart);
  }

  return cart;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found or unavailable');
  }
  if (product.quantity < quantity) {
    throw new ApiError(400, `Only ${product.quantity} items available`);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (product.quantity < newQty) {
      throw new ApiError(400, `Only ${product.quantity} items available`);
    }
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return populateCart(cart);
};

export const updateCartItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found or unavailable');
  }
  if (quantity > product.quantity) {
    throw new ApiError(400, `Only ${product.quantity} items available`);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Item not in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  return populateCart(cart);
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return populateCart(cart);
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return { items: [] };
  cart.items = [];
  await cart.save();
  return populateCart(cart);
};
