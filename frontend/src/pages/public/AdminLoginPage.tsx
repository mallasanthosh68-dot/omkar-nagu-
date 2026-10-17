import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { Shield, User, Lock, AlertCircle, ArrowRight, Sparkles, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Login3DNode } from '../../components/3d/Login3DNode';
import { TiltCard } from '../../components/effects/TiltCard';
import { BackButton } from '../../components/common/BackButton';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await adminLogin(username, password);
      if (res.user?.role !== 'ADMIN') {
        setErrorMsg('Access Denied: This account does not possess administrative privileges.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify admin username and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setUsername('naguomkar@service.com');
    setPassword('26152215');
  };

  const copyAdminCredentials = () => {
    navigator.clipboard.writeText('Username: naguomkar@service.com\nPassword: 26152215');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-transparent text-slate-100">
      {/* Background glow in Cobalt & Ice Blue */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Button Bar */}
        <div className="flex items-center justify-start">
          <BackButton label="Back" />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Management Access</span>
          </div>
          <Logo size="lg" variant="admin" />
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
            Admin Portal Login
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-sky-200/80">
            OMKAR NAGU ELECTRICAL WORKS — Operations Console
          </p>
        </div>

        {/* Interactive 3D Admin Security Power Core */}
        <div className="flex flex-col items-center justify-center -my-3">
          <Login3DNode
            isLoading={loading}
            isTyping={username.length > 0 || password.length > 0}
            mode="admin"
          />
          <div className="flex items-center gap-1.5 text-[11px] text-sky-300/80 -mt-2">
            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : username.length > 0 || password.length > 0 ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{loading ? 'Decrypting Admin Encryption...' : username.length > 0 || password.length > 0 ? 'Authorized Cipher Stream Active' : 'Admin Security Power Core Online'}</span>
          </div>
        </div>

        {/* Official Admin Access Credentials Box */}
        <div className="bg-[#0c2b57]/90 border border-sky-400/35 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Admin Access Credentials:
            </span>
            <div className="text-sky-100 font-mono text-xs">
              <span className="text-sky-300/70">Username: </span>
              <strong className="text-white">naguomkar@service.com</strong> <span className="text-sky-400/60">(or admin)</span>
            </div>
            <div className="text-sky-100 font-mono text-xs">
              <span className="text-sky-300/70">Password: </span>
              <strong className="text-amber-300 font-bold">26152215</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={copyAdminCredentials}
              className="p-2 text-xs font-semibold bg-[#071c3b] hover:bg-[#0a2752] text-sky-300 border border-sky-400/30 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1"
              title="Copy credentials"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="px-3 py-2 text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-xl transition-all shadow-md active:scale-95 hover:scale-105"
            >
              Auto-fill
            </button>
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

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-sky-200/90 mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. naguomkar@service.com or admin"
                  autoComplete="username"
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-sky-200/90 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password (26152215)"
                  autoComplete="current-password"
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-sky-400/70 hover:text-sky-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-sky-400/20 text-xs text-sky-200/70">
            Customer booking portal?{' '}
            <Link to="/login" className="font-semibold text-sky-300 hover:text-white transition-colors">
              Customer Login
            </Link>
          </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};
