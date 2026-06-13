import React, { useState, useMemo } from 'react';
import { Landmark, ArrowRight, ShieldCheck, CreditCard, Send, Check, Phone, ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react';
import { CartItem, Coupon, User } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  user: User | null;
  total: number;
  onClearCart: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function CheckoutView({
  cartItems,
  appliedCoupon,
  user,
  total,
  onClearCart,
  onNavigate
}: CheckoutViewProps) {
  // Page Multi-step status: 'shipping' | 'payment'
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Input states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.shippingAddress?.phone || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || 'Accra');
  const [addressLine, setAddressLine] = useState(user?.shippingAddress?.line1 || '');
  
  // Mobile money provider selector
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'VODAFONE' | 'AIRTELTIGO'>('MTN');
  const [momoNumber, setMomoNumber] = useState('');

  // Status flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Settle shipping charges dynamically:
  const shippingCost = useMemo(() => {
    if (city === 'Accra') {
      // Free Accra delivery over GHC 200
      return total >= 200 ? 0 : 20;
    }
    if (city === 'Kumasi') return 30;
    return 40; // Flat other outer regions rate GHC 40
  }, [city, total]);

  // Compute discount amount:
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return total * (appliedCoupon.value / 100);
    } else {
      return appliedCoupon.value;
    }
  }, [appliedCoupon, total]);

  // Gross total calculation:
  const subtotalWithDiscountAndShipping = useMemo(() => {
    const discountedSubtotal = Math.max(0, total - discountAmount);
    return discountedSubtotal + shippingCost;
  }, [total, discountAmount, shippingCost]);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !addressLine) {
      setError('Please input all shipping coordinates fields.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    const orderPayload = {
      userId: user?.id || 'guest',
      items: cartItems,
      couponCode: appliedCoupon?.code || null,
      subtotal: total,
      discount: discountAmount,
      shipping: shippingCost,
      total: subtotalWithDiscountAndShipping,
      shippingAddress: {
        name,
        email,
        phone,
        city,
        line1: addressLine
      },
      paymentDetails: {
        method: 'Mobile Money',
        provider: momoProvider,
        number: momoNumber || phone
      }
    };

    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await resp.json();

      if (data.success) {
        // Clear active bag details
        onClearCart();
        
        // Redirect to Success View
        onNavigate('order-success', {
          orderId: data.orderId,
          total: subtotalWithDiscountAndShipping,
          momo: momoNumber || phone,
          provider: momoProvider
        });
      } else {
        setError(data.message || 'Transaction submission error.');
      }
    } catch (e) {
      setError('Connection timeout trying to link merchant transaction portal.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full pt-32 md:pt-40 pb-20 bg-cream text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md px-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-charcoal">Checkout Bag is Hollow</h2>
          <p className="text-xs text-gray-400 mt-2">Explore our collections catalog first to find your testimony items.</p>
          <button type="button"
            onClick={() => onNavigate('shop')}
            className="mt-6 bg-charcoal text-white text-xs tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-rust transition"
          >
            Start Shop Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column represents dynamic forms depending on step */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6 text-xs font-bold uppercase tracking-wider">
            <span className={`pb-1 border-b-2 ${step === 'shipping' ? 'border-rust text-rust' : 'border-transparent text-gray-400'}`}>
              1. Shipping Address
            </span>
            <span className="text-gray-300">/</span>
            <span className={`pb-1 border-b-2 ${step === 'payment' ? 'border-rust text-rust' : 'border-transparent text-gray-400'}`}>
              2. Secured Merchant Payment
            </span>
          </div>

          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <h3 className="font-serif text-xl font-black text-charcoal">Receiver Coordinates</h3>
              <p className="text-xs text-gray-450 leading-relaxed -mt-1">
                Please input correct address specifics so our transport delivery caretakers can reach you cleanly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Receiver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Antwi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Notification Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kwame@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Active hotline Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0554312323"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Region Metropolis Selector *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-bold text-charcoal focus:outline-none focus:border-rust cursor-pointer"
                  >
                    <option value="Accra">Greater Accra Area (GHC 20 or FREE Over 200)</option>
                    <option value="Kumasi">Kumasi / Ashanti Region (GHC 30)</option>
                    <option value="Takoradi">Takoradi / Western Region (GHC 35)</option>
                    <option value="Tamale">Tamale / Northern Region (GHC 40)</option>
                    <option value="Other">Other Region / Transport (GHC 40)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Showroom/Delivery Street coordinates *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Legon, Near Boundary Road Block, House 12A"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full mt-6 flex items-center justify-center gap-2 hover:bg-rust transition"
              >
                Proceed to Payment options <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <h3 className="font-serif text-xl font-black text-charcoal">Secured Gateway Settlement</h3>
                <button type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-bold text-gray-400 hover:text-rust flex items-center gap-1 focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                </button>
              </div>

              <p className="text-xs text-gray-500 leading-normal mb-4">
                Your transaction is filtered through Paystack security protocol. Settlement operates seamlessly with automated callbacks.
              </p>

              {/* MoMo Provider selector badges */}
              <div className="space-y-3 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <span className="block text-[10.5px] uppercase font-bold text-gray-400 tracking-wider">Select Network Provider:</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['MTN', 'VODAFONE', 'AIRTELTIGO'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setMomoProvider(prov)}
                      className={`text-[10px] font-black uppercase py-2.5 rounded-lg border tracking-wider transition ${
                        momoProvider === prov
                          ? 'bg-rust text-white border-rust shadow-sm'
                          : 'bg-white text-gray-600 border-gray-150 hover:bg-beige'
                      }`}
                    >
                      {prov} MOMO
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">MoMo Wallet Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 0554312323"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Secure indicator watermark */}
              <div className="flex items-center gap-1.5 p-3.5 rounded-xl border border-dashed border-green-200 bg-green-50/30 text-[11px] text-green-700 font-medium">
                <ShieldCheck className="w-5 h-5 text-green-600 animate-pulse shrink-0" />
                <span>Simulating secure Paystack authorization loops. Click dispatch below to execute transaction securely.</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Final submission trigger */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-charcoal text-white text-xs font-extrabold tracking-widest uppercase py-4 rounded-full flex items-center justify-center gap-1.5 hover:bg-rust shadow-lg cursor-pointer disabled:bg-gray-405 transition duration-300"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin text-white" /> Link Authorized. Submitting order keys..
                  </>
                ) : (
                  <>
                    Authorize MoMo Payment and Place Order (GHC {subtotalWithDiscountAndShipping.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Right shopping bag sidebar summary */}
        <aside className="lg:col-span-5 bg-beige p-6 md:p-8 rounded-3xl border border-gray-150/80 shadow-inner">
          <h3 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
            Bag Summary
          </h3>

          {/* Cart items listing */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-white" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-charcoal truncate">{item.productName}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{item.size} | {item.color.name} x {item.quantity}</p>
                </div>
                <span className="font-bold text-charcoal">GHC {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 my-4" />

          {/* Pricing breakdowns */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Items Total</span>
              <span>GHC {total.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-700 font-semibold bg-green-50 p-2 rounded-xl border border-green-100">
                <span>Covenant discount ({appliedCoupon.code})</span>
                <span>-GHC {discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500 font-medium">
              <span>Region Shipping ({city})</span>
              <span>{shippingCost === 0 ? 'FREE Accra Delivery' : `GHC ${shippingCost.toFixed(2)}`}</span>
            </div>

            <hr className="border-gray-200 pt-1" />

            <div className="flex justify-between items-center text-sm font-bold text-charcoal">
              <span>Overall Total</span>
              <span className="text-lg text-rust">GHC {subtotalWithDiscountAndShipping.toFixed(2)}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
