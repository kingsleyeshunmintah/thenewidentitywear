import { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';

// Modular view states
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import StaticPageViews from './components/StaticPageViews';
import ContactView from './components/ContactView';
import FaqView from './components/FaqView';
import AuthViews from './components/AuthViews';
import DashboardView from './components/DashboardView';
import WishlistView from './components/WishlistView';
import CheckoutView from './components/CheckoutView';
import TrackerView from './components/TrackerView';
import AdminDashboardView from './components/admin/AdminDashboardView';

import { Product, CartItem, Coupon, User } from './types';

export default function App() {
  // Master page router keys: 'home' | 'shop' | 'product' | 'about' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'faq' | 'login' | 'register' | 'dashboard' | 'wishlist' | 'checkout' | 'order-success' | 'track-order'
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>(null);

  // Layout overlay drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync state pools
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Initialize and load localStorage cache structures
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tni_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('tni_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem('tni_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Error loading localStorage sync state:', e);
    }

    // Read initial URL ?page= parameter if page refreshes
    const params = new URLSearchParams(window.location.search);
    const initialPage = params.get('page');
    if (initialPage) {
      setCurrentPage(initialPage);
      const id = params.get('id');
      if (id) setPageParams({ id });
    }
  }, []);

  // Save changes to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('tni_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tni_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Synchronous page navigator helper
  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync browser address bar search query cleanly
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    if (params && params.id) {
      url.searchParams.set('id', params.id);
    } else {
      url.searchParams.delete('id');
    }
    window.history.pushState(null, '', url.toString());
  };

  // Popstate standard listener for back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || 'home';
      setCurrentPage(page);
      const id = params.get('id');
      if (id) setPageParams({ id });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Cart operations
  const handleAddProductToCart = (product: Product, size: string, color: any) => {
    setCart((prevCart) => {
      const uniqueId = `${product.id}-${size}-${color.name.toLowerCase()}`;
      const existingProductIndex = prevCart.findIndex((item) => item.id === uniqueId);

      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        const newItem: CartItem = {
          id: uniqueId,
          productId: product.id,
          productName: product.name,
          productImage: product.images[0],
          size,
          color,
          price: product.price,
          quantity: 1
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Sync Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  // Sync Auth operations
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('tni_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tni_user');
    handleNavigate('home');
  };

  const cartTotal = cart.reduce((acc, current) => acc + current.price * current.quantity, 0);
  const cartItemCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <div className="min-h-screen bg-cream selection:bg-rust selection:text-white relative flex flex-col justify-between">
      <div>
        {/* Top announcement strip slider */}
        <AnnouncementBar />

        {/* Persistent Pill Header */}
        <Header
          onNavigate={handleNavigate}
          currentPage={currentPage}
          cartCount={cartItemCount}
          wishlistCount={wishlist.length}
          user={user}
          onLogout={handleLogout}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic page dispatcher templates */}
        <main className="w-full">
          {currentPage === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onAddProductToCart={handleAddProductToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {currentPage === 'shop' && (
            <ShopView
              onNavigate={handleNavigate}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              pastedCategorySlug={pageParams?.category || 'all'}
            />
          )}

          {currentPage === 'product' && (
            <ProductDetailView
              productId={pageParams?.id}
              onNavigate={handleNavigate}
              onAddProductToCart={handleAddProductToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {['about', 'privacy', 'terms', 'shipping'].includes(currentPage) && (
            <StaticPageViews
              viewType={currentPage as any}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'contact' && <ContactView />}

          {currentPage === 'faq' && <FaqView />}

          {['login', 'register', 'forgot'].includes(currentPage) && (
            <AuthViews
              initialMode={currentPage as any}
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {currentPage === 'dashboard' && user && (
            <DashboardView
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboardView
              currentUser={user || { id: '', name: '', email: '', phone: '', role: 'customer', createdAt: '' }}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'wishlist' && (
            <WishlistView
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'checkout' && (
            <CheckoutView
              cartItems={cart}
              appliedCoupon={pageParams?.coupon || null}
              user={user}
              total={cartTotal}
              onClearCart={handleClearCart}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'order-success' && (
            <TrackerView
              initialOrderId={pageParams?.orderId}
              initialTotal={pageParams?.total}
              initialMomo={pageParams?.momo}
              initialProvider={pageParams?.provider}
              isSuccessReceipt={true}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'track-order' && (
            <TrackerView
              initialOrderId={pageParams?.orderId}
              isSuccessReceipt={false}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Shared Footer block layout */}
      <Footer onNavigate={handleNavigate} />

      {/* Overlay Layers: Drawer Bags & fullscreen Live Searches */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={(coupon) => handleNavigate('checkout', { coupon })}
        total={cartTotal}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => handleNavigate('product', { id: prod.id })}
      />
    </div>
  );
}
