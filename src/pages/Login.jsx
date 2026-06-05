import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, error, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const alertMsg = searchParams.get('msg');

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // redirect handled by useEffect
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-beige-light/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-luxuryGray-dark/20 p-8 rounded-xl shadow-premium space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center justify-center gap-1">
            <Sparkles size={12} />
            <span>Vintage Collection</span>
          </span>
          <h2 className="text-3xl font-serif font-bold text-charcoal">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log in to experience luxury South Indian fashion</p>
        </div>

        {/* Alerts from router redirections */}
        {alertMsg && (
          <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Authentication error */}
        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded animate-fadeIn">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Sign Up Redirect */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-luxuryGray">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-gold hover:underline">
              Create free account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
