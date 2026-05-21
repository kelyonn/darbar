import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  seller: 'bg-blue-100 text-blue-800',
  customer: 'bg-gray-100 text-gray-600',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setTotal(data.pagination.total);
    } finally { setLoading(false); }
  }, [search, role, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeRole = async (id: string, newRole: string) => {
    await api.put(`/admin/users/${id}/role`, { role: newRole });
    fetchUsers();
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
    fetchUsers();
  };

  return (
    <AdminLayout title="Users">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold"
            />
          </div>
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-montserrat text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-montserrat text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="font-montserrat text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-montserrat text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={e => changeRole(user._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 font-montserrat focus:outline-none focus:ring-1 focus:ring-royal-gold"
                      >
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => toggleStatus(user._id, user.isActive)}
                        className={`p-1 rounded transition-colors ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                        title={user.isActive ? 'Suspend user' : 'Activate user'}
                      >
                        {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between font-montserrat text-sm text-gray-500">
          <span>{total} users</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
