import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    coupon,
    discountAmount,
    couponError,
    getSubtotal,
    getTax,
    getShipping,
    getGrandTotal
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setPromoSuccess('');
    if (couponCode.trim()) {
      try {
        await applyCoupon(couponCode.trim());
        setPromoSuccess('Promo code applied successfully!');
        setCouponCode('');
      } catch (err) {
        // error handled by CartContext
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setPromoSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="bg-white border rounded-xl p-12 max-w-lg mx-auto shadow-premium space-y-4">
          <ShoppingBag size={48} className="text-gray-300 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-charcoal">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            You haven't added any luxury South Indian fashion items to your shopping cart yet. Let's find something elegant.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded transition-colors shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Shopping Cart</h1>
        <div className="h-0.5 w-12 bg-gold mt-1"></div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            if (!item.product) return null;
            const itemPrice = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white border border-luxuryGray-dark/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <Link to={`/product/${item.product._id}`} className="w-20 sm:w-24 aspect-[3/4] rounded overflow-hidden bg-beige-light flex-shrink-0">
                  <img src={item.product.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-grow min-w-0 space-y-1">
                  <span className="text-[9px] text-gold uppercase tracking-widest font-bold block">{item.product.brand}</span>
                  <Link to={`/product/${item.product._id}`} className="hover:text-gold block">
                    <h4 className="text-sm font-serif font-semibold text-charcoal truncate">{item.product.name}</h4>
                  </Link>
                  <p className="text-[10px] text-gray-400">
                    Size: <span className="text-charcoal font-bold">{item.size}</span> | Color:{' '}
                    <span className="text-charcoal font-bold">{item.color}</span>
                  </p>

                  {/* Quantity Spinner */}
                  <div className="flex items-center space-x-2 border rounded p-0.5 bg-white w-24">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-1.5 text-gray-500 font-bold hover:text-black focus:outline-none disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="flex-grow text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-1.5 text-gray-500 font-bold hover:text-black focus:outline-none disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pricing & Delete */}
                <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="text-right">
                    <p className="text-sm font-bold text-charcoal">₹{itemPrice * item.quantity}</p>
                    <p className="text-[10px] text-gray-400">₹{itemPrice} each</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3">Order Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated GST (5%)</span>
                <span>₹{getTax()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{getShipping() === 0 ? <span className="text-green-700 font-bold">Free</span> : `₹${getShipping()}`}</span>
              </div>
              
              {/* Coupon applied summary */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-bold bg-green-50 p-2 rounded">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Coupon ({coupon?.code})</span>
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-charcoal border-t pt-3">
                <span>Grand Total</span>
                <span className="text-gold-dark">₹{getGrandTotal()}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/checkout"
                className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Promo Code Card */}
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal">Promotional Coupon</h4>
            
            {coupon ? (
              <div className="flex items-center justify-between bg-gold/10 text-charcoal border border-gold-premium/40 px-3 py-2 rounded text-xs">
                <div>
                  <span className="font-bold">{coupon.code}</span>
                  <span className="text-[10px] text-gray-500 ml-1.5">Applied</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-gray-500 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-white text-xs px-3 py-2 border border-luxuryGray-dark/30 focus:outline-none focus:border-gold rounded-l w-full placeholder-gray-400 uppercase"
                />
                <button
                  type="submit"
                  className="bg-charcoal text-white hover:bg-gold hover:text-charcoal text-xs font-bold uppercase tracking-wider px-4 rounded-r transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {promoSuccess && <p className="text-[11px] text-green-700 font-semibold">{promoSuccess}</p>}
            {couponError && <p className="text-[11px] text-red-700 font-semibold">{couponError}</p>}
            
            {/* Display Available Coupons */}
            <div className="pt-2 border-t text-[10px] text-gray-400 space-y-1">
              <p className="font-semibold text-gray-500">Available Demo Codes:</p>
              <p>• <span className="font-bold text-gold-dark">WELCOME10</span> (10% off, min ₹1000)</p>
              <p>• <span className="font-bold text-gold-dark">FESTIVE20</span> (20% off, min ₹3000)</p>
              <p>• <span className="font-bold text-gold-dark">GOLDEN500</span> (₹500 flat off, min ₹5000)</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
