import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, ClipboardList, Clock, Truck, Package, PackageCheck, Search, HelpCircle } from 'lucide-react';

interface TrackerViewProps {
  initialOrderId?: string;
  initialTotal?: number;
  initialMomo?: string;
  initialProvider?: string;
  isSuccessReceipt?: boolean;
  onNavigate: (page: string) => void;
}

export default function TrackerView({
  initialOrderId = '',
  initialTotal = 0,
  initialMomo = '',
  initialProvider = '',
  isSuccessReceipt = false,
  onNavigate
}: TrackerViewProps) {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fetch if order ID is loaded on initial render
  useEffect(() => {
    if (initialOrderId) {
      handleTrackOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrackOrder = async (targetId: string) => {
    if (!targetId.trim()) return;
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const resp = await fetch(`/api/orders/track/${encodeURIComponent(targetId.trim())}`);
      const data = await resp.json();

      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        setError('Order serial tag not found in system archives.');
      }
    } catch (e) {
      setError('Connection failed checking order tracking archives.');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgressIndex = (status: string) => {
    switch (status) {
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const timelineSteps = [
    { title: 'Payment Settled', desc: 'Secure Mobile Money validation authorized', icon: Clock },
    { title: 'Item Prepared', desc: 'Sizing verified and hand-packed inside zip folders', icon: Package },
    { title: 'Out for Delivery', desc: 'Handed to Ghana region transport shuttle networks', icon: Truck },
    { title: 'Delivered', desc: 'Item successfully arrived. Active witness registered', icon: PackageCheck }
  ];

  const progressIndex = orderData ? getStepProgressIndex(orderData.status) : 0;

  return (
    <div id="tracker-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-3xl mx-auto px-6 font-sans">
        
        {/* SUCCESS RECEIPT MODE */}
        {isSuccessReceipt ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Success greeting banner card */}
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-150 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8 font-extrabold" />
              </div>
              <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-rust block">
                GLORY TO GOD, TRANSACTION COMPLETED!
              </span>
              <h1 className="font-serif text-3xl md:text-3.5xl font-extrabold text-[#111] leading-tight max-w-sm mx-auto">
                Your Order Has Been Dispatched
              </h1>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Thank you for joining 'The New Identity Wear' family! Your payment of <strong>GHC {initialTotal.toFixed(2)}</strong> has been processed securely using {initialProvider} {initialMomo}.
              </p>

              {/* Order reference tag display box */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl max-w-sm mx-auto flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Tracking Reference Key</span>
                <span className="font-mono text-sm md:text-base font-extrabold text-charcoal select-all mt-1 uppercase tracking-wider">
                  {searchOrderId}
                </span>
                <p className="text-[10px] text-gray-400 font-medium leading-normal mt-1.5 font-sans">
                  (Tap or double-click to copy tracking serial key)
                </p>
              </div>

              {/* CTA switches */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button type="button"
                  onClick={() => handleTrackOrder(searchOrderId)}
                  className="w-full sm:w-auto bg-charcoal text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-rust transition"
                >
                  Track Live Route Status
                </button>
                <button type="button"
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto border border-gray-200 text-charcoal text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-gray-50 transition"
                >
                  Explore Drop catalog
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* TRADITIONAL ORDERS SEARCH TRACKING MODE */
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="text-center">
                <ClipboardList className="w-10 h-10 text-rust mx-auto mb-2.5" />
                <h2 className="font-serif text-2xl font-black text-charcoal">Track Your Order Status</h2>
                <p className="text-xs text-gray-450 mt-1 max-w-md mx-auto">
                  Type your order reference serial key to check our shipment logs and locate your dispatch route in Ghana.
                </p>
              </div>

              {/* Search bar inputs */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 5F6528C6-A0F1-46C8..."
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-xs uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-rust"
                />
                <button type="button"
                  onClick={() => handleTrackOrder(searchOrderId)}
                  disabled={loading || !searchOrderId.trim()}
                  className="bg-charcoal text-white hover:bg-rust px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors disabled:bg-gray-200 flex items-center gap-1.5 focus:outline-none"
                >
                  {loading ? 'Searching..' : 'Search'} <Search className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-semibold text-center mt-2 bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* TIMELINE PROGRESS RENDER CARDS */}
        {orderData && (
          <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl mt-8 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">VERIFIED RECIPIENT:</span>
                <h4 className="font-serif text-lg font-bold text-charcoal">{orderData.shippingAddress.name}</h4>
                <p className="text-xs text-gray-500 font-medium font-sans mt-0.5">{orderData.shippingAddress.line1}, {orderData.shippingAddress.city}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TRANS Gross TOTAL:</span>
                <p className="text-lg text-rust font-extrabold font-sans">GHC {orderData.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Stepper Timeline container */}
            <div className="relative pl-8 space-y-8 border-l border-gray-200">
              {timelineSteps.map((stepItem, idx) => {
                const isPassed = idx <= progressIndex;
                const isCurrent = idx === progressIndex;
                const StepIcon = stepItem.icon;

                return (
                  <div key={idx} className="relative">
                    {/* Circle icon marker */}
                    <div
                      className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-white shadow-sm ${
                        isPassed
                          ? 'border-rust text-rust fill-rust/5 scale-102 animate-pulse'
                          : 'border-gray-200 text-gray-300'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <div>
                      <h4
                        className={`text-sm tracking-tight ${
                          isPassed ? 'font-bold text-charcoal' : 'text-gray-400 font-medium'
                        }`}
                      >
                        {stepItem.title}
                        {isCurrent && (
                          <span className="ml-2.5 bg-rust/5 text-rust border border-rust/10 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                            Active Stage
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400 leading-normal mt-0.5">{stepItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
