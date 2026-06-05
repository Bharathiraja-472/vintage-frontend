import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const { login, logout, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is already an admin, redirect directly to dashboard
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await login(email, password);

      if (data.role !== 'admin') {
        // Not an admin — immediately revoke session
        logout();
        setErrorMessage('Access Denied. You are not registered as an administrator.');
        setLoading(false);
        return;
      }

      // Admin verified — navigate to dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid administrator credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-charcoal-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-charcoal border border-gold/30 p-8 rounded-xl shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
            <KeyRound size={12} />
            <span>Vintage Collection Management</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Administrator Portal</h2>
          <p className="text-xs text-gray-400">Please provide administrator credentials to log in.</p>
        </div>

        {errorMessage && (
          <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs text-gray-300">
          
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@vintagecollection.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border border-white/10 bg-charcoal-light/60 text-white rounded focus:outline-none focus:border-gold placeholder-gray-500"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 border border-white/10 bg-charcoal-light/60 text-white rounded focus:outline-none focus:border-gold placeholder-gray-500"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded shadow-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : 'Access Console'}
            </button>
          </div>
        </form>

        <div className="text-[10px] text-gray-500 text-center leading-relaxed">
          <p>This is a secure gateway. Attempts to unauthorized access are logged.</p>
          <p className="pt-2 text-gold-premium font-semibold">Demo Credentials: admin@vintagecollection.com / Admin@123</p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
