import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Check, ChevronLeft, ChevronRight, MessageSquare, Star, Mail } from 'lucide-react';
import { Product, Testimonial } from '../types';
import { PRODUCTS, TESTIMONIALS } from '../data';

interface HomeViewProps {
  onNavigate: (page: string, params?: any) => void;
  onAddProductToCart: (product: Product, size: string, color: any) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onOpenCart: () => void;
}

export default function HomeView({
  onNavigate,
  onAddProductToCart,
  wishlist,
  onToggleWishlist,
  onOpenCart
}: HomeViewProps) {
  // Testimonial Slider State
  const [testiIndex, setTestiIndex] = useState(0);

  // Newsletter Subscription Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const featuredProducts = PRODUCTS.slice(0, 4);

  const prevTestimonial = () => {
    setTestiIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTestiIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsLoading(true);
    setNewsError('');
    setNewsSuccess('');

    try {
      const resp = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await resp.json();
      if (data.success) {
        setNewsSuccess(data.message);
        setNewsletterEmail('');
      } else {
        setNewsError(data.message || 'Subscription failed.');
      }
    } catch (err) {
      setNewsError('Something went wrong. Please check your connection.');
    } finally {
      setNewsLoading(false);
    }
  };

  return (
    <div id="homepage-root" className="w-full">
      {/* ==================================================== */}
      {/* SECTION A — HERO (Asymmetric Grid Layout) */}
      {/* ==================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-6 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        {/* Decorative low-opacity watermark emblem in the background */}
        <div className="absolute top-[20%] left-[10%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full border border-gray-200/40 pointer-events-none flex items-center justify-center -z-10 animate-pulse duration-1000">
          <span className="font-serif text-[180px] font-extrabold text-gray-100/30 select-none">TNI</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: New Drop, portrait card with rounded corners */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-script text-6xl text-rust rotate-[-6deg] ml-4 block selection:bg-transparent">
              New Drop
            </span>
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer" onClick={() => onNavigate('shop')}>
              <img
                src="../assets/images/sd2.jpg"
                alt="The New Identity Oversized Apparel"
                referrerPolicy="no-referrer"
                className="w-full aspect-[3/4] object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#DDD]">Faith-first Drape</span>
                <h4 className="font-sans font-bold text-sm">2 Corinthians 5:17</h4>
              </div>
            </div>
          </div>

          {/* Center Column: Big serif display title & badges */}
          <div className="lg:col-span-6 text-center flex flex-col items-center justify-center px-4">
            <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-gray-400 mb-3 bg-gray-50 px-3 py-1 rounded-full border border-gray-200/50">
              NEW ARRIVALS
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-charcoal mb-4">
              Wear Who <br className="hidden md:inline" /> You Are <br className="hidden md:inline" /> In Christ
            </h1>
            <p className="text-xs md:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mt-2 font-sans">
              Premium faith-based streetwear designed to be a walking testimony. Forget your old labels. Put on your New Identity.
            </p>

            {/* Custom Monogram Circular Emblem Badge styled with the beautiful olive tone and dashed spin slow ring */}
            <div className="mt-8 relative w-32 h-32 flex items-center justify-center cursor-pointer group" onClick={() => onNavigate('shop')}>
              <div className="absolute inset-0 border border-dashed border-[#5A5A40]/30 rounded-full animate-spin-slow group-hover:border-rust transition-colors" />
              <div className="w-24 h-24 bg-olive rounded-full flex flex-col items-center justify-center text-white font-extrabold text-2xl shadow-md group-hover:bg-rust transition duration-300">
                <span className="leading-none text-xl tracking-tighter">TNI</span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-mono mt-0.5">wear</span>
              </div>
            </div>
            
            <button type="button"
              onClick={() => onNavigate('shop')}
              className="mt-8 bg-charcoal text-white text-xs tracking-widest font-extrabold uppercase px-8 py-3.5 rounded-full hover:bg-rust btn-sweep shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Shop Collection Drop
            </button>
          </div>

          {/* Right Column: Parallax visual panels & giveaway badges */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer" onClick={() => onNavigate('shop')}>
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80"
                alt="Bold Faith Fleece Hoodie Heavy Duty"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-rust border-4 border-white text-white flex flex-col items-center justify-center transform rotate-[15deg] shadow-md z-15 select-none animate-bounce">
                <span className="text-[10px] font-bold tracking-tighter">WIN</span>
                <span className="text-[8px] tracking-tight uppercase leading-none font-mono">GIVEAWAY</span>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer" onClick={() => onNavigate('shop')}>
              <img
                src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80"
                alt="Scripture structured dad caps"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION B — RUNNING TICKER / MARQUEE BAND */}
      {/* ==================================================== */}
      <section className="w-full bg-charcoal text-white py-5 overflow-hidden border-y border-gray-900 select-none">
        <div className="flex whitespace-nowrap overflow-hidden relative">
          <div className="flex animate-marquee py-2 gap-12 font-semibold">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center gap-12 select-none">
                <span className="font-sans font-extrabold text-sm md:text-base tracking-[0.2em] uppercase">
                  RUN THE RACE
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-script text-3xl text-rust lowercase tracking-normal">
                  thenewidentitywear
                </span>
                <span className="text-gray-500">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION C — TWO-COLUMN FEATURE BANNERS */}
      {/* ==================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Promo Block 1 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg aspect-[4/3] md:aspect-[16/10] border border-gray-100">
            <img
              src="../assets/images/JSvibe.jpg"
              alt="Run the Race Collection"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-xs font-mono uppercase tracking-widest text-rust mb-1 text-gold">THE RUNNER</span>
              <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold tracking-tight mb-2">
                Run The Race
              </h2>
              <p className="text-xs text-gray-300 max-w-xs mb-6 font-sans leading-relaxed">
                "Let us run with endurance the race that is set before us." - Hebrews 12:1. Heavy utility clothing.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => onNavigate('shop')} className="bg-white text-charcoal text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-rust hover:text-white transition duration-300">
                  Shop Now
                </button>
                <button type="button" onClick={() => onNavigate('about')} className="border border-white/60 text-white text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-white/10 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Promo Block 2 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg aspect-[4/3] md:aspect-[16/10] border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80"
              alt="Purpose Collection New creation hoodies and caps"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 text-white">
              <span className="text-xs font-mono uppercase tracking-widest text-[#DDD] mb-1 text-gold">PURPOSE APPAREL</span>
              <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold tracking-tight mb-2">
                Purpose Collection
              </h2>
              <p className="text-xs text-gray-300 max-w-xs mb-6 font-sans leading-relaxed">
                Empower your spirit and elevate your style. Discover meaning in every premium woven thread.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => onNavigate('shop')} className="bg-white text-charcoal text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-rust hover:text-white transition duration-300">
                  Shop Now
                </button>
                <button type="button" onClick={() => onNavigate('about')} className="border border-white/60 text-white text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-white/10 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION D — FEATURED PRODUCTS GRID */}
      {/* ==================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 bg-white/50 border border-gray-100 rounded-[3xl]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-rust">CHOSEN DROP FOR EVERYDAY</span>
          <p className="text-sm md:text-base text-gray-500 font-sans leading-relaxed mt-2.5">
            Essential pieces designed for everyday wear, built around purpose and intentional living.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const isSaved = wishlist.includes(p.id);
            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image card */}
                <div className="relative rounded-t-2xl overflow-hidden aspect-square bg-gray-50">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  />
                  {/* Category eye-brow */}
                  <span className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm border border-gray-100 text-charcoal px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider rounded-full">
                    GHC {p.price.toFixed(2)}
                  </span>
                  {/* Wishlist Heart Pop toggle */}
                  <button type="button"
                    onClick={() => onToggleWishlist(p.id)}
                    className="absolute right-3 top-3 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 text-charcoal hover:text-red-500 focus:outline-none transition active:scale-75"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 transition ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Info block */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 onClick={() => onNavigate('product', { id: p.id })} className="font-sans font-bold text-sm text-[#111] hover:text-rust cursor-pointer line-clamp-1">{p.name}</h3>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">{p.sku}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed h-8 mb-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                    <span className="text-xs font-mono font-medium text-gray-400 capitalize">
                      {p.gender} • {p.sizes.join(', ')}
                    </span>
                    <button type="button"
                      onClick={() => onNavigate('product', { id: p.id })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rust hover:text-charcoal transition"
                    >
                      Buy Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button type="button"
            onClick={() => onNavigate('shop')}
            className="border border-charcoal text-charcoal text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION E — MISSION STATEMENT BAND */}
      {/* ==================================================== */}
      <section className="w-full bg-cream py-16 md:py-24 border-y border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#999] bg-white px-3 py-1 rounded-full border border-gray-200/50">
            OUR MISSION
          </span>
          <p className="font-serif text-lg md:text-2xl italic font-medium leading-relaxed text-[#222] mt-6 max-w-2xl mx-auto">
            "At The New Identity Wear, we believe that what you wear should reflect who you are becoming. Inspired by <span className="font-bold underline text-rust">2 Corinthians 5:17</span>, our mission is to empower believers to display their faith boldly and unapologetically."
          </p>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-sans mt-4 max-w-md mx-auto">
            We design premium, minimal, and comfortable streetwear that sparks conversations and shares your testimony without you saying a word. You don't need a better mask -- you need a New Identity.
          </p>
          <button type="button"
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rust hover:text-charcoal mt-6 underline-grow"
          >
            Learn more about our journey <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION F — DIAGONAL/SKEWED IMAGE COLLAGE BAND */}
      {/* ==================================================== */}
      <section className="relative w-full bg-[#151515] py-24 md:py-32 overflow-hidden border-y border-black">
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center select-none pointer-events-none">
          <span className="font-serif font-black text-[120px] md:text-[200px] text-white whitespace-nowrap tracking-tighter">
            THE NEW CREATION
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md text-white">
            <span className="text-[10px] uppercase tracking-widest text-[#AAA] font-mono leading-none">CULTURAL REVELATION</span>
            <h2 className="font-serif text-3.5xl md:text-5xl font-extrabold tracking-tight mt-2 mb-4">
              Transformation <br className="hidden md:inline" /> in Style
            </h2>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Ditching the superficial constructs of temporary modern trends. Bold lettering structure meets high density textile drapes carefully woven in Ghana. Putting on the character of a New Creature.
            </p>
          </div>

          {/* Skewed small product images collage grid */}
          <div className="flex gap-4 transform rotate-[-3deg] skew-y-[-2deg]">
            <div className="flex flex-col gap-4 mt-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg bg-gray-900 border border-white/10">
                <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80" alt="apparel thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg bg-gray-900 border border-white/10">
                <img src="../assets/images/JSvibe.jpg" alt="apparel thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover animate-float" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg bg-gray-900 border border-white/10">
                <img src="../assets/images/sd2.jpg" alt="apparel thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg bg-gray-900 border border-white/10">
                <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80" alt="apparel thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION G — "LIVE ON PURPOSE" PRODUCT SPOTLIGHT */}
      {/* ==================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Oversized text titles */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h3 className="font-sans font-black text-5xl md:text-7xl leading-tight text-charcoal tracking-tighter">
              LIV ON <br /> PURPOSE.
            </h3>
            <span className="text-xs uppercase tracking-[0.2em] text-[#AAA] font-bold mt-2 font-mono">
              ACT WITH SPIRITUAL INTENTION
            </span>
          </div>

          {/* Portrait models overlap */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
                alt="Live on Purpose model style"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlay float animation card */}
            <div className="absolute -bottom-6 -left-6 w-36 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-float z-15">
              <img
                src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80"
                alt="TNI Cap detailed view"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description Block lines */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <h4 className="font-serif text-xl font-bold text-charcoal">"The New Creation"</h4>
            <p className="text-xs text-gray-500 leading-relaxed mt-4">
              "Behold, all things have become new." Our New Creation signature t-shirts are customized to fit modern high-comfort aesthetics while keeping your faith unashamed.
            </p>
            <button type="button"
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1 text-xs font-bold text-rust hover:text-charcoal mt-6 border-b border-rust pb-1 w-fit transition duration-300"
            >
              Get yours now →
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION H — SECOND PRODUCT SPOTLIGHT (MIRRORED) */}
      {/* ==================================================== */}
      <section className="w-full bg-[#1A1A1A] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left panel is image first */}
          <div className="lg:col-span-4 order-2 lg:order-1 relative">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-white/5">
              <img
                src="../assets/images/JSvibe.jpg"
                alt="A family of believers wear hoodie"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-36 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1A1A1A] animate-float z-15">
              <img
                src="../assets/images/sd2.jpg"
                alt="New Creation Tee detail description"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Center details */}
          <div className="lg:col-span-3 order-3 lg:order-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#AAA] font-mono">BLESSED COMMUNITY</span>
            <h4 className="font-serif text-lg font-bold text-white mt-1">"A family of believers"</h4>
            <p className="text-xs text-gray-400 leading-relaxed mt-4">
              Step out in unity. Join a community of believers across ring-roads, workspaces, and congregations carrying witness unapologetically.
            </p>
            <button type="button"
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1 text-xs font-bold text-rust hover:text-[#CCC] mt-6 border-b border-rust pb-1 w-fit transition"
            >
              Explore community drop →
            </button>
          </div>

          {/* Right oversized heavy display serif */}
          <div className="lg:col-span-5 order-1 lg:order-3 text-right">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-500 font-mono">COMMUNITY VALUES</span>
            <h3 className="font-sans font-black text-5xl md:text-7xl leading-none text-white tracking-tighter mt-1">
              HE IS ALIVE.
            </h3>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION I — LIFESTYLE BANNER STRIP */}
      {/* ==================================================== */}
      <section className="w-full max-h-[350px] aspect-[16/6] relative overflow-hidden group select-none cursor-pointer" onClick={() => onNavigate('shop')}>
        <img
          src="../assets/images/JSvibe.jpg"
          alt="The New Identity Wear group of models styling shirts"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-75 scale-102 group-hover:scale-105 transition duration-[3000ms]"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 text-center">
          <div className="max-w-lg text-white">
            <p className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight">"Forget your old labels or past mistakes. Put on your New Identity."</p>
            <span className="inline-block mt-4 text-[10px] tracking-widest uppercase font-mono bg-white/10 px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition">
              Explore Urban Collection Dropped
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION J — COLLECTION CALLOUT WITH PROGRESS UNDERLINE */}
      {/* ==================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#999] font-mono">SEASONAL SELECTION</span>
            <h3 className="font-serif text-2xl md:text-3.5xl font-extrabold text-[#111] mt-2 mb-3">
              Bold Faith Collections
            </h3>
            {/* SVG line that dynamically appears drawn wide */}
            <div className="w-24 h-1 bg-rust rounded-full mb-6 animate-pulse" />

            {/* Micro layout bordered card */}
            <div className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm max-w-md">
              <span className="text-[10px] font-mono text-gray-400 block mb-1">FEATURED ARCHIVE #04</span>
              <p className="text-xs text-gray-500 leading-normal">
                Includes our best-selling "Bold Faith Hoodie" paired with the structured unstructured washed cotton "Scripture Cap". Built for seasons of action.
              </p>
              <button type="button"
                onClick={() => onNavigate('shop')}
                className="mt-6 w-full py-3 rounded-full text-xs font-bold tracking-widest uppercase text-white bg-charcoal hover:bg-rust transition duration-300 flex items-center justify-center gap-2"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 h-[400px] overflow-hidden rounded-3xl shadow-md border border-gray-100 cursor-pointer" onClick={() => onNavigate('shop')}>
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Transformed tote bags"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transitionduration-1000"
            />
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION K — TESTIMONIALS / "COMMUNITY LOVE" */}
      {/* ==================================================== */}
      <section className="w-full bg-cream py-16 md:py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-rust opacity-90">COMMUNITY LOVE</span>
            <h3 className="font-serif text-3xl font-extrabold text-charcoal tracking-tight mt-2">
              Hear From Our Believers Family
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Conversations regarding grace, truth, and transforming clothes across the continent.
            </p>
          </div>

          {/* Sibling Slider test */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative">
            <div className="md:col-span-5 relative flex items-center justify-center">
              {/* Overlapping offset cards simulating swiper */}
              <div className="absolute w-[90%] aspect-square bg-[#FAF9F5] rounded-3xl border border-gray-100 translate-x-[15px] translate-y-[-10px] rotate-[3deg] -z-10 shadow-sm" />
              <div className="absolute w-[95%] aspect-square bg-beige rounded-3xl border border-gray-100 translate-x-[-8px] translate-y-[8px] rotate-[-2deg] -z-10 shadow-sm" />
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-charcoal">
                <img
                  src={TESTIMONIALS[testiIndex].avatar}
                  alt={TESTIMONIALS[testiIndex].customerName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-2 text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-rust text-rust" />
                ))}
              </div>

              <blockquote className="font-serif text-[#333] italic text-sm md:text-base leading-relaxed mb-6">
                "{TESTIMONIALS[testiIndex].message}"
              </blockquote>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <div>
                  <h4 className="font-sans font-bold text-sm text-charcoal flex items-center gap-1.5">
                    {TESTIMONIALS[testiIndex].customerName}
                    {TESTIMONIALS[testiIndex].isVerified && (
                      <span className="inline-flex bg-blue-50 text-blue-600 rounded-full p-0.5" title="Verified Believer and customer">
                        <Check className="w-3 h-3 font-extrabold" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">{TESTIMONIALS[testiIndex].role}</p>
                </div>

                {/* Left and right trigger controls */}
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={prevTestimonial}
                    className="p-2 rounded-full border border-gray-100 hover:bg-beige transition cursor-pointer text-charcoal focus:outline-none"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button"
                    onClick={nextTestimonial}
                    className="p-2 rounded-full border border-gray-100 hover:bg-beige transition cursor-pointer text-charcoal focus:outline-none"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION L — NEWSLETTER SIGNUP */}
      {/* ==================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto bg-charcoal text-white rounded-[3xl] px-6 py-12 md:py-16 shadow-xl border border-black relative overflow-hidden">
          {/* subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rust/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-olive/10 rounded-full blur-2xl" />

          <span className="text-xs uppercase tracking-widest text-[#AAA] font-mono">SACRED COMMUNITY BULLETIN</span>
          <h3 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white mt-2 mb-4 leading-tight">
            Subscribe To Our Ministry Newsletter
          </h3>
          <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
            Get spiritual encouragement, exclusive drop updates, and secret discounts directly in your inbox. No spam. Only grace and truth.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Secure email (e.g. adwoa@example.com)..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-xs md:text-sm focus:outline-none focus:border-rust focus:bg-white/10 text-white placeholder:text-gray-500 transition duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={newsLoading}
              className="bg-white hover:bg-rust text-charcoal hover:text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow active:scale-95 disabled:bg-gray-700"
            >
              {newsLoading ? 'Subscribing..' : 'Subscribe'}
            </button>
          </form>

          {newsSuccess && (
            <p className="text-xs text-green-400 font-semibold mt-4 animate-pulse flex items-center justify-center gap-1">
              <Check className="w-4 h-4" /> {newsSuccess}
            </p>
          )}

          {newsError && (
            <p className="text-xs text-red-400 mt-4">
              {newsError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
