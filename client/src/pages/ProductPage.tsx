import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  const product = products.find(p => String(p.id) === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="font-playfair text-3xl mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/collections"
          className="inline-block bg-royal-gold text-white px-8 py-3 rounded hover:bg-opacity-90 font-montserrat"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const categoryLabel =
    product.category === 'mens'
      ? "Men's Collection"
      : product.category === 'womens'
      ? "Women's Collection"
      : 'Accessories';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-montserrat text-gray-500 mb-8">
        <Link to="/" className="hover:text-royal-gold">Home</Link>
        <ChevronRight size={14} />
        <Link
          to={`/${product.category}`}
          className="hover:text-royal-gold"
        >
          {categoryLabel}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg bg-gray-50">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-auto max-h-[700px] object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-royal-gold'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-playfair text-3xl mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-royal-gold">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-montserrat text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Colour
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded text-sm font-montserrat transition-colors ${
                      selectedColor === color
                        ? 'border-royal-gold bg-royal-gold/10 text-royal-gold'
                        : 'border-gray-300 hover:border-royal-gold'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-montserrat text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded text-sm font-montserrat transition-colors ${
                      selectedSize === size
                        ? 'border-royal-gold bg-royal-gold/10 text-royal-gold'
                        : 'border-gray-300 hover:border-royal-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3 rounded font-montserrat text-sm font-medium transition-all ${
                added
                  ? 'bg-royal-green text-white'
                  : 'bg-royal-gold text-white hover:bg-opacity-90'
              }`}
            >
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 border rounded transition-colors ${
                isInWishlist(product.id)
                  ? 'border-royal-red text-royal-red'
                  : 'border-gray-300 text-gray-600 hover:border-royal-red hover:text-royal-red'
              }`}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={20}
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-montserrat text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-600 font-montserrat text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Fabric */}
          {product.fabric && product.fabric !== 'n/a' && (
            <div>
              <h3 className="font-montserrat text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Fabric
              </h3>
              <p className="text-gray-600 font-montserrat text-sm">{product.fabric}</p>
            </div>
          )}

          {/* Artisan Story */}
          {product.artisanStory && (
            <div className="bg-royal-cream border border-royal-gold/20 rounded-lg p-4">
              <h3 className="font-playfair text-lg mb-2">Artisan Story</h3>
              <p className="text-gray-600 font-montserrat text-sm leading-relaxed">
                {product.artisanStory}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
