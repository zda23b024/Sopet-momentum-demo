import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Compass, AlertCircle, ArrowRight, Check, X, Sparkles } from 'lucide-react';

export const LightweightOnboarding: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, setIsCreateGoalOpen, showToast, setActiveView } = useApp();
  const [step, setStep] = useState(1);

  if (!isOnboardingOpen) return null;

  const handleFinishOnboarding = () => {
    closeOnboarding();
    setIsCreateGoalOpen(true);
    showToast('Onboarding complete! Let us define your first Meaningful Goal.', 'success');
  };

  const handleSkip = () => {
    closeOnboarding();
    setActiveView('today');
    showToast('Skipped onboarding. Active demo loaded.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#155A8A] flex items-center justify-center text-xs font-bold text-white">
              {step}/3
            </span>
            <h2 className="text-base font-bold">Welcome to SOPET Momentum</h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-300 hover:text-white text-xs font-medium px-2 py-1 rounded"
          >
            Skip Intro
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FB] text-[#155A8A] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3C5B]">One Goal, One Meaningful Action</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                SOPET Momentum is a personal execution system designed to move you from <strong>meaningful intention</strong> into <strong>observable action</strong>.
              </p>
              <div className="bg-[#EAF4FB] border border-[#155A8A]/20 rounded-xl p-3 text-xs text-[#0E3C5B]">
                Unlike conventional to-do apps with dozens of competing tasks, Momentum maintains focus on <strong>ONE Next Meaningful Action (NMA)</strong> at a time.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A034] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3C5B]">When Progress Is Blocked</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                When you can't start or complete an action, you will never be told to simply "try harder".
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Instead, you will complete a 60-second <strong>Barrier Review</strong> using our 13-category framework to pinpoint whether it is overwhelm, a missing resource, an unclear next step, or a dependency—then receive a targeted intervention.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4B9C91] flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3C5B]">Ethical Clarity &amp; Privacy</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Before we begin, please note:
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155A8A] mt-1.5 shrink-0"></span>
                  <span>SOPET Momentum is <strong>not therapy</strong> and not medical treatment.</span>
                </li>
                <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155A8A] mt-1.5 shrink-0"></span>
                  <span>It does not promise or guarantee immediate success; it provides a developmental structure.</span>
                </li>
                <li className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155A8A] mt-1.5 shrink-0"></span>
                  <span>Your reflections, goals, and barriers are <strong>strictly private by default</strong>.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="flex items-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                <span>Create Meaningful Goal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
