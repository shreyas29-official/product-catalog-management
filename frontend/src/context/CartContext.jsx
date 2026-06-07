import { createContext, useContext, useState, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'client') return;
    setLoading(true);
    try {
      const { data } = await cartService.getCart();
      setCart(data.data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await cartService.addToCart(productId, quantity);
    setCart(data.data);
    return data.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await cartService.updateCartItem(productId, quantity);
    setCart(data.data);
    return data.data;
  };

  const removeItem = async (productId) => {
    const { data } = await cartService.removeFromCart(productId);
    setCart(data.data);
    return data.data;
  };

  const clearCart = async () => {
    const { data } = await cartService.clearCart();
    setCart(data.data);
    return data.data;
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal =
    cart.items?.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
