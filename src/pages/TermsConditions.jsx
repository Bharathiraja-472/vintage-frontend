import React from 'react';
import { FileText } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-charcoal">Terms & Conditions</h1>
      <div className="h-0.5 w-12 bg-gold"></div>

      <div className="bg-white border p-6 sm:p-8 rounded-lg shadow-sm text-xs text-gray-600 leading-relaxed font-sans space-y-4">
        <div className="flex items-center space-x-2 text-charcoal font-bold mb-2">
          <FileText className="text-gold" size={18} />
          <span>Terms of Service Agreement</span>
        </div>

        <p>
          Welcome to the <strong>Vintage Collection</strong> e-commerce store. By accessing our catalog, registering an account, or checking out, you agree to comply with and be bound by the following Terms & Conditions of service.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">1. Catalog Content & Authenticity</h3>
        <p>
          All traditional saree designs, photographs, descriptions, and logos are properties of Vintage Collection. Any unauthorized replication of handloom designs is prohibited under local laws.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">2. Accuracy of Pricing & Inventory</h3>
        <p>
          We strive to state correct stock levels and prices. However, we reserve the right to cancel orders arising from database syncing errors or inventory shortages.
        </p>

        <h3 className="font-bold text-charcoal pt-2 text-sm uppercase">3. Customer Accounts</h3>
        <p>
          Users are responsible for safeguarding login passwords and API tokens. The store reserves the right to block accounts violating guidelines.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
