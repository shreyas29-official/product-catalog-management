import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import OrderCard from '../../components/orders/OrderCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { adminLinks } from '../../config/navigation';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, order: null });
  const [rejectReason, setRejectReason] = useState('');
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [productStats, orderStats, ordersRes] = await Promise.all([
        productService.getProductStats(),
        orderService.getOrderStats(),
        orderService.getOrders({ status: 'PENDING', limit: 5 }),
      ]);
      setStats({ products: productStats.data.data, orders: orderStats.data.data });
      setRecentOrders(ordersRes.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchData();
    socket.on('order-created', refresh);
    socket.on('order-approved', refresh);
    socket.on('order-rejected', refresh);
    return () => {
      socket.off('order-created', refresh);
      socket.off('order-approved', refresh);
      socket.off('order-rejected', refresh);
    };
  }, [socket]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    setError('');
    try {
      await orderService.approveOrder(id);
      setSuccess('Order approved successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async () => {
    try {
      await orderService.rejectOrder(rejectModal.order._id, rejectReason);
      setSuccess('Order rejected');
      setRejectModal({ open: false, order: null });
      setRejectReason('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed');
    }
  };

  if (loading) return <DashboardLayout links={adminLinks}><LoadingSpinner size="lg" className="py-20" /></DashboardLayout>;

  return (
    <DashboardLayout links={adminLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of your store and orders</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard title="Total Products" value={stats?.products?.total || 0} color="primary"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
          <StatCard title="Total Orders" value={stats?.orders?.total || 0} color="purple"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
          <StatCard title="Pending" value={stats?.orders?.pending || 0} color="yellow" />
          <StatCard title="Approved" value={stats?.orders?.approved || 0} color="green" />
          <StatCard title="Rejected" value={stats?.orders?.rejected || 0} color="red" />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No pending orders
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recentOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isAdmin
                  approvingId={approvingId}
                  onApprove={handleApprove}
                  onReject={(o) => setRejectModal({ open: true, order: o })}
                />
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={rejectModal.open}
          onClose={() => setRejectModal({ open: false, order: null })}
          title="Reject Order"
        >
          <div className="space-y-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModal({ open: false, order: null })}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReject}>Reject Order</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
