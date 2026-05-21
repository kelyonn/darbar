import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-royal-green/10 flex items-center justify-center mb-6">
        <ShoppingBag size={28} className="text-royal-green" />
      </div>
      <h1 className="font-playfair text-4xl mb-4">Order Placed</h1>
      <p className="font-montserrat text-gray-600 max-w-md mb-2">
        Thank you for your purchase. We will send you a confirmation email shortly.
      </p>
      <p className="font-montserrat text-sm text-gray-500 mb-8">
        Your order is being processed and you will receive shipping details soon.
      </p>
      <div className="flex gap-4">
        <Link
          to="/collections"
          className="bg-royal-gold text-white px-6 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
