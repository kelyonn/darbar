import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';

const ProductPage = () => {
  const { id } = useParams();
  console.log('ID from URL:', id); // Debugging

  const product = products.find(p => String(p.id) === id);
  console.log('Product found:', product); // Debugging

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <p>Product not found</p>
      </div>
    );
  }

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-3 aspect-h-4">
            {product?.images?.length > 0 ? (
              <img
                src={product.images[selectedImage] || product.images[0]} // Use selected image or fallback
                alt={product.name || "Product Image"}
                className="w-full h-auto max-h-[700px] object-contain rounded-lg"
                onError={(e) => (e.currentTarget.src = "/fallback.jpg")} // Fallback if image fails to load
              />
            ) : (
              <p className="text-gray-500">No Image Available</p>
            )}
          </div>
          <div className="flex space-x-4">
            {product?.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-royal-gold' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/fallback-thumbnail.jpg")}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="font-playfair text-3xl">{product.name}</h1>
          <p className="text-2xl font-semibold">₹{product.price.toLocaleString()}</p>
          
          {/* Colors */}
          {product.colors && (
            <div>
              <h3 className="font-montserrat text-lg mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color ? 'border-royal-gold bg-royal-gold/10' : ''
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && (
            <div>
              <h3 className="font-montserrat text-lg mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? 'border-royal-gold bg-royal-gold/10' : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart & Wishlist */}
          <div className="flex space-x-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-royal-gold text-white px-6 py-3 rounded hover:bg-opacity-90"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className={`p-3 border rounded ${
                isInWishlist(product.id) ? 'text-royal-red' : 'text-gray-600'
              }`}
            >
              <Heart />
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-montserrat text-lg mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Fabric */}
          {product.fabric && (
            <div>
              <h3 className="font-montserrat text-lg mb-2">Fabric</h3>
              <p className="text-gray-600">{product.fabric}</p>
            </div>
          )}

          {/* Artisan Story */}
          {product.artisanStory && (
            <div>
              <h3 className="font-montserrat text-lg mb-2">Artisan Story</h3>
              <p className="text-gray-600">{product.artisanStory}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
