import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Target,
  BarChart3,
  BookOpen,
  ShieldCheck,
  User,
  Settings,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    demoRole,
    setDemoRole,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setIsSettingsModalOpen,
    resetDemoData,
    openAuthModal,
    showToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'today', label: 'Today', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'review', label: 'Review', icon: BookOpen },
  ] as const;

  return (
    <header className="bg-[#0E3C5B] text-white border-b border-[#155A8A] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('today')}
              className="text-left group flex flex-col justify-center focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#EAF4FB] transition">
                  SOPET Momentum
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] uppercase font-semibold tracking-wider bg-[#155A8A] text-[#EAF4FB] px-2 py-0.5 rounded">
                  Demo
                </span>
              </div>
              <span className="text-[11px] text-gray-300 font-normal tracking-wide hidden sm:block">
                THE SOFT PERSONA TOOL · ACoS EduTech &amp; Consultancy
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-[#092B42]/60 p-1 rounded-xl border border-[#155A8A]/40">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id && demoRole === 'user';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDemoRole('user');
                      setActiveView(item.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#155A8A] text-white shadow-xs'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Role Switcher, Reset, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Role Switcher */}
            <div className="flex items-center bg-[#092B42] rounded-lg p-0.5 border border-[#155A8A]">
              <button
                onClick={() => {
                  setDemoRole('user');
                  showToast('Switched to User Demo view (Amina).', 'info');
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  demoRole === 'user'
                    ? 'bg-[#155A8A] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="View app as Participant / User"
              >
                User Demo
              </button>
              <button
                onClick={() => {
                  setDemoRole('admin');
                  showToast('Switched to Administrator Demo view (ACIF Taxonomy & Governance).', 'info');
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  demoRole === 'admin'
                    ? 'bg-[#C5A034] text-gray-900 font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="View administrator metrics, ACIF taxonomy, and interventions"
              >
                Admin Demo
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to the initial pilot scenario (Amina - Catering Business)?')) {
                  resetDemoData();
                }
              }}
              className="p-2 text-gray-300 hover:text-white hover:bg-[#155A8A]/50 rounded-lg transition"
              title="Reset Demo to Original Pilot State"
              aria-label="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-[#155A8A]/40 hover:bg-[#155A8A] px-2.5 py-1.5 rounded-lg border border-[#155A8A] transition text-sm text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4B9C91] flex items-center justify-center text-white font-bold text-xs">
                    {user?.name.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs text-gray-200">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 py-1 z-50 text-sm animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <p className="text-[11px] text-[#4B9C91] font-medium mt-0.5">{user?.cohort}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsSettingsModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>Account &amp; Privacy Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setDemoRole(demoRole === 'admin' ? 'user' : 'admin');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C5A034]" />
                      <span>Switch to {demoRole === 'admin' ? 'User' : 'Admin'} Mode</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setIsProfileDropdownOpen(false);
                        showToast('Signed out to preview Landing & Authentication.', 'info');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-700 text-left"
                    >
                      <User className="w-4 h-4 text-rose-500" />
                      <span>Sign Out (View Landing)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="bg-[#155A8A] hover:bg-[#155A8A]/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-[#092B42] border-t border-[#155A8A] px-4 pt-3 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id && demoRole === 'user';
            return (
              <button
                key={item.id}
                onClick={() => {
                  setDemoRole('user');
                  setActiveView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#155A8A] text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#155A8A]/50">
            <button
              onClick={() => {
                setIsSettingsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white"
            >
              <Settings className="w-4 h-4" />
              <span>Settings &amp; Privacy</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
