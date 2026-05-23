import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/resend-verification', { email });
      setSent(true);
    } catch (err: any) {
      toast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-white">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-sm font-montserrat text-gray-500 hover:text-royal-gold mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl mb-2">Resend Verification</h1>
          <p className="font-montserrat text-sm text-gray-500">
            Didn't receive the email? Enter your email address and we'll send a new verification link.
          </p>
        </div>
        
        {sent ? (
          <div className="bg-green-50 border border-green-100 text-green-800 rounded-lg p-6 text-center">
            <h3 className="font-montserrat font-medium mb-2">Check Your Inbox</h3>
            <p className="font-montserrat text-sm">
              If an unverified account exists for {email}, a new verification link has been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 font-montserrat uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 font-montserrat text-sm focus:border-royal-gold focus:ring-1 focus:ring-royal-gold focus:outline-none transition-colors"
                placeholder="nawab@darbar.in"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-gold text-white rounded-lg px-4 py-3 font-montserrat font-medium text-sm hover:bg-opacity-90 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Verification Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
