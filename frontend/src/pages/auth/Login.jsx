import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page relative flex min-h-screen overflow-hidden">
      {/* Left panel — branding */}
      <div className="login-panel-left relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="login-bg-left absolute inset-0" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />

        <div className="relative z-10 login-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">PCMS</span>
          </div>
        </div>

        <div className="relative z-10 login-slide-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Manage your catalog
            <span className="block text-primary-300">with confidence</span>
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
            A complete platform for product management, order approvals, and real-time notifications.
          </p>

          <div className="mt-10 flex gap-6">
            {[
              { label: 'Products', value: '∞' },
              { label: 'Orders', value: 'Live' },
              { label: 'Alerts', value: 'Real-time' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="login-slide-up rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500 login-fade-in" style={{ animationDelay: '0.5s' }}>
          © 2026 Product Catalog Management System
        </p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
        <div className="login-bg-right absolute inset-0 lg:hidden" />
        <div className="login-orb login-orb-3 lg:hidden" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden login-slide-up">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Product Catalog MS</h1>
          </div>

          <div className="login-card login-slide-up rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl lg:bg-white lg:shadow-2xl"
            style={{ animationDelay: '0.1s' }}>
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-1 text-sm text-gray-500">Sign in to continue to your dashboard</p>
            </div>

            {error && (
              <div className="login-shake mb-4">
                <Alert type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="login-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                <div className={`login-input-wrap rounded-xl border-2 bg-white transition-all duration-300 ${
                  focused === 'email' ? 'border-primary-500 shadow-md shadow-primary-500/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 px-4">
                    <svg className={`h-5 w-5 transition-colors ${focused === 'email' ? 'text-primary-500' : 'text-gray-400'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder="you@example.com"
                      required
                      className="w-full py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="login-slide-up" style={{ animationDelay: '0.3s' }}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                <div className={`login-input-wrap rounded-xl border-2 bg-white transition-all duration-300 ${
                  focused === 'password' ? 'border-primary-500 shadow-md shadow-primary-500/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 px-4">
                    <svg className={`h-5 w-5 transition-colors ${focused === 'password' ? 'text-primary-500' : 'text-gray-400'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      placeholder="••••••••"
                      required
                      className="w-full py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="login-slide-up pt-1" style={{ animationDelay: '0.4s' }}>
                <Button type="submit" className="login-btn w-full py-3" loading={loading}>
                  Sign In
                </Button>
              </div>
            </form>

            <p className="login-slide-up mt-8 text-center text-sm text-gray-500" style={{ animationDelay: '0.5s' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
