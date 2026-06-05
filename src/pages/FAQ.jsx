import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      q: 'Are your silk products Silk Mark certified?',
      a: 'Yes! All pure Mysore, Kanchipuram, and Banarasi silk products bear the official Silk Mark certification of India, verifying 100% genuine silk fibers.'
    },
    {
      q: 'Do you offer custom tailoring for blouses and kurtas?',
      a: 'Currently, we offer premium unstitched material and standard pre-stitched sizes. Custom tailors are scheduled to launch in our next expansion.'
    },
    {
      q: 'How long does shipping take?',
      a: 'Metro cities take 2-4 business days. Other regions take 4-7 business days. We pack garments in customized rigid cardboard boxes to preserve the Zari folds.'
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day hassle-free return window for unused, unwashed garments with original tags intact. Silk sarees must have their silk marks attached.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Currently, we ship across India. International logistics will be integrated soon.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-charcoal">FAQ</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        <p className="text-sm text-gray-500 font-sans">Frequently Asked Questions & Customer Support</p>
      </section>

      {/* Accordions */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border rounded-lg overflow-hidden shadow-sm transition-all"
            >
              <div
                onClick={() => toggleFAQ(idx)}
                className="p-5 flex items-center justify-between cursor-pointer select-none bg-beige-light/10 hover:bg-beige-light/30 transition-colors"
              >
                <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold text-charcoal">
                  <HelpCircle size={16} className="text-gold" />
                  <span>{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {isOpen && (
                <div className="p-5 border-t text-xs text-gray-500 leading-relaxed font-sans bg-white animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default FAQ;
