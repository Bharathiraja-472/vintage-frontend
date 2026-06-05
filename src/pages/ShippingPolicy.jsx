import React from 'react';
import { Truck } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-charcoal">Shipping Policy</h1>
      <div className="h-0.5 w-12 bg-gold"></div>

      <div className="bg-white border p-6 sm:p-8 rounded-lg shadow-sm text-xs text-gray-600 leading-relaxed font-sans space-y-4">
        <div className="flex items-center space-x-2 text-charcoal font-bold mb-2">
          <Truck className="text-gold" size={18} />
          <span>Dispatch & Cargo Packing Standards</span>
        </div>

        <p>
          At <strong>Vintage Collection</strong>, we package all luxury garments with custom padding to ensure the delicate gold zarikari borders and linen stitches are delivered in perfect condition.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">1. Timeline for Processing</h3>
        <p>
          Orders are typically packed and dispatched within 24-48 business hours of payment confirmation or COD checkout.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">2. Delivery Charges</h3>
        <p>
          • Orders below ₹1500: ₹100 flat shipping fee.<br/>
          • Orders above ₹1500: <strong>Free Shipping</strong> nationwide.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">3. Tracking Your Order</h3>
        <p>
          Upon dispatch, you will receive an SMS and email notification with a tracking ID and link from our courier partners (Delhivery, BlueDart).
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
