import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { getFirstImage } from '../../utils/images';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  sellerId?: { firstName: string; lastName: string };
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleFeatured = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      await api.put(`/products/${id}`, { isFeatured: !current });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, isFeatured: !current } : p));
    } finally { setUpdating(null); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      if (current) {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: false } : p));
      } else {
        await api.put(`/products/${id}`, { isActive: true });
        setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: true } : p));
      }
    } finally { setUpdating(null); }
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-2xl">All Products</h1>
          <p className="font-montserrat text-xs text-gray-500 mt-1">{total} products total</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-2 text-sm font-montserrat focus:border-royal-gold focus:outline-none w-48"
          />
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-2 text-sm font-montserrat focus:border-royal-gold focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="mens">Men's</option>
            <option value="womens">Women's</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-montserrat text-sm">No products found.</div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Featured</th>
                  <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className={`border-b border-gray-100 last:border-0 ${!product.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getFirstImage(product.images)} alt={product.name} className="w-10 h-12 rounded object-cover flex-shrink-0" />
                        <p className="font-playfair text-sm max-w-[180px] truncate">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-montserrat text-sm text-gray-600">
                      {product.sellerId ? `${product.sellerId.firstName} ${product.sellerId.lastName}` : '—'}
                    </td>
                    <td className="px-6 py-4 font-montserrat text-sm capitalize">{product.category}</td>
                    <td className="px-6 py-4 font-montserrat text-sm text-royal-gold font-medium">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-montserrat ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0  ? 'bg-yellow-100 text-yellow-800' :
                                             'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled={updating === product._id}
                        onClick={() => toggleFeatured(product._id, product.isFeatured)}
                        className={`px-3 py-1 rounded text-xs font-montserrat border transition-colors disabled:opacity-50 ${
                          product.isFeatured
                            ? 'bg-royal-gold text-white border-royal-gold'
                            : 'border-gray-300 text-gray-500 hover:border-royal-gold'
                        }`}
                      >
                        {product.isFeatured ? '★ Featured' : 'Feature'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled={updating === product._id}
                        onClick={() => toggleActive(product._id, product.isActive)}
                        className={`px-3 py-1 rounded text-xs font-montserrat border transition-colors disabled:opacity-50 ${
                          product.isActive
                            ? 'border-red-300 text-red-500 hover:bg-red-50'
                            : 'border-green-300 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {product.isActive ? 'Deactivate' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center items-center gap-4 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-montserrat border border-gray-300 rounded disabled:opacity-50 hover:border-royal-gold"
                >
                  ← Prev
                </button>
                <span className="font-montserrat text-xs text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="px-3 py-1.5 text-xs font-montserrat border border-gray-300 rounded disabled:opacity-50 hover:border-royal-gold"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
