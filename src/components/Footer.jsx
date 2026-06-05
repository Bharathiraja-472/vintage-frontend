import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldAlert } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal text-gray-300 border-t border-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-white tracking-widest uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
            VINTAGE COLLECTION
          </h3>
          <p className="text-xs leading-relaxed text-gray-400">
            A celebration of South Indian handloom legacy and luxury traditional attire. We design pure Kanchipuram silk sarees, linen garments, and heritage wedding wear for those who cherish authentic style.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links / Navigation */}
        <div>
          <h4 className="text-sm uppercase tracking-widest text-white font-bold mb-4 font-serif">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/shop" className="hover:text-gold transition-colors">All Collections</Link>
            </li>
            <li>
              <Link to="/shop?gender=Men" className="hover:text-gold transition-colors">Men's Wardrobe</Link>
            </li>
            <li>
              <Link to="/shop?gender=Women" className="hover:text-gold transition-colors">Women's Sarees</Link>
            </li>
            <li>
              <Link to="/shop?gender=Kids" className="hover:text-gold transition-colors">Kids Wear</Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-gold transition-colors">Our Brand Story</Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold transition-colors">FAQ & Support</Link>
            </li>
          </ul>
        </div>

        {/* Customer Policies */}
        <div>
          <h4 className="text-sm uppercase tracking-widest text-white font-bold mb-4 font-serif">Policies</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-gold transition-colors">Return Policy</Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-gold transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="/admin-login" className="hover:text-gold transition-colors text-gold/80 flex items-center space-x-1">
                <ShieldAlert size={12} />
                <span>Admin Login</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="space-y-4">
          <h4 className="text-sm uppercase tracking-widest text-white font-bold mb-4 font-serif">Contact Information</h4>
          <div className="space-y-2 text-xs text-gray-400">
            <p className="flex items-center space-x-2">
              <MapPin size={14} className="text-gold" />
              <span>12 Temple Street, Mylapore, Chennai, TN</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone size={14} className="text-gold" />
              <span>+91 98765 43210</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail size={14} className="text-gold" />
              <span>support@vintagecollection.com</span>
            </p>
          </div>

          <div className="pt-2">
            <h5 className="text-xs uppercase tracking-wider text-white font-bold mb-2 font-serif">Subscribe to luxury news</h5>
            {subscribed ? (
              <p className="text-xs text-gold">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-charcoal-light text-white text-xs px-3 py-2 border border-gold/20 focus:outline-none focus:border-gold rounded-l w-full placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-charcoal text-xs font-bold uppercase tracking-wider px-4 rounded-r transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Vintage Collection. All rights reserved. Designed for College Project Demonstration.</p>
      </div>
    </footer>
  );
};

export default Footer;
