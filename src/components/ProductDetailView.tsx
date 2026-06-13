import { useState, useMemo } from 'react';
import { Heart, Star, Check, Sparkles, Sliders, Truck, RefreshCw, ChevronLeft, ChevronRight, LoaderCircle, ArrowRight } from 'lucide-react';
import { Product, Color } from '../types';
import { PRODUCTS } from '../data';

interface ProductDetailViewProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
  onAddProductToCart: (product: Product, size: string, color: Color) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onOpenCart: () => void;
}

export default function ProductDetailView({
  productId,
  onNavigate,
  onAddProductToCart,
  wishlist,
  onToggleWishlist,
  onOpenCart
}: ProductDetailViewProps) {
  // Find current product in our dataset matching requested id
  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  }, [productId]);

  // Gallery main image swap state
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);

  // Swatches Selection States
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0] || { name: 'Neutral', hex: '#CCC' });
  const [quantity, setQuantity] = useState<number>(1);

  // Accordion Section Tabs
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  // Add to cart feedback loaders
  const [cartLoading, setCartLoading] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sync state if product ID shifts
  useMemo(() => {
    setActiveImage(product.images[0]);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0] || { name: 'Neutral', hex: '#CCC' });
    setQuantity(1);
    setAddedSuccess(false);
  }, [product]);

  const isSaved = wishlist.includes(product.id);

  // Recommendations: Other products from identical category or simply offset
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

  const handleAddToCart = () => {
    setCartLoading(true);
    setAddedSuccess(false);

    // Simulate luxury loading response
    setTimeout(() => {
      onAddProductToCart(product, selectedSize, selectedColor);
      setCartLoading(false);
      setAddedSuccess(true);

      // Auto clear success state
      setTimeout(() => {
        setAddedSuccess(false);
      }, 3000);
    }, 700);
  };

  return (
    <div id="product-detail-view-root" className="w-full pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Breadcrumb utility locator */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 font-sans tracking-wider uppercase mb-8">
          <button type="button" onClick={() => onNavigate('home')} className="hover:text-rust transition">Home</button>
          <span>/</span>
          <button type="button" onClick={() => onNavigate('shop')} className="hover:text-rust transition">Collection catalog</button>
          <span>/</span>
          <span className="text-charcoal font-semibold truncate">{product.name}</span>
        </div>

        {/* Main interactive grid layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT 6 COLS: Image Gallery swapper */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main high fidelity photo view */}
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-md border border-gray-100 bg-gray-50 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />
              <span className="absolute left-4 bottom-4 bg-charcoal/80 backdrop-blur-sm text-white px-3 py-1 text-[10px] font-mono rounded">
                Genuine TNI Craftsmanship
              </span>
            </div>

            {/* Micro thumbnail slider row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 mt-3">
                {product.images.map((imgUrl, idx) => (
                  <button type="button"
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 aspect-square rounded-xl overflow-hidden border-2 bg-gray-50 focus:outline-none transition-all duration-300 ${
                      activeImage === imgUrl ? 'border-rust scale-[0.98] shadow-sm' : 'border-gray-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Checkout Swatches configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] tracking-widest uppercase text-rust font-extrabold bg-rust/5 px-2.5 py-1 rounded inline-block">
                  {product.gender} Streetwear
                </span>
                <span className="text-[10px] tracking-widest uppercase text-green-700 bg-green-50 px-2.5 py-1 rounded font-bold">
                  In Stock ({product.stock} pieces)
                </span>
              </div>
              <h1 className="font-serif text-3xl font-extrabold text-[#111] tracking-tight">{product.name}</h1>
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mt-1 block">SKU: {product.sku}</span>

              {/* Review Ratings display bar */}
              <div className="flex items-center gap-1.5 mt-3 text-gold">
                <div className="flex items-center text-rust">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-rust text-rust" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-sans font-medium">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* GHC price tag */}
              <div className="mt-4 pb-4 border-b border-gray-100 flex items-baseline gap-2">
                <span className="text-2xl font-serif font-extrabold text-[#111]">
                  GHC {product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Custom attributes selections: COLORS */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Select Color: <strong className="text-charcoal">{selectedColor.name}</strong>
              </span>
              <div className="flex items-center gap-2.5">
                {product.colors.map((col) => (
                  <button type="button"
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition focus:outline-none ${
                      selectedColor.name === col.name ? 'border-rust ring-1 ring-rust scale-102 shadow-sm' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor.name === col.name && (
                      <Check className="w-3.5 h-3.5 text-white filter drop-shadow font-extrabold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom attributes selections: SIZES PANEL */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Select Sizing Fit: <strong className="text-charcoal">{selectedSize}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button type="button"
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs tracking-wider font-extrabold uppercase py-2 px-5 rounded-full border transition-all duration-300 focus:outline-none ${
                      selectedSize === sz
                        ? 'bg-charcoal text-white border-charcoal scale-102 shadow-sm'
                        : 'text-gray-600 hover:bg-beige border-gray-200 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* STEPS COUNT & CART LINK Action container */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Quantity</span>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Stepper controls */}
                <div className="flex items-center justify-between border border-gray-300 rounded-full bg-white px-4 py-2.5 max-w-[140px] w-full">
                  <button type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-gray-400 hover:text-charcoal focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-charcoal select-none">{quantity}</span>
                  <button type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 text-gray-400 hover:text-charcoal focus:outline-none"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                {/* Primary ADD TO BAG activator button */}
                <button type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 bg-charcoal text-white font-sans text-xs font-semibold tracking-widest uppercase py-4 rounded-full flex items-center justify-center gap-2 hover:bg-rust hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-md disabled:bg-gray-400 focus:outline-none"
                >
                  {cartLoading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin text-white" /> Placing in Bag..
                    </>
                  ) : addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-green-400 font-extrabold animate-bounce" /> Added to your Bag!
                    </>
                  ) : (
                    'Add To Shopping Bag'
                  )}
                </button>

                {/* Wishlist toggle badge */}
                <button type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`border p-3.5 rounded-full hover:bg-beige transition duration-300 focus:outline-none ${
                    isSaved ? 'border-red-100 text-red-500 bg-red-50' : 'border-gray-200 text-gray-405'
                  }`}
                  aria-label="Wishlist heart pop details toggle"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {addedSuccess && (
                <button type="button"
                  onClick={onOpenCart}
                  className="w-full text-center text-xs font-bold text-rust hover:text-charcoal underline block pt-2 transition"
                >
                  Open Checkout Cart Bag Now →
                </button>
              )}
            </div>

            {/* TAB PANELS: Toggling details specifications or shipping policies */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden mt-8 bg-white/50 shadow-sm">
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button type="button"
                  onClick={() => setActiveTab('desc')}
                  className={`flex-1 py-3 text-2xs uppercase tracking-widest font-extrabold border-b-2 text-center transition ${
                    activeTab === 'desc' ? 'border-rust text-rust bg-white' : 'border-transparent text-gray-400 hover:text-charcoal'
                  }`}
                >
                  Details Description
                </button>
                <button type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-3 text-2xs uppercase tracking-widest font-extrabold border-b-2 text-center transition ${
                    activeTab === 'specs' ? 'border-rust text-rust bg-white' : 'border-transparent text-gray-400 hover:text-charcoal'
                  }`}
                >
                  Specs
                </button>
                <button type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`flex-1 py-3 text-2xs uppercase tracking-widest font-extrabold border-b-2 text-center transition ${
                    activeTab === 'shipping' ? 'border-rust text-rust bg-white' : 'border-transparent text-gray-400 hover:text-charcoal'
                  }`}
                >
                  Shipping
                </button>
              </div>

              <div className="p-5 text-xs text-gray-500 leading-relaxed">
                {activeTab === 'desc' && (
                  <div className="space-y-3 font-sans">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1.5 pt-2 font-medium">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="text-[#333]">{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1.5 border-b border-gray-50 max-w-sm">
                        <span className="font-semibold text-[#333] capitalize">{key}:</span>
                        <span className="text-[#666]">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-3 font-sans">
                    <p className="font-bold text-charcoal">Express Local & Inter-region Deliveries:</p>
                    <p>Accra deliveries inside 24 hours (Free on orders over GHC 200). Inter-region shipments delivered using secure transport networks inside 48-72 hours flat.</p>
                    <p className="font-bold text-charcoal">Hassle-Free Returns:</p>
                    <p>Exchange requests processed up to 30 days from purchase. The piece must retain brand packaging tags and remain entirely unworn.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS REC-SLIDER */}
        <section className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="font-serif text-2xl font-extrabold text-charcoal mb-8 tracking-tight">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('product', { id: p.id })}
                className="group cursor-pointer border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-103 transitionduration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-sans font-bold text-sm text-charcoal line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-rust font-semibold mt-1">GHC {p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
