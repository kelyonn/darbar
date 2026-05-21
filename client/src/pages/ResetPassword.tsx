import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';
import api from '../services/api';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const failed = passwordRules.find(r => !r.test(password));
    if (failed) { setError(failed.label + ' is required'); return; }
    setLoading(true); setError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login', { state: { message: 'Password reset successfully. You can now log in.' } });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'block w-full rounded border border-gray-300 px-4 py-3 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        <Link to="/" className="font-playfair text-2xl text-royal-green tracking-widest block mb-10">DARBAR</Link>
        <h1 className="font-playfair text-3xl mb-2">Reset Password</h1>
        <p className="font-montserrat text-sm text-gray-500 mb-8">Enter your new password below.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm font-montserrat mb-5">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className={inputClass} placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map(rule => (
                  <li key={rule.label} className={`flex items-center gap-2 text-xs font-montserrat ${rule.test(password) ? 'text-royal-green' : 'text-gray-400'}`}>
                    <Check size={12} />{rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-royal-gold text-white py-3 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
