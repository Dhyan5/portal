import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/sheets';
import { GraduationCap, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        login(result.data.token, result.data.username);
        toast.success('Welcome back, ' + result.data.username + '!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Check your connection.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 to-primary-50/30">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 rounded-full bg-accent-100/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center mx-auto shadow-lg shadow-primary-200">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold font-display text-surface-900">Admin Login</h1>
          <p className="text-sm text-surface-500 mt-1">Sign in to manage placement drives</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 sm:p-8" style={{ '--tw-shadow': '0 4px 32px rgba(99, 102, 241, 0.08)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pr-11"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3"
              id="btn-login"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-100 text-center">
            <p className="text-xs text-surface-400">
              Protected area for authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
