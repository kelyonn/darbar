import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';
import api from '../services/api';
import { getFirstImage } from '../utils/images';

interface CollectionsProps {
  category?: 'mens' | 'womens' | 'accessories';
}

const Collections: React.FC<CollectionsProps> = ({ category }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);

  // Fetch products when params change
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 48 };
        if (category) params.category = category;
        if (searchQuery) params.search = searchQuery;
        if (selectedFabrics.length > 0) params.fabric = selectedFabrics.join(',');
        
        // We only apply price filter on frontend to make sliding instant,
        // but for a real large app we'd pass it to backend.
        
        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        
        // Extract unique fabrics from all returned products for the filter
        const fabrics = Array.from(new Set(data.products.map((p: Product) => p.fabric).filter(Boolean))) as string[];
        if (availableFabrics.length === 0) {
          setAvailableFabrics(fabrics);
        }
      } catch (err) {
        toast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, searchQuery, toast]); // Intentionally leaving selectedFabrics out of dependency array if we filter locally

  // Apply local filters (price and fabric)
  const filteredProducts = products.filter(product => {
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedFabrics.length > 0 && product.fabric && !selectedFabrics.includes(product.fabric)) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `Search: ${searchQuery}` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : "All Collections"} — Darbar</title>
        <meta name="description" content="Shop luxury Mughal-inspired fashion at Darbar. Browse our curated collections of sherwanis, lehengas, and traditional accessories." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
        <h1 className="font-playfair text-4xl">
          {searchQuery ? `Search Results for "${searchQuery}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Collections'}
        </h1>
        {searchQuery && (
          <button onClick={() => setSearchParams({})} className="text-sm text-gray-500 hover:text-royal-gold font-montserrat transition-colors">
            Clear Search
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-montserrat text-lg mb-2">Price Range</h3>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-royal-gold"
          />
          <div className="flex justify-between font-montserrat text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="font-montserrat text-lg mb-2">Fabric</h3>
          <div className="flex flex-wrap gap-2">
            {availableFabrics.map(fabric => (
              <button
                key={fabric}
                onClick={() => {
                  setSelectedFabrics(prev =>
                    prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]
                  );
                }}
                className={`px-3 py-1 rounded text-sm font-montserrat border transition-colors ${
                  selectedFabrics.includes(fabric)
                    ? 'bg-royal-gold text-white border-royal-gold'
                    : 'border-gray-300 text-gray-600 hover:border-royal-gold'
                }`}
              >
                {fabric}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <h2 className="font-playfair text-2xl text-gray-400">No products found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <div key={product._id || product.id} className="group relative">
              <Link to={`/product/${product.slug}`} className="block">
                <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
                  <img
                    src={getFirstImage(product.images)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-playfair text-lg truncate">{product.name}</h3>
                  <p className="text-gray-600 font-montserrat">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating to product page
                  addToWishlist(product);
                }}
                className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md transition-colors ${
                  isInWishlist(product._id || product.id) ? 'text-royal-red' : 'text-gray-400 hover:text-royal-red'
                }`}
              >
                <Heart size={20} fill={isInWishlist(product._id || product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default Collections;