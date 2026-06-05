import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useContext(AuthContext);

  const [step, setStep] = useState(1); // 1 = request, 2 = reset form
  const [email, setEmail] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [codeEntry, setCodeEntry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const data = await forgotPassword(email);
      setDemoCode(data.resetCode);
      setMessage(data.message);
      setStep(2);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err || 'Failed to request reset pin');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    if (codeEntry !== demoCode) {
      setErrorMsg('Invalid verification pin code');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(email, password);
      setMessage(data.message);
      setStep(3); // success view
      setLoading(false);
    } catch (err) {
      setErrorMsg(err || 'Password reset failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-beige-light/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-luxuryGray-dark/20 p-8 rounded-xl shadow-premium space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center justify-center gap-0.5">
            <Key size={12} />
            <span>Security Recovery</span>
          </span>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Reset Password</h2>
          <p className="text-xs text-gray-400">Restore access to your Vintage account</p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {message && step !== 3 && (
          <div className="flex flex-col space-y-2 text-xs text-green-700 bg-green-50 border border-green-200 p-4 rounded leading-relaxed">
            <p className="font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>Reset Code Received</span>
            </p>
            <p>{message}</p>
            <div className="border-t border-green-200 pt-2 mt-1">
              <span className="font-bold uppercase">Demo Code:</span>{' '}
              <span className="font-serif text-sm tracking-widest bg-white border px-3 py-1 font-bold text-charcoal border-green-300 rounded ml-1.5">
                {demoCode}
              </span>
            </div>
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 border rounded focus:outline-none"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Requesting...' : 'Request Verification Pin'}
            </button>
          </form>
        )}

        {/* Step 2: Code verification & password reset fields */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider">Enter 6-Digit Demo Pin</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="######"
                value={codeEntry}
                onChange={(e) => setCodeEntry(e.target.value)}
                className="w-full p-3 border rounded text-center tracking-widest text-lg font-bold bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-wider text-xs py-3.5 rounded shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Confirm Reset Password'}
            </button>
          </form>
        )}

        {/* Step 3: Success View */}
        {step === 3 && (
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <CheckCircle2 size={48} className="text-green-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal">Password Recovered!</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Your password has been successfully reset. You can now use your new credentials to access your account.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-charcoal hover:bg-gold text-white hover:text-charcoal px-8 py-3 uppercase tracking-widest text-xs font-bold rounded shadow transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login link */}
        {step !== 3 && (
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-luxuryGray">
            <Link to="/login" className="font-semibold text-gold hover:underline">
              Back to Sign In
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
