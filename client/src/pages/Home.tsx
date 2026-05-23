import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';
import { ProductGridSkeleton } from '../components/Skeletons';
import { getFirstImage } from '../utils/images';

const categories = [
  { label: "Men's Collection", slug: 'mens', description: 'Sherwanis, Bandhgalas & Kurta Sets', image: '/nawabiyat.jpg' },
  { label: "Women's Collection", slug: 'womens', description: 'Lehengas, Anarkalis & Sarees', image: '/noor_jahan.jpg' },
  { label: 'Accessories', slug: 'accessories', description: 'Jewellery, Clutches & More', image: '/shahi_guluband.jpg' },
];

const brandPillars = [
  { title: 'Master Artisans', body: 'Every piece is crafted by hereditary craftspeople whose families have practised these arts for generations.' },
  { title: 'Authentic Materials', body: 'We source pure silks from Varanasi, chanderi from Madhya Pradesh, and gold zari from Surat.' },
  { title: 'Heritage Technique', body: 'From hand-block printing to zardozi embroidery — every technique is rooted in Mughal court tradition.' },
];

const NewsletterSection: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      setSubscribed(true);
    } catch (err: any) {
      toast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-royal-green py-16 text-center">
      <div className="max-w-xl mx-auto px-4">
        <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">Stay in the loop</p>
        <h2 className="font-playfair text-3xl text-white mb-3">The Royal Dispatch</h2>
        <p className="font-montserrat text-white/70 text-sm mb-8">New collections, artisan stories, and exclusive previews — straight to your inbox.</p>
        {subscribed ? (
          <p className="font-montserrat text-white font-medium">✓ You're on the list. Shukriya!</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-royal-gold text-white px-5 py-3 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 disabled:opacity-70 transition-all"
            >
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = '/homepage.jpg';
    img.onload = () => setHeroLoaded(true);

    api.get('/products/featured').then(r => setFeatured(r.data.products)).catch(() => {}).finally(() => setLoadingFeatured(false));
    api.get('/products/trending').then(r => setTrending(r.data.products)).catch(() => {}).finally(() => setLoadingTrending(false));
  }, []);

  return (
    <div className="bg-royal-ivory">
      <Helmet>
        <title>Darbar — Luxury Mughal-Inspired Fashion</title>
        <meta name="description" content="Discover luxury Mughal-inspired fashion crafted by master artisans. Sherwanis, lehengas, jewellery and more — heritage meets luxury at Darbar." />
      </Helmet>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: "url('/homepage.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <p className="font-montserrat text-royal-gold text-sm tracking-[6px] uppercase mb-4">The Royal Court</p>
          <h1 className="font-playfair text-5xl md:text-7xl text-white leading-tight mb-6 max-w-2xl">
            Where Heritage<br />Meets Luxury
          </h1>
          <p className="font-montserrat text-white/80 text-lg max-w-md mb-10 leading-relaxed">
            Mughal-inspired fashion crafted by master artisans. Garments that carry centuries of craft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-royal-gold text-white px-8 py-4 rounded font-montserrat text-sm font-medium hover:bg-opacity-90 transition-all group"
            >
              Explore Collections
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-white/60 text-white px-8 py-4 rounded font-montserrat text-sm hover:bg-white/10 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">Browse by Category</p>
          <h2 className="font-playfair text-4xl">The Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-playfair text-2xl text-white mb-1">{cat.label}</h3>
                <p className="font-montserrat text-sm text-white/70">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">Handpicked</p>
              <h2 className="font-playfair text-4xl">Featured Pieces</h2>
            </div>
            <Link to="/collections" className="hidden sm:flex items-center gap-2 font-montserrat text-sm text-gray-600 hover:text-royal-gold transition-colors group">
              View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loadingFeatured ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(product => (
                <Link key={product._id || product.id} to={`/product/${product.slug}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                    <img
                      src={getFirstImage(product.images)}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-playfair text-base group-hover:text-royal-gold transition-colors leading-tight mb-1">{product.name}</h3>
                  <p className="font-montserrat text-sm text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">Most Loved</p>
              <h2 className="font-playfair text-4xl">Trending Now</h2>
            </div>
            <Link to="/collections" className="hidden sm:flex items-center gap-2 font-montserrat text-sm text-gray-600 hover:text-royal-gold transition-colors group">
              Browse all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loadingTrending ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map(product => (
                <Link key={product._id || product.id} to={`/product/${product.slug}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3 relative">
                    <img
                      src={getFirstImage(product.images)}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-royal-red text-white text-xs font-montserrat px-2 py-0.5 rounded">Trending</div>
                  </div>
                  <h3 className="font-playfair text-base group-hover:text-royal-gold transition-colors leading-tight mb-1">{product.name}</h3>
                  <p className="font-montserrat text-sm text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand story / pillars */}
      <section className="bg-royal-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">Our Commitment</p>
            <h2 className="font-playfair text-4xl text-white">The Darbar Promise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {brandPillars.map(pillar => (
              <div key={pillar.title} className="text-center">
                <div className="w-12 h-0.5 bg-royal-gold mx-auto mb-6" />
                <h3 className="font-playfair text-xl text-white mb-4">{pillar.title}</h3>
                <p className="font-montserrat text-sm text-white/70 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mughal Art gallery strip */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-3">The Inspiration</p>
          <h2 className="font-playfair text-4xl">Art of the Mughal Court</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 scrollbar-hide">
          {['/m1.jpg', '/m2.jpg', '/m3.jpg', '/m4.jpg'].map((img, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-80 rounded-xl overflow-hidden">
              <img src={img} alt={`Mughal art ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA banner */}
      <section className="bg-royal-gold py-16 text-center">
        <h2 className="font-playfair text-3xl md:text-4xl text-white mb-4">Begin Your Royal Journey</h2>
        <p className="font-montserrat text-white/80 text-sm mb-8 max-w-md mx-auto">
          Create an account to save your wishlist, track orders, and access exclusive member collections.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-royal-gold px-10 py-4 rounded font-montserrat text-sm font-semibold hover:bg-opacity-90 transition-all"
        >
          Join Darbar
        </Link>
      </section>
    </div>
  );
};

export default Home;
