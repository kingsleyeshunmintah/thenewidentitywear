import { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { FAQS } from '../data';

export default function FaqView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqQuery, setFaqQuery] = useState('');

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = useMemo(() => {
    if (!faqQuery.trim()) return FAQS;
    const q = faqQuery.toLowerCase();
    return FAQS.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  return (
    <div id="faq-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Title area */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-rust bg-rust/5 px-2.5 py-1 rounded inline-block animate-pulse">
            HELP CENTER MINISTRIES
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight mt-2">
            Frequently Asked Queries
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-sans">
            Need prompt support on shipping times, sizing swatches, or merchant checkout? Browse our quick answers below.
          </p>
        </div>

        {/* FAQ Filter query */}
        <div className="relative mb-10 max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. shipping, returns, sizes)..."
            value={faqQuery}
            onChange={(e) => setFaqQuery(e.target.value)}
            className="w-full bg-white border border-gray-150 pl-11 pr-4 py-3 rounded-full text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rust transition-all"
          />
        </div>

        {/* Accordion Panels Stack */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  {/* Button header trigger */}
                  <button type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-serif text-sm md:text-base font-bold text-charcoal hover:text-rust focus:outline-none transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-rust shrink-0" /> {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-185 text-rust' : ''
                      }`}
                    />
                  </button>

                  {/* Body description panel with height transition */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-60 border-t border-gray-50' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="px-6 py-5 text-xs text-gray-500 font-sans leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <p className="font-serif font-bold text-[#333]">No matched queries found</p>
              <p className="text-xs text-gray-400 mt-1">Try typing another keyword (e.g. "size" or "Ghana").</p>
            </div>
          )}
        </div>

        {/* Support outreach panel card */}
        <div className="mt-12 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm text-center">
          <h4 className="font-serif text-base md:text-lg font-bold text-charcoal">Still have outstanding questions?</h4>
          <p className="text-xs text-gray-450 font-sans max-w-sm mx-auto leading-relaxed mt-1">
            We are always here to help you get the best fitting witness apparel. Direct WhatsApp lines are checked daily.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <a
              href="https://wa.me/233554312323"
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white hover:bg-green-700 text-xs font-bold tracking-wider px-6 py-2.5 rounded-full uppercase transition flex items-center gap-1.5"
            >
              Direct WhatsApp Support
            </a>
            <span className="text-xs text-gray-400 font-mono">OR</span>
            <a
              href="mailto:thenewidentitywear@gmail.com"
              className="border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-xs font-bold tracking-wider px-6 py-2.5 rounded-full uppercase transition flex items-center gap-1"
            >
              Email Support Office
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
