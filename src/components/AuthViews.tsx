import React, { useState } from 'react';
import { Mail, Lock, User, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthViewsProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthViews({
  initialMode = 'login',
  onNavigate,
  onLoginSuccess
}: AuthViewsProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  // Input fields states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback hooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();

      if (data.success) {
        setSuccess('Authentication successful! Initializing customer credentials..');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onNavigate('dashboard');
        }, 800);
      } else {
        setError(data.message || 'Incorrect credentials.');
      }
    } catch (err) {
      setError('Server connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please input all mandatory columns.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await resp.json();

      if (data.success) {
        setSuccess('Account created! Sign in credentials activated. Please log in.');
        setTimeout(() => {
          setMode('login');
          setSuccess('');
        }, 1500);
      } else {
        setError(data.message || 'Registration failure.');
      }
    } catch (e) {
      setError('Database link error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please input your valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();

      if (data.success) {
        setSuccess(data.message || 'Dispatched credentials link to registered inbox!');
        setEmail('');
      } else {
        setError(data.message || 'Registered email not found.');
      }
    } catch (e) {
      setError('Network request timed-out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-views-root" className="w-full pt-32 md:pt-40 pb-20 bg-cream min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          
          {/* Top Logo emblem */}
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs mx-auto mb-3">
              TNI
            </div>
            {mode === 'login' && (
              <>
                <h1 className="font-serif text-2xl font-extrabold text-[#111] tracking-tight">Sign Into Your Account</h1>
                <p className="text-[10px] text-gray-400 font-mono mt-1">THE NEW IDENTITY WEAR MEMBERS PORTAL</p>
              </>
            )}
            {mode === 'register' && (
              <>
                <h1 className="font-serif text-2xl font-extrabold text-[#111] tracking-tight">Create TNI Account</h1>
                <p className="text-[10px] text-gray-400 font-mono mt-1">JOIN A BELIEVING COMMUNITY FAMILY</p>
              </>
            )}
            {mode === 'forgot' && (
              <>
                <h1 className="font-serif text-2xl font-extrabold text-[#111] tracking-tight">Recover Password</h1>
                <p className="text-[10px] text-gray-400 font-mono mt-1">RESET YOUR TRANSACTIONS ENCRYPTION</p>
              </>
            )}
          </div>

          {/* Form blocks depending on modes */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. adwoa@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-[10px] text-rust hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 shrink-0 text-green-600" /> {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white text-xs font-extrabold tracking-widest uppercase py-3 rounded-full hover:bg-rust transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {loading ? 'Validating..' : 'Log In'} <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-center text-gray-500 pt-3">
                Don't have an offline drop account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-rust hover:underline font-semibold"
                >
                  Create Account
                </button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adwoa Osei"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. adwoa@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Confirm</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-1.5 font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-150 rounded-2xl text-green-700 text-xs flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 shrink-0 text-green-600" /> {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white text-xs font-extrabold tracking-widest uppercase py-3 rounded-full hover:bg-rust transition duration-300"
              >
                {loading ? 'Assembling Account Key..' : 'Join Community'}
              </button>

              <p className="text-xs text-center text-gray-500 pt-3">
                Already have a core credentials tag?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-rust hover:underline font-semibold"
                >
                  Log In Instead
                </button>
              </p>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed font-sans mt-2 mb-4 text-center">
                Input your registered email, and we will dispatch credentials reset tokens to get your profile re-secured.
              </p>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Your Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. adwoa@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-rust"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-150 rounded-2xl text-green-700 text-xs flex items-start gap-1.5 leading-normal">
                  <Check className="w-4 h-4 shrink-0 text-green-600" /> <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white text-xs font-extrabold tracking-widest uppercase py-3 rounded-full hover:bg-rust transition duration-300"
              >
                {loading ? 'Connecting SMTP mailbox..' : 'Dispatch Reset Link'}
              </button>

              <p className="text-xs text-center text-gray-500 pt-3">
                Back to{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-rust hover:underline font-semibold"
                >
                  Log In
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
