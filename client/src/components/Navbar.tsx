import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, User, ChevronDown, Moon, Sun } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { items } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/collections', label: 'Collections' },
    { to: '/mens', label: 'Men' },
    { to: '/womens', label: 'Women' },
    { to: '/accessories', label: 'Accessories' },
  ];

  return (
    <>
      <nav className={`bg-white sticky top-0 z-40 transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-playfair text-2xl font-bold text-royal-red tracking-widest">DARBAR</Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className={`font-montserrat text-sm tracking-wide transition-colors ${location.pathname === link.to ? 'text-royal-red' : 'text-gray-700 hover:text-royal-red'}`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop search */}
            <div className="hidden lg:flex items-center">
              <SearchBar />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="text-gray-700 hover:text-royal-gold transition-colors p-1"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/liked" className="text-gray-700 hover:text-royal-red transition-colors" aria-label="Wishlist">
                <Heart size={22} />
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-royal-red relative transition-colors" aria-label="Cart">
                <ShoppingBag size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-royal-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-montserrat">{cartItemsCount}</span>
                )}
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(p => !p)}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-royal-red transition-colors font-montserrat text-sm"
                  >
                    <div className="w-7 h-7 bg-royal-gold/20 rounded-full flex items-center justify-center text-xs font-semibold text-royal-gold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-montserrat text-sm font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                        <p className="font-montserrat text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm font-montserrat text-gray-700 hover:bg-gray-50">My Account</Link>
                      {(user?.role === 'seller' || user?.role === 'admin') && (
                        <Link to={user.role === 'admin' ? '/admin' : '/seller'} className="block px-4 py-2 text-sm font-montserrat text-gray-700 hover:bg-gray-50 capitalize">{user.role} Dashboard</Link>
                      )}
                      {user?.role === 'customer' && (
                        <Link to="/sell" className="block px-4 py-2 text-sm font-montserrat text-royal-gold hover:bg-amber-50">Become a Seller ✦</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-montserrat text-royal-red hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:block font-montserrat text-sm text-gray-700 hover:text-royal-red transition-colors">
                  <User size={22} />
                </Link>
              )}

              <button className="md:hidden text-gray-700 hover:text-royal-red transition-colors" onClick={() => setMobileOpen(p => !p)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <div className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-white z-40 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!mobileOpen}>
        <nav className="flex flex-col p-6 space-y-5">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`font-montserrat text-lg tracking-wide ${location.pathname === link.to ? 'text-royal-red' : 'text-gray-700 hover:text-royal-red'}`}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            {isAuthenticated ? (
              <>
                <p className="font-montserrat text-sm font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                <Link to="/profile" className="block font-montserrat text-gray-700 hover:text-royal-red text-sm">My Account</Link>
                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <Link to={user.role === 'admin' ? '/admin' : '/seller'} className="block font-montserrat text-gray-700 hover:text-royal-red text-sm capitalize">{user.role} Dashboard</Link>
                )}
                {user?.role === 'customer' && (
                  <Link to="/sell" className="block font-montserrat text-royal-gold text-sm font-medium">Become a Seller ✦</Link>
                )}
                <button onClick={handleLogout} className="block font-montserrat text-royal-red text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block font-montserrat text-gray-700 hover:text-royal-red text-sm">Sign In</Link>
                <Link to="/register" className="block font-montserrat text-gray-700 hover:text-royal-red text-sm">Create Account</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;