import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-royal-green text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-2xl mb-4">DARBAR</h3>
            <p className="font-montserrat text-sm">Luxury Mughal-inspired fashion for the modern royalty.</p>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 font-montserrat text-sm">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/returns">Returns Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Collections</h4>
            <ul className="space-y-2 font-montserrat text-sm">
              <li><Link to="/mens">Men's Collection</Link></li>
              <li><Link to="/womens">Women's Collection</Link></li>
              <li><Link to="/accessories">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-royal-gold"><Instagram size={24} /></a>
              <a href="#" className="hover:text-royal-gold"><Facebook size={24} /></a>
              <a href="#" className="hover:text-royal-gold"><Twitter size={24} /></a>
            </div>
            <div className="mt-4">
              <h5 className="font-montserrat text-sm mb-2">Subscribe to our newsletter</h5>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 text-gray-900 rounded-l focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-royal-gold px-4 py-2 rounded-r hover:bg-opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center font-montserrat text-sm">
          <p>&copy; {new Date().getFullYear()} Darbar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;