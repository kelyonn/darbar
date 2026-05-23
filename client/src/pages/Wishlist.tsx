import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-3xl mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-montserrat text-gray-600 mb-6">Your wishlist is empty.</p>
          <Link
            to="/collections"
            className="inline-block bg-royal-gold text-white px-8 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm group">
              <div className="relative">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={typeof item.images[0] === 'string' ? item.images[0] : (item.images[0] as any)?.url || ''}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-gray-500 hover:text-royal-red transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-playfair text-lg mb-1 hover:text-royal-gold transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="font-montserrat text-sm text-gray-600 mb-4">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-royal-gold text-white py-2 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;