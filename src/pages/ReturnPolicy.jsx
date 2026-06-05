import React from 'react';
import { RotateCcw } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-charcoal">Return Policy</h1>
      <div className="h-0.5 w-12 bg-gold"></div>

      <div className="bg-white border p-6 sm:p-8 rounded-lg shadow-sm text-xs text-gray-600 leading-relaxed font-sans space-y-4">
        <div className="flex items-center space-x-2 text-charcoal font-bold mb-2">
          <RotateCcw className="text-gold" size={18} />
          <span>7 Days Returns & Exchange</span>
        </div>

        <p>
          We want you to be completely delighted with your traditional purchase. If for any reason you are not satisfied, you may return the item within <strong>7 days</strong> of delivery.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">1. Return Qualifications</h3>
        <p>
          • The garment must be unwashed, unworn, and unaltered.<br/>
          • Original tag labels and price stickers must remain intact.<br/>
          • The Silk Mark label and packaging box must accompany returned silk sarees.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">2. Refund Processing</h3>
        <p>
          Once we receive and inspect the returned item, a refund will be processed to your bank account or Razorpay wallet within 5-7 business days. COD orders are refunded via direct bank transfers.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
