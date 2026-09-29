import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContextualAiService } from '../../services/contextualAi';
import {
  X,
  Sparkles,
  Link,
  CheckCircle2,
  Play,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  Clock
} from 'lucide-react';

export const MmaModal: React.FC = () => {
  const {
    isMmaModalOpen,
    mmaTargetActionId,
    closeMmaModal,
    actions,
    createMMA,
    startMMA,
    completeMMA,
    showToast
  } = useApp();

  const parentAction = actions.find(a => a.id === mmaTargetActionId);

  // Suggested MMA
  const defaultMma = parentAction ? ContextualAiService.suggestMma(parentAction.title) : null;
  const [mmaTitle, setMmaTitle] = useState(defaultMma?.title || 'Draft the problem statement');
  const [whyThisHelps, setWhyThisHelps] = useState(
    defaultMma?.whyThisHelps ||
      'Writing just the 2-paragraph problem statement breaks the initial blank-page friction without taking on the entire document.'
  );

  if (!isMmaModalOpen || !parentAction) return null;

  const existingMma = parentAction.mma;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mmaTitle.trim()) return;
    createMMA(parentAction.id, mmaTitle, whyThisHelps);
  };

  const handleStart = () => {
    startMMA(parentAction.id);
  };

  const handleComplete = () => {
    completeMMA(parentAction.id);
    closeMmaModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4B9C91]">
              Intervention Protocol
            </span>
            <h2 className="text-lg font-bold">Minimum Meaningful Action (MMA)</h2>
          </div>
          <button
            onClick={closeMmaModal}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Definition callout */}
          <div className="text-xs text-gray-700 bg-[#EAF4FB] p-3.5 rounded-xl border border-[#155A8A]/20 leading-relaxed">
            <strong className="text-[#0E3C5B] block mb-0.5">Methodology Definition:</strong>
            "The smallest practical Action that preserves meaningful forward movement when the original Action feels too difficult to begin."
          </div>

          {/* Parent Action Relationship */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Link className="w-3.5 h-3.5 text-[#155A8A]" />
              <span>Parent Action (Remains Incomplete):</span>
            </div>
            <p className="font-bold text-sm text-[#0E3C5B]">{parentAction.title}</p>
          </div>

          {/* If MMA already created, show status & actions */}
          {existingMma ? (
            <div className="border-2 border-[#4B9C91]/40 rounded-xl p-4 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#4B9C91]">
                  Active Linked MMA:
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    existingMma.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : existingMma.startedAt
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {existingMma.completed
                    ? 'Completed'
                    : existingMma.startedAt
                    ? 'In Progress'
                    : 'Created'}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900">{existingMma.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{existingMma.whyThisHelps}</p>

              {/* Crucial Methodology Rule */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Rule:</strong> Completing this MMA does <strong>NOT</strong> falsely mark the Parent Action complete. It preserves momentum and unlocks the next step.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {!existingMma.startedAt && !existingMma.completed && (
                  <button
                    type="button"
                    onClick={handleStart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start MMA</span>
                  </button>
                )}

                {!existingMma.completed && (
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4B9C91] hover:bg-[#3d8278] text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete MMA &amp; Return to Parent</span>
                  </button>
                )}

                {existingMma.completed && (
                  <button
                    type="button"
                    onClick={closeMmaModal}
                    className="w-full bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    Return to Parent Action Focus
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Form to create MMA */
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Proposed Minimum Meaningful Action:
                </label>
                <input
                  type="text"
                  required
                  value={mmaTitle}
                  onChange={e => setMmaTitle(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                  placeholder="e.g. Draft the problem statement"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Why this helps:
                </label>
                <textarea
                  rows={2}
                  required
                  value={whyThisHelps}
                  onChange={e => setWhyThisHelps(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                />
              </div>

              {/* Misuse Warning */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Methodology Caution on MMA Misuse:
                </span>
                <p>
                  MMA is an intervention to overcome initial resistance—not a way to engage in endless tiny actions that avoid real progress. Return to the parent action as soon as momentum is restored.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeMmaModal}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  <span>Create &amp; Link MMA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
