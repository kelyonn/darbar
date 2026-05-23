import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Store } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface SellerApplication {
  _id: string;
  businessName: string;
  description: string;
  gstin?: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  isApproved: boolean;
  createdAt: string;
  userId: { _id: string; firstName: string; lastName: string; email: string; createdAt: string };
}

const AdminSellers: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/sellers?status=${tab}`);
      setApplications(data.profiles || []);
    } catch { toast('Failed to load applications', 'error'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const handleDecision = async (id: string, approved: boolean) => {
    setProcessing(id);
    try {
      await api.put(`/sellers/${id}/approve`, { approved });
      toast(approved ? 'Seller approved — their role has been upgraded' : 'Application rejected', approved ? 'success' : 'error');
      load();
    } catch { toast('Action failed', 'error'); }
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>Seller Applications — Darbar Admin</title></Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-montserrat text-royal-gold text-xs tracking-[3px] uppercase mb-1">Admin</p>
          <h1 className="font-playfair text-3xl">Seller Applications</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'approved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded font-montserrat text-sm font-medium transition-colors ${tab === t ? 'bg-royal-gold text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-royal-gold'}`}
            >
              {t === 'pending' ? <><Clock size={14} className="inline mr-1.5" />Pending</> : <><CheckCircle size={14} className="inline mr-1.5" />Approved</>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" /></div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <Store size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="font-montserrat text-gray-400">No {tab} applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-royal-gold/10 rounded-full flex items-center justify-center">
                      <Store size={18} className="text-royal-gold" />
                    </div>
                    <div>
                      <p className="font-playfair font-medium">{app.businessName}</p>
                      <p className="font-montserrat text-xs text-gray-500">
                        {app.userId?.firstName} {app.userId?.lastName} · {app.userId?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-montserrat text-xs text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {expanded === app._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === app._id && (
                  <div className="border-t border-gray-100 p-5 space-y-4">
                    <div>
                      <p className="font-montserrat text-xs text-gray-400 mb-1">Business Description</p>
                      <p className="font-montserrat text-sm text-gray-700">{app.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {app.gstin && (
                        <div>
                          <p className="font-montserrat text-xs text-gray-400 mb-0.5">GSTIN</p>
                          <p className="font-montserrat text-sm font-medium">{app.gstin}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-montserrat text-xs text-gray-400 mb-0.5">Account Name</p>
                        <p className="font-montserrat text-sm font-medium">{app.bankAccountName}</p>
                      </div>
                      <div>
                        <p className="font-montserrat text-xs text-gray-400 mb-0.5">Account No.</p>
                        <p className="font-montserrat text-sm font-medium">****{app.bankAccountNumber.slice(-4)}</p>
                      </div>
                      <div>
                        <p className="font-montserrat text-xs text-gray-400 mb-0.5">IFSC</p>
                        <p className="font-montserrat text-sm font-medium">{app.bankIfsc}</p>
                      </div>
                      <div>
                        <p className="font-montserrat text-xs text-gray-400 mb-0.5">Member Since</p>
                        <p className="font-montserrat text-sm">{new Date(app.userId?.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>

                    {!app.isApproved && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleDecision(app._id, true)}
                          disabled={processing === app._id}
                          className="flex items-center gap-2 bg-royal-green text-white px-5 py-2.5 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all"
                        >
                          <CheckCircle size={15} /> {processing === app._id ? 'Processing...' : 'Approve Seller'}
                        </button>
                        <button
                          onClick={() => handleDecision(app._id, false)}
                          disabled={processing === app._id}
                          className="flex items-center gap-2 border border-red-300 text-red-600 px-5 py-2.5 rounded font-montserrat text-sm hover:bg-red-50 disabled:opacity-60 transition-all"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      </div>
                    )}

                    {app.isApproved && (
                      <div className="flex items-center gap-2 text-emerald-600 font-montserrat text-sm pt-2">
                        <CheckCircle size={16} /> Approved seller
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellers;
