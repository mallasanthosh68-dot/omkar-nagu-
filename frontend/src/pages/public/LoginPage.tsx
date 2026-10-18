import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { Phone, Lock, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Login3DNode } from '../../components/3d/Login3DNode';
import { TiltCard } from '../../components/effects/TiltCard';
import { BackButton } from '../../components/common/BackButton';
import { getBusinessWhatsAppNumber } from '../../utils/whatsapp';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const whatsappNum = getBusinessWhatsAppNumber();

  const { isAuthenticated, isAdmin, isCustomer, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isCustomer) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isCustomer, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(phone, password);
      // Auto redirect based on role or previous location state
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your phone number and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-transparent text-slate-100">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Button Bar */}
        <div className="flex items-center justify-start">
          <BackButton label="Back" />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
            Customer Login
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-200/80">
            Sign in to book electrical services and track booking status
          </p>
        </div>

        {/* Interactive 3D Quantum Security Node */}
        <div className="flex flex-col items-center justify-center -my-3">
          <Login3DNode
            isLoading={loading}
            isTyping={phone.length > 0 || password.length > 0}
            mode="customer"
          />
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300/80 -mt-2">
            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : phone.length > 0 || password.length > 0 ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{loading ? 'Verifying 3D Security Gateway...' : phone.length > 0 || password.length > 0 ? 'Secure Input Signal Active' : '3D Power Security Gateway Online'}</span>
          </div>
        </div>

        {/* 3D Tilt Form Card */}
        <TiltCard maxTilt={3.5} glare={true} className="rounded-2xl">
          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-8 rounded-2xl shadow-2xl shadow-[#04142b]/60 space-y-6 backdrop-blur-md">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-sky-200/90 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  autoComplete="off"
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-sky-200/90">
                  Password
                </label>
                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello,%20I%20forgot%20my%20password%20for%20Omkar%20Nagu%20Electrical%20Works.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-300 hover:text-white transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-sky-400/20 text-xs text-sky-200/70">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-sky-300 hover:text-white transition-colors">
              Create New Account
            </Link>
          </div>
          </div>
        </TiltCard>

        {/* Staff/Admin link footer */}
        <div className="text-center">
          <Link
            to="/admin/login"
            className="text-xs text-sky-300/70 hover:text-sky-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3" />
            Switch to Admin Portal Login
          </Link>
        </div>
      </div>
    </div>
  );
};
