import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search, User, LogOut, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Men', path: '/shop?gender=Men' },
    { name: 'Women', path: '/shop?gender=Women' },
    { name: 'Kids', path: '/shop?gender=Kids' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal text-white shadow-premium border-b border-gold-premium/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gold transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif tracking-widest uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                Vintage
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-gold-premium border-l border-gold-premium/40 pl-2">
                Collection
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-widest hover:text-gold transition-colors luxury-underline ${
                  location.pathname + location.search === link.path ? 'text-gold' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-charcoal-light text-white text-xs px-4 py-2 pr-10 rounded-full border border-gold/20 focus:outline-none focus:border-gold w-64 transition-all duration-300 placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 text-gray-400 hover:text-gold">
                <Search size={16} />
              </button>
            </form>

            {/* Mobile Search Icon */}
            <button
              onClick={() => navigate('/shop')}
              className="lg:hidden text-gray-300 hover:text-gold transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative text-gray-300 hover:text-gold transition-colors">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative text-gray-300 hover:text-gold transition-colors">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-1 text-gray-300 hover:text-gold transition-colors focus:outline-none"
                  >
                    <User size={22} />
                    <span className="hidden md:inline-block text-xs uppercase tracking-widest max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 bg-charcoal-dark border border-gold-premium/20 rounded shadow-lg py-2 z-50 text-left">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-gray-400">Logged in as</p>
                        <p className="text-sm font-semibold truncate text-gold-premium">{user.name}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:text-gold text-gold-premium"
                        >
                          <ShieldAlert size={14} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-300 hover:text-gold transition-colors text-xs uppercase tracking-widest border border-gold/30 px-3 py-1.5 rounded hover:border-gold"
                >
                  <User size={14} />
                  <span className="hidden sm:inline-block">Login</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-dark border-t border-gold-premium/20 py-4 px-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search premium collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-charcoal text-white text-xs px-4 py-2.5 pr-10 rounded-md border border-gold/20 focus:outline-none focus:border-gold w-full"
            />
            <button type="submit" className="absolute right-3 top-3 text-gray-400">
              <Search size={16} />
            </button>
          </form>

          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-widest hover:text-gold ${
                  location.pathname + location.search === link.path ? 'text-gold font-bold' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
