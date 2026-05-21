import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } catch {
      // Always show success to prevent email enumeration
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const inputClass = 'block w-full rounded border border-gray-300 px-4 py-3 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        <Link to="/" className="font-playfair text-2xl text-royal-green tracking-widest block mb-10">DARBAR</Link>
        <h1 className="font-playfair text-3xl mb-2">Forgot Password</h1>
        <p className="font-montserrat text-sm text-gray-500 mb-8">
          Enter your email address and we will send you a password reset link.
        </p>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded font-montserrat text-sm">
            If an account with that email exists, a reset link has been sent. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-royal-gold text-white py-3 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center font-montserrat text-sm text-gray-500">
          <Link to="/login" className="text-royal-gold hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
