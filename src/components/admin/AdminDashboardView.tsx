import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Coins, 
  Lock, 
  Sparkles, 
  Plus, 
  Check, 
  AlertCircle,
  Clock,
  Truck,
  PackageCheck,
  RefreshCw,
  Mail,
  UserPlus,
  Compass,
  FileText
} from 'lucide-react';
import { User, Order, Coupon } from '../../types';

interface AdminDashboardViewProps {
  currentUser: User;
  onNavigate: (page: string) => void;
}

export default function AdminDashboardView({ currentUser, onNavigate }: AdminDashboardViewProps) {
  // Master administrative tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'team' | 'coupons' | 'tickets'>('overview');

  // API dynamic states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Status/feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sub/Super Admin creation form states
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'sub-admin' | 'admin' | 'super-admin'>('sub-admin');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // New Coupon form states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMinSpend, setNewCouponMinSpend] = useState('');
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Auto load administrative content from our custom Express routes
  const loadAdminData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch dashboard statistics
      const statsResp = await fetch('/api/admin/stats');
      const statsData = await statsResp.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Fetch all system order archives
      const ordersResp = await fetch('/api/admin/orders');
      const ordersData = await ordersResp.json();
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }

      // 3. Fetch system team & registry (including roles)
      const usersResp = await fetch('/api/admin/users');
      const usersData = await usersResp.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // 4. Fetch contact inquiries
      const contactsResp = await fetch('/api/admin/contacts');
      const contactsData = await contactsResp.json();
      if (contactsData.success) {
        setContacts(contactsData.contacts || []);
      }

      // 5. Fetch newsletter list
      const subscribersResp = await fetch('/api/admin/subscribers');
      const subscribersData = await subscribersResp.json();
      if (subscribersData.success) {
        setSubscribers(subscribersData.subscribers || []);
      }

    } catch (e) {
      console.error('Error fetching admin payload:', e);
      setErrorMsg('Failed to fetch standard core data archives from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update specific order's shipping status
  const handleUpdateOrderStatus = async (orderId: string, targetStatus: string) => {
    // Access control validation: Only admins & super-admins can update status
    if (currentUser.role === 'sub-admin') {
      alert('Access Restricted: Sub-Admins hold a read-only registry key. Status modification is blocked.');
      return;
    }

    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: targetStatus })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Order successfully updated to ${targetStatus}`);
        // Locally refresh orders catalog
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: targetStatus as any } : o));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Fulfillment adjustment error.');
      }
    } catch (e) {
      setErrorMsg('Connection failed connecting status updates.');
    }
  };

  // Create Sub-Admin or Super-Admin account
  const handleCreateNewAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role !== 'super-admin') {
      setErrorMsg('Strict Access Restriction: Only Super-Admins possess role creation capabilities.');
      return;
    }

    setCreatingAdmin(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const resp = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          phone: newAdminPhone,
          password: newAdminPassword,
          role: newAdminRole
        })
      });
      const data = await resp.json();

      if (data.success) {
        setSuccessMsg(`Anointed & configured ${newAdminName} as ${newAdminRole} successfully!`);
        // Reset states
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPhone('');
        setNewAdminPassword('');
        setNewAdminRole('sub-admin');
        // Refresh databases
        loadAdminData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Failed to construct administrative credentials.');
      }
    } catch (e) {
      setErrorMsg('Failed to process admin validation pathways.');
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Update role of an existing user on the fly
  const handleModifyUserRole = async (userId: string, targetRole: 'customer' | 'sub-admin' | 'admin' | 'super-admin') => {
    if (currentUser.role !== 'super-admin') {
      alert('Strict Role Security: Only super-admins have access to alter employee credentials.');
      return;
    }

    try {
      const resp = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: targetRole })
      });
      const data = await resp.json();
      if (data.success) {
        setSuccessMsg('Security credentials updated in database.');
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error('Failed role update:', e);
    }
  };

  // Create dynamic coupon code
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'sub-admin') {
      setErrorMsg('Access Restricted: Sub-admins are blocked from mutating promotional covenants.');
      return;
    }

    setCreatingCoupon(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/admin/coupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          type: newCouponType,
          value: newCouponValue,
          minSpend: newCouponMinSpend ? Number(newCouponMinSpend) : undefined
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Promo coupon ${newCouponCode.toUpperCase()} activated successfully!`);
        setNewCouponCode('');
        setNewCouponValue('');
        setNewCouponType('percentage');
        setNewCouponMinSpend('');
        loadAdminData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Coupon activation error.');
      }
    } catch (e) {
      setErrorMsg('Backend link error registering coupon.');
    } finally {
      setCreatingCoupon(false);
    }
  };

  // Convert status indicator badges with customized classy tags
  const renderStatusTag = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            <PackageCheck className="w-3 h-3" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-400 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full">
            Pending Payment
          </span>
        );
    }
  };

  // Check if current authenticated user has any admin credentials at all
  const isAuthorized = ['super-admin', 'admin', 'sub-admin'].includes(currentUser.role);

  if (!isAuthorized) {
    return (
      <div className="w-full min-h-[80vh] pt-36 pb-20 bg-cream flex items-center justify-center px-6">
        <div className="max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-250 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-rust block">
            ACCESS DENIED SECURE DIRECTORY
          </span>
          <h2 className="font-serif text-2xl font-extrabold text-[#111] leading-tight">
            Unauthorized Credentials
          </h2>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Your current email profile <strong className="text-charcoal">{currentUser.email}</strong> does not possess active administrative roles inside the Kingdom Ministry system.
          </p>
          <div className="pt-4 flex flex-col gap-2.5">
            <button type="button"
              onClick={() => onNavigate('home')}
              className="bg-charcoal text-white text-xs font-bold tracking-widest uppercase py-3 rounded-full hover:bg-rust transition"
            >
              Return Home
            </button>
            <button type="button"
              onClick={() => onNavigate('login')}
              className="border border-gray-255 text-charcoal text-xs font-bold tracking-widest uppercase py-3 rounded-full hover:bg-gray-50 transition"
            >
              Authenticate with Another Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-hub-view-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream font-sans selection:bg-rust selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
        
        {/* Classy Top Banner with detailed credentials */}
        <div className="bg-white border border-gray-150 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-olive/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-rust/10 text-rust border border-rust/10 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> TNI COVENANT INTERFACE
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                Logged role: <strong className="text-charcoal uppercase tracking-wider">{currentUser.role}</strong>
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">
              Administration Control Hub
            </h1>
            <p className="text-xs text-gray-500 font-sans max-w-xl">
              Manage client transactions, create promotional covenant coupons, review inquiry tickets, and configure sub-admin privilege roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button"
              onClick={loadAdminData}
              title="Refresh servers data sync"
              className="bg-gray-50 hover:bg-beige text-charcoal p-2.5 rounded-full border border-gray-200 hover:border-charcoal/30 transition flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button"
              onClick={() => onNavigate('shop')}
              className="border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 rounded-full transition"
            >
              Enter Public Shop
            </button>
          </div>
        </div>

        {/* Status Alerts Notification Rails */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-150 rounded-2xl text-red-650 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-150 rounded-2xl text-green-700 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-green-600 font-black animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* HORIZONTAL TABBED PILLED CONTROL SWITCHES */}
        <div className="bg-white/80 backdrop-blur border border-gray-150 p-2.5 rounded-2xl shadow-sm flex flex-wrap gap-2 overflow-x-auto">
          <button type="button"
            onClick={() => setActiveTab('overview')}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-widest uppercase transition flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> System Overview
          </button>
          <button type="button"
            onClick={() => setActiveTab('orders')}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-widest uppercase transition flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Orders Registry ({orders.length})
          </button>
          <button type="button"
            onClick={() => setActiveTab('team')}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-widest uppercase transition flex items-center gap-1.5 ${
              activeTab === 'team' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Admin Team & Roles ({users.length})
          </button>
          <button type="button"
            onClick={() => setActiveTab('coupons')}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-widest uppercase transition flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige'
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> Covenant Coupons
          </button>
          <button type="button"
            onClick={() => setActiveTab('tickets')}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-widest uppercase transition flex items-center gap-1.5 ${
              activeTab === 'tickets' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> inquiries ticket logs ({contacts.length})
          </button>
        </div>

        {/* DYNAMIC RENDERING CORRESPONDING SECTIONS CONTENT */}
        <main className="min-h-[460px]">
          {loading ? (
            <div className="py-28 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-gray-150 rounded-[2rem] shadow-sm">
              <RefreshCw className="w-8 h-8 text-rust animate-spin" />
              <p className="text-xs text-gray-400 font-mono font-bold uppercase tracking-widest">Accessing central TNI server aggregates...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              
              {/* TAB 1: OVERVIEW METRIC GRID COMPONENT */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-403 tracking-widest block">Accumulated Income</span>
                          <span className="text-2xl font-serif font-black text-charcoal block mt-2">
                            GHC {(stats?.totalSales || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-green-50 text-green-600 border border-green-105">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <p className="text-[10px] text-green-621 font-bold mt-4">Verified completed transactions.</p>
                    </div>

                    {/* Orders Metr */}
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-403 tracking-widest block">Overall Orders</span>
                          <span className="text-2xl font-serif font-black text-charcoal block mt-2">
                            {stats?.totalOrders || 0} Placed
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#5A5A40]/10 text-olive border border-olive/10">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-4">Average customer basket sync values.</p>
                    </div>

                    {/* Customers Metr */}
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-403 tracking-widest block">Covenant Members</span>
                          <span className="text-2xl font-serif font-black text-charcoal block mt-2">
                            {stats?.totalCustomers || 0} Profiles
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-orange-50 text-rust border border-orange-100">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-4">Unique registered accounts database.</p>
                    </div>

                    {/* Newsletters Metr */}
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-403 tracking-widest block font-sans">Newsletters</span>
                          <span className="text-2xl font-serif font-black text-charcoal block mt-2">
                            {stats?.totalSubscribers || 0} Emails
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-105">
                          <Mail className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-[10px] text-blue-600 font-bold mt-4">Active dynamic newsletter subscribers.</p>
                    </div>
                  </div>

                  {/* Split Dashboard Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Modern List of Recent Orders */}
                    <div className="lg:col-span-8 bg-white border border-gray-150 p-6 rounded-2xl space-y-4">
                      <h3 className="font-serif text-lg font-extrabold text-[#111] pb-3 border-b border-gray-100 flex items-center justify-between">
                        <span>Fulfillment Queue Tracker</span>
                        <span className="text-[10px] font-mono text-gray-400 font-normal">Showing recent entries</span>
                      </h3>

                      <div className="space-y-3">
                        {orders.slice(0, 4).map((or) => (
                          <div key={or.id} className="p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-gray-50/50">
                            <div>
                              <p className="font-mono font-bold text-charcoal">{or.orderNumber}</p>
                              <p className="text-gray-400 text-[10px] font-medium mt-0.5">By {or.shippingAddress.fullName} • GHC {or.total.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStatusTag(or.status)}
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(or.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}

                        {orders.length === 0 && (
                          <p className="text-center py-12 text-xs text-gray-400">No active physical orders recorded in server yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Classy Promo Watermark Block */}
                    <div className="lg:col-span-4 bg-beige border border-gray-150 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <Sparkles className="w-8 h-8 text-rust animate-pulse" />
                        <h4 className="font-serif text-lg font-bold text-charcoal">Design Theme & Concept</h4>
                        <p className="text-xs text-gray-650 leading-relaxed font-sans">
                          You are currently styling under the <strong className="text-charcoal">Artistic Flair</strong> aesthetic. Rich muted greens or cream backdrops, high contrast typography, and premium subtle outlines reinforce the brand's sacred covenant street vibe.
                        </p>
                      </div>

                      <div className="bg-white/40 border border-white/50 p-3.5 rounded-xl text-[11px] text-gray-500 flex flex-col gap-1 font-mono">
                        <span className="block text-charcoal font-bold uppercase tracking-widest text-[10px] mb-1">Covenant Secrets:</span>
                        <span>1. Default Root Admin: admin@thenewidentitywear.com</span>
                        <span>2. Root Pass: AdminSecure2026</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE ORDERS REGISTRY */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-gray-155 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-extrabold text-charcoal">Fulfillment Registry</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Adjust client status between Preparing, Shipped, Delivered, or Cancelled.</p>
                    </div>
                    {currentUser.role === 'sub-admin' && (
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 p-2 rounded-xl text-[10.5px] text-amber-700 font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sub-Admin Lock: View Only privileges active.</span>
                      </div>
                    )}
                  </div>

                  {orders.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-100 font-mono text-gray-400 uppercase text-[9.5px]">
                            <th className="p-4 font-bold">SERIAL KEY NO.</th>
                            <th className="p-4 font-bold">RECIPIENT</th>
                            <th className="p-4 font-bold">TOTAL SUM</th>
                            <th className="p-4 font-bold">DATE PLACED</th>
                            <th className="p-4 font-bold">DELIVERY METRIC status</th>
                            <th className="p-4 font-bold text-right">ACTION COMMANDS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-sans">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50/40 transition">
                              <td className="p-4 font-mono font-bold text-charcoal text-[11px] select-all">
                                {o.orderNumber || 'TNI-N/A'}
                              </td>
                              <td className="p-4 text-charcoal">
                                <span className="font-bold block">{o.shippingAddress.fullName}</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">{o.shippingAddress.phone} • {o.shippingAddress.city}</span>
                              </td>
                              <td className="p-4 text-charcoal font-bold">
                                GHC {o.total.toFixed(2)}
                              </td>
                              <td className="p-4 text-gray-400 text-[10.5px] font-mono">
                                {new Date(o.createdAt).toLocaleString()}
                              </td>
                              <td className="p-4">
                                {renderStatusTag(o.status)}
                              </td>
                              <td className="p-4 text-right">
                                <select
                                  value={o.status}
                                  disabled={currentUser.role === 'sub-admin'}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className="bg-gray-50 border border-gray-200 text-charcoal rounded-xl text-[10px] font-extrabold px-3 py-1.5 focus:outline-none focus:border-rust cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-serif font-bold text-charcoal">Fulfillment registry is empty</p>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: ADMIN TEAM & ROLE ACCESS MANAGEMENT */}
              {activeTab === 'team' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel represents Team listing */}
                  <div className="lg:col-span-8 bg-white border border-gray-155 p-6 md:p-8 rounded-[1.8rem] space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-extrabold text-charcoal">Administrative Team Registry</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Overview of team personnel and security roles.</p>
                    </div>

                    <div className="space-y-3">
                      {users.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-bold text-[#111]">{item.name}</span>
                              
                              {/* Distinct colored layout badges for sub-admin, admin and super admin */}
                              {item.role === 'super-admin' && (
                                <span className="text-[8px] uppercase tracking-wider bg-red-101 border border-red-200 text-red-700 px-2 py-0.5 font-bold rounded">
                                  SUPER-ADMIN COVENANT
                                </span>
                              )}
                              {item.role === 'admin' && (
                                <span className="text-[8px] uppercase tracking-wider bg-orange-50 border border-orange-100 text-rust px-2 py-0.5 font-bold rounded">
                                  STANDARD ADMIN
                                </span>
                              )}
                              {item.role === 'sub-admin' && (
                                <span className="text-[8px] uppercase tracking-wider bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 font-bold rounded">
                                  SUB READ-ONLY
                                </span>
                              )}
                              {item.role === 'customer' && (
                                <span className="text-[8px] uppercase tracking-wider bg-gray-50 border border-gray-200 text-gray-400 px-2 py-0.5 font-bold rounded">
                                  REGISTERED CLIENT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-[10px] mt-0.5 font-mono">{item.email} • ID: {item.id.split('-')[1] || item.id}</p>
                          </div>

                          {/* Role modifier drop down (Super-admin only) */}
                          {currentUser.role === 'super-admin' && item.email !== currentUser.email && (
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="text-[9.5px] uppercase font-bold text-gray-400">Shift Role:</span>
                              <select
                                value={item.role}
                                onChange={(e) => handleModifyUserRole(item.id, e.target.value as any)}
                                className="bg-gray-50 border border-gray-200 text-charcoal rounded-lg text-[9.5px] font-bold px-2.5 py-1 focus:outline-none"
                              >
                                <option value="customer">Customer</option>
                                <option value="sub-admin">Sub-Admin (Read-Only)</option>
                                <option value="admin">Admin</option>
                                <option value="super-admin">Super Admin</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel represents New admin construction pathway */}
                  <div className="lg:col-span-4 bg-white border border-gray-155 p-6 rounded-[1.8rem] space-y-6">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-1.5">
                        <UserPlus className="w-5 h-5 text-rust shrink-0" />
                        <span>Add Team Member</span>
                      </h3>
                      {currentUser.role !== 'super-admin' && <Lock className="w-4 h-4 text-gold shrink-0" />}
                    </div>

                    {currentUser.role === 'super-admin' ? (
                      <form onSubmit={handleCreateNewAdminUser} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">User Display Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Samuel Antwi"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. sam@thenewidentitywear.com"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Showroom Hotline</label>
                          <input
                            type="tel"
                            placeholder="e.g. 0554313222"
                            value={newAdminPhone}
                            onChange={(e) => setNewAdminPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Access Password *</label>
                          <input
                            type="password"
                            required
                            placeholder="Create safe credential password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Access Access role *</label>
                          <select
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value as any)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-bold text-charcoal focus:outline-none cursor-pointer"
                          >
                            <option value="sub-admin">Sub-Admin (Read-Only Registry view)</option>
                            <option value="admin">Standard Admin (Write access, no role edit)</option>
                            <option value="super-admin">Super Admin (Full covenant control)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={creatingAdmin}
                          className="w-full bg-charcoal text-white hover:bg-rust py-3 rounded-full text-xs font-extrabold tracking-widest uppercase transition-colors"
                        >
                          {creatingAdmin ? 'Constructing credentials..' : 'Anoint & Appoint Member'}
                        </button>
                      </form>
                    ) : (
                      <div className="p-5 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center space-y-3">
                        <Lock className="w-8 h-8 text-gold mx-auto animate-pulse" />
                        <h4 className="font-serif font-bold text-[#333] text-sm">Access Role Restriction</h4>
                        <p className="text-[11px] text-gray-400 leading-normal font-sans">
                          Only <strong className="text-rust">super-admins</strong> possess sufficient permissions to add and edit internal access credentials or mutate administrator access hierarchies. Contact technical support for security clearance changes.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: COVENANT COUPONS ENGINE */}
              {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
                  
                  {/* Left Column Coupon List */}
                  <div className="lg:col-span-8 bg-white border border-gray-155 p-6 md:p-8 rounded-[1.8rem] space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-extrabold text-charcoal">Covenant Promotional Codes</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Campaign coupons currently active in database.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* We'll load matching coupons manually as static references or seed data */}
                      <div className="p-4 bg-cream border border-gray-200 rounded-2xl">
                        <p className="font-mono text-xs font-black text-rust uppercase">NEWCREATION10</p>
                        <p className="text-[11px] text-gray-500 font-sans mt-1">
                          Offers 10% discount on initial shop checkouts. No minimum spending boundaries.
                        </p>
                      </div>

                      <div className="p-4 bg-cream border border-gray-200 rounded-2xl">
                        <p className="font-mono text-xs font-black text-rust uppercase">TNI20</p>
                        <p className="text-[11px] text-gray-500 font-sans mt-1">
                          Offers 20% discount on entire cart totals. No minimum spending boundaries.
                        </p>
                      </div>

                      <div className="p-4 bg-cream border border-gray-200 rounded-2xl">
                        <p className="font-mono text-xs font-black text-rust uppercase">ACCRAFREE</p>
                        <p className="text-[11px] text-gray-500 font-sans mt-1">
                          Waives transport shipping rates for clients placing greater Accra region orders over GHC 150.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Coupon Form */}
                  <div className="lg:col-span-4 bg-white border border-gray-155 p-6 rounded-[1.8rem] space-y-6">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-1.5">
                        <Plus className="w-5 h-5 text-rust shrink-0" />
                        <span>Construct Coupon</span>
                      </h3>
                      {currentUser.role === 'sub-admin' && <Lock className="w-4 h-4 text-gold shrink-0" />}
                    </div>

                    {currentUser.role !== 'sub-admin' ? (
                      <form onSubmit={handleCreateCoupon} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Coupon Code *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. WITNESS30"
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none uppercase"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Discount Type *</label>
                          <select
                            value={newCouponType}
                            onChange={(e) => setNewCouponType(e.target.value as any)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-bold text-charcoal focus:outline-none cursor-pointer"
                          >
                            <option value="percentage">Percentage Discount (%)</option>
                            <option value="fixed">Fixed Cash Value (GHC)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Value Limit *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="Value (e.g. 15)"
                            value={newCouponValue}
                            onChange={(e) => setNewCouponValue(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Min Spend limit (GHC)</label>
                          <input
                            type="number"
                            placeholder="Optional min spend (e.g. 100)"
                            value={newCouponMinSpend}
                            onChange={(e) => setNewCouponMinSpend(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={creatingCoupon}
                          className="w-full bg-charcoal text-white hover:bg-rust py-3 rounded-full text-xs font-extrabold tracking-widest uppercase transition-colors"
                        >
                          {creatingCoupon ? 'Verifying coupon..' : 'Activate Covenant Promo'}
                        </button>
                      </form>
                    ) : (
                      <div className="p-5 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center space-y-3">
                        <Lock className="w-8 h-8 text-gold mx-auto animate-pulse" />
                        <h4 className="font-serif font-bold text-[#333] text-sm">Coupon Mutation Locked</h4>
                        <p className="text-[11px] text-gray-400 leading-normal font-sans">
                          Sub-admins are assigned a strict read-only scope and are unauthorized to mutate coupons or write promotion codes directly inside administrative database storage.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: MINISTRY CONTACT INQUIRIES & NEWSLETTER LISTS */}
              {activeTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Contact tickets */}
                  <div className="lg:col-span-8 bg-white border border-gray-155 p-6 md:p-8 rounded-[1.8rem] space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-extrabold text-charcoal flex items-center gap-1.5">
                        <FileText className="w-5 h-5 text-rust shrink-0" />
                        <span>Ministry Inquiry Tickets</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Tickets securely logged from online contact forms.</p>
                    </div>

                    <div className="space-y-4">
                      {contacts.map((ticket) => (
                        <div key={ticket.id} className="p-5 border border-gray-100 rounded-2xl space-y-2 hover:shadow-xs transition bg-[#F5F5F0]/20">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2.5 text-xs">
                            <div>
                              <span className="font-bold text-charcoal">{ticket.name}</span>
                              <span className="text-gray-400 text-[10px] ml-1.5 font-mono">{ticket.email}</span>
                            </div>
                            <span className="text-gray-400 text-[10px] font-mono">{new Date(ticket.createdAt).toLocaleString()}</span>
                          </div>
                          
                          <p className="text-xs font-bold text-rust uppercase tracking-wider">{ticket.subject}</p>
                          <p className="text-xs text-[#444] leading-relaxed italic">"{ticket.message}"</p>
                        </div>
                      ))}

                      {contacts.length === 0 && (
                        <div className="text-center py-16 text-xs text-gray-400 font-sans">
                          No customer queries or tickets logged in the system currently.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Newsletter Email lists */}
                  <div className="lg:col-span-4 bg-white border border-gray-155 p-6 rounded-[1.8rem] space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-1.5">
                        <Mail className="w-5 h-5 text-rust shrink-0" />
                        <span>Newsletter Subscribers ({subscribers.length})</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">List of verified newsletter subscribers in directory.</p>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2 pr-1.5">
                      {subscribers.map((emailItem, idx) => (
                        <div key={idx} className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl text-xs flex justify-between items-center hover:bg-beige/25 transition">
                          <span className="font-medium text-[#444] font-mono break-all">{emailItem}</span>
                          <span className="text-[9px] bg-green-50 text-green-600 font-bold px-1.5 py-0.5 rounded uppercase">Joined</span>
                        </div>
                      ))}

                      {subscribers.length === 0 && (
                        <p className="text-center py-8 text-[11px] text-gray-400 font-sans">No subscriber emails yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </main>

      </div>
    </div>
  );
}
