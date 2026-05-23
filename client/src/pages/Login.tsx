import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; code?: string } } };
      const message = axiosError.response?.data?.message || 'Login failed. Please try again.';
      const code = axiosError.response?.data?.code;
      setError(message);
      if (code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'block w-full rounded border border-gray-300 px-4 py-3 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold transition-colors';

  return (
    <>
      <Helmet>
        <title>Sign In — Darbar</title>
        <meta name="description" content="Sign in to your Darbar account to track orders, manage your wishlist, and access exclusive member collections." />
      </Helmet>
      <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-royal-green flex-col justify-center px-16"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/arabesque.png')",
        }}
      >
        <Link to="/" className="font-playfair text-3xl text-white tracking-widest mb-4">
          DARBAR
        </Link>
        <p className="font-montserrat text-white/70 text-sm leading-relaxed max-w-xs">
          Luxury Mughal-inspired fashion crafted by master artisans. Welcome back to the royal court.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden font-playfair text-2xl text-royal-green tracking-widest block mb-8">
            DARBAR
          </Link>

          <h1 className="font-playfair text-3xl mb-2">Sign In</h1>
          <p className="font-montserrat text-sm text-gray-500 mb-8">
            Welcome back. Enter your credentials to continue.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm font-montserrat mb-6">
              {error}
              {needsVerification && (
                <div className="mt-2">
                  <Link
                    to="/resend-verification"
                    className="text-royal-gold underline text-xs"
                  >
                    Resend verification email
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 font-montserrat">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-montserrat text-royal-gold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-gold text-white py-3 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center font-montserrat text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-royal-gold hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;