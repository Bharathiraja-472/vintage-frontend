import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, User, Users, Baby, LayoutGrid } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'All',    label: 'All',    icon: LayoutGrid },
  { key: 'Men',    label: 'Men',    icon: User },
  { key: 'Women',  label: 'Women',  icon: Users },
  { key: 'Kids',   label: 'Kids',   icon: Baby },
];

const Wishlist = () => {
  const { wishlistItems, loading } = useContext(WishlistContext);
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="bg-white border rounded-xl p-12 max-w-lg mx-auto shadow-premium space-y-4">
          <Heart size={48} className="text-gray-300 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-charcoal">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            You haven't favorited any luxury traditional apparel items yet. Browse our collections and click the heart icon.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded transition-colors shadow-md"
            >
              Browse Collections <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Count items per category
  const countFor = (cat) =>
    cat === 'All'
      ? wishlistItems.length
      : wishlistItems.filter((p) => p.gender === cat).length;

  // Filtered list based on active tab
  const filtered =
    activeCategory === 'All'
      ? wishlistItems
      : wishlistItems.filter((p) => p.gender === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-luxuryGray-dark/20">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">My Wishlist</h1>
          <div className="h-0.5 w-12 bg-gold mt-1"></div>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
            {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-gold font-semibold hover:text-gold-dark transition-colors"
        >
          Continue Shopping <ArrowRight size={13} />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(({ key, label, icon: Icon }) => {
          const count = countFor(key);
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                isActive
                  ? 'bg-charcoal text-white border-charcoal shadow-md'
                  : 'bg-white text-gray-600 border-luxuryGray-dark/30 hover:border-gold hover:text-gold'
              }`}
            >
              <Icon size={13} />
              {label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-gold text-charcoal' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid or Empty State for filtered category */}
      {filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center space-y-3 shadow-sm">
          <Heart size={36} className="text-gray-200 mx-auto" />
          <p className="text-sm font-serif font-semibold text-charcoal">
            No {activeCategory} items in your wishlist
          </p>
          <p className="text-xs text-gray-400">
            Browse our {activeCategory.toLowerCase()} collection and add items you love.
          </p>
          <Link
            to={`/shop?gender=${activeCategory === 'All' ? '' : activeCategory}`}
            className="inline-block mt-2 bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded transition-colors"
          >
            Shop {activeCategory === 'All' ? 'All' : activeCategory}'s Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
