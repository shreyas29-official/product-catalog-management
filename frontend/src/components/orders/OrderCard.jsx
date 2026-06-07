import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { getImageUrl } from '../../services/api';

export default function OrderCard({ order, isAdmin, onApprove, onReject, onView, approvingId }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
          <p className="mt-1 font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
          {isAdmin && order.user && (
            <p className="text-sm text-gray-600">{order.user.name} ({order.user.email})</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 space-y-2">
        {order.items?.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm">
            {item.image && (
              <img src={getImageUrl(item.image)} alt={item.name} className="h-10 w-10 rounded object-cover" />
            )}
            <span className="flex-1 text-gray-700">{item.name} x{item.quantity}</span>
            <span className="text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
        )}
      </div>

      {order.rejectionReason && order.status === 'REJECTED' && (
        <p className="mt-3 text-sm text-red-600">Reason: {order.rejectionReason}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(order)}>
            View Details
          </Button>
        )}
        {isAdmin && order.status === 'PENDING' && onApprove && onReject && (
          <>
            <Button
              variant="success"
              size="sm"
              loading={approvingId === order._id}
              disabled={!!approvingId}
              onClick={() => onApprove(order._id)}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!!approvingId}
              onClick={() => onReject(order)}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
