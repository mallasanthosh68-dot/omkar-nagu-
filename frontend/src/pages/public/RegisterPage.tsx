import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { User, Phone, MapPin, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Clean phone number (strip whitespace, hyphens, and leading +91 or 0)
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('+91')) {
      cleanPhone = cleanPhone.substring(3);
    } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1);
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
        password,
        confirmPassword
      });

      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. An account with this phone number might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-transparent text-slate-100">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Back Button Bar */}
        <div className="flex items-center justify-start">
          <BackButton label="Back" />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
            Create Your Customer Account
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-200/80">
            Join Omkar Nagu Electrical Works for seamless service bookings
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-8 rounded-2xl shadow-2xl shadow-[#04142b]/60 space-y-6 backdrop-blur-md">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs animate-pulse">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg} Redirecting to your dashboard...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Section: Personal Information */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block border-b border-sky-400/20 pb-1">
                Personal Information
              </span>

              <div>
                <label className="block text-xs font-medium text-sky-200/90 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-sky-200/90 mb-1">
                  Phone Number (Indian Mobile) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-sky-200/90 mb-1">
                  Full Service Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Door/Flat No, Apartment, Street, Landmark, Visakhapatnam..."
                    className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Account & Password */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block border-b border-sky-400/20 pb-1">
                Account Security
              </span>

              <div>
                <label className="block text-xs font-medium text-sky-200/90 mb-1">
                  Create Password (min. 8 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-sky-200/90 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-sky-400/20 text-xs text-sky-200/70">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-300 hover:text-white transition-colors">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
