import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-charcoal">Privacy Policy</h1>
      <div className="h-0.5 w-12 bg-gold"></div>

      <div className="bg-white border p-6 sm:p-8 rounded-lg shadow-sm text-xs text-gray-600 leading-relaxed font-sans space-y-4">
        <div className="flex items-center space-x-2 text-charcoal font-bold mb-2">
          <ShieldCheck className="text-gold" size={18} />
          <span>Your Privacy Matters To Us</span>
        </div>

        <p>
          At <strong>Vintage Collection</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy details how we collect, use, store, and safeguard your details during checkout, registration, and payment.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">1. Information We Collect</h3>
        <p>
          We collect personal details such as your Name, Email Address, Phone Number, Shipping/Billing Address, and payment choices to successfully execute orders. Payment credentials (card/UPI) are handled directly by secure payment processors (e.g. Razorpay) and are never stored on our database.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">2. Use of Information</h3>
        <p>
          We use your information to dispatch products, notify you of shipping tracking, verify accounts, process cash or digital transactions, and optionally email catalog discounts.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">3. Data Security</h3>
        <p>
          Our database uses Secure Sockets Layer (SSL) 256-bit encryption for all incoming API routes, protecting user profile addresses and password hashes from leakage.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
