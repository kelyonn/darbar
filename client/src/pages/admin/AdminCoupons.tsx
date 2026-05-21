import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { Plus, X } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', expiresAt: '' });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/coupons');
      setCoupons(data.coupons);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/coupons', {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minPurchase: Number(form.minPurchase) || 0,
      maxUses: Number(form.maxUses) || 1000,
      ...(form.expiresAt && { expiresAt: new Date(form.expiresAt) }),
    });
    setShowForm(false);
    setForm({ code: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', expiresAt: '' });
    fetchCoupons();
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    await api.put(`/admin/coupons/${id}`, { isActive: !isActive });
    fetchCoupons();
  };

  const inputClass = 'block w-full rounded border border-gray-200 px-3 py-2 text-sm font-montserrat focus:outline-none focus:ring-1 focus:ring-royal-gold';

  return (
    <AdminLayout title="Coupons">
      <div className="mb-4 flex justify-end">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-royal-gold text-white px-4 py-2 rounded-lg font-montserrat text-sm hover:bg-opacity-90 transition-colors">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl">Create Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Code</label>
                <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} className={inputClass} placeholder="ROYAL10" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputClass}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select></div>
                <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Value</label>
                  <input type="number" required value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={inputClass} placeholder="10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Min. Purchase (₹)</label>
                  <input type="number" value={form.minPurchase} onChange={e => setForm(p => ({ ...p, minPurchase: e.target.value }))} className={inputClass} placeholder="0" /></div>
                <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} className={inputClass} placeholder="100" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 font-montserrat mb-1">Expires At (optional)</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} className={inputClass} /></div>
              <button type="submit" className="w-full bg-royal-gold text-white py-2.5 rounded-lg font-montserrat text-sm hover:bg-opacity-90 transition-colors">Create Coupon</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Code', 'Type', 'Value', 'Min. Purchase', 'Used / Max', 'Expires', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-montserrat text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? [...Array(4)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>)
              : coupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-montserrat text-sm font-bold tracking-wider">{coupon.code}</td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-600 capitalize">{coupon.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-montserrat text-sm">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-600">₹{coupon.minPurchase.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-600">{coupon.usedCount} / {coupon.maxUses}</td>
                  <td className="px-6 py-4 font-montserrat text-xs text-gray-500">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-montserrat ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{coupon.isActive ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleCoupon(coupon._id, coupon.isActive)} className={`font-montserrat text-xs ${coupon.isActive ? 'text-red-500 hover:underline' : 'text-green-600 hover:underline'}`}>
                      {coupon.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
