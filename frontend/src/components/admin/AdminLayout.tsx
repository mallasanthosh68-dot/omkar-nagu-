import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wrench,
  LogOut,
  Menu,
  X,
  Shield,
  Zap
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#061938] text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#051634]/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#08234d] border-r border-sky-400/20 flex flex-col justify-between transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo in Admin Bar */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-sky-400/20 bg-[#061c3d]">
            <Logo size="sm" variant="admin" showTagline={false} linkTo="/admin/dashboard" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-sky-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Tag */}
          <div className="px-6 py-3 bg-sky-500/15 border-b border-sky-400/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Admin Operations Portal
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 text-sm overflow-y-auto max-h-[calc(100vh-210px)]">
            <Link
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                  : 'text-sky-200/90 hover:bg-[#0c2b57] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {/* Bookings with Sub-menu */}
            <div className="pt-2">
              <Link
                to="/admin/bookings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  location.pathname === '/admin/bookings' && !location.search
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                    : 'text-sky-200/90 hover:bg-[#0c2b57] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4" />
                  <span>Bookings</span>
                </div>
              </Link>

              {/* Sub-menu items for Status Filters */}
              <div className="pl-6 pr-2 pt-1.5 space-y-1 border-l-2 border-sky-400/20 ml-5 mt-1">
                <Link
                  to="/admin/bookings?status=NEW"
                  onClick={() => setSidebarOpen(false)}
                  className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('NEW')
                      ? 'bg-sky-500/25 text-amber-300 font-bold'
                      : 'text-sky-200/70 hover:text-white hover:bg-[#0c2b57]'
                  }`}
                >
                  🟡 New Requests
                </Link>
                <Link
                  to="/admin/bookings?status=CONFIRMED"
                  onClick={() => setSidebarOpen(false)}
                  className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('CONFIRMED')
                      ? 'bg-sky-500/25 text-sky-300 font-bold'
                      : 'text-sky-200/70 hover:text-white hover:bg-[#0c2b57]'
                  }`}
                >
                  🔵 Confirmed
                </Link>
                <Link
                  to="/admin/bookings?status=IN_PROGRESS"
                  onClick={() => setSidebarOpen(false)}
                  className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('IN_PROGRESS')
                      ? 'bg-sky-500/25 text-amber-400 font-bold'
                      : 'text-sky-200/70 hover:text-white hover:bg-[#0c2b57]'
                  }`}
                >
                  🟠 In Progress
                </Link>
                <Link
                  to="/admin/bookings?status=COMPLETED"
                  onClick={() => setSidebarOpen(false)}
                  className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('COMPLETED')
                      ? 'bg-sky-500/25 text-emerald-300 font-bold'
                      : 'text-sky-200/70 hover:text-white hover:bg-[#0c2b57]'
                  }`}
                >
                  🟢 Completed
                </Link>
                <Link
                  to="/admin/bookings?status=CANCELLED"
                  onClick={() => setSidebarOpen(false)}
                  className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('CANCELLED')
                      ? 'bg-sky-500/25 text-rose-300 font-bold'
                      : 'text-sky-200/70 hover:text-white hover:bg-[#0c2b57]'
                  }`}
                >
                  🔴 Cancelled
                </Link>
              </div>
            </div>

            <Link
              to="/admin/customers"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                isActive('/admin/customers')
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                  : 'text-sky-200/90 hover:bg-[#0c2b57] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </Link>

            <Link
              to="/admin/services"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                isActive('/admin/services')
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                  : 'text-sky-200/90 hover:bg-[#0c2b57] hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Services</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-sky-400/20 bg-[#061c3d]">
          <div className="flex items-center justify-between text-xs mb-3">
            <div>
              <span className="font-bold text-white block truncate">{user?.name}</span>
              <span className="text-[11px] text-sky-300/80">Master Admin</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Online" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#08234d]/90 border-b border-sky-400/20 flex items-center justify-between px-4 sm:px-6 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-sky-200 hover:text-white hover:bg-[#0c2b57]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                OMKAR NAGU ELECTRICAL WORKS — ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white font-medium transition-colors"
            >
              <span>View Public Website ↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#08234d] to-[#051634]">
          {children}
        </main>
      </div>
    </div>
  );
};
