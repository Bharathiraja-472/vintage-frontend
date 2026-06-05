import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-serif font-bold text-charcoal">Contact Us</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        <p className="text-sm text-gray-500 font-sans">Have questions about our collections or custom orders? Write to us.</p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border p-8 sm:p-12 rounded-xl shadow-premium">
        
        {/* Info Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold text-charcoal">Get In Touch</h2>
          
          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex items-center space-x-3.5">
              <MapPin size={20} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-charcoal">Registered Office</p>
                <p>12 Temple Street, Mylapore, Chennai, Tamil Nadu - 600004</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Phone size={20} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-charcoal">Phone & Support</p>
                <p>+91 98765 43210 (Mon-Sat, 9:00 AM to 6:00 PM IST)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Mail size={20} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-charcoal">Electronic Mail</p>
                <p>support@vintagecollection.com</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-charcoal">Wholesale & Bulk Orders</p>
            <p>For marriage trousseaus, corporate gifts, and bulk veshti distribution, please email <strong>wholesale@vintagecollection.com</strong>.</p>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="space-y-4 bg-beige-light/35 p-6 rounded-lg border">
          <h3 className="text-sm uppercase tracking-wider font-bold text-charcoal font-serif">Send Us A Message</h3>
          
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-white border p-6 rounded shadow-sm">
              <CheckCircle2 size={32} className="text-green-600 animate-bounce" />
              <h4 className="text-xs font-bold text-charcoal uppercase">Message Sent Successfully</h4>
              <p className="text-[11px] text-gray-400">Thank you for writing. Our customer support will respond back within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal text-white hover:bg-gold hover:text-charcoal py-3 font-bold uppercase tracking-widest text-[10px] rounded transition-colors flex items-center justify-center space-x-1 shadow"
              >
                <Send size={12} />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default ContactUs;
