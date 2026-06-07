import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OrderCard from '../../components/orders/OrderCard';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { clientLinks } from '../../config/navigation';
import * as orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getImageUrl } from '../../services/api';

export default function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const { socket } = useSocket();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status) params.status = status;
      const { data } = await orderService.getOrders(params);
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [status, page]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchOrders();
    socket.on('order-approved', refresh);
    socket.on('order-rejected', refresh);
    return () => {
      socket.off('order-approved', refresh);
      socket.off('order-rejected', refresh);
    };
  }, [socket, status, page]);

  return (
    <DashboardLayout links={clientLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">Track your order history and status</p>
        </div>

        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          className="max-w-xs" />

        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : orders.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">No orders yet</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} onView={setViewOrder} />
            ))}
          </div>
        )}

        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />

        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title="Order Details" size="lg">
          {viewOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order #{viewOrder._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{formatDate(viewOrder.createdAt)}</p>
                </div>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div className="divide-y rounded-lg border">
                {viewOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3">
                    {item.image && <img src={getImageUrl(item.image)} alt="" className="h-12 w-12 rounded object-cover" />}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <p className="text-right text-lg font-bold">Total: {formatCurrency(viewOrder.totalAmount)}</p>
              {viewOrder.rejectionReason && (
                <p className="text-sm text-red-600">Rejection reason: {viewOrder.rejectionReason}</p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
