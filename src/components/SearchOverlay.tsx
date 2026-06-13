import { useState, useEffect, useRef } from 'react';
import { Search, X, LoaderCircle, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onSelectProduct
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle immediate search input as typing
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top Search Header Panel */}
      <div className="border-b border-gray-100 py-6 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
            TNI
          </div>
          <span className="font-sans font-bold text-xs tracking-tighter uppercase text-charcoal">
            Live Search Bar
          </span>
        </div>
        <button type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition flex items-center gap-1.5 focus:outline-none"
        >
          <span className="text-xs font-mono uppercase text-gray-400">Close</span>
          <X className="w-5 h-5 text-charcoal" />
        </button>
      </div>

      {/* Main Bar Input Layout */}
      <div className="flex-1 overflow-y-auto px-6 md:px-24 py-12 max-w-4xl mx-auto w-full">
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search our scripture collections (e.g. Tee, Hoodie, Cap)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-14 pr-12 py-4 text-base md:text-lg focus:outline-none focus:ring-1 focus:ring-rust focus:bg-white transition"
          />
          {loading && (
            <LoaderCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rust animate-spin" />
          )}
        </div>

        {/* Dynamic List */}
        {query.trim().length > 0 ? (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-6">
              Search Results ({results.length})
            </h3>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex gap-4 p-3 border border-gray-100 rounded-2xl hover:border-rust hover:shadow-sm cursor-pointer transition duration-300 bg-white"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-sm text-charcoal truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5 capitalize">{product.category}</p>
                      <p className="text-sm font-semibold text-rust mt-1">GHC {product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-center px-2">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400 font-sans font-medium">
                  Seek and you shall find. Try searching another keyword for truth.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-6">
              Aesthetic Suggestions
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {['New Creation', 'Hoodie', 'Scripture Cap', 'Tee', 'Tote Bag', 'Bold Faith'].map((suggest) => (
                <button type="button"
                  key={suggest}
                  onClick={() => setQuery(suggest)}
                  className="bg-gray-50 hover:bg-beige text-xs font-semibold px-4 py-2 rounded-full border border-gray-100 text-gray-600 transition"
                >
                  {suggest}
                </button>
              ))}
            </div>

            <div className="mt-12 p-6 bg-beige/40 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h4 className="font-serif font-bold text-base text-charcoal">"Wear Who You Are In Christ"</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Our apparel is built around divine intention and premium materials. Experience scripture displayed in aesthetic urban layout structures.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
