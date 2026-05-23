import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Store } from 'lucide-react';
import api from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/newsletter', { email });
      setSubscribed(true);
      setEmail('');
    } catch {
      // Silently succeed for UX (even if duplicate, backend handles it)
      setSubscribed(true);
      setEmail('');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-royal-green text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-playfair text-2xl mb-4">DARBAR</h3>
            <p className="font-montserrat text-sm text-white/80 leading-relaxed mb-4">
              Luxury Mughal-inspired fashion for the modern connoisseur. Crafted by master artisans.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 border border-royal-gold text-royal-gold px-4 py-2 rounded font-montserrat text-xs hover:bg-royal-gold hover:text-white transition-all"
            >
              <Store size={13} /> Sell on Darbar
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 font-montserrat text-sm text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">Become a Seller</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Collections</h4>
            <ul className="space-y-2 font-montserrat text-sm text-white/80">
              <li><Link to="/mens" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/womens" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Connect + Newsletter */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={22} />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={22} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={22} />
              </a>
            </div>

            <h5 className="font-montserrat text-sm font-medium mb-2">Newsletter</h5>
            {subscribed ? (
              <p className="font-montserrat text-sm text-white/80">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-3 py-2 text-sm text-gray-900 rounded-l focus:outline-none font-montserrat min-w-0"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-royal-gold px-4 py-2 text-sm rounded-r hover:bg-opacity-90 font-montserrat transition-colors disabled:opacity-70 whitespace-nowrap"
                >
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 font-montserrat text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Darbar. All rights reserved.</p>
          <p>Made with ♥ for master artisans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;