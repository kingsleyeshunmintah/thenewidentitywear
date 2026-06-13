import { useState, useMemo } from 'react';
import { Heart, Grid, List, SlidersHorizontal, ArrowUpDown, ArrowRight, Search, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../data';

interface ShopViewProps {
  onNavigate: (page: string, params?: any) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  pastedCategorySlug?: string;
}

export default function ShopView({
  onNavigate,
  wishlist,
  onToggleWishlist,
  pastedCategorySlug = 'all'
}: ShopViewProps) {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(pastedCategorySlug);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Available static attributes
  const genders = ['all', 'Unisex', 'Men', 'Women'];
  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // 1. Search query text
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // 2. Category selection
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // 3. Gender selection
    if (selectedGender !== 'all') {
      list = list.filter(p => p.gender === selectedGender);
    }

    // 4. Sizing check
    if (selectedSize !== 'all') {
      list = list.filter(p => p.sizes.includes(selectedSize));
    }

    // 5. Price ceiling cap
    list = list.filter(p => p.price <= maxPrice);

    // 6. Sort operations
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [selectedCategory, selectedGender, selectedSize, maxPrice, sortBy, filterQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSize('all');
    setMaxPrice(300);
    setSortBy('newest');
    setFilterQuery('');
  };

  return (
    <div id="shopview-root" className="w-full pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Title Header area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-rust font-extrabold">The New Identity Collection</span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#111] mt-1">Shop All Products</h1>
            <p className="text-xs text-gray-500 mt-1.5 font-sans">
              Express your faith with our thoughtfully designed apparel, built for daily testimony.
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="relative mt-4 md:mt-0 max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded-full text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rust focus:bg-white transition"
            />
          </div>
        </div>

        {/* Filters and Grid layout holder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sidebar Filters Box (Desktop only, hidden on mobile unless toggled) */}
          <aside className={`lg:col-span-3 space-y-7 bg-white p-6 rounded-2xl border border-gray-100/80 shadow-sm ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rust" /> Filter Catalogue
              </h3>
              <button type="button"
                onClick={resetFilters}
                className="text-[10px] text-gray-400 hover:text-rust font-mono font-medium flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Groups Links */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Categories</h4>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button type="button"
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (showMobileFilters) setShowMobileFilters(false);
                    }}
                    className={`text-xs text-left px-3 py-2 rounded-full font-medium transition duration-200 border ${
                      selectedCategory === cat.id
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'text-gray-600 hover:bg-beige/40 hover:text-charcoal border-transparent'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider group */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Max Price Range</h4>
                <span className="text-xs font-mono font-bold text-rust">GHC {maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-rust cursor-pointer bg-gray-200 h-1 rounded"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>GHC 50</span>
                <span>GHC 300</span>
              </div>
            </div>

            {/* Gender choices */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gender Selection</h4>
              <div className="flex flex-wrap gap-1.5">
                {genders.map((g) => (
                  <button type="button"
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full font-bold transition border ${
                      selectedGender === g
                        ? 'bg-rust text-white border-rust'
                        : 'text-gray-600 hover:bg-beige shadow-sm bg-white border-gray-150'
                    }`}
                  >
                    {g === 'all' ? 'All Genders' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing swatches */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Sizing Fitting</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`text-[10px] tracking-wide font-extrabold uppercase py-1 px-3.5 rounded border transition-all duration-300 ${
                      selectedSize === s
                        ? 'bg-charcoal text-white border-charcoal scale-102'
                        : 'text-gray-600 hover:bg-beige border-gray-200'
                    }`}
                  >
                    {s === 'all' ? 'All Sizes' : s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Grid catalogue list */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Catalog header controls */}
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                {/* Mobile filters toggling button */}
                <button type="button"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 focus:outline-none hover:bg-beige transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
                <span className="text-xs text-gray-400 font-mono">
                  Displaying: <strong className="text-charcoal font-semibold">{filteredProducts.length}</strong> clothing pieces
                </span>
              </div>

              {/* Sorting triggers */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-0 text-xs font-bold text-charcoal outline-none cursor-pointer focus:ring-0"
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Popularity</option>
                </select>
              </div>
            </div>

            {/* Product list rendered as bento columns */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const isSaved = wishlist.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="group relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300"
                    >
                      {/* Image block */}
                      <div className="relative rounded-t-2xl overflow-hidden aspect-square bg-gray-50">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        {/* Price badge corner */}
                        <span className="absolute left-3.5 top-3.5 bg-white/90 backdrop-blur-sm border border-gray-150 text-charcoal px-3 py-1 text-xs font-black rounded-full shadow-sm">
                          GHC {p.price.toFixed(2)}
                        </span>
                        {/* Wishlist toggle */}
                        <button type="button"
                          onClick={() => onToggleWishlist(p.id)}
                          className="absolute right-3.5 top-3.5 p-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-gray-150 text-charcoal hover:text-red-500 focus:outline-none active:scale-75 transition-transform"
                          aria-label="Wishlist heart trigger"
                        >
                          <Heart className={`w-4 h-4 transition ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>

                      {/* Info details */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <h3
                            onClick={() => onNavigate('product', { id: p.id })}
                            className="font-sans font-bold text-sm text-[#111] hover:text-rust cursor-pointer transition line-clamp-1"
                          >
                            {p.name}
                          </h3>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">{p.sku}</p>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed min-h-8">
                            {p.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
                          <span className="text-[10px] font-mono font-medium text-gray-400">
                            {p.gender} • {p.sizes.join(', ')}
                          </span>
                          <button type="button"
                            onClick={() => onNavigate('product', { id: p.id })}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rust hover:text-charcoal transition"
                          >
                            Browse Item <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <p className="font-serif font-bold text-lg text-charcoal">No products matching filters</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto font-sans leading-normal">
                  Seek and you shall find. Modify your selection constraints or reset filters to discover other collections.
                </p>
                <button type="button"
                  onClick={resetFilters}
                  className="mt-6 bg-charcoal text-white text-xs tracking-widest font-extrabold uppercase px-6 py-2.5 rounded-full hover:bg-rust transition"
                >
                  Reset Selection Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
