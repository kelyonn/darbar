import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set('status', status);
      const { data } = await api.get(`/admin/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [status, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } finally { setUpdating(null); }
  };

  return (
    <AdminLayout title="Orders">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex gap-4">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold"
          >
            <option value="">All Orders</option>
            {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <p className="font-montserrat text-sm text-gray-500 self-center">{total} orders total</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order #', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-montserrat text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-montserrat text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 font-montserrat text-xs text-gray-500">
                    {order.items?.slice(0,2).map(i => i.name).join(', ')}
                    {order.items?.length > 2 && ` +${order.items.length - 2}`}
                  </td>
                  <td className="px-6 py-4 font-montserrat text-sm">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-montserrat ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-montserrat ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-montserrat text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="text-xs border border-gray-200 rounded px-2 py-1 font-montserrat focus:outline-none disabled:opacity-50"
                    >
                      {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between font-montserrat text-sm text-gray-500">
          <span>Page {page}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
