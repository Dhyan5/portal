'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-md shadow-primary-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-surface-900 tracking-tight block leading-none">
                Placement Portal
              </span>
              <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-widest block mt-0.5">
                Campus Drive System
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`btn-secondary text-xs sm:text-sm !py-2 ${
                    pathname === '/admin/dashboard' ? '!border-primary-300 !bg-primary-50 !text-primary-700' : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 text-surface-700 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                  <span>{username || 'Admin'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-danger text-xs sm:text-sm !py-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-xs sm:text-sm !py-2"
                id="nav-login-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
