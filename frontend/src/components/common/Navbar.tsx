import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

import { Menu, X, Calendar, User as UserIcon, LogOut, Shield, PhoneCall, PlusCircle, Zap, ArrowLeft } from 'lucide-react';
import { getBusinessWhatsAppNumber } from '../../utils/whatsapp';

interface NavbarProps {
  onOpenBooking?: () => void;
  onOpenSketch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenSketch }) => {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const businessPhone = getBusinessWhatsAppNumber();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Show Back button only on nested sub-pages, not on root or main dashboards
  const isSubPage =
    location.pathname !== '/' &&
    location.pathname !== '/dashboard' &&
    location.pathname !== '/admin/dashboard';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08234d]/90 backdrop-blur-md border-b border-sky-400/20 transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-4">
          {/* 1. Left: Brand Logo & Contextual Sub-page Back Navigation */}
          <div className="flex-shrink-0 flex items-center gap-2.5 sm:gap-3">
            {isSubPage && (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate(isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/');
                  }
                }}
                className="h-9 w-9 rounded-xl bg-[#0c2b57]/90 hover:bg-[#123b72] border border-sky-400/40 text-sky-200 hover:text-white transition-all active:scale-95 shadow-sm inline-flex items-center justify-center shrink-0 cursor-pointer"
                title="Go back to previous page"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-sky-300" />
              </button>
            )}
            <Logo size="md" showTagline={false} onOpenSketch={onOpenSketch} />
          </div>

          {/* 2. Center: Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            {!isAuthenticated ? (
              // Public Navigation (Before Login)
              <>
                <Link
                  to="/"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap ${
                    isActive('/') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap ${
                    isActive('/services') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap ${
                    isActive('/about') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap ${
                    isActive('/contact') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  Contact
                </Link>
              </>
            ) : isCustomer ? (
              // Customer Logged In (After Login) - Only Customer Navigation
              <>
                <Link
                  to="/dashboard"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center whitespace-nowrap ${
                    isActive('/dashboard') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenBooking ? onOpenBooking() : navigate('/book')}
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 border border-sky-300 shadow-md shadow-sky-500/25 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Book Service</span>
                </button>
                <Link
                  to="/my-bookings"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isActive('/my-bookings') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>My Bookings</span>
                </Link>
                <Link
                  to="/profile"
                  className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isActive('/profile') 
                      ? 'text-white bg-[#0e3774] border border-sky-400/40 shadow-xs' 
                      : 'text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Profile</span>
                </Link>
              </>
            ) : isAdmin ? (
              // Admin Logged In
              <>
                <Link
                  to="/admin/dashboard"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-sky-200 bg-sky-500/15 border border-sky-400/30 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Admin Portal</span>
                </Link>
                <Link
                  to="/admin/bookings"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70 inline-flex items-center justify-center whitespace-nowrap"
                >
                  Bookings
                </Link>
                <Link
                  to="/admin/customers"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70 inline-flex items-center justify-center whitespace-nowrap"
                >
                  Customers
                </Link>
                <Link
                  to="/admin/services"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-medium text-sky-200/90 hover:text-white hover:bg-[#0c2b57]/70 inline-flex items-center justify-center whitespace-nowrap"
                >
                  Services
                </Link>
              </>
            ) : null}
          </nav>

          {/* 3. Right: User Identity, Quick Actions & Helpline */}
          <div className="hidden md:flex items-center gap-2 xl:gap-2.5">
            {!isAuthenticated ? (
              // Public Visitor Actions
              <>
                <button
                  type="button"
                  onClick={() => onOpenBooking ? onOpenBooking() : navigate('/book')}
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 border border-sky-300 shadow-md shadow-sky-500/25 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Book Service</span>
                </button>
                <div className="h-5 w-px bg-sky-500/25 mx-0.5 shrink-0" />
                <Link
                  to="/login"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-sky-100 hover:text-white hover:bg-[#0c2b57]/70 transition-colors inline-flex items-center justify-center whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md shadow-sky-500/25 hover:shadow-sky-400/40 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center whitespace-nowrap"
                >
                  Create Account
                </Link>
              </>
            ) : isCustomer ? (
              // Customer Logged In Identity
              <>
                <div className="h-5 w-px bg-sky-500/25 mx-0.5 shrink-0" />
                {/* User Greeting Pill (Strict single line, clean emerald online dot) */}
                <div className="h-9 px-3 rounded-xl inline-flex items-center gap-1.5 bg-[#061b38] border border-sky-400/25 text-xs text-sky-200 font-medium whitespace-nowrap shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399] shrink-0" />
                  <span className="text-slate-400 font-normal">Hi,</span>
                  <span className="text-white font-bold">{user?.name ? user.name.split(' ')[0] : 'Customer'}</span>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-9 px-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : isAdmin ? (
              // Admin Logged In Identity
              <>
                <div className="h-5 w-px bg-sky-500/25 mx-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-9 px-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}

            {/* Direct Phone Helpline */}
            <a
              href={`tel:+${businessPhone}`}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold text-sky-200 hover:text-white bg-[#0c2b57]/90 hover:bg-[#123b72] border border-sky-400/30 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              title="Call Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-mono tracking-tight whitespace-nowrap">+91 94946 66420</span>
            </a>
          </div>

          {/* Mobile Menu Button & Controls */}
          <div className="flex md:hidden items-center gap-2">
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }}
                className="p-2 rounded-xl bg-[#0c2b57] text-sky-300 border border-sky-400/30 hover:text-white cursor-pointer"
                title="Go Back"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <a
              href={`tel:+${businessPhone}`}
              className="p-2 rounded-xl bg-[#0c2b57] text-sky-300 border border-sky-400/30"
              title="Call Helpline"
            >
              <PhoneCall className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-sky-200 hover:text-white bg-[#0c2b57] border border-sky-400/30 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sky-400/20 bg-[#08234d]/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          {location.pathname !== '/' && (
            <div className="pb-2 border-b border-sky-400/20">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-200 text-sm font-bold"
              >
                <ArrowLeft className="w-4 h-4 text-sky-300" />
                <span>Back to Previous Screen</span>
              </button>
            </div>
          )}

          {!isAuthenticated ? (
            // Public Mobile Menu (Before Login)
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/services') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                Services
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/about') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/contact') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                Contact
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) onOpenBooking();
                  else navigate('/book');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book Service</span>
              </button>

              <div className="pt-3 border-t border-sky-400/20 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-sky-100 bg-[#0c2b57] border border-sky-400/30"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md"
                >
                  Create Account
                </Link>
              </div>
            </>
          ) : isCustomer ? (
            // Customer Mobile Menu (After Login - No Home, Services, About, Contact)
            <>
              <div className="px-3 py-2 bg-[#0c2b57]/80 rounded-xl border border-sky-400/25 mb-2">
                <span className="text-xs text-sky-300 block">Logged in as</span>
                <span className="text-sm font-bold text-white">{user?.name}</span>
                <span className="text-xs text-sky-200/80 block">{user?.phone}</span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/dashboard') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking ? onOpenBooking() : navigate('/book');
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 font-bold"
              >
                <PlusCircle className="w-5 h-5" />
                Book New Service
              </button>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/my-bookings') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                My Bookings
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/profile') ? 'bg-[#0e3774] text-white border border-sky-400/30' : 'text-sky-200 hover:bg-[#0c2b57]'
                }`}
              >
                Profile Settings
              </Link>
              <div className="pt-2 border-t border-sky-400/20">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-rose-300 hover:bg-rose-500/15"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Admin Mobile Menu
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-sky-200 bg-sky-500/20 border border-sky-400/30"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-sky-200 hover:bg-[#0c2b57]"
              >
                Bookings
              </Link>
              <Link
                to="/admin/customers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-sky-200 hover:bg-[#0c2b57]"
              >
                Customers
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-rose-300 hover:bg-rose-500/15"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

