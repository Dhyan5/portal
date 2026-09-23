import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-300 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display text-surface-900 leading-tight">PlaceMe</span>
              <span className="text-[10px] text-surface-500 leading-none hidden sm:block">Placement Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Drives
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === '/admin/dashboard'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="w-px h-6 bg-surface-200 mx-1" />
                <span className="text-sm text-surface-500">Hi, <span className="font-semibold text-surface-700">{username}</span></span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="btn-primary text-sm !px-5 !py-2"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-in border-t border-surface-100 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              All Drives
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
