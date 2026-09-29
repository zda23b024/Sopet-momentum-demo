import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RestartStrategy } from '../../types';
import {
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const IntelligentRestartModal: React.FC = () => {
  const {
    isRestartModalOpen,
    closeRestartModal,
    submitRestartReview,
    primaryGoal,
    showToast
  } = useApp();

  const [isMeaningful, setIsMeaningful] = useState(true);
  const [whatChanged, setWhatChanged] = useState(
    'A client emergency and family commitments required full attention for 5 days, breaking the weekly interview cadence.'
  );
  const [interruptionCause, setInterruptionCause] = useState<
    'Planned' | 'External' | 'Barrier-Driven' | 'Priority-Driven' | 'Meaning-Driven'
  >('External');
  const [isPlanRealistic, setIsPlanRealistic] = useState(true);
  const [strategy, setStrategy] = useState<RestartStrategy>('Reduce Action');
  const [restartActionTitle, setRestartActionTitle] = useState(
    'Schedule two 15-minute customer interviews for this Thursday'
  );
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  if (!isRestartModalOpen || !primaryGoal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restartActionTitle.trim()) return;

    submitRestartReview({
      isGoalStillMeaningful: isMeaningful,
      whatChanged,
      interruptionCause,
      isPlanStillRealistic: isPlanRealistic,
      restartStrategy: strategy,
      restartActionTitle,
      restartTargetDate: targetDate,
    });
  };

  const strategyDescriptions: Record<RestartStrategy, string> = {
    Resume: 'Continue with the original plan without alterations now that the interruption has cleared.',
    Adjust: 'Modify the timeline, rhythm, or intermediate milestones while retaining the actions.',
    'Reduce Action': 'Downsize the immediate restart action to a modest, achievable threshold to safely regain momentum.',
    'Change NMA': 'Select a completely different high-leverage action as the new NMA.',
    'Pause Goal': 'Place this Goal on hold intentionally without guilt while focusing on immediate life priorities.',
    'Strategically Discontinue': 'Consciously archive this Goal as it is no longer relevant or aligned with core purpose.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A034] flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Momentum Restoration
            </span>
            <h2 className="text-lg font-bold">Intelligent Restart Review</h2>
          </div>
          <button
            onClick={closeRestartModal}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Banner */}
        <div className="bg-[#EAF4FB] px-6 py-2.5 border-b border-[#155A8A]/20 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A]">
            Evaluating Interruption on Goal:
          </span>
          <p className="text-xs font-semibold text-[#0E3C5B] truncate">{primaryGoal.title}</p>
        </div>

        {/* Scrollable Questions Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Methodological principle banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-gray-600 leading-relaxed">
            <strong className="text-gray-900 block mb-0.5">Core Methodology Note:</strong>
            Restart does <strong>not</strong> mean blindly continuing. It is a conscious diagnostic to confirm goal relevance, understand what shifted, and select a realistic next action.
          </div>

          {/* Q1: Is the Goal still meaningful? */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-800 block text-xs">
              1. Is this Goal still meaningful to you?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMeaningful(true)}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold border transition text-center ${
                  isMeaningful
                    ? 'bg-[#155A8A] text-white border-[#155A8A]'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Yes, deeply meaningful
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMeaningful(false);
                  setStrategy('Pause Goal');
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold border transition text-center ${
                  !isMeaningful
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Unsure / Questioning
              </button>
            </div>
          </div>

          {/* Q2: What changed? */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-800 block text-xs">
              2. What changed in your circumstances or schedule?
            </label>
            <textarea
              rows={2}
              required
              value={whatChanged}
              onChange={e => setWhatChanged(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Q3: What caused the interruption? */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-800 block text-xs">
              3. Primary Cause of Interruption:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(['External', 'Barrier-Driven', 'Priority-Driven', 'Planned', 'Meaning-Driven'] as const).map(
                cause => (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => setInterruptionCause(cause)}
                    className={`py-1.5 px-2.5 rounded-lg border text-center font-medium transition ${
                      interruptionCause === cause
                        ? 'bg-[#0E3C5B] text-white border-[#0E3C5B]'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {cause}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Q4: Is the previous plan still realistic? */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-800 block text-xs">
              4. Is the previous timeline &amp; pace still realistic?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPlanRealistic(true)}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium border ${
                  isPlanRealistic
                    ? 'bg-[#155A8A] text-white border-[#155A8A]'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                Yes, realistic
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlanRealistic(false);
                  setStrategy('Adjust');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium border ${
                  !isPlanRealistic
                    ? 'bg-[#155A8A] text-white border-[#155A8A]'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                No, need lighter pace
              </button>
            </div>
          </div>

          {/* Restart Strategy Decision */}
          <div className="space-y-1.5 pt-1">
            <label className="font-bold text-gray-900 block text-xs">
              Select Your Restart Strategy:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'Resume',
                  'Adjust',
                  'Reduce Action',
                  'Change NMA',
                  'Pause Goal',
                  'Strategically Discontinue',
                ] as const
              ).map(strat => (
                <button
                  key={strat}
                  type="button"
                  onClick={() => setStrategy(strat)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    strategy === strat
                      ? 'border-[#0E3C5B] bg-[#EAF4FB] text-[#0E3C5B] font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-xs">{strat}</span>
                  <span className="text-[10px] text-gray-500 font-normal leading-tight line-clamp-2 mt-0.5">
                    {strategyDescriptions[strat]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q5: Next Realistic Restart Action */}
          {strategy !== 'Pause Goal' && strategy !== 'Strategically Discontinue' && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="font-bold text-gray-900 block text-xs mb-1">
                  5. What is the next realistic Restart Action?
                </label>
                <input
                  type="text"
                  required
                  value={restartActionTitle}
                  onChange={e => setRestartActionTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                  placeholder="e.g. Schedule two 15-minute customer interviews for this Thursday"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block text-xs mb-1">
                  Restart Target Date:
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeRestartModal}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              <span>Record Restart &amp; Return to Today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
