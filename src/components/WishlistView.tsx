import { Heart, Trash, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface WishlistViewProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function WishlistView({
  wishlist,
  onToggleWishlist,
  onNavigate
}: WishlistViewProps) {
  // Query product records matching keys stored in client-side arrays
  const bookmarkedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div id="wishlist-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#999] bg-white px-2.5 py-1 rounded border border-gray-150 shadow-sm inline-block">
            MY COVENANT COLLECTION
          </span>
          <h1 className="font-serif text-3.5xl font-extrabold text-charcoal tracking-tight mt-2 pb-1">
            My Wishlist Favorites ({bookmarkedProducts.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Your saved testimony garments waiting for action. Click an item to expand color and size swatches.
          </p>
        </div>

        {bookmarkedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookmarkedProducts.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image panel */}
                <div className="relative rounded-t-2xl overflow-hidden aspect-square bg-gray-50">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 duration-501"
                  />
                  <span className="absolute left-3 top-3 bg-white/95 backdrop-blur-sm border border-gray-100 text-charcoal px-2.5 py-1 text-[11px] font-black rounded-full">
                    GHC {p.price.toFixed(2)}
                  </span>
                  
                  {/* Remove trash trigger */}
                  <button type="button"
                    onClick={() => onToggleWishlist(p.id)}
                    className="absolute right-3 top-3 p-1.5 rounded-full bg-white text-gray-400 hover:text-red-500 border border-gray-100 focus:outline-none transition-colors"
                    title="Remove item"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info block details */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 onClick={() => onNavigate('product', { id: p.id })} className="font-sans font-bold text-sm text-charcoal hover:text-rust cursor-pointer transition line-clamp-1">{p.name}</h3>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">{p.sku}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed min-h-8">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
                    <span className="text-[10px] font-mono text-gray-400 font-medium">
                      {p.gender} • {p.sizes.join(', ')}
                    </span>
                    <button type="button"
                      onClick={() => onNavigate('product', { id: p.id })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rust hover:text-charcoal transition"
                    >
                      Configure Fit <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-xl mx-auto">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-[#333]">Your wishlist is hollow</h3>
            <p className="text-xs text-gray-400 leading-normal max-w-xs mx-auto mt-1 font-sans">
              Discover unique christian streetwear designs and tap the heart icon on any card to cache them inside your directory.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button type="button"
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rust hover:underline focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              <button type="button"
                onClick={() => onNavigate('shop')}
                className="bg-charcoal text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-rust transition"
              >
                Start Shop CATALOGUE
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
