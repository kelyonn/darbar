import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-3xl mb-6">Liked Items</h1>
      {items.length === 0 ? (
        <p>No items in your wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4">
              <img src={item.images[0]} alt={item.name} className="w-full h-64 object-cover mb-4" />
              <h3 className="font-playfair text-lg">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => addToCart(item)}
                  className="bg-royal-gold text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-royal-red"
                >
                  Remove
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