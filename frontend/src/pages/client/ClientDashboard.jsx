import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductCard from '../../components/products/ProductCard';
import OrderCard from '../../components/orders/OrderCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { clientLinks } from '../../config/navigation';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { useSocket } from '../../context/SocketContext';

export default function ClientDashboard() {
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { addToCart, fetchCart } = useCart();
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productService.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }),
        orderService.getOrders({ limit: 3 }),
      ]);
      setProducts(productsRes.data.data.products);
      setRecentOrders(ordersRes.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchData();
  }, [fetchCart]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchData();
    socket.on('order-approved', refresh);
    socket.on('order-rejected', refresh);
    return () => {
      socket.off('order-approved', refresh);
      socket.off('order-rejected', refresh);
    };
  }, [socket]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <DashboardLayout links={clientLinks}><LoadingSpinner size="lg" className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout links={clientLinks}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-500">Browse products and track your orders</p>
        </div>

        {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
            <Link to="/client/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/client/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No orders yet. Start shopping!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
