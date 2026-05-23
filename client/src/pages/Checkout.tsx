import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast('Please login to checkout', 'error');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast('Razorpay SDK failed to load', 'error');
        setSubmitting(false);
        return;
      }

      // Create Order
      const { data } = await api.post('/orders', {
        shippingAddress: formData,
        couponCode: couponCode || undefined
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Darbar',
        description: 'Luxury Marketplace Purchase',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: data.order._id
            });
            clearCart();
            toast('Payment successful!', 'success');
            navigate('/order-success');
          } catch (err: any) {
            toast(err.response?.data?.message || 'Payment verification failed', 'error');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#d4af37' // royal-gold
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        toast(response.error.description || 'Payment failed', 'error');
      });
      paymentObject.open();

    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm font-montserrat shadow-sm focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold';
  const labelClass = 'block text-sm font-medium text-gray-700 font-montserrat';

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="font-playfair text-3xl mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/collections')}
          className="bg-royal-gold text-white px-8 py-3 rounded font-montserrat hover:bg-opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-3xl mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-playfair text-xl">Shipping Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name</label>
              <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name</label>
              <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>Address</label>
            <input type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>City</label>
              <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>State</label>
              <input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="pincode" className={labelClass}>PIN Code</label>
            <input type="text" id="pincode" name="pincode" required maxLength={6} value={formData.pincode} onChange={handleInputChange} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-royal-gold text-white px-6 py-3 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

        <div>
          <h2 className="font-playfair text-xl mb-6">Order Summary</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-montserrat text-sm font-medium">{item.name}</p>
                  <p className="font-montserrat text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-montserrat text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
            
            <div className="pt-4 pb-2">
              <label htmlFor="coupon" className="block text-xs font-montserrat text-gray-500 mb-2">Have a coupon code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="block w-full rounded border border-gray-300 px-3 py-2 text-sm font-montserrat focus:border-royal-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between font-montserrat text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-montserrat text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-royal-green">Free</span>
              </div>
              <div className="flex justify-between font-montserrat font-semibold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-royal-gold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
