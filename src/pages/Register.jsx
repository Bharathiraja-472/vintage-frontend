import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Phone, ShieldAlert, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, error, user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
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
          <h2 className="text-3xl font-serif font-bold text-charcoal">Create Account</h2>
          <p className="text-xs text-gray-400">Join our exclusive South Indian luxury store</p>
        </div>

        {/* Input validations */}
        {(validationError || error) && (
          <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 pl-10 border rounded focus:outline-none focus:border-gold placeholder-gray-400 bg-white"
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border rounded focus:outline-none"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider">Phone Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 pl-10 border rounded focus:outline-none"
              />
              <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 border rounded focus:outline-none"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-10 border rounded focus:outline-none"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Registering Account...' : 'Register Now'}
            </button>
          </div>
        </form>

        {/* Login Redirect */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-luxuryGray">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-gold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
