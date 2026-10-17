import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BookingModal } from './components/booking/BookingModal';
import { BookingDetailsModal } from './components/booking/BookingDetailsModal';
import { Booking, ServiceItem } from './types';
import { ElectricBackground } from './components/effects/ElectricBackground';
import { TouchSparkEffect } from './components/effects/TouchSparkEffect';
import { ScrollProgress3D } from './components/effects/ScrollProgress3D';
import { PageTransition } from './components/effects/PageTransition';
import { LogoSketchModal } from './components/effects/LogoSketchModal';
import { IntroLogoSketchSplash } from './components/effects/IntroLogoSketchSplash';

// Keep HomePage instant/eager for instant 0ms first render
import { HomePage } from './pages/public/HomePage';

// Lazy-loaded routes for ultra-fast initial page load
const ServicesPage = React.lazy(() => import('./pages/public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AboutPage = React.lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const LoginPage = React.lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AdminLoginPage = React.lazy(() => import('./pages/public/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));

// Customer Pages (Lazy Loaded)
const CustomerDashboard = React.lazy(() => import('./pages/customer/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const MyBookingsPage = React.lazy(() => import('./pages/customer/MyBookingsPage').then(m => ({ default: m.MyBookingsPage })));
const CustomerProfilePage = React.lazy(() => import('./pages/customer/CustomerProfilePage').then(m => ({ default: m.CustomerProfilePage })));

// Admin Pages & Layout (Lazy Loaded)
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminBookingsPage = React.lazy(() => import('./pages/admin/AdminBookingsPage').then(m => ({ default: m.AdminBookingsPage })));
const AdminCustomersPage = React.lazy(() => import('./pages/admin/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminServicesPage = React.lazy(() => import('./pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })));

// High-performance loading indicator
const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
    <div className="relative w-14 h-14 flex items-center justify-center mb-3">
      <div className="absolute inset-0 rounded-full border-2 border-sky-400/20 animate-ping" />
      <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-amber-400 border-r-sky-400 animate-spin" />
      <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-amber-300 text-xs">
        ⚡
      </div>
    </div>
    <p className="text-xs font-semibold tracking-wider text-sky-200/80 uppercase animate-pulse">
      Loading Omkar Nagu Electricals...
    </p>
  </div>
);

// Protected Route Guards
const CustomerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCustomer, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isCustomer) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const MainAppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  // 9-Second Intro Logo Sketch Splash Animation
  // Only triggers when explicitly opened, via ?intro=true, or on demand
  const [showIntroSplash, setShowIntroSplash] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('intro') === 'true') {
      return true;
    }
    if (params.get('skipIntro') === 'true' || params.get('intro') === 'false') {
      return false;
    }
    try {
      if (sessionStorage.getItem('omkar_intro_seen') === 'true') {
        return false;
      }
    } catch {
      // fallback
    }
    return false;
  });

  // Global Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<string | undefined>(undefined);
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);

  // Global Booking Details Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Global 9s Logo Sketch Modal State (optional fallback modal)
  const [logoSketchModalOpen, setLogoSketchModalOpen] = useState(false);

  const handleOpenBooking = (category?: string, service?: any) => {
    setBookingCategory(category);
    setBookingService(service || null);
    setBookingModalOpen(true);
  };

  const handleOpenBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 relative overflow-x-hidden">
      {/* 9-Second Logo Sketch Intro Splash (On opening website with URL or clicking button) */}
      {showIntroSplash && (
        <IntroLogoSketchSplash
          onComplete={() => {
            try {
              sessionStorage.setItem('omkar_intro_seen', 'true');
            } catch {}
            setShowIntroSplash(false);
          }}
          onBack={() => {
            try {
              sessionStorage.setItem('omkar_intro_seen', 'true');
            } catch {}
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setShowIntroSplash(false);
            }
          }}
          onNavigate={(path) => {
            try {
              sessionStorage.setItem('omkar_intro_seen', 'true');
            } catch {}
            setShowIntroSplash(false);
            navigate(path);
          }}
        />
      )}

      {/* Dynamic Ambient Electric Lighting & Plasma Aurora Background */}
      <ElectricBackground />

      {/* 3D Electric Scroll Progress Beam */}
      <ScrollProgress3D />

      {/* Tactile Micro-Interactions: Electric Sparks & Neon Ripples on every touch/click */}
      <TouchSparkEffect />

      {/* Show Public/Customer Navbar only when not in admin operations portal */}
      {!isAdminRoute && (
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
          onOpenSketch={() => setShowIntroSplash(true)}
        />
      )}


      <main className="flex-1 relative z-10">
        <PageTransition>
          <React.Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenBooking={handleOpenBooking}
                    onOpenSketch={() => setShowIntroSplash(true)}
                  />
                }
              />

              <Route path="/services" element={<ServicesPage onOpenBooking={handleOpenBooking} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage onOpenBooking={() => handleOpenBooking()} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Seamless Requirement Intake Booking Route */}
              <Route
                path="/book"
                element={
                  <ServicesPage onOpenBooking={handleOpenBooking} />
                }
              />

              {/* Customer Portal Routes (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <CustomerProtectedRoute>
                    <CustomerDashboard
                      onOpenBooking={handleOpenBooking}
                      onOpenBookingDetails={handleOpenBookingDetails}
                    />
                  </CustomerProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <CustomerProtectedRoute>
                    <MyBookingsPage
                      onOpenBooking={() => handleOpenBooking()}
                      onOpenBookingDetails={handleOpenBookingDetails}
                    />
                  </CustomerProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <CustomerProtectedRoute>
                    <CustomerProfilePage />
                  </CustomerProtectedRoute>
                }
              />

              {/* Admin Portal Routes (Protected with Admin Role) */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard onOpenBookingDetails={handleOpenBookingDetails} />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminBookingsPage onOpenBookingDetails={handleOpenBookingDetails} />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminCustomersPage onOpenBookingDetails={handleOpenBookingDetails} />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminServicesPage />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </PageTransition>
      </main>

      {/* Show Public/Customer Footer only when not in admin operations portal */}
      {!isAdminRoute && <Footer />}

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedCategory={bookingCategory}
        preselectedService={bookingService}
        onBookingSuccess={() => {
          // Can refresh lists if needed
        }}
      />

      {/* Global Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        isAdminView={isAdminRoute}
      />

      {/* 9-Second Logo Outline Sketch Animation Modal */}
      <LogoSketchModal
        isOpen={logoSketchModalOpen}
        onClose={() => setLogoSketchModalOpen(false)}
      />

      {/* Floating Quick Trigger for 9s Logo Sketch Animation */}
      {!isAdminRoute && (
        <button
          type="button"
          onClick={() => setShowIntroSplash(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#08234d]/90 hover:bg-[#0c3166] border border-sky-400/40 text-xs font-bold text-sky-200 shadow-xl shadow-[#04142b]/80 hover:scale-105 active:scale-95 transition-all backdrop-blur-md group"
          title="Watch 8-10s Logo Outline Sketch Animation"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-sky-400/60 bg-slate-900 flex items-center justify-center shrink-0">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
            <div className="absolute inset-0 border border-amber-300 rounded-full animate-ping opacity-50" />
          </div>
          <span className="hidden sm:inline">9s Logo Sketch</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px]">
            Live
          </span>
        </button>
      )}
    </div>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainAppContent />
      </Router>
    </AuthProvider>
  );
}
