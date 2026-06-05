import React from 'react';
import { Award, Landmark, Users, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-serif font-bold text-charcoal">Our Brand Story</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        <p className="text-sm text-gray-500 font-sans leading-relaxed">
          Vintage Collection is a celebration of South Indian handloom legacy and luxury traditional attire, crafted for those who value heritage, sustainability, and authentic styling.
        </p>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white border p-8 sm:p-12 rounded-xl shadow-premium">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal">Preserving Handloom Art</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            Founded in Chennai with a vision to connect local weavers directly to customers, Vintage Collection preserves age-old weaving techniques like direct vat-dyeing, high-warp alignments, and gold zari embroidery.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            Every garment in our catalog is handwoven, telling the story of its weavers. We sourcing only Silk Mark certified threads from Mysore and organic cotton from Coimbatore.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg aspect-video shadow-md border bg-beige-light">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
            alt="Hand weaving work"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Grid Values */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white border p-6 rounded-lg text-center space-y-3">
          <Landmark className="text-gold h-10 w-10 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">Historical Roots</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Designs inspired by temple architectures and Tamil heritage motifs.</p>
        </div>
        <div className="bg-white border p-6 rounded-lg text-center space-y-3">
          <Users className="text-gold h-10 w-10 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">Direct to Weaver</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Eliminating middlemen to pay fair living wages to local weaving families.</p>
        </div>
        <div className="bg-white border p-6 rounded-lg text-center space-y-3">
          <Award className="text-gold h-10 w-10 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">Certified Quality</h3>
          <p className="text-xs text-gray-500 leading-relaxed">100% purity assurance for silks, linen threads, and precious metal borders.</p>
        </div>
        <div className="bg-white border p-6 rounded-lg text-center space-y-3">
          <Heart className="text-gold h-10 w-10 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">Sustainable Weaves</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Hypoallergenic natural fabrics, children-safe dyes and green processing.</p>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
