import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { products, fetchProducts, loading } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch top products for home display
    fetchProducts({ limit: 8 });
  }, []);

  // Filter products for sections
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.filter(p => p.ratings >= 4.5).slice(0, 4);

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

  const specialCollections = [
    { name: 'Wedding Collection', slug: 'Wedding Collection', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80' },
    { name: 'Pongal Collection', slug: 'Pongal Collection', image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=500&q=80' },
    { name: 'Temple Collection', slug: 'Temple Collection', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80' }
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
                <p className="text-xs text-gray-300 line-clamp-2">{cat.desc}</p>
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

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-wide">New Arrivals</h2>
            <div className="h-0.5 w-12 bg-gold"></div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Freshly off the weavers loom</p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs uppercase tracking-wider font-bold text-gold hover:text-gold-dark transition-colors flex items-center space-x-1"
          >
            <span>View All New Arrivals</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Seasonal & Festivals Banner (Pongal / Diwali / Wedding Collections) */}
      <section className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">Seasonal & Festival Collections</h2>
            <div className="h-0.5 w-16 bg-gold mx-auto"></div>
            <p className="text-xs text-gold-premium uppercase tracking-widest">Woven for custom celebrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialCollections.map((col, idx) => (
              <Link
                key={idx}
                to={`/shop?specialCollection=${encodeURIComponent(col.slug)}`}
                className="group relative overflow-hidden rounded-lg aspect-video block shadow-lg border border-white/10"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-charcoal-dark/80 text-white border border-gold-premium/30 px-5 py-2 text-xs uppercase tracking-widest font-bold font-serif group-hover:bg-gold group-hover:text-charcoal transition-colors">
                    {col.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-wide">Best Sellers</h2>
            <div className="h-0.5 w-12 bg-gold"></div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Highest rated pieces chosen by connoisseurs</p>
          </div>
          <Link
            to="/shop?sort=popularity"
            className="text-xs uppercase tracking-wider font-bold text-gold hover:text-gold-dark transition-colors flex items-center space-x-1"
          >
            <span>View All Best Sellers</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-luxuryGray-dark/30 rounded-xl p-8 sm:p-12 shadow-premium">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-charcoal leading-tight">Our Heritage Story</h2>
            <div className="h-0.5 w-16 bg-gold"></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            Vintage Collection was established to preserve and elevate the timeless weaving practices of South India. Every thread in our collection is handspun by generational weavers in Mylapore, Kanchipuram, and Bangalore.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            By sourcing directly from artisans, we assure the highest grade of Zari and soft silk, while guaranteeing fair living wages for our master weavers. When you drape a saree or wear a silk shirt from our house, you wear history.
          </p>
          <div className="pt-2">
            <Link
              to="/about-us"
              className="text-xs uppercase tracking-wider font-bold text-gold hover:text-gold-dark transition-colors flex items-center space-x-1.5"
            >
              <span>Read Full Brand Journey</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80"
            alt="Traditional Saree Detail"
            className="rounded-lg object-cover h-56 w-full shadow-md border border-luxuryGray"
          />
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80"
            alt="Weaver Loom Weaving"
            className="rounded-lg object-cover h-56 w-full shadow-md border border-luxuryGray mt-6"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-beige/50 border-y border-gold/10 py-16 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-wide">What Our Patrons Say</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-luxuryGray-dark/20 p-6 rounded-lg shadow-sm space-y-4">
            <div className="text-amber-500 flex text-xs">
              {[...Array(5)].map((_, i) => <Sparkles key={i} size={12} className="fill-current" />)}
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "The Kanchipuram silk saree I ordered for my daughter's wedding is absolutely stunning. The zari work is fine, genuine, and looks extremely premium. Highly recommended!"
            </p>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal">Lakshmi Raman</h5>
              <p className="text-[10px] text-gray-400">Chennai, Tamil Nadu</p>
            </div>
          </div>

          <div className="bg-white border border-luxuryGray-dark/20 p-6 rounded-lg shadow-sm space-y-4">
            <div className="text-amber-500 flex text-xs">
              {[...Array(5)].map((_, i) => <Sparkles key={i} size={12} className="fill-current" />)}
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "I purchased three linen shirts and a silk veshti double pack for Pongal. The fabric quality is breathable and light, fitting perfectly. Truly luxury wear."
            </p>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal">Rajesh Krishnan</h5>
              <p className="text-[10px] text-gray-400">Bangalore, Karnataka</p>
            </div>
          </div>

          <div className="bg-white border border-luxuryGray-dark/20 p-6 rounded-lg shadow-sm space-y-4">
            <div className="text-amber-500 flex text-xs">
              {[...Array(5)].map((_, i) => <Sparkles key={i} size={12} className="fill-current" />)}
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "Outstanding customer service. Delivery was prompt and the gift packaging matches the luxury label. Will definitely buy again."
            </p>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal">Anjali Menon</h5>
              <p className="text-[10px] text-gray-400">Kochi, Kerala</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-wide">Share Your Drapery</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Tag #VintageCollection on Instagram</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=300&q=80'
          ].map((url, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-luxuryGray shadow-sm group relative">
              <img
                src={url}
                alt={`Instagram look ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white border border-white/50 px-2 py-1 uppercase tracking-widest font-semibold bg-charcoal/40">
                  View Look
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
