import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Target,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { openAuthModal, openOnboarding, setIsAuthenticated, showToast } = useApp();

  const handleQuickDemoEnter = () => {
    setIsAuthenticated(true);
    showToast('Entered interactive prototype as Pilot Participant Amina.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#EAF4FB] text-[#1E293B] flex flex-col justify-between">
      {/* Top Banner Disclaimer */}
      <div className="bg-[#0E3C5B] text-gray-200 text-xs py-2 px-4 text-center border-b border-[#155A8A]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C5A034] shrink-0" />
          <span>
            <strong>Authoritative UX Prototype:</strong> Validating the SOPET Momentum Developmental Framework for ACoS EduTech &amp; Consultancy.
          </span>
        </div>
      </div>

      {/* Main Hero Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#155A8A]/20 shadow-xs text-xs font-semibold text-[#0E3C5B]">
            <span className="w-2 h-2 rounded-full bg-[#4B9C91] animate-pulse"></span>
            THE SOFT PERSONA TOOL — SOPET
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E3C5B] tracking-tight leading-tight">
            Turn meaningful goals into <span className="text-[#155A8A]">meaningful action</span>.
          </h1>

          {/* Supporting Statement */}
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Knowing what to do is not always enough to make action happen. SOPET Momentum helps you identify the next concrete step, understand real barriers, restart after interruptions, and learn from progress.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleQuickDemoEnter}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-sm transition transform active:scale-98"
            >
              <span>Explore Interactive Demo (Amina)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#0E3C5B] border border-gray-300 px-6 py-3.5 rounded-xl font-semibold text-base transition"
            >
              Get Started (New User)
            </button>

            <button
              onClick={() => openAuthModal('signin')}
              className="w-full sm:w-auto text-sm text-[#155A8A] hover:text-[#0E3C5B] font-medium px-4 py-3"
            >
              Sign In
            </button>
          </div>

          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No real credentials required. Click <strong>Explore Interactive Demo</strong> to jump directly into the active pilot scenario.
          </p>
        </div>

        {/* Primary Momentum Loops Visual Diagram */}
        <div className="mt-16 max-w-4xl mx-auto w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0E3C5B]">
              The Core Momentum Methodology
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              A continuous developmental cycle designed to overcome paralysis, diagnose blockers, and restore forward momentum.
            </p>
          </div>

          {/* Primary Loop */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-[#155A8A] uppercase tracking-wider block">
              1. The Primary Momentum Cycle
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
              {[
                { label: 'Meaningful Goal', sub: 'Personally Significant', bg: 'bg-[#0E3C5B] text-white' },
                { label: 'Next Action (NMA)', sub: 'Single Concrete Step', bg: 'bg-[#C5A034] text-gray-900 font-bold' },
                { label: 'Readiness Check', sub: 'Clarity & Resources', bg: 'bg-[#155A8A] text-white' },
                { label: 'Active Execution', sub: 'Focused Work', bg: 'bg-white border-2 border-[#155A8A] text-[#155A8A]' },
                { label: 'Progress Review', sub: 'Observable Metric', bg: 'bg-[#4B9C91] text-white' },
                { label: 'Adjustment & Next NMA', sub: 'Continuous Growth', bg: 'bg-[#0E3C5B] text-white' },
              ].map((step, idx) => (
                <div key={idx} className={`${step.bg} p-3 rounded-xl flex flex-col justify-center items-center shadow-2xs`}>
                  <span className="text-xs font-semibold leading-tight">{step.label}</span>
                  <span className="text-[10px] opacity-85 mt-0.5">{step.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interruption & Blocked Branch */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block mb-3">
              2. When Action Is Blocked (ACIF Framework)
            </span>
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="bg-white border border-rose-200 p-2.5 rounded-lg">
                  <span className="font-bold text-rose-900 block">Blocked Action</span>
                  <span className="text-[10px] text-gray-500">"What got in the way?"</span>
                </div>
                <div className="bg-white border border-rose-200 p-2.5 rounded-lg">
                  <span className="font-bold text-rose-900 block">Barrier Review</span>
                  <span className="text-[10px] text-gray-500">13 ACIF Categories</span>
                </div>
                <div className="bg-white border border-amber-300 p-2.5 rounded-lg">
                  <span className="font-bold text-amber-900 block">Appropriate Intervention</span>
                  <span className="text-[10px] text-gray-500">Targeted support</span>
                </div>
                <div className="bg-white border border-[#4B9C91] p-2.5 rounded-lg">
                  <span className="font-bold text-[#4B9C91] block">MMA / Response</span>
                  <span className="text-[10px] text-gray-500">Smallest meaningful step</span>
                </div>
                <div className="bg-white border border-[#0E3C5B] p-2.5 rounded-lg">
                  <span className="font-bold text-[#0E3C5B] block">Intelligent Restart</span>
                  <span className="text-[10px] text-gray-500">Action continues</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Principles Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="w-9 h-9 rounded-lg bg-[#EAF4FB] text-[#155A8A] flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="font-bold text-[#0E3C5B] text-base mb-1">One Goal + One NMA</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Never drowned in endless to-do lists. You always have one clear, high-priority Next Meaningful Action that dominates your focus.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#4B9C91] flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="font-bold text-[#0E3C5B] text-base mb-1">Non-Judgmental Diagnosis</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When work stops, we don't say "try harder". We systematically identify whether it's overwhelm, missing resources, or unclear next steps.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#C5A034] flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h3 className="font-bold text-[#0E3C5B] text-base mb-1">Intelligent Restart</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              No guilt over broken streaks. When interruptions happen, a 5-question restart protocol establishes a realistic action to resume forward movement.
            </p>
          </div>
        </div>

        {/* Ethical Boundaries / Disclaimer */}
        <div className="mt-12 bg-white/70 border border-gray-200 rounded-xl p-4 text-center max-w-3xl mx-auto text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">
            Ethical Governance &amp; Boundaries
          </p>
          <p>
            SOPET Momentum is a developmental execution system. It is <strong>not therapy</strong>, <strong>not medical or clinical treatment</strong>, and <strong>does not guarantee success</strong>. All personal progress data is private by default.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 ACoS EduTech and Consultancy. All rights reserved.</span>
          <span className="text-gray-400">THE SOFT PERSONA TOOL — SOPET MOMENTUM PILOT</span>
        </div>
      </footer>
    </div>
  );
};
