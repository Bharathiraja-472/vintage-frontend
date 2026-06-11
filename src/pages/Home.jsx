import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const categoriesList = [
    {
      name: 'Men\'s Wear',
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80',
      path: '/shop?gender=Men'
    },
    {
      name: 'Women\'s Silks',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
      path: '/shop?gender=Women'
    },
    {
      name: 'Kids Traditional',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
      path: '/shop?gender=Kids'
    }
  ];

  return (
    <div className="space-y-16 pb-16">

      {/* Hero Banner */}
      <section className="relative bg-charcoal text-white overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center">
        {/* Background Overlay Graphic */}
        <div className="absolute inset-0 opacity-40 z-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/hero.png')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/95 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-20">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gold/10 text-gold-premium px-3.5 py-1.5 rounded-full border border-gold/30 w-fit text-xs uppercase tracking-widest font-bold">
              <Sparkles size={14} />
              <span>Weaving Royal Traditions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Elegance Woven In <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                Pure Gold Zari
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed font-sans">
              Discover the premium Vintage Collection of authentic South Indian handlooms. From royal Kanchipuram silk sarees to hand-spun linen shirts and wedding ensembles.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded shadow-lg transition-colors flex items-center space-x-2"
              >
                <span>Shop Catalog</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/shop?specialCollection=Premium+Collection"
                className="border border-white/40 hover:border-gold hover:text-gold text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded transition-colors"
              >
                <span>Premium Label</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            {/* Elegant Framed Image */}
            <div className="border border-gold-premium/40 p-3 bg-charcoal-light/35 rounded-lg max-w-sm relative">
              <div className="absolute -top-3 -left-3 bg-gold text-charcoal text-[10px] font-bold uppercase px-3 py-1 tracking-widest rounded shadow-md">
                Royal Label
              </div>
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                alt="South Indian Traditional Saree Model"
                className="rounded shadow-lg object-cover w-full h-[400px] border border-gold-premium/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-wide">Featured Categories</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Handloom masterpieces curated by departments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesList.map((cat, idx) => (
            <div
              key={idx}
              className="group bg-white border border-luxuryGray-dark/30 rounded-lg overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 relative flex flex-col h-96"
            >
              <div className="overflow-hidden flex-grow relative bg-beige-light">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-white space-y-2">
                <h3 className="text-lg font-serif font-bold">{cat.name}</h3>
                <Link
                  to={cat.path}
                  className="inline-flex items-center space-x-1 text-xs text-gold font-bold hover:text-gold-light transition-colors uppercase pt-2 tracking-wider"
                >
                  <span>Explore Now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="bg-beige/70 border-y border-gold/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <Award className="text-gold h-8 w-8" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">Pure Silk Guarantee</h4>
            <p className="text-[11px] text-gray-500">100% certified Silk Mark woven threads.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <Truck className="text-gold h-8 w-8" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">Pan-India Delivery</h4>
            <p className="text-[11px] text-gray-500">Secure luxury packing and shipping.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <RotateCcw className="text-gold h-8 w-8" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">7 Days Return</h4>
            <p className="text-[11px] text-gray-500">Easy and hassle-free return policy.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <ShieldCheck className="text-gold h-8 w-8" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal">Secure Payments</h4>
            <p className="text-[11px] text-gray-500">Razorpay encrypted and cash transactions.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
