import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  Tag, LogOut, Menu, X, ChevronRight, Store, TrendingUp,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64'} bg-royal-green text-white flex flex-col h-full`}>
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="font-playfair text-2xl tracking-widest text-white">DARBAR</Link>
        <p className="font-montserrat text-xs text-white/50 mt-1">Admin Console</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-montserrat text-sm transition-colors ${
                active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-2 mb-2">
          <p className="font-montserrat text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
          <p className="font-montserrat text-xs text-white/50 capitalize">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 font-montserrat text-sm transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 font-montserrat text-sm text-gray-500">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium">{title}</span>
            </div>
          </div>
          <Link to="/" className="font-montserrat text-sm text-gray-500 hover:text-royal-gold transition-colors">
            View Store
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
