import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

const statCards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: TrendingUp, format: (v: number) => `₹${v.toLocaleString('en-IN')}`, color: 'text-royal-gold' },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, format: (v: number) => v.toString(), color: 'text-blue-600' },
  { key: 'totalProducts', label: 'Active Products', icon: Package, format: (v: number) => v.toString(), color: 'text-green-600' },
  { key: 'totalUsers', label: 'Registered Users', icon: Users, format: (v: number) => v.toString(), color: 'text-purple-600' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Overview">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(card => (
            <div key={card.key} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="font-montserrat text-sm text-gray-500">{card.label}</p>
                <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <p className={`font-playfair text-2xl font-bold ${card.color}`}>
                {stats ? card.format(stats[card.key as keyof DashboardStats] as number) : '—'}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-playfair text-xl">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order #', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-montserrat text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-montserrat text-sm font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-600">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && !loading && (
                <tr><td colSpan={4} className="px-6 py-12 text-center font-montserrat text-sm text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
