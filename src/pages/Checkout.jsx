import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShoppingBag, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    coupon,
    discountAmount,
    getSubtotal,
    getTax,
    getShipping,
    getGrandTotal,
    clearCart
  } = useContext(CartContext);

  // Address form states
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Payment simulation & overlay states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoGateway, setShowDemoGateway] = useState(false);
  const [demoOrderDetails, setDemoOrderDetails] = useState(null);

  // Pre-fill user profile address if available
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    if (user && user.addresses && user.addresses.length > 0) {
      const addr = user.addresses[0];
      setShippingAddress({
        street: addr.street || '',
        city: addr.city || '',
        state: addr.state || '',
        postalCode: addr.postalCode || '',
        country: addr.country || 'India'
      });
    }
  }, [user, cartItems]);

  const validateForm = () => {
    const s = shippingAddress;
    if (!s.street || !s.city || !s.state || !s.postalCode) {
      setErrorMessage('Please fill in all shipping address fields.');
      return false;
    }
    if (!billingSameAsShipping) {
      const b = billingAddress;
      if (!b.street || !b.city || !b.state || !b.postalCode) {
        setErrorMessage('Please fill in all billing address fields.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPlacingOrder(true);
    const finalBillingAddress = billingSameAsShipping ? shippingAddress : billingAddress;

    // Build items payload
    const itemsPayload = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.salePrice > 0 ? item.product.salePrice : item.product.price,
      size: item.size,
      color: item.color,
      image: item.product.images?.[0]
    }));

    const orderPayload = {
      items: itemsPayload,
      shippingAddress,
      billingAddress: finalBillingAddress,
      paymentMethod,
      couponUsed: coupon?.code || '',
      itemsPrice: getSubtotal(),
      taxPrice: getTax(),
      shippingPrice: getShipping(),
      discountPrice: discountAmount,
      totalPrice: getGrandTotal()
    };

    try {
      const { data } = await api.post('/orders', orderPayload);
      
      if (paymentMethod === 'COD') {
        clearCart();
        setIsPlacingOrder(false);
        navigate('/orders?success=true');
      } else {
        // Razorpay method selected
        if (data.isDemo) {
          // Trigger Demo simulated gateway overlay
          setDemoOrderDetails(data);
          setShowDemoGateway(true);
          setIsPlacingOrder(false);
        } else {
          // Open real Razorpay modal using credentials returned by backend
          openRealRazorpay(data);
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error occurred while creating order');
      setIsPlacingOrder(false);
    }
  };

  // Real Razorpay implementation handler
  const openRealRazorpay = (orderData) => {
    const { order, razorpayOrder } = orderData;
    
    const options = {
      key: orderData.razorpayKeyId || 'rzp_test_placeholder', 
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Vintage Collection',
      description: 'Luxury South Indian Fashion Order Checkout',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          setIsPlacingOrder(true);
          const verifyPayload = {
            orderId: order._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            isDemo: false
          };
          await api.post('/orders/verify', verifyPayload);
          clearCart();
          setIsPlacingOrder(false);
          navigate('/orders?success=true');
        } catch (err) {
          setErrorMessage('Signature verification failed. Please contact support.');
          setIsPlacingOrder(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || '9999999999'
      },
      theme: {
        color: '#D4AF37' // Gold theme
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setIsPlacingOrder(false);
  };

  // Simulated Razorpay payment verification
  const handleSimulatePayment = async () => {
    if (!demoOrderDetails) return;
    setIsPlacingOrder(true);
    setShowDemoGateway(false);

    try {
      const verifyPayload = {
        orderId: demoOrderDetails.order._id,
        razorpayOrderId: demoOrderDetails.razorpayOrder.id,
        razorpayPaymentId: `pay_demo_${Math.random().toString(36).substring(2, 12)}`,
        razorpaySignature: `sig_demo_${Math.random().toString(36).substring(2, 12)}`,
        isDemo: true
      };

      await api.post('/orders/verify', verifyPayload);
      clearCart();
      setIsPlacingOrder(false);
      navigate('/orders?success=true');
    } catch (err) {
      setErrorMessage('Mock transaction failed.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Secure Checkout</h1>
        <div className="h-0.5 w-12 bg-gold mt-1"></div>
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Address Details & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Card */}
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3">1. Shipping Address</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12 Temple Street, Mylapore"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil Nadu"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Postal Pin Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 600004"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Country</label>
                <input
                  type="text"
                  required
                  disabled
                  value={shippingAddress.country}
                  className="w-full p-2.5 border rounded bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Same address checkbox */}
            <label className="flex items-center space-x-2 text-xs text-gray-600 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                className="text-gold focus:ring-gold"
              />
              <span>Billing address is same as shipping address</span>
            </label>
          </div>

          {/* Billing Address Card (Conditionally shown) */}
          {!billingSameAsShipping && (
            <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4 animate-fadeIn">
              <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3">Billing Address</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street, appt"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                    className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    className="w-full p-2.5 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                    className="w-full p-2.5 border rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Pin Code</label>
                  <input
                    type="text"
                    required
                    placeholder="600004"
                    value={billingAddress.postalCode}
                    onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                    className="w-full p-2.5 border rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Card */}
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3">2. Payment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD Option */}
              <label
                className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-gold bg-gold/5 ring-1 ring-gold shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-gold focus:ring-gold"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Cash On Delivery (COD)</p>
                    <p className="text-[10px] text-gray-400">Pay cash upon secure home delivery</p>
                  </div>
                </div>
              </label>

              {/* Razorpay Option */}
              <label
                className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay' ? 'border-gold bg-gold/5 ring-1 ring-gold shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="text-gold focus:ring-gold"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Razorpay Checkout</p>
                    <p className="text-[10px] text-gray-400">Card, NetBanking, UPI, Wallet</p>
                  </div>
                </div>
                <CreditCard size={18} className="text-gold-dark" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3">3. Order Summary</h3>

            {/* Line Items */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => {
                if (!item.product) return null;
                const p = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
                return (
                  <div key={item._id} className="flex gap-3 text-xs items-center">
                    <img src={item.product.images?.[0]} alt={item.name} className="w-10 h-12 rounded object-cover" />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-charcoal truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} | Size: {item.size}</p>
                    </div>
                    <span className="font-semibold text-charcoal">₹{p * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            {/* Total Pricing panel */}
            <div className="space-y-2.5 text-xs border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST Tax (5%)</span>
                <span>₹{getTax()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>{getShipping() === 0 ? <span className="text-green-700 font-bold">Free</span> : `₹${getShipping()}`}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-bold bg-green-50 p-2 rounded">
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-charcoal border-t pt-3">
                <span>Grand Total</span>
                <span className="text-gold-dark text-base">₹{getGrandTotal()}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-55"
              >
                <span>{isPlacingOrder ? 'Processing Order...' : 'Complete Payment & Place Order'}</span>
              </button>
            </div>

            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center space-x-1">
              <ShieldCheck size={12} className="text-gold" />
              <span>SSL 256-Bit Encrypted Payment Check</span>
            </div>
          </div>
        </div>

      </form>

      {/* Simulated Razorpay Gateway Dialog Popup */}
      {showDemoGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6 shadow-2xl border-t-4 border-gold">
            <div className="text-center space-y-2">
              <CheckCircle size={36} className="text-gold mx-auto" />
              <h3 className="text-lg font-serif font-bold text-charcoal">Razorpay Sandbox Gateway</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Demo payment environment</p>
            </div>

            {/* Details */}
            <div className="border border-luxuryGray p-4 rounded text-xs space-y-2 bg-beige-light">
              <div className="flex justify-between">
                <span className="text-gray-500">Merchant:</span>
                <span className="font-semibold">VINTAGE COLLECTION</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-semibold text-gold-dark">{demoOrderDetails?.razorpayOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold">₹{getGrandTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User Email:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-500 leading-relaxed font-sans bg-amber-50 border border-amber-200 p-3 rounded">
              <p>• Since no Razorpay API keys were detected in `.env` config, the store runs in <strong>Demo Checkout Mode</strong>.</p>
              <p>• Clicking "Simulate Success" triggers verification, inventory decrement, and orders confirmation.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDemoGateway(false);
                  setErrorMessage('Demo transaction was aborted.');
                }}
                className="w-1/2 border py-2.5 text-xs uppercase font-bold text-gray-500 rounded"
              >
                Abort
              </button>
              <button
                onClick={handleSimulatePayment}
                className="w-1/2 bg-gold hover:bg-gold-dark text-charcoal py-2.5 text-xs uppercase font-bold rounded shadow transition-colors"
              >
                Simulate Success
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
