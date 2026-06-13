import { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash, ArrowRight, Check } from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (appliedCoupon: Coupon | null) => void;
  total: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  total
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validating, setValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const resp = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: total })
      });
      const data = await resp.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponSuccess(`Coupon code '${data.coupon.code}' applied successfully!`);
      } else {
        setCouponError(data.message || 'Invalid coupon code.');
      }
    } catch (e) {
      setCouponError('Error validating discount token. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const getDiscountedTotal = () => {
    if (!appliedCoupon) return total;
    if (appliedCoupon.type === 'percentage') {
      return total * (1 - appliedCoupon.value / 100);
    } else {
      return Math.max(0, total - appliedCoupon.value);
    }
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return total * (appliedCoupon.value / 100);
    } else {
      return appliedCoupon.value;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-40' : 'opacity-0'
        }`}
      />

      {/* Cart Cabinet Block */}
      <div
        className={`relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Drawer */}
        <div className="border-b border-gray-100 py-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rust" />
            <span className="font-sans font-extrabold text-[#333] text-sm tracking-wider uppercase">
              Shopping Bag ({cartItems.reduce((acc, current) => acc + current.quantity, 0)})
            </span>
          </div>
          <button type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-50 rounded-full transition focus:outline-none"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Dynamic Items Slider */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-white"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-charcoal truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-sans">
                        Size: <span className="text-charcoal font-semibold">{item.size}</span> | Color:{' '}
                        <span className="text-charcoal font-semibold">{item.color.name}</span>
                      </p>
                    </div>
                    <button type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md transition"
                      title="Remove Item"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-full">
                      <button type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-500 rounded-l-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-charcoal select-none">
                        {item.quantity}
                      </span>
                      <button type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-500 rounded-r-full"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-extrabold text-charcoal">
                      GHC {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-full bg-beige text-rust flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="font-serif font-bold text-base text-charcoal">Your bag is empty</p>
              <p className="text-xs text-gray-400 leading-normal max-w-xs mt-1">
                Explore our gospel-rooted garments to find your bold witness today.
              </p>
              <button type="button"
                onClick={onClose}
                className="mt-6 bg-charcoal text-white text-xs font-semibold tracking-widest px-6 py-3 rounded-full uppercase hover:bg-rust transition"
              >
                Start Shop
              </button>
            </div>
          )}
        </div>

        {/* Pricing Summary Desk */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            {/* Coupon Code Block */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Have a Covenant Coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NEWCREATION10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs uppercase font-semibold focus:outline-none focus:border-rust"
                />
                {appliedCoupon ? (
                  <button type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                      setCouponSuccess('');
                    }}
                    className="bg-gray-200 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition"
                  >
                    Clear
                  </button>
                ) : (
                  <button type="button"
                    onClick={handleApplyCoupon}
                    disabled={validating || !couponCode.trim()}
                    className="bg-charcoal text-white hover:bg-rust px-4 py-2 rounded-full text-xs font-bold tracking-wider transition disabled:bg-gray-200"
                  >
                    {validating ? 'Matching..' : 'Apply'}
                  </button>
                )}
              </div>
              {couponError && <p className="text-[10px] text-red-500 font-medium mt-1">{couponError}</p>}
              {couponSuccess && (
                <p className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
            </div>

            <hr className="border-gray-100 my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>GHC {total.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-green-600 font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-GHC {getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Local Shipping</span>
                <span className="text-gray-400 font-normal">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between items-center text-sm text-charcoal font-bold pt-2 border-t border-gray-200">
                <span>Bag Total</span>
                <span className="text-base text-rust">GHC {getDiscountedTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkouts Activator */}
            <button type="button"
              onClick={() => {
                onCheckout(appliedCoupon);
                onClose();
              }}
              className="w-full bg-charcoal text-white font-sans text-xs font-semibold tracking-widest uppercase py-3.5 rounded-full mt-6 flex items-center justify-center gap-2 hover:bg-rust hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-md border border-charcoal hover:border-rust"
            >
              Secure Mobile Money Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
