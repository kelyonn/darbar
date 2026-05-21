import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { items } = useCart();
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-playfair text-2xl font-bold text-royal-red">
              DARBAR
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/collections" className="font-montserrat text-gray-700 hover:text-royal-red">
              Collections
            </Link>
            <Link to="/mens" className="font-montserrat text-gray-700 hover:text-royal-red">
              Men
            </Link>
            <Link to="/womens" className="font-montserrat text-gray-700 hover:text-royal-red">
              Women
            </Link>
            <Link to="/accessories" className="font-montserrat text-gray-700 hover:text-royal-red">
              Accessories
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/liked" className="text-gray-700 hover:text-royal-red">
              <Heart size={24} />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-royal-red relative">
              <ShoppingBag size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-royal-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button className="md:hidden text-gray-700">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;