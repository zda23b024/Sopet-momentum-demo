import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Download,
  RotateCcw,
  Lock,
  UserCheck,
  AlertTriangle,
  Info,
  Check,
  Sparkles
} from 'lucide-react';

export const SettingsPrivacyView: React.FC = () => {
  const { userProfile, resetDemoData, showToast, goals, actions, barriers, weeklyReviews } = useApp();
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true);

  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: userProfile,
      goals,
      actions,
      barriers,
      weeklyReviews,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sopet_momentum_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported prototype data as JSON.', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all prototype state back to the original pilot scenario?')) {
      resetDemoData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0E3C5B]">Settings &amp; Privacy</h1>
        <p className="text-xs text-gray-600 mt-1">
          Manage your participant profile, ethical boundaries, AI coach settings, and data export.
        </p>
      </div>

      {/* Participant Profile */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#0E3C5B]">Participant Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-500 block mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={userProfile.name}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold"
            />
          </div>
          <div>
            <label className="text-gray-500 block mb-1">Email</label>
            <input
              type="email"
              readOnly
              value={userProfile.email}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold"
            />
          </div>
          <div>
            <label className="text-gray-500 block mb-1">Ecosystem Role</label>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-[#155A8A]">
              Pilot Participant (Amina Scenario)
            </div>
          </div>
          <div>
            <label className="text-gray-500 block mb-1">Data Storage</label>
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              Interactive LocalStorage Session
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Ethical Boundaries */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#4B9C91]" />
          <h2 className="text-base font-bold text-[#0E3C5B]">
            Ethical Governance &amp; Boundaries
          </h2>
        </div>

        <div className="space-y-3 text-xs text-gray-700">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <strong className="text-gray-900 block font-bold">1. Non-Clinical Framework</strong>
            <p className="leading-relaxed">
              SOPET Momentum is an educational and developmental execution system developed by <strong>ACoS EduTech and Consultancy</strong>. It is <strong>not therapy</strong> and <strong>not medical or psychiatric treatment</strong>. It is designed to assist individuals in establishing next meaningful steps and overcoming execution friction.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <strong className="text-gray-900 block font-bold">2. No Guarantee of Success</strong>
            <p className="leading-relaxed">
              Momentum provides structure, clarity, and reflection protocols; however, external outcomes depend on many external variables. We make no commercial claim of guaranteed success.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <strong className="text-gray-900 block font-bold">3. Absolute Privacy by Default</strong>
            <p className="leading-relaxed">
              Your personal reflections, internal resistance notes, and barrier explanations are private by default. Aggregated pilot research only uses anonymized taxonomy counts with explicit participant consent.
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0E3C5B]">Contextual AI Assistance</h2>
            <p className="text-xs text-gray-600">
              Assists in Barrier diagnosis and MMA suggestions with user confirmation required.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAiAssistanceEnabled(!aiAssistanceEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              aiAssistanceEnabled ? 'bg-[#155A8A]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                aiAssistanceEnabled ? 'left-6' : 'left-1'
              }`}
            ></span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          When enabled, the AI coach will offer provisional barrier classifications from your written descriptions, which you can accept, edit, or reject.
        </p>
      </div>

      {/* Data Management & Export */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#0E3C5B]">Prototype Data Controls</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Pilot Data (JSON)</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo to Amina Default</span>
          </button>
        </div>
        <span className="text-[11px] text-gray-500 block">
          Resetting will restore the default scenario for Amina's catering business pilot.
        </span>
      </div>
    </div>
  );
};
