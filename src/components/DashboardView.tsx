import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, MapPin, Key, Check, AlertCircle, Clock, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import { User as UserType, Order } from '../types';

interface DashboardViewProps {
  user: UserType;
  onLogout: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function DashboardView({ user, onLogout, onNavigate }: DashboardViewProps) {
  // Navigation inside dashboard tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'address'>('orders');

  // Orders metadata pulled via endpoint or simple store
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Address editing states
  const [phone, setPhone] = useState(user.shippingAddress?.phone || '');
  const [city, setCity] = useState(user.shippingAddress?.city || 'Accra');
  const [addressLine, setAddressLine] = useState(user.shippingAddress?.line1 || '');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  // Profile updating states
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email); // Read-only for integrity
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Fetch orders placed by this authenticated customer
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const resp = await fetch(`/api/user/orders?userId=${user.id}`);
        const data = await resp.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Fetch orders from endpoint failed:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressSuccess('');

    try {
      const resp = await fetch('/api/user/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          address: { phone, city, line1: addressLine }
        })
      });
      const data = await resp.json();
      if (data.success) {
        setAddressSuccess('Delivery coordinates cached successfully in directory.');
        // Update local object storage coordinates integrity
        user.shippingAddress = { phone, city, line1: addressLine };
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const resp = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          oldPassword,
          newPassword
        })
      });
      const data = await resp.json();
      if (data.success) {
        setProfileSuccess('Profile credentials refreshed successfully.');
        user.name = name;
        setOldPassword('');
        setNewPassword('');
      } else {
        setProfileError(data.message || 'Incorrect old password constraints.');
      }
    } catch (e) {
      setProfileError('Failed to synchronize details.');
    } finally {
      setProfileLoading(false);
    }
  };

  const statusTags = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full animate-pulse">
            <Truck className="w-3 h-3" /> Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            <CheckCircle className="w-3 h-3" /> Delivered Successfully
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-400 px-2.5 py-1 text-[11px] font-bold uppercase rounded-full">
            Pending Payment
          </span>
        );
    }
  };

  return (
    <div id="dashboard-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Welcome Banner Header */}
        <div className="bg-charcoal text-white p-6 md:p-10 rounded-3xl shadow-md border border-black mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rust border-4 border-white/10 text-white font-serif text-3xl font-extrabold flex items-center justify-center select-none shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] tracking-wider font-mono uppercase text-gray-400">TNI BELIEVING MEMBER</span>
              <h1 className="font-serif text-2xl md:text-3xl font-extrabold">{user.name}</h1>
              <p className="text-xs text-gray-405 font-sans mt-0.5 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button"
              onClick={() => onNavigate('shop')}
              className="bg-white hover:bg-beige text-charcoal text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full transition"
            >
              Browse Shop drops
            </button>
            <button type="button"
              onClick={onLogout}
              className="border border-white/20 hover:border-red-500 text-white hover:text-red-500 text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dashboard inner panels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel navigations switches */}
          <nav className="lg:col-span-3 flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <button type="button"
              onClick={() => setActiveTab('orders')}
              className={`text-xs text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-charcoal text-white' : 'text-gray-600 hover:bg-beige/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Order History Logs ({orders.length})
            </button>
            <button type="button"
              onClick={() => setActiveTab('address')}
              className={`text-xs text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'address' ? 'bg-charcoal text-white' : 'text-gray-600 hover:bg-beige/40'
              }`}
            >
              <MapPin className="w-4 h-4" /> Address coordinates
            </button>
            <button type="button"
              onClick={() => setActiveTab('profile')}
              className={`text-xs text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-charcoal text-white' : 'text-gray-600 hover:bg-beige/40'
              }`}
            >
              <User className="w-4 h-4" /> Credentials & Password
            </button>
          </nav>

          {/* Right panel actual rendering dashboard views */}
          <main className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
            
            {/* Orders historical table list */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-extrabold text-charcoal pb-3 border-b border-gray-100 flex items-center gap-2">
                  Interactive Purchase History
                </h3>

                {ordersLoading ? (
                  <div className="py-16 text-center text-xs text-gray-400 font-sans">
                    Assembling historical records database..
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((or) => (
                      <div
                        key={or.id}
                        className="p-5 border border-gray-100 rounded-2xl space-y-4 hover:shadow-sm transition"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-50">
                          <div>
                            <span className="text-[10px] text-gray-400 font-mono">ORDER SERIAL TOKEN ID:</span>
                            <p className="font-mono text-xs font-bold text-charcoal uppercase tracking-wider">{or.id.split('-')[0]}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {statusTags(or.status)}
                            <button type="button"
                              onClick={() => onNavigate('track-order', { orderId: or.id })}
                              className="text-[10px] uppercase font-bold text-rust hover:underline focus:outline-none bg-rust/5 px-3 py-1.5 rounded-full"
                            >
                              Track Live Route →
                            </button>
                          </div>
                        </div>

                        {/* Order Items description */}
                        <div className="space-y-2.5">
                          {or.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[#444]">
                                {it.productName} <span className="text-gray-400 text-[10px] font-bold">({it.size} | {it.color.name})</span> x {it.quantity}
                              </span>
                              <span className="font-bold text-charcoal">
                                GHC {(it.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                          <span className="text-gray-400 font-mono">
                            PLACED ON: {new Date(or.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-bold text-charcoal">
                            Total: <strong className="text-rust">GHC {or.total.toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="font-serif font-bold text-[#333]">No matched purchases detected</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-normal">
                      Put on your New Identity garments to display your faith. Subtotal transactions arrive here immediately.
                    </p>
                    <button type="button"
                      onClick={() => onNavigate('shop')}
                      className="mt-6 bg-charcoal text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-rust transition"
                    >
                      Browse Catalogue Drop
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Address coordinate modifiers forms */}
            {activeTab === 'address' && (
              <form onSubmit={handleUpdateAddress} className="space-y-5">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="font-serif text-xl font-extrabold text-charcoal">Delivery Coordinates</h3>
                  <p className="text-xs text-gray-400 mt-1">Configure your Accra or inter-region shipping locations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ghana Active Hotline *</label>
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
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Metropolis Region *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-bold text-charcoal focus:outline-none focus:border-rust"
                    >
                      <option value="Accra">Greater Accra Area (GHC 20)</option>
                      <option value="Kumasi">Kumasi / Ashanti Region (GHC 30)</option>
                      <option value="Takoradi">Takoradi / Western Region (GHC 35)</option>
                      <option value="Tamale">Tamale / Northern Region (GHC 40)</option>
                      <option value="Other">Other Region / Shuttled Transport (GHC 40)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Home/Showroom coordinates Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. East Legon, Near Boundary Road Intersection, House No. 12"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>

                {addressSuccess && (
                  <p className="text-xs text-green-600 font-semibold animate-pulse flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500 font-extrabold" /> {addressSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={addressLoading}
                  className="bg-charcoal text-white hover:bg-rust px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  {addressLoading ? 'Syncing address coordinates..' : 'Save shipping coordinates'}
                </button>
              </form>
            )}

            {/* Profile Password credentials editor form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="font-serif text-xl font-extrabold text-charcoal">Account Credentials</h3>
                  <p className="text-xs text-gray-400 mt-1">Refine your login details and account password limits.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Display Username</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                    />
                  </div>

                  <div className="space-y-1.5 text-gray-400">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Sign email (Locked)</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full bg-gray-100 border border-gray-150 rounded-full px-4 py-2.5 text-xs font-medium select-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Previous Password</label>
                    <input
                      type="password"
                      placeholder="Input old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Fresh password replacement</label>
                    <input
                      type="password"
                      placeholder="Input new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                    />
                  </div>
                </div>

                {profileError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {profileError}
                  </p>
                )}

                {profileSuccess && (
                  <p className="text-xs text-green-600 font-semibold flex items-center gap-1 animate-pulse">
                    <Check className="w-4 h-4 text-green-500 font-extrabold" /> {profileSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-charcoal text-white hover:bg-rust px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  {profileLoading ? 'Authenticating updates..' : 'Update Password profile'}
                </button>
              </form>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
