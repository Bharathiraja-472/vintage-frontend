import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  
  const navigate = useNavigate();

  const isFavorite = isInWishlist(product._id);
  const hasSale = product.salePrice > 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?msg=Please log in to manage your wishlist');
      return;
    }
    toggleWishlist(product._id);
  };

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?msg=Please log in to add items to cart');
      return;
    }
    try {
      // Add default size and color
      const defaultSize = product.sizes?.[0] || 'M';
      const defaultColor = product.colors?.[0] || 'Cream';
      await addToCart(product._id, 1, defaultSize, defaultColor);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert(err || 'Failed to add item to cart');
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-luxuryGray-dark/40 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col relative">
      
      {/* Wishlist Toggle Button Overlay */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-charcoal hover:text-red-500 transition-colors"
      >
        <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} className={isFavorite ? 'text-red-500' : ''} />
      </button>

      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasSale && (
          <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Sale
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-charcoal text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Out of Stock
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
            Low Stock
          </span>
        )}
        {product.specialCollection && product.specialCollection !== 'None' && (
          <span className="bg-gold text-charcoal text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-gold-dark/20">
            {product.specialCollection}
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="aspect-[3/4] block overflow-hidden bg-beige-light">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover hover-zoom-img"
          loading="lazy"
        />
      </Link>

      {/* Info Content */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">
            <span>{product.brand}</span>
            <span>{product.category?.name || 'Traditional'}</span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product._id}`} className="block">
            <h4 className="text-sm font-serif font-semibold text-charcoal group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {/* Reviews Star Rating */}
          <div className="flex items-center space-x-1.5 mt-1">
            <div className="flex text-amber-500">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-xs text-charcoal-light font-medium">{product.ratings}</span>
            <span className="text-[10px] text-gray-400">({product.numReviews})</span>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-luxuryGray">
          <div className="flex flex-col">
            {hasSale ? (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                <span className="text-sm font-bold text-red-600">₹{product.salePrice}</span>
              </>
            ) : (
              <span className="text-sm font-bold text-charcoal">₹{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className={`p-2 rounded bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
