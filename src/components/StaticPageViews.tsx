interface StaticPageViewsProps {
  viewType: 'about' | 'privacy' | 'terms' | 'shipping';
  onNavigate: (page: string) => void;
}

export default function StaticPageViews({ viewType, onNavigate }: StaticPageViewsProps) {
  return (
    <div id="static-views-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        
        {viewType === 'about' && (
          <article className="space-y-12">
            
            {/* Mission Section */}
            <div className="text-center space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-rust bg-rust/5 px-3 py-1 rounded inline-block">ABOUT THE BRAND</span>
              <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-charcoal">Wear Your Testimony</h1>
              <p className="text-sm text-gray-400 font-sans italic max-w-lg mx-auto">
                "We wanted clothes that could be worn to Sunday service, a coffee shop, or a casual night out."
              </p>
            </div>

            {/* Parallax block / design header */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80"
                alt="The New Identity Wear team"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6 text-[#333] leading-relaxed text-sm md:text-base">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Our Mission</h2>
              <p className="bg-white p-6 rounded-2xl border border-gray-150 font-serif text-base md:text-lg italic text-[#555] shadow-sm">
                "At The New Identity Wear, we believe that what you wear should reflect who you are becoming. Inspired by 2 Corinthians 5:17, our mission is to empower believers to display their faith boldly and unapologetically. We design premium, minimal, and comfortable streetwear that sparks conversations and shares your testimony without you saying a word. You don't need a better mask -- you need a New Identity."
              </p>

              <h2 className="font-serif text-2xl font-bold text-charcoal pt-6">Our Story & Origin</h2>
              <p>
                "The New Identity Wear started with a simple question: why can't faith-focused apparel look as sharp and modern as the culture around us? We wanted clothes that could be worn to Sunday service, a coffee shop, or a casual night out -- pieces that start conversations about transformation. Inspired by 2 Corinthians 5:17, our brand is built on the truth that anyone in Christ is a new creation. The old is gone; the new has come."
              </p>

              <h2 className="font-serif text-2xl font-bold text-charcoal pt-6">Our Kingdom Vision</h2>
              <blockquote className="border-l-4 border-rust pl-5 italic text-gray-500 my-4 bg-gray-50/50 py-4 pr-4 rounded-r-xl">
                "The vision for The New Identity Wear is to provide modern, faith-based apparel that reminds believers of their transformation in Christ. Grounded in scripture, the brand replaces worldly labels with a kingdom-focused mindset. It is built to unify congregations, spark evangelism, and empower individuals to wear their beliefs boldly."
              </blockquote>

              <p>
                Every fabric weight, screen layout alignment, and typography selection is guided under strict craftsmanship. Each piece is a dynamic testimony, hand-carved to feel luxury on your skin and stand unashamed for the Gospel.
              </p>
            </div>

            {/* Core Values Bento Grid */}
            <div className="pt-10">
              <h3 className="font-serif text-2xl font-bold text-charcoal mb-6 text-center">Core Pillars of TNI Ministry</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xl font-bold text-rust mb-2 block">1. Faithfulness</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We commit our entire designing process, financial stewardship, and creative direction to the Lord first, acknowledging Christ in all elements.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xl font-bold text-olive mb-2 block">2. Conversations</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    We seek to transform passive streetwear into active preaching media—creating friendly avenues to start conversations about truth of grace.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xl font-bold text-gold mb-2 block">3. Premium Crafted</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    No subpar compromises. Combed organic cotton weights (up to 420 GSM) tailored cleanly to achieve absolute editorial standard silhouettes.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <button type="button"
                onClick={() => onNavigate('shop')}
                className="bg-charcoal text-white text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-full hover:bg-rust transition"
              >
                Browse Collections catalogue
              </button>
            </div>
          </article>
        )}

        {viewType === 'privacy' && (
          <article className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h1 className="font-serif text-3xl font-extrabold text-charcoal">Privacy & Disclosures</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: June 2026</p>
            <div className="text-xs md:text-sm text-gray-500 space-y-4 leading-relaxed font-sans">
              <p>
                At The New Identity Wear, we are committed to keeping your online transactional metadata and personal information completely confidential and secure. Your privacy is paramount to our ministry.
              </p>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">Data We Track</h3>
              <p>
                We collect your email Address, contact number, and local delivery coordinates when you explicitly place orders or subscribe to newsletters. These fields are secured inside server-side storage and we never sell user details under any conditions.
              </p>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">Secure MoMo Merchant Payments</h3>
              <p>
                All financial details are handled recursively using Paystack secured payment APIs. Neither our database nor external interfaces are exposed to your full card specifics or payment keys.
              </p>
            </div>
          </article>
        )}

        {viewType === 'terms' && (
          <article className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h1 className="font-serif text-3xl font-extrabold text-charcoal">Terms of Merchandise Agreement</h1>
            <p className="text-xs text-gray-400 font-mono">Last updated: June 2026</p>
            <div className="text-xs md:text-sm text-gray-500 space-y-4 leading-relaxed font-sans">
              <p>
                By accessing this e-commerce portal, you affirm that your details are valid and agree to standard terms of purchase.
              </p>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">Shipping Adjustments</h3>
              <p>
                Pricing of standard shipments is configured by region dynamically. We reserve the authority to update these values based on central transport rates.
              </p>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">Trademarked Graphics</h3>
              <p>
                All "The New Identity Wear" taglines, monograms, graphic typography layouts, and embroidery arrangements belong to TNI brand. Unsolicited branding copies are strictly prohibited.
              </p>
            </div>
          </article>
        )}

        {viewType === 'shipping' && (
          <article className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h1 className="font-serif text-3xl font-extrabold text-charcoal">Shipping & Hassel-Free Returns</h1>
            <div className="text-xs md:text-sm text-gray-500 space-y-4 leading-relaxed font-sans">
              <p>
                We seek to make delivery of your bold witness garments as seamless and cheap as possible.
              </p>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">Ghana Delivery Matrix</h3>
              <ul className="list-disc pl-5 space-y-1.5 font-medium text-gray-600">
                <li>Greater Accra Area: GHC 20 (Deliver inside 24 hours).</li>
                <li>FREE Greater Accra delivery on subtotal orders exceeding GHC 200.</li>
                <li>Ashanti, Central, Eastern, Voltas, and Northern regions: GHC 30-40 flat rate (Scheduled inside 2-3 business days using verified transport shuttles).</li>
              </ul>
              <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs pt-4">30-Day returns guideline</h3>
              <p>
                If your fit is slightly tight or large, we support easy exchanges inside 30 days. Items must arrive clean, unwashed, and placed back inside the zip lock tags. Email support at thenewidentitywear@gmail.com and we will set up the swap!
              </p>
            </div>
          </article>
        )}

      </div>
    </div>
  );
}
