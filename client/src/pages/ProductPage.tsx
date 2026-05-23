import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ChevronRight, Star, Share2, Copy, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getFirstImage, normaliseImages } from '../utils/images';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Product } from '../types';

/* ─── Star Rating Input ──────────────────────────────────────────────── */
const StarInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="text-royal-gold transition-transform hover:scale-110"
        >
          <Star size={22} fill={(hovered || value) >= i ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};

/* ─── Review Form ────────────────────────────────────────────────────── */
interface ReviewFormProps {
  productId: string;
  onSubmitted: () => void;
  orders: { _id: string; orderNumber: string }[];
}
const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmitted, orders }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [orderId, setOrderId] = useState(orders[0]?._id || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast('Please select a star rating', 'error'); return; }
    if (body.length < 20) { toast('Review must be at least 20 characters', 'error'); return; }
    setLoading(true);
    try {
      await api.post('/reviews', { productId, orderId, rating, title, body });
      toast('Review submitted — thank you!', 'success');
      onSubmitted();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Could not submit review', 'error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
      <h3 className="font-playfair text-lg">Write a Review</h3>

      {orders.length > 1 && (
        <div>
          <label className="block font-montserrat text-xs font-medium text-gray-600 mb-1">Order</label>
          <select
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold"
          >
            {orders.map(o => (
              <option key={o._id} value={o._id}>Order #{o.orderNumber}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-montserrat text-xs font-medium text-gray-600 mb-2">Your Rating *</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block font-montserrat text-xs font-medium text-gray-600 mb-1">Review Title</label>
        <input
          type="text"
          maxLength={150}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Summarise your experience"
          className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold"
        />
      </div>

      <div>
        <label className="block font-montserrat text-xs font-medium text-gray-600 mb-1">Review *</label>
        <textarea
          required
          rows={4}
          minLength={20}
          maxLength={1000}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share details about fit, quality, and your overall experience (min 20 characters)..."
          className="w-full border border-gray-300 rounded px-3 py-2 font-montserrat text-sm focus:outline-none focus:ring-1 focus:ring-royal-gold resize-none"
        />
        <p className={`font-montserrat text-xs mt-0.5 ${body.length < 20 ? 'text-gray-400' : 'text-emerald-600'}`}>{body.length}/20 minimum</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-royal-gold text-white px-6 py-2.5 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

/* ─── Share Menu ─────────────────────────────────────────────────────── */
const ShareMenu: React.FC<{ name: string }> = ({ name }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const url = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied to clipboard!', 'success');
    } catch { toast('Could not copy link', 'error'); }
    setOpen(false);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${name} on Darbar 🛍️\n${url}`)}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-3 border border-gray-300 rounded text-gray-600 hover:border-royal-gold hover:text-royal-gold transition-colors"
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-40 w-52 overflow-hidden">
            <button
              onClick={copyLink}
              className="flex items-center gap-3 w-full px-4 py-3 font-montserrat text-sm hover:bg-gray-50 transition-colors"
            >
              <Copy size={15} className="text-gray-500" /> Copy Link
            </button>
            <button
              onClick={whatsapp}
              className="flex items-center gap-3 w-full px-4 py-3 font-montserrat text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              <MessageCircle size={15} className="text-emerald-600" /> Share on WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
const ProductPage = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getItems, addItem } = useRecentlyViewed();

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewMeta, setReviewMeta] = useState({ average: 0, count: 0 });
  const [eligibleOrders, setEligibleOrders] = useState<{ _id: string; orderNumber: string }[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [recentItems, setRecentItems] = useState(getItems());

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  const loadReviews = async (productId: string) => {
    const res = await api.get(`/reviews/product/${productId}`).catch(() => ({ data: { reviews: [], average: 0, count: 0 } }));
    setReviews(res.data.reviews || []);
    setReviewMeta({ average: res.data.average || 0, count: res.data.count || 0 });
    if (user) {
      const alreadyReviewed = (res.data.reviews || []).some(
        (r: any) => r.userId?._id === user._id || r.userId === user._id
      );
      setHasReviewed(alreadyReviewed);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchProductData = async () => {
      try {
        const { data: { product: p } } = await api.get(`/products/${slug}`);
        setProduct(p);
        if (p.colors?.length) setSelectedColor(p.colors[0]);
        if (p.sizes?.length) setSelectedSize(p.sizes[0]);

        // Track recently viewed
        addItem({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: getFirstImage(p.images),
        });
        setRecentItems(getItems());

        const [recsRes] = await Promise.all([
          api.get(`/products/${p._id}/recommendations`).catch(() => ({ data: { similar: [] } })),
          loadReviews(p._id),
        ]);
        setSimilar(recsRes.data.similar);

        // Fetch user's orders for this product to allow review
        if (user) {
          const ordRes = await api.get('/orders').catch(() => ({ data: { orders: [] } }));
          const eligible = (ordRes.data.orders || []).filter((o: any) =>
            o.paymentStatus === 'paid' &&
            o.items?.some((item: any) => item.productId === p._id || item.productId?._id === p._id)
          );
          setEligibleOrders(eligible.map((o: any) => ({ _id: o._id, orderNumber: o.orderNumber || o._id.slice(-6) })));
        }
      } catch {
        toast('Failed to load product', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-playfair text-3xl mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/collections" className="inline-block bg-royal-gold text-white px-8 py-3 rounded hover:bg-opacity-90 font-montserrat">
          Back to Collections
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, id: product._id || product.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    const pid = product._id || product.id;
    if (isInWishlist(pid)) { removeFromWishlist(pid); }
    else { addToWishlist({ ...product, id: pid }); }
  };

  const pid = product._id || product.id;
  const inWishlist = isInWishlist(pid);
  const filteredRecent = recentItems.filter(i => i.id !== pid).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>{product.name} — Darbar</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 155)} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-montserrat text-gray-500 mb-8 flex-wrap">
        <Link to="/" className="hover:text-royal-gold transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/collections?category=${product.category}`} className="hover:text-royal-gold transition-colors capitalize">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-gray-50">
            <img
              src={normaliseImages(product.images)[selectedImage] || getFirstImage(product.images)}
              alt={product.name}
              className="w-full h-auto max-h-[680px] object-contain"
              loading="lazy"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {normaliseImages(product.images).map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-royal-gold' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={imageUrl} alt={`view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-playfair text-3xl lg:text-4xl mb-2">{product.name}</h1>
            {reviewMeta.count > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-royal-gold">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} fill={i <= Math.round(reviewMeta.average) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="font-montserrat text-xs text-gray-500">{reviewMeta.average.toFixed(1)} ({reviewMeta.count} review{reviewMeta.count !== 1 ? 's' : ''})</span>
              </div>
            )}
            <p className="text-2xl font-semibold text-royal-gold">₹{product.price.toLocaleString('en-IN')}</p>
            {(product as any).compareAtPrice > product.price && (
              <p className="font-montserrat text-sm text-gray-400 line-through">₹{(product as any).compareAtPrice.toLocaleString('en-IN')}</p>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-montserrat text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Colour: <span className="normal-case font-normal text-gray-600">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded text-sm font-montserrat transition-colors ${selectedColor === color ? 'border-royal-gold bg-royal-gold/10 text-royal-gold' : 'border-gray-300 hover:border-royal-gold'}`}
                  >{color}</button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-montserrat text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded text-sm font-montserrat transition-colors ${selectedSize === size ? 'border-royal-gold bg-royal-gold/10 text-royal-gold' : 'border-gray-300 hover:border-royal-gold'}`}
                  >{size}</button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3.5 rounded font-montserrat text-sm font-medium transition-all ${added ? 'bg-royal-green text-white' : 'bg-royal-gold text-white hover:bg-opacity-90'}`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3.5 border rounded transition-colors ${inWishlist ? 'border-royal-red text-royal-red bg-red-50' : 'border-gray-300 text-gray-600 hover:border-royal-red hover:text-royal-red'}`}
              aria-label="Add to wishlist"
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <ShareMenu name={product.name} />
          </div>

          <div className="border-t pt-5 space-y-4">
            <div>
              <h3 className="font-montserrat text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-gray-600 font-montserrat text-sm leading-relaxed">{product.description}</p>
            </div>
            {product.fabric && product.fabric !== 'n/a' && (
              <div>
                <h3 className="font-montserrat text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Fabric</h3>
                <p className="text-gray-600 font-montserrat text-sm">{product.fabric}</p>
              </div>
            )}
          </div>

          {product.artisanStory && (
            <div className="bg-royal-cream border border-royal-gold/20 rounded-lg p-5">
              <h3 className="font-playfair text-lg mb-2">Artisan Story</h3>
              <p className="text-gray-600 font-montserrat text-sm leading-relaxed">{product.artisanStory}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16 border-t pt-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-playfair text-2xl">Customer Reviews</h2>
            {reviewMeta.count > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-royal-gold">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} fill={i <= Math.round(reviewMeta.average) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="font-montserrat text-sm text-gray-500">{reviewMeta.average.toFixed(1)} out of 5 ({reviewMeta.count} reviews)</span>
              </div>
            )}
          </div>
          {user && eligibleOrders.length > 0 && !hasReviewed && (
            <button
              onClick={() => setShowReviewForm(v => !v)}
              className="flex items-center gap-2 border border-royal-gold text-royal-gold px-5 py-2.5 rounded font-montserrat text-sm hover:bg-royal-gold hover:text-white transition-all"
            >
              <Star size={15} /> Write a Review
            </button>
          )}
          {hasReviewed && (
            <div className="flex items-center gap-2 font-montserrat text-sm text-emerald-600">
              <CheckCircle size={16} /> You've reviewed this product
            </div>
          )}
          {user && eligibleOrders.length === 0 && !hasReviewed && (
            <div className="flex items-center gap-2 font-montserrat text-xs text-gray-400">
              <Clock size={14} /> Purchase this product to write a review
            </div>
          )}
        </div>

        {showReviewForm && eligibleOrders.length > 0 && (
          <div className="mb-8">
            <ReviewForm
              productId={pid}
              orders={eligibleOrders}
              onSubmitted={() => {
                setShowReviewForm(false);
                loadReviews(pid);
              }}
            />
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Star size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="font-montserrat text-gray-400 text-sm">No reviews yet. Be the first to share your experience.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-gray-50 border border-gray-100 p-6 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-montserrat font-medium text-sm">{review.userId?.firstName} {review.userId?.lastName}</p>
                    <p className="font-montserrat text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                  <div className="flex text-royal-gold">
                    {[1,2,3,4,5].map(i => <Star key={i} size={13} fill={i <= review.rating ? 'currentColor' : 'none'} />)}
                  </div>
                </div>
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-montserrat mb-2">
                    <CheckCircle size={11} /> Verified Purchase
                  </span>
                )}
                {review.title && <h4 className="font-playfair font-medium mb-1">{review.title}</h4>}
                <p className="font-montserrat text-sm text-gray-600 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      {filteredRecent.length > 0 && (
        <div className="mb-16 border-t pt-12">
          <h2 className="font-playfair text-2xl mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {filteredRecent.map(item => (
              <Link key={item.id} to={`/product/${item.slug}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-lg mb-2 bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <p className="font-playfair text-xs truncate">{item.name}</p>
                <p className="font-montserrat text-xs text-royal-gold">₹{item.price.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {similar.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="font-playfair text-2xl mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map(item => (
              <Link key={(item as any)._id || item.id} to={`/product/${(item as any).slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-50">
                  <img src={getFirstImage(item.images)} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <h3 className="font-playfair text-base truncate">{item.name}</h3>
                <p className="text-royal-gold font-montserrat text-sm">₹{item.price.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
