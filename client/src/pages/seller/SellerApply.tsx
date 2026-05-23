import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const inputClass = 'block w-full rounded border border-gray-300 px-4 py-3 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold transition-colors';

const SellerApply: React.FC = () => {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    description: '',
    gstin: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.description.length < 30) {
      toast('Description must be at least 30 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/sellers/apply', form);
      setSubmitted(true);
    } catch (err: any) {
      toast(err.response?.data?.message || 'Submission failed', 'error');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Helmet><title>Application Submitted — Darbar</title></Helmet>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-royal-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-royal-green" />
          </div>
          <h1 className="font-playfair text-3xl mb-3">Application Received</h1>
          <p className="font-montserrat text-gray-600 text-sm leading-relaxed mb-8">
            Thank you for applying to sell on Darbar. Our team will review your application and notify you within 2–3 business days. Once approved, your account will be upgraded automatically.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-royal-gold text-white px-8 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-ivory">
      <Helmet>
        <title>Become a Seller — Darbar</title>
        <meta name="description" content="Apply to sell your luxury fashion and accessories on Darbar. Join our curated community of master artisans." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={28} className="text-royal-gold" />
          </div>
          <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-2">Join the Marketplace</p>
          <h1 className="font-playfair text-4xl mb-3">Become a Darbar Seller</h1>
          <p className="font-montserrat text-gray-600 text-sm leading-relaxed">
            Reach thousands of customers who appreciate luxury, heritage craft, and authentic Indian fashion.
          </p>
        </div>

        {/* Info banner */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-montserrat text-sm text-amber-700">
            Your application will be reviewed by our team. Once approved, you can list products and start earning. Approval typically takes 2–3 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-gray-200 p-8">
          {/* Business Info */}
          <div>
            <h2 className="font-playfair text-xl mb-5 pb-3 border-b border-gray-100">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                <input name="businessName" required value={form.businessName} onChange={handleChange} className={inputClass} placeholder="e.g. Zardozi House of Lucknow" />
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">About Your Business *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your craft, heritage, materials, and what makes your work unique (min 30 characters)..."
                />
                <p className={`font-montserrat text-xs mt-1 ${form.description.length < 30 ? 'text-gray-400' : 'text-emerald-600'}`}>
                  {form.description.length}/30 characters minimum
                </p>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">GSTIN (optional)</label>
                <input name="gstin" value={form.gstin} onChange={handleChange} className={inputClass} placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="font-playfair text-xl mb-5 pb-3 border-b border-gray-100">Bank Details</h2>
            <p className="font-montserrat text-xs text-gray-500 mb-4">Your earnings will be transferred to this account. Details are encrypted and never shared.</p>
            <div className="space-y-4">
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                <input name="bankAccountName" required value={form.bankAccountName} onChange={handleChange} className={inputClass} placeholder="As per bank records" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input name="bankAccountNumber" required type="password" value={form.bankAccountNumber} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
                  <input name="bankIfsc" required value={form.bankIfsc} onChange={handleChange} className={`${inputClass} uppercase`} placeholder="SBIN0001234" maxLength={11} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-royal-gold text-white py-4 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 disabled:opacity-60 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>

          <p className="text-center font-montserrat text-xs text-gray-400">
            By submitting you agree to Darbar's Seller Terms and Marketplace Policies.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerApply;
