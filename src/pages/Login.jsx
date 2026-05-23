import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let data;
      if (isSignUp) {
        data = await api.register({
          name: name.trim(),
          email: email.trim(),
          password
        });
      } else {
        data = await api.login(email.trim(), password);
      }
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen bg-[#fff7ed] flex flex-col justify-center items-center p-4 overflow-hidden font-sans">
      
      {/* Decorative Radial Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-orange-200/30 blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-amber-200 rounded-2xl p-8 shadow-[0_12px_40px_rgba(139,92,26,0.08)] relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-900 border border-amber-800 text-white mb-3 shadow-md"
          >
            <i className="fa-solid fa-layer-group text-xl"></i>
          </motion.div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Academica</h1>
          <p className="text-amber-700 text-xs mt-1">Universal Task & Project Management</p>
        </div>



        {/* Shaking Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [0, -6, 6, -6, 6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6 text-xs text-orange-900 flex items-start gap-2.5"
            >
              <i className="fa-solid fa-triangle-exclamation text-orange-600 mt-0.5"></i>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-700">
                    <i className="fa-solid fa-user text-xs"></i>
                  </span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-amber-50/50 border border-amber-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-amber-700/60 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-700">
                <i className="fa-solid fa-envelope text-xs"></i>
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-amber-700/60 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-700">
                <i className="fa-solid fa-lock text-xs"></i>
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-amber-700/60 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all duration-200"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : isSignUp ? (
              <>
                <span>Create Account</span>
                <i className="fa-solid fa-user-plus text-[10px]"></i>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <i className="fa-solid fa-arrow-right-to-bracket text-[10px]"></i>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Mode Switch Link */}
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setName('');
            }}
            className="text-[11px] text-amber-800 hover:text-amber-955 transition-colors cursor-pointer"
          >
            {isSignUp ? (
              <>Already have an account? <span className="font-bold underline text-amber-900">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="font-bold underline text-amber-900">Sign Up</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
