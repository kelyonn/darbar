import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Check } from 'lucide-react';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const failedRule = passwordRules.find(r => !r.test(formData.password));
    if (failedRule) {
      setError(failedRule.label + ' is required');
      setLoading(false);
      return;
    }

    try {
      const message = await register(formData);
      setSuccessMessage(message);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'block w-full rounded border border-gray-300 px-4 py-3 text-sm font-montserrat focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold transition-colors';

  if (successMessage) {
    return (
      <>
        <Helmet>
          <title>Registration Complete — Darbar</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-royal-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-royal-green" />
            </div>
            <h1 className="font-playfair text-3xl mb-3">Check your email</h1>
            <p className="font-montserrat text-gray-600 text-sm leading-relaxed mb-6">
              {successMessage}
            </p>
            <Link
              to="/login"
              className="inline-block bg-royal-gold text-white px-8 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Create Account — Darbar</title>
        <meta name="description" content="Join Darbar to discover luxury Mughal-inspired fashion and manage your orders and wishlist." />
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
          Join the royal court. Discover luxury Mughal-inspired fashion crafted by master artisans across India.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-playfair text-2xl text-royal-green tracking-widest block mb-8">
            DARBAR
          </Link>

          <h1 className="font-playfair text-3xl mb-2">Create Account</h1>
          <p className="font-montserrat text-sm text-gray-500 mb-8">
            Join Darbar to access exclusive collections.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm font-montserrat mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-700 font-montserrat mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Create a strong password"
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

              {/* Password strength indicator */}
              {formData.password && (
                <ul className="mt-2 space-y-1">
                  {passwordRules.map(rule => (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs font-montserrat ${
                        rule.test(formData.password) ? 'text-royal-green' : 'text-gray-400'
                      }`}
                    >
                      <Check size={12} />
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-gold text-white py-3 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center font-montserrat text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-royal-gold hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;