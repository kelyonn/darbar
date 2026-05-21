import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu } from 'lucide-react';

const navItems = [
  { to: '/seller', label: 'Overview', icon: LayoutDashboard },
  { to: '/seller/products', label: 'My Products', icon: Package },
  { to: '/seller/orders', label: 'Orders', icon: ShoppingBag },
];

const SellerLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="font-playfair text-2xl tracking-widest text-royal-gold">DARBAR</Link>
        <p className="font-montserrat text-xs text-white/50 mt-1">Seller Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-montserrat text-sm transition-colors ${active ? 'bg-royal-gold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <item.icon size={18} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="font-montserrat text-sm text-white px-4 mb-1">{user?.firstName} {user?.lastName}</p>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-montserrat text-sm transition-colors">
          <LogOut size={16} />Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden lg:flex"><Sidebar /></div>
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"><Sidebar /></div>
        </>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu size={22} /></button>
            <h1 className="font-montserrat text-sm font-medium text-gray-800">{title}</h1>
          </div>
          <Link to="/" className="font-montserrat text-sm text-gray-500 hover:text-royal-gold transition-colors">View Store</Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
