import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { Product } from '../types';

interface CollectionsProps {
  category?: 'mens' | 'womens' | 'accessories';
}

const Collections: React.FC<CollectionsProps> = ({ category }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(product => {
    if (category && product.category !== category) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedFabrics.length > 0 && product.fabric && !selectedFabrics.includes(product.fabric)) return false;
    return true;
  });

  const fabrics = Array.from(new Set(products.map(p => p.fabric).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl mb-8">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Collections'}
      </h1>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Range */}
        <div>
          <h3 className="font-montserrat text-lg mb-2">Price Range</h3>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        {/* Fabric Filter */}
        <div>
          <h3 className="font-montserrat text-lg mb-2">Fabric</h3>
          <div className="flex flex-wrap gap-2">
            {fabrics.map(fabric => fabric && (
              <button
                key={fabric}
                onClick={() => {
                  setSelectedFabrics(prev =>
                    prev.includes(fabric)
                      ? prev.filter(f => f !== fabric)
                      : [...prev, fabric]
                  );
                }}
                className={`px-3 py-1 rounded border ${
                  selectedFabrics.includes(fabric)
                    ? 'bg-royal-gold text-white'
                    : 'border-gray-300'
                }`}
              >
                {fabric}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <div key={product.id} className="group relative">
            <Link to={`/product/${product.id}`} className="block">
              <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-playfair text-lg">{product.name}</h3>
                <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
            <button
              onClick={() => addToWishlist(product)}
              className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md ${
                isInWishlist(product.id) ? 'text-royal-red' : 'text-gray-600'
              }`}
            >
              <Heart size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
