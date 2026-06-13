import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all mandatory inputs.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await resp.json();

      if (data.success) {
        setSuccess('Your scripture ministry message has been dispatched! Our caretakers will connect with you inside 24 hours.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(data.message || 'Error executing submission.');
      }
    } catch (e) {
      setError('Connection failure. Please double-check network status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header summary */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-rust bg-rust/5 px-2.5 py-1 rounded inline-block">REACH TNI MINISTRY</span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight mt-2">Connect With Our Team</h1>
          <p className="text-xs text-gray-400 mt-2 font-sans max-w-md mx-auto">
            Have questions regarding sizes, custom bulk design drops, or partnership? Dispatched files arrive instantaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT 5 COLS: Direct contact channels & visual location deck */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-charcoal">Direct Inquiries</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Our team is physically operating out of Accra, Ghana. We represent both a high-fidelity streetwear brand and a kingdom-first community focus.
              </p>

              <hr className="border-gray-50" />

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs md:text-sm text-gray-600 font-sans">
                  <MapPin className="w-4 h-4 text-rust mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-charcoal">Showroom Location:</h4>
                    <p className="text-gray-500 mt-0.5 text-xs">House No. 12, Boundary Road, East Legon, Accra, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs md:text-sm text-gray-600 font-sans">
                  <Phone className="w-4 h-4 text-rust mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-charcoal">Calling Hotline:</h4>
                    <p className="text-gray-500 mt-0.5 text-xs">0554312323 (WhatsApp & Regular Calls)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs md:text-sm text-gray-600 font-sans">
                  <Mail className="w-4 h-4 text-rust mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-charcoal">Email Address:</h4>
                    <p className="text-gray-600 mt-0.5 text-xs font-mono">thenewidentitywear@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Vector showroom layout block */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">East Legon Showroom Hub</span>
              <div className="h-44 bg-beige mt-3 rounded-xl flex flex-col items-center justify-center p-4 border border-gray-150">
                <MapPin className="w-8 h-8 text-rust animate-bounce mb-2" />
                <span className="text-xs font-bold text-charcoal font-sans">East Legon Boundary Road Intersection</span>
                <span className="text-[10px] text-gray-400 font-mono mt-1">Accra, Ghana</span>
                <span className="mt-3 text-[9px] uppercase font-bold tracking-widest text-white bg-charcoal px-3 py-1 rounded-full">TNI Map View</span>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: validated contact form inputs */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Send A Digital Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-[#888] tracking-widest">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Antwi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-[#888] tracking-widest">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kwame@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-[#888] tracking-widest">Subject Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Bulk sizing or Order Shipping inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-[#888] tracking-widest">Message Text *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share your testimony, sizes request, or general support query with us..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-rust transition resize-none"
                />
              </div>

              {/* Status messages blocks */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-1.5 font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-150 rounded-2xl text-green-700 text-xs flex items-start gap-1.5 font-sans leading-normal">
                  <Check className="w-5 h-5 shrink-0 text-green-600" /> <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white text-xs font-bold tracking-widest uppercase py-3 rounded-full flex items-center justify-center gap-2 hover:bg-rust transition-colors duration-300 disabled:bg-gray-400 focus:outline-none"
              >
                {loading ? (
                  'Transmitting Inquiry File..'
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
