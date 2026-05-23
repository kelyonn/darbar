import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Package } from 'lucide-react';
import { getFirstImage } from '../../utils/images';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
}

const statusColors: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/seller/orders');
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o)
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-montserrat text-gray-500">No orders yet. When customers buy your products, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-montserrat text-xs text-gray-500 uppercase tracking-wider">Order</p>
                    <p className="font-montserrat text-sm font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="font-montserrat text-xs text-gray-500 uppercase tracking-wider">Date</p>
                    <p className="font-montserrat text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="font-montserrat text-xs text-gray-500 uppercase tracking-wider">Total</p>
                    <p className="font-montserrat text-sm font-semibold text-royal-gold">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-montserrat font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <span className="text-gray-400 font-montserrat text-xs">{expanded === order._id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded Detail */}
              {expanded === order._id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  {/* Items */}
                  <div className="mt-4 space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={getFirstImage([item.image])} alt={item.name} className="w-12 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-playfair text-sm">{item.name}</p>
                          <p className="font-montserrat text-xs text-gray-500">
                            Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}
                          </p>
                        </div>
                        <p className="font-montserrat text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-montserrat text-xs uppercase tracking-wider text-gray-500 mb-2">Ship to</p>
                    <p className="font-montserrat text-sm text-gray-700">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                      {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                      {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />
                      {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div>
                    <p className="font-montserrat text-xs uppercase tracking-wider text-gray-500 mb-3">Update Fulfillment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          disabled={order.orderStatus === s || updating === order._id}
                          onClick={() => updateStatus(order._id, s)}
                          className={`px-3 py-1.5 rounded text-xs font-montserrat font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            order.orderStatus === s
                              ? 'bg-royal-gold text-white border-royal-gold'
                              : 'border-gray-300 text-gray-600 hover:border-royal-gold hover:text-royal-gold'
                          }`}
                        >
                          {updating === order._id && order.orderStatus !== s ? '...' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
