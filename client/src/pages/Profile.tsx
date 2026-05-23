import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Package, LogOut, Settings, ExternalLink } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'details' | 'password' | 'orders'>('details');
  const [details, setDetails] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      api.get('/orders')
        .then(res => setOrders(res.data.orders))
        .catch(err => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put('/auth/me', details);
      await refreshUser();
      showMsg('success', 'Profile updated successfully.');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      showMsg('error', axiosError.response?.data?.message || 'Update failed.');
    } finally { setLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put('/auth/me/password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      showMsg('success', 'Password changed successfully.');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      showMsg('error', axiosError.response?.data?.message || 'Password change failed.');
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const inputClass = 'block w-full rounded border border-gray-300 px-3 py-2 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold';
  const labelClass = 'block text-sm font-medium text-gray-700 font-montserrat mb-1';

  const tabs = [
    { id: 'details' as const, label: 'My Details', icon: User },
    { id: 'orders' as const, label: 'My Orders', icon: Package },
    { id: 'password' as const, label: 'Security', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>My Account — Darbar</title>
        <meta name="description" content="Manage your Darbar account, orders, and profile settings." />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl">My Account</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-montserrat text-gray-500 hover:text-royal-red transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded text-sm font-montserrat border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-playfair text-2xl text-royal-gold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <p className="font-playfair text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="font-montserrat text-xs text-gray-500 mt-1 capitalize">{user?.role}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-montserrat transition-colors ${activeTab === tab.id ? 'bg-royal-gold/10 text-royal-gold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon size={16} />{tab.label}
                </button>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-montserrat text-gray-600 hover:bg-gray-50 mt-4 border-t pt-4">
                  <ExternalLink size={16} /> Admin Portal
                </Link>
              )}
              {user?.role === 'seller' && (
                <Link to="/seller" className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-montserrat text-gray-600 hover:bg-gray-50 mt-4 border-t pt-4">
                  <ExternalLink size={16} /> Seller Portal
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white rounded-lg border border-gray-100 p-6">
          {activeTab === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-5 max-w-lg">
              <h2 className="font-playfair text-xl mb-4">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" required value={details.firstName} onChange={e => setDetails(p => ({ ...p, firstName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" required value={details.lastName} onChange={e => setDetails(p => ({ ...p, lastName: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={user?.email || ''} disabled className={inputClass + ' bg-gray-50 cursor-not-allowed'} />
                <p className="text-xs text-gray-400 font-montserrat mt-1">Email address cannot be changed</p>
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={details.phone} onChange={e => setDetails(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="+91 98765 43210" />
              </div>
              <button type="submit" disabled={loading} className="bg-royal-gold text-white px-6 py-2.5 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
              <h2 className="font-playfair text-xl mb-4">Change Password</h2>
              <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" required minLength={8} value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className={inputClass} />
                <p className="text-xs text-gray-400 font-montserrat mt-1">Min. 8 characters</p>
              </div>
              <button type="submit" disabled={loading} className="bg-royal-gold text-white px-6 py-2.5 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-playfair text-xl mb-6">Order History</h2>
              {loadingOrders ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-montserrat text-sm border rounded-lg">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/collections" className="mt-4 inline-block text-royal-gold hover:underline text-sm">
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                        <div>
                          <p className="font-montserrat text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
                          <p className="font-montserrat text-sm font-medium">{order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat text-xs text-gray-500 uppercase tracking-wide">Date Placed</p>
                          <p className="font-montserrat text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-playfair text-lg">{item.name}</h4>
                              <p className="font-montserrat text-xs text-gray-500">Qty: {item.quantity} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                            </div>
                            <div className="text-right font-montserrat font-medium">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat text-xs text-gray-500 uppercase tracking-wide">Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-montserrat font-medium ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <p className="font-montserrat font-semibold text-lg">
                          Total: ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;