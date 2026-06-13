import { Landmark, ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const socialIcons = [
    { name: 'Instagram', url: 'https://instagram.com/thenewidentitywear', icon: 'IG' },
    { name: 'Facebook', url: 'https://facebook.com/thenewidentitywear', icon: 'FB' },
    { name: 'Twitter', url: 'https://twitter.com/thenewidentitywear', icon: 'X' },
    { name: 'YouTube', url: 'https://youtube.com/thenewidentitywear', icon: 'YT' }
  ];

  return (
    <>
      {/* Dynamic Infinite scrolling artist marquee banner */}
      <div className="w-full py-6 bg-charcoal overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee whitespace-nowrap">
          <span className="text-3xl text-white mx-8 font-script">thenewidentitywear</span>
          <span className="text-3xl font-bold text-white/20 uppercase tracking-[0.2em] mx-8 font-serif">Run The Race</span>
          <span className="text-3xl text-white mx-8 font-script">thenewidentitywear</span>
          <span className="text-3xl font-bold text-white/20 uppercase tracking-[0.2em] mx-8 font-serif">Run The Race</span>
          <span className="text-3xl text-white mx-8 font-script">thenewidentitywear</span>
          <span className="text-3xl font-bold text-white/20 uppercase tracking-[0.2em] mx-8 font-serif">Run The Race</span>
          <span className="text-3xl text-white mx-8 font-script">thenewidentitywear</span>
          <span className="text-3xl font-bold text-white/20 uppercase tracking-[0.2em] mx-8 font-serif">Run The Race</span>
        </div>
      </div>

      <footer id="main-footer" className="bg-white border-t border-gray-100 pt-16 pb-8 text-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Brand & Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
              TNI
            </div>
            <span className="font-sans font-bold text-sm tracking-tight capitalize">
              The New Identity Wear
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-sans mt-2">
            Christian apparel designed to inspire faith, spark conversations, and reflect your transformation in Christ. Inspired by 2 Corinthians 5:17.
          </p>
          {/* Social icons row */}
          <div className="flex items-center gap-3 mt-4">
            {socialIcons.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:text-white hover:bg-rust hover:border-rust flex items-center justify-center transition duration-300"
                title={soc.name}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Shop */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal">Shop Collection</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-rust underline-grow">
                All Streetwear New Drop
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-rust underline-grow">
                Aesthetic T-Shirts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-rust underline-grow">
                Faith Hoodies & Sweaters
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-rust underline-grow">
                Unstructured Caps
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal">Company</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-rust underline-grow">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('faq')} className="hover:text-rust underline-grow">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-rust underline-grow">
                Reach Our Ministry (Contact)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-rust underline-grow">
                Our Story & Vision
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal">Direct Support</h4>
          <ul className="flex flex-col gap-3 text-xs text-gray-400 font-mono">
            <li className="flex items-center gap-2 text-gray-500 font-medium">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href="mailto:thenewidentitywear@gmail.com" className="hover:text-rust">
                thenewidentitywear@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-gray-500 font-medium">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href="tel:0554312323" className="hover:text-rust">
                0554312323
              </a>
            </li>
            <li className="flex items-center gap-2 pt-2">
              <a
                href="https://wa.me/233554312323"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 transition px-3 py-1.5 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase border border-green-200"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
            </li>
          </ul>
          <p className="text-[11px] text-gray-400 leading-normal mt-2">
            Have queries on delivery? Read our{' '}
            <button onClick={() => onNavigate('about')} className="text-rust hover:underline underline-grow">
              Shipping & Return Policies
            </button>
            .
          </p>
        </div>
      </div>

      {/* Payment methods row */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12 pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pay Securely With:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-wider font-extrabold uppercase px-3 py-1.5 rounded border border-gray-200 bg-gray-50/50">
              MTN MOMO
            </span>
            <span className="text-[10px] tracking-wider font-extrabold uppercase px-3 py-1.5 rounded border border-gray-200 bg-gray-50/50">
              VODAFONE CASH
            </span>
            <span className="text-[10px] tracking-wider font-extrabold uppercase px-3 py-1.5 rounded border border-gray-200 bg-gray-50/50">
              VISA / MASTERCARD
            </span>
          </div>
        </div>

        {/* Dynamic secure badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans font-medium">
          <Landmark className="w-3.5 h-3.5 text-rust animate-pulse" />
          <span>Paystack Secured Endpoint</span>
        </div>
      </div>

      {/* Bottom Bar: Copyright policies */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8 pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-sans">
        <p>© {new Date().getFullYear()} The New Identity Wear. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('about')} className="hover:text-rust underline-grow">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('about')} className="hover:text-rust underline-grow">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  </>
  );
}
