import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OrderCard from '../../components/orders/OrderCard';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { adminLinks } from '../../config/navigation';
import * as orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import { getImageUrl } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectModal, setRejectModal] = useState({ open: false, order: null });
  const [rejectReason, setRejectReason] = useState('');
  const [viewOrder, setViewOrder] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
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
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [status, page]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchOrders();
    socket.on('order-created', refresh);
    socket.on('order-approved', refresh);
    socket.on('order-rejected', refresh);
    return () => {
      socket.off('order-created', refresh);
      socket.off('order-approved', refresh);
      socket.off('order-rejected', refresh);
    };
  }, [socket, status, page]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    setError('');
    try {
      await orderService.approveOrder(id);
      setSuccess('Order approved successfully');
      fetchOrders();
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
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <DashboardLayout links={adminLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Review and approve purchase requests</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

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
          <p className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">No orders found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                isAdmin
                approvingId={approvingId}
                onApprove={handleApprove}
                onReject={(o) => setRejectModal({ open: true, order: o })}
                onView={setViewOrder}
              />
            ))}
          </div>
        )}

        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />

        <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({ open: false, order: null })}
          title="Reject Order">
          <div className="space-y-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModal({ open: false, order: null })}>Cancel</Button>
              <Button variant="danger" onClick={handleReject}>Reject Order</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title="Order Details" size="lg">
          {viewOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order #{viewOrder._id.slice(-6).toUpperCase()}</p>
                  <p className="font-semibold">{viewOrder.user?.name}</p>
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
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
