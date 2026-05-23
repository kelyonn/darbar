import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, ShoppingBag, Users, Package, IndianRupee, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../services/api';

interface MonthlyRevenue { _id: { year: number; month: number }; revenue: number; orders: number; }
interface CategoryStat { _id: string; count: number; revenue: number; }
interface TopProduct { _id: string; name: string; slug: string; sold: number; revenue: number; image: string; }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminAnalytics: React.FC = () => {
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0, revenueChange: 0, orderChange: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/analytics?period=${period}`);
        setMonthly(data.monthly || []);
        setCategories(data.categories || []);
        setTopProducts(data.topProducts || []);
        setSummary(data.summary || summary);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [period]);

  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);

  const StatCard = ({ label, value, icon: Icon, change, prefix = '' }: { label: string; value: number; icon: React.ElementType; change?: number; prefix?: string }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-montserrat text-sm text-gray-500">{label}</p>
        <div className="w-10 h-10 bg-royal-gold/10 rounded-lg flex items-center justify-center">
          <Icon size={18} className="text-royal-gold" />
        </div>
      </div>
      <p className="font-playfair text-3xl mb-1">{prefix}{value.toLocaleString('en-IN')}</p>
      {change !== undefined && (
        <p className={`font-montserrat text-xs flex items-center gap-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(change)}% vs last period
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>Analytics — Darbar Admin</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-montserrat text-royal-gold text-xs tracking-[3px] uppercase mb-1">Platform</p>
            <h1 className="font-playfair text-3xl">Analytics</h1>
          </div>
          <div className="flex gap-2">
            {(['7d','30d','90d','1y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded font-montserrat text-sm transition-colors ${period === p ? 'bg-royal-gold text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-royal-gold'}`}
              >{p}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Revenue" value={summary.totalRevenue} icon={IndianRupee} change={summary.revenueChange} prefix="₹" />
              <StatCard label="Total Orders" value={summary.totalOrders} icon={ShoppingBag} change={summary.orderChange} />
              <StatCard label="Total Users" value={summary.totalUsers} icon={Users} />
              <StatCard label="Active Products" value={summary.totalProducts} icon={Package} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-playfair text-xl mb-6">Revenue Over Time</h2>
                {monthly.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400 font-montserrat text-sm">No data for this period</div>
                ) : (
                  <div className="flex items-end gap-2 h-48">
                    {monthly.map((m, i) => {
                      const height = maxRevenue > 0 ? Math.max((m.revenue / maxRevenue) * 100, 4) : 4;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            ₹{m.revenue.toLocaleString('en-IN')}<br />{m.orders} orders
                          </div>
                          <div
                            className="w-full bg-royal-gold/80 hover:bg-royal-gold rounded-t transition-all"
                            style={{ height: `${height}%` }}
                          />
                          <span className="font-montserrat text-xs text-gray-400 truncate w-full text-center">
                            {MONTHS[(m._id.month - 1)]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-playfair text-xl mb-6">By Category</h2>
                <div className="space-y-4">
                  {categories.length === 0 && <p className="text-gray-400 font-montserrat text-sm">No data</p>}
                  {categories.map(cat => {
                    const totalCount = categories.reduce((s, c) => s + c.count, 0) || 1;
                    const pct = Math.round((cat.count / totalCount) * 100);
                    return (
                      <div key={cat._id}>
                        <div className="flex justify-between mb-1">
                          <span className="font-montserrat text-sm capitalize">{cat._id || 'Unknown'}</span>
                          <span className="font-montserrat text-sm text-gray-500">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-royal-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="font-montserrat text-xs text-gray-400 mt-0.5">₹{cat.revenue.toLocaleString('en-IN')} • {cat.count} orders</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-playfair text-xl mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-royal-gold" /> Top Selling Products
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-montserrat text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 font-medium text-gray-500">Product</th>
                      <th className="text-right py-3 font-medium text-gray-500">Units Sold</th>
                      <th className="text-right py-3 font-medium text-gray-500">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 && (
                      <tr><td colSpan={3} className="py-8 text-center text-gray-400">No order data yet</td></tr>
                    )}
                    {topProducts.map((p, i) => (
                      <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 flex items-center gap-3">
                          <span className="text-gray-400 w-5 text-right">{i + 1}</span>
                          {p.image && <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded" />}
                          <span className="font-medium">{p.name}</span>
                        </td>
                        <td className="py-3 text-right">{p.sold}</td>
                        <td className="py-3 text-right text-royal-gold font-medium">₹{p.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
