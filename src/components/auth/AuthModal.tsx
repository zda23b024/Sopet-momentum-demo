import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setIsAuthenticated,
    openOnboarding,
    showToast,
    logEvent
  } = useApp();

  const [email, setEmail] = useState('amina.pilot@acosedutech.org');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Amina');

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    closeAuthModal();
    logEvent('USER_REGISTERED', { email, simulated: true });
    showToast('Signed in successfully as Amina.', 'success');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    closeAuthModal();
    openOnboarding();
    logEvent('USER_REGISTERED', { name, email, simulated: true });
    showToast('Account created. Welcome to SOPET Momentum Onboarding.', 'success');
  };

  const handleDemoOneClick = () => {
    setIsAuthenticated(true);
    closeAuthModal();
    showToast('Signed in with Pilot Demo Account (Amina).', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {authModalMode === 'signin' && 'Sign In to SOPET Momentum'}
              {authModalMode === 'signup' && 'Create Your Momentum Account'}
              {authModalMode === 'forgot' && 'Account Recovery'}
            </h2>
            <p className="text-xs text-gray-300">
              {authModalMode === 'signin' && 'Enter your credentials or use quick demo access'}
              {authModalMode === 'signup' && 'Begin your journey with one meaningful goal'}
              {authModalMode === 'forgot' && 'Reset your password securely'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Access banner for Evaluators */}
          <div className="bg-[#EAF4FB] border border-[#155A8A]/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-[#0E3C5B] block">Interactive Evaluator Access</span>
              <span className="text-gray-600">Pre-configured with Amina's catering business goal</span>
            </div>
            <button
              onClick={handleDemoOneClick}
              className="bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Sign In as Amina
            </button>
          </div>

          {authModalMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-xs text-[#155A8A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#155A8A] hover:bg-[#0E3C5B] text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="text-xs font-semibold text-[#155A8A] hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {authModalMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                  placeholder="e.g. Amina"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                />
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#4B9C91] shrink-0 mt-0.5" />
                <span>
                  By continuing, you acknowledge that SOPET Momentum is a developmental execution tool, not clinical therapy.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#155A8A] hover:bg-[#0E3C5B] text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Create Account &amp; Start Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-600">Already registered? </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-xs font-semibold text-[#155A8A] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {authModalMode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">
                In this prototype, password recovery is simulated. Enter your email and click reset to simulate a secure link.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast('Password reset link sent (simulated).', 'info');
                  openAuthModal('signin');
                }}
                className="w-full bg-[#155A8A] text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                Send Recovery Instructions
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-xs text-[#155A8A] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
