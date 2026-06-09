import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, CreditCard, ChevronRight, MessageSquare, AlertTriangle } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user } = useContext(AuthContext);
  const { product, fetchProductById, addProductReview, products, fetchProducts, loading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  // Component States
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const prod = await fetchProductById(id);
        setActiveImage(getImageUrl(prod.images?.[0]) || '');
        setSelectedSize(prod.sizes?.[0] || '');
        setSelectedColor(prod.colors?.[0] || 'White');
        setQuantity(1);

        // Fetch related products in the same category
        if (prod.category) {
          const categorySlug = prod.category.slug;
          await fetchProducts({ category: categorySlug, limit: 5 });
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      }
    };
    loadDetails();
  }, [id]);

  // Extract related products (excluding the current one)
  useEffect(() => {
    if (product) {
      const filtered = products.filter((p) => p._id !== product._id).slice(0, 4);
      setRelatedProducts(filtered);
    }
  }, [products, product]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const hasSale = product.salePrice > 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleAddToCart = async (redirect = false) => {
    if (!user) {
      navigate('/login?msg=Please log in to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      if (redirect) {
        navigate('/checkout');
      } else {
        alert(`${product.name} added to cart successfully!`);
      }
    } catch (err) {
      alert(err || 'Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSuccess('');
    setReviewError('');

    if (!user) {
      setReviewError('You must be logged in to submit a review');
      return;
    }

    try {
      await addProductReview(product._id, rating, comment);
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gray-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-gold">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-gold">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Information Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-luxuryGray-dark/20 rounded-xl p-6 sm:p-8 shadow-premium">
        
        {/* Left Side: Product Gallery */}
        <div className="space-y-4">
          
          {/* Main Display Image */}
          <div className="aspect-[3/4] bg-beige-light rounded-lg overflow-hidden border border-luxuryGray relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Out of stock tag */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-charcoal text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-3">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(getImageUrl(img))}
                className={`aspect-[3/4] rounded border overflow-hidden bg-beige-light transition-all ${
                  activeImage === getImageUrl(img) ? 'border-gold ring-1 ring-gold shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} alt={`${product.name} look ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Specifications and Checkout Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{product.brand}</span>
            <h1 className="text-3xl font-serif font-bold text-charcoal mt-1">{product.name}</h1>
            
            {/* Star Ratings Summary */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.ratings) ? 'currentColor' : 'none'}
                    className={i < Math.round(product.ratings) ? '' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-charcoal">{product.ratings} Stars</span>
              <span className="text-xs text-gray-400">({product.numReviews} Verified Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-4 bg-beige-light p-4 rounded border border-gold/10">
            {hasSale ? (
              <>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 line-through">Original: ₹{product.price}</span>
                  <span className="text-2xl font-bold text-red-600">₹{product.salePrice}</span>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                  Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-charcoal">Price: ₹{product.price}</span>
            )}
          </div>

          {/* Inventory Alerts */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded">
              <AlertTriangle size={16} />
              <span>Low Stock Warning: Only {product.stock} items left in stock. Order soon!</span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-charcoal">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">{product.description}</p>
          </div>

          {/* Attributes Selectors (Size Only) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal block">Select Size</label>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes?.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-xs px-3 py-1.5 border transition-all ${
                    selectedSize === sz
                      ? 'bg-charcoal text-white border-charcoal font-bold'
                      : 'border-gray-200 hover:border-gold text-gray-600 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal block">Quantity</label>
              <div className="flex items-center space-x-3 w-32 border border-gray-200 rounded p-1 bg-white">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="px-2 py-0.5 text-gray-500 font-bold hover:text-black focus:outline-none disabled:opacity-30"
                >
                  -
                </button>
                <span className="flex-grow text-center text-xs font-bold">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-0.5 text-gray-500 font-bold hover:text-black focus:outline-none disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-luxuryGray">
            <button
              onClick={() => handleAddToCart(false)}
              disabled={isOutOfStock}
              className={`flex-grow bg-charcoal hover:bg-charcoal-light text-white text-xs font-bold uppercase tracking-wider py-4 rounded transition-colors flex items-center justify-center space-x-2 shadow-md ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingBag size={16} />
              <span>Add To Cart</span>
            </button>

            <button
              onClick={() => handleAddToCart(true)}
              disabled={isOutOfStock}
              className={`flex-grow bg-gold hover:bg-gold-dark text-charcoal text-xs font-bold uppercase tracking-wider py-4 rounded transition-colors flex items-center justify-center space-x-2 shadow-md ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CreditCard size={16} />
              <span>Buy It Now</span>
            </button>

            <button
              onClick={() => toggleWishlist(product._id)}
              className={`p-4 border rounded hover:bg-beige-light transition-all flex items-center justify-center ${
                isFavorite ? 'border-red-200 text-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
          </div>

        </div>

      </div>

      {/* Review Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white border border-luxuryGray-dark/20 rounded-xl p-6 sm:p-8 shadow-premium">
        
        {/* Left Side: Review statistics & Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-charcoal">Customer Reviews</h2>
            <div className="h-0.5 w-12 bg-gold"></div>
          </div>

          {/* Write a review form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 border border-gold/10 p-4 rounded bg-beige-light">
              <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>Write a Review</span>
              </h4>

              {reviewSuccess && <p className="text-xs text-green-700 font-semibold">{reviewSuccess}</p>}
              {reviewError && <p className="text-xs text-red-700 font-semibold">{reviewError}</p>}

              {/* Rating selection */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Select Rating</label>
                <div className="flex space-x-1.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setRating(stars)}
                      className="focus:outline-none"
                    >
                      <Star size={16} fill={stars <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details of your experience with this garment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-luxuryGray-dark/30 rounded focus:outline-none focus:border-gold placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal text-white hover:bg-gold hover:text-charcoal py-2 text-xs uppercase tracking-widest font-bold rounded transition-colors"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="bg-beige-light p-4 rounded border text-center space-y-3">
              <p className="text-xs text-gray-500">Please log in to submit a review for this product.</p>
              <Link
                to="/login"
                className="inline-block bg-charcoal text-white hover:bg-gold hover:text-charcoal text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded transition-colors"
              >
                Login Account
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-2 space-y-6 max-h-[500px] overflow-y-auto pr-2">
          {product.reviews?.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded text-gray-400 text-xs">
              No reviews have been written yet for this product. Be the first!
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((rev, index) => (
                <div key={index} className="border-b border-luxuryGray pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-charcoal">{rev.name || 'Anonymous User'}</h5>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-amber-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          className={i < rev.rating ? '' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-charcoal">{rev.rating} Stars</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-charcoal">Related Masterpieces</h3>
            <div className="h-0.5 w-12 bg-gold"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
