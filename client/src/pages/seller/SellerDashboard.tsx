import React, { useEffect, useState } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import api from '../../services/api';
import { TrendingUp, Package, ShoppingBag } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<{ activeProducts: number; totalRevenue: number; totalOrders: number } | null>(null);
  const [orders, setOrders] = useState<{ _id: string; orderNumber: string; total: number; orderStatus: string; createdAt: string }[]>([]);

  useEffect(() => {
    api.get('/seller/dashboard').then(({ data }) => setStats(data.stats));
    api.get('/seller/orders').then(({ data }) => setOrders(data.orders.slice(0, 5)));
  }, []);

  const cards = [
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', icon: TrendingUp, color: 'text-royal-gold' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Active Products', value: stats?.activeProducts ?? '—', icon: Package, color: 'text-green-600' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <SellerLayout title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="font-montserrat text-sm text-gray-500">{card.label}</p>
              <div className={`p-2 bg-gray-50 rounded-lg ${card.color}`}><card.icon size={18} /></div>
            </div>
            <p className={`font-playfair text-2xl font-bold ${card.color}`}>{String(card.value)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100"><h2 className="font-playfair text-xl">Recent Orders</h2></div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{['Order #', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-3 text-left font-montserrat text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-montserrat text-sm font-medium">{o.orderNumber}</td>
                <td className="px-6 py-4 font-montserrat text-sm">₹{o.total.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-montserrat ${statusColors[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{o.orderStatus}</span></td>
                <td className="px-6 py-4 font-montserrat text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center font-montserrat text-sm text-gray-400">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
