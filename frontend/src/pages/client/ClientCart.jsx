import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { clientLinks } from '../../config/navigation';
import { useCart } from '../../context/CartContext';
import * as orderService from '../../services/orderService';
import { getImageUrl } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function ClientCart() {
  const { cart, loading, cartTotal, fetchCart, updateQuantity, removeItem } = useCart();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      await orderService.placeOrder();
      await fetchCart();
      setMessage('Order placed successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/client/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <DashboardLayout links={clientLinks}><LoadingSpinner size="lg" className="py-20" /></DashboardLayout>;

  const items = cart.items?.filter((item) => item.product) || [];

  return (
    <DashboardLayout links={clientLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''} in cart</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {message && <Alert type="success" message={message} />}

        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">Your cart is empty</p>
            <Button className="mt-4" onClick={() => navigate('/client/products')}>Browse Products</Button>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-4">
                  {item.product.image && (
                    <img src={getImageUrl(item.product.image)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button size="sm" variant="outline"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</Button>
                  </div>
                  <p className="w-24 text-right font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <Button size="sm" variant="danger" onClick={() => removeItem(item.product._id)}>Remove</Button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t p-6">
              <p className="text-xl font-bold">Total: {formatCurrency(cartTotal)}</p>
              <Button loading={placing} onClick={handlePlaceOrder}>Place Order</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
