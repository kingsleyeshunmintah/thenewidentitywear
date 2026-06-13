import { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, Heart, User, X } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  cartCount: number;
  wishlistCount: number;
  user: UserType | null;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export default function Header({
  onNavigate,
  currentPage,
  cartCount,
  wishlistCount,
  user,
  onLogout,
  onOpenCart,
  onOpenSearch
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', page: 'shop' },
    { label: 'Our Mission', page: 'about' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact', page: 'contact' }
  ];

  return (
    <>
      <header
        id="sticky-header"
        className={`fixed left-0 right-0 z-40 transition-all duration-500 px-4 md:px-8 ${
          isScrolled 
            ? 'top-4' 
            : 'top-10 md:top-14'
        }`}
      >
        <div
          className={`mx-auto max-w-7xl bg-white/85 backdrop-blur-md border border-gray-200/70 rounded-full transition-all duration-300 flex items-center justify-between px-6 py-3 md:py-3.5 ${
            isScrolled 
              ? 'shadow-md scale-[0.98] py-2.5 border-gray-200/50' 
              : 'shadow-sm'
          }`}
        >
          {/* Left Side: Hamburguer & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              id="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 hover:bg-gray-50 rounded-full transition duration-200 focus:outline-none"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5 text-charcoal" />
            </button>

            {/* Circular Emblem */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs tracking-tight group-hover:scale-105 transition duration-300">
                TNI
              </div>
              <span className="font-sans font-bold text-sm tracking-tighter lowercase text-charcoal group-hover:text-rust transition duration-200">
                thenewidentitywear
              </span>
            </div>
          </div>

          {/* Center Column: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`text-xs uppercase tracking-widest font-medium transition duration-200 hover:text-rust underline-grow ${
                  currentPage === link.page ? 'text-rust font-semibold' : 'text-gray-500'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Side: Search, Wishlist, Cart, Dashboard login */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSearch}
              className="p-1 hover:text-rust transition text-charcoal relative focus:outline-none"
              aria-label="Search clothing"
            >
              <Search className="w-4 h-4 md:w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className="p-1 hover:text-rust transition text-charcoal relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 md:w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rust text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce font-sans font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="p-1 hover:text-rust transition text-charcoal relative focus:outline-none"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-charcoal text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {['super-admin', 'admin', 'sub-admin'].includes(user.role) && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="bg-rust/10 hover:bg-rust hover:text-white transition duration-200 text-rust border border-rust/10 text-[9.5px] uppercase font-black px-3 py-1 rounded-full tracking-wider"
                  >
                    Admin Terminal
                  </button>
                )}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-rust transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:inline-block text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-rust transition duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 flex ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Dark Overlay Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-40' : 'opacity-0'
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`relative w-80 max-w-[85vw] h-full bg-cream py-8 px-6 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out z-10 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Actions */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
                  TNI
                </div>
                <span className="font-sans font-bold text-xs tracking-tighter lowercase text-charcoal">
                  thenewidentitywear
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-charcoal" />
              </button>
            </div>

            {/* Navigation links with staggered list */}
            <div className="flex flex-col gap-6 mt-8">
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left font-serif font-bold text-2xl text-charcoal hover:text-rust transition"
              >
                Home
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-serif font-bold text-2xl text-charcoal hover:text-rust transition"
                >
                  {link.label}
                </button>
              ))}

              <hr className="border-gray-100 my-2" />

              <button
                onClick={() => {
                  onNavigate('wishlist');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left font-sans text-sm tracking-widest uppercase font-semibold text-gray-500 hover:text-rust transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
              </button>
            </div>
          </div>

          {/* Social Links & Auth */}
          <div className="border-t border-gray-100 pt-6">
            {user ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 font-mono">
                  LOGGED IN AS: <span className="text-charcoal font-semibold">{user.email}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {['super-admin', 'admin', 'sub-admin'].includes(user.role) && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs font-bold text-rust hover:text-charcoal uppercase tracking-wider"
                    >
                      Admin Terminal
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-charcoal hover:text-rust uppercase tracking-wider"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-charcoal text-white py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-rust transition duration-300"
              >
                Sign In
              </button>
            )}

            <p className="text-[10px] text-gray-400 font-mono mt-6 text-center">
              © 2026 THE NEW IDENTITY WEAR
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
