import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils/urls';
import { useAuth } from '@/contexts/AuthContext';

export default function Access() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const navigate = useNavigate();
  const { user, login, loginWithCode, register } = useAuth();

  useEffect(() => {
    // Auto-redirect if user already logged in
    if (user) {
      navigate(createPageUrl('Dashboard'), { replace: true });
    }
  }, [user, navigate]);

  const validateAccessCode = (code: string): string | null => {
    if (!code) return null;
    if (code.length < 5) return 'Access code must be at least 5 characters';
    if (!/[a-zA-Z]/.test(code)) return 'Must include at least one letter';
    if (!/[0-9]/.test(code)) return 'Must include at least one number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(code)) return 'Must include at least one special character';
    return null;
  };

  const handleAccessCodeChange = (value: string) => {
    setAccessCode(value);
    if (!isRegistering) {
      setAccessCodeError('');
      return;
    }
    const validation = validateAccessCode(value);
    setAccessCodeError(validation || '');
  };

  const handleSubmit = async () => {
    setError('');
    setErrorShake(false);
    setIsLoading(true);

    try {
      const trimmedCode = accessCode.trim();
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      // Quick login path with access code only
      if (trimmedCode && !trimmedUsername && !trimmedPassword) {
        await loginWithCode(trimmedCode);
        navigate(createPageUrl('Dashboard'));
        return;
      }

      if (!trimmedUsername || !trimmedPassword) {
        setError('Username and password are required');
        setErrorShake(true);
        return;
      }

      if (isRegistering) {
        const codeError = validateAccessCode(trimmedCode);
        if (codeError) {
          setAccessCodeError(codeError);
          setError('Please fix the access code requirements');
          setErrorShake(true);
          return;
        }
        await register(trimmedUsername, trimmedPassword, trimmedCode || undefined);
      } else {
        await login(trimmedUsername, trimmedPassword);
      }

      navigate(createPageUrl('Dashboard'));
    } catch (err: any) {
      setError(err?.message || 'Unable to authenticate');
      setErrorShake(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-6 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center mb-12">
          <div className="w-8 h-8 border border-[#2a2a2d] mx-auto mb-8 flex items-center justify-center">
            <motion.div className="w-2 h-2 bg-[#2d4a3a]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <h1 className="text-[#c4c4c6] text-xl tracking-wide mb-3">Welcome to Mizan</h1>
          <p className="text-[#5a5a5d] text-sm tracking-wide leading-relaxed">
            Private accountability. No comparisons. No audience.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-6">
          {/* Error message with shake animation */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`px-4 py-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs tracking-wide ${
                  errorShake ? 'animate-shake' : ''
                }`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Section */}
          <motion.div 
            className="border border-[#1a1a1d] p-6 bg-[#0a0a0b]"
            layout
          >
            <h2 className="text-[#8a8a8d] text-sm tracking-[0.15em] uppercase mb-4">
              {isRegistering ? 'Create Account' : 'Login'}
            </h2>

            <div className="space-y-4">
              <div>
                <motion.label 
                  className="block text-[#4a4a4d] text-xs tracking-[0.15em] uppercase mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Username
                </motion.label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-5 py-4 text-sm tracking-wide outline-none transition-all duration-300 placeholder:text-[#3a3a3d]"
                  placeholder={isRegistering ? "choose a username" : "your username"}
                  whileFocus={{ boxShadow: '0 0 8px rgba(45, 74, 58, 0.3)' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2d4a3a';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1d';
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                />
              </div>

              <div>
                <motion.label 
                  className="block text-[#4a4a4d] text-xs tracking-[0.15em] uppercase mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Password
                </motion.label>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-5 py-4 text-sm tracking-wide outline-none transition-all duration-300 placeholder:text-[#3a3a3d]"
                  placeholder={isRegistering ? "create a password (min 6 chars)" : "your password"}
                  whileFocus={{ boxShadow: '0 0 8px rgba(45, 74, 58, 0.3)' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2d4a3a';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1d';
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                />
              </div>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-[#0e0e10] border border-[#1a1a1d] text-[#8a8a8d] text-sm tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, borderColor: '#2a2a2d', color: '#c4c4c6' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isRegistering ? (
                  'Create Account'
                ) : (
                  'Login'
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-[#4a4a4d] hover:text-[#8a8a8d] text-xs tracking-wide underline decoration-[#2a2a2d] decoration-1 underline-offset-4 transition-colors duration-200"
                whileHover={{ color: '#8a8a8d' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
              </motion.button>
            </div>
          </motion.div>

          {/* Other Options - Collapsed with smooth animation */}
          <details className="group">
            <motion.summary 
              className="cursor-pointer text-[#4a4a4d] hover:text-[#8a8a8d] text-xs tracking-wide underline decoration-[#2a2a2d] decoration-1 underline-offset-4 transition-colors duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Other options
            </motion.summary>
            <motion.div 
              className="border border-[#1a1a1d] p-6 bg-[#0a0a0b] mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#8a8a8d] text-sm tracking-[0.15em] uppercase mb-3">Quick access</p>
              <p className="text-[#4a4a4d] text-xs mb-4">Login from another device with your access code</p>
              <motion.input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full bg-[#0e0e10] border border-[#1a1a1d] text-[#c4c4c6] px-5 py-4 text-sm tracking-wide outline-none transition-all duration-300 placeholder:text-[#3a3a3d] mb-3"
                placeholder="enter your access code"
                whileFocus={{ boxShadow: '0 0 8px rgba(45, 74, 58, 0.3)' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2d4a3a';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a1d';
                }}
              />
              {accessCodeError && (
                <motion.p 
                  className="text-red-400 text-xs mb-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {accessCodeError}
                </motion.p>
              )}
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !accessCode.trim()}
                className="w-full py-3 bg-[#0e0e10] border border-[#1a1a1d] text-[#8a8a8d] text-xs tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, borderColor: '#2a2a2d', color: '#c4c4c6' }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Quick Login'
                )}
              </motion.button>
            </motion.div>
          </details>
        </motion.div>
      </motion.div>
    </div>
  );
}
