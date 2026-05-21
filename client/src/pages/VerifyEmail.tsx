import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    api.get(`/auth/verify-email/${token}`)
      .then(({ data }) => { setStatus('success'); setMessage(data.message); })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed.'); });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        )}
        <h1 className="font-playfair text-3xl mb-3">
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified' : 'Verification Failed'}
        </h1>
        <p className="font-montserrat text-sm text-gray-600 mb-6">{message}</p>
        {status !== 'loading' && (
          <Link
            to={status === 'success' ? '/login' : '/resend-verification'}
            className="inline-block bg-royal-gold text-white px-8 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
          >
            {status === 'success' ? 'Go to Login' : 'Resend Verification Email'}
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
