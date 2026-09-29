import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReadinessOutput } from '../../types';
import { X, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const ActionReadinessModal: React.FC = () => {
  const {
    isReadinessModalOpen,
    readinessTargetActionId,
    closeReadinessCheck,
    submitReadinessCheck,
    actions,
    openBarrierReview,
    startAction
  } = useApp();

  const action = actions.find(a => a.id === readinessTargetActionId);

  const [q1, setQ1] = useState(true); // Understand
  const [q2, setQ2] = useState(true); // Know how
  const [q3, setQ3] = useState(true); // Resources
  const [q4, setQ4] = useState(true); // Prerequisites
  const [q5, setQ5] = useState(true); // No internal resistance
  const [notes, setNotes] = useState('');

  if (!isReadinessModalOpen || !action) return null;

  // Determine provisional output
  let output: ReadinessOutput = 'Ready';
  if (!q1) output = 'Needs Clarification';
  else if (!q2) output = 'Capability Concern';
  else if (!q3) output = 'Resource Concern';
  else if (!q4) output = 'Dependency Concern';
  else if (!q5) output = 'Internal Resistance';

  const isReady = output === 'Ready';

  const handleConfirmReady = () => {
    submitReadinessCheck(
      action.id,
      {
        q1Understand: q1,
        q2KnowHow: q2,
        q3HaveResources: q3,
        q4PrerequisitesDone: q4,
        q5NoResistance: q5,
      },
      output,
      notes
    );
    startAction(action.id);
  };

  const handleReviewConcern = () => {
    submitReadinessCheck(
      action.id,
      {
        q1Understand: q1,
        q2KnowHow: q2,
        q3HaveResources: q3,
        q4PrerequisitesDone: q4,
        q5NoResistance: q5,
      },
      output,
      notes
    );
    openBarrierReview(action.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4B9C91]">
              Pre-Action Diagnostic
            </span>
            <h2 className="text-lg font-bold">Action Readiness Check</h2>
          </div>
          <button
            onClick={closeReadinessCheck}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Target Action Context */}
          <div className="bg-[#EAF4FB] border border-[#155A8A]/20 p-3.5 rounded-xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#155A8A] block">
              Checking Readiness for:
            </span>
            <p className="font-semibold text-sm text-[#0E3C5B] mt-0.5">{action.title}</p>
          </div>

          {/* 5 Questions */}
          <div className="space-y-3 text-xs">
            {/* Q1 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <span className="font-medium text-gray-800 pr-2">1. Do I clearly understand the specific physical action?</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQ1(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${q1 ? 'bg-[#155A8A] text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQ1(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${!q1 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Q2 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <span className="font-medium text-gray-800 pr-2">2. Do I know how to execute it?</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQ2(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${q2 ? 'bg-[#155A8A] text-white' : 'bg-amber-600 text-white'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQ2(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${!q2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Q3 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <span className="font-medium text-gray-800 pr-2">3. Do I have all necessary tools/resources?</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQ3(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${q3 ? 'bg-[#155A8A] text-white' : 'bg-amber-600 text-white'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQ3(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${!q3 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Q4 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <span className="font-medium text-gray-800 pr-2">4. Is anything else required first (dependencies)?</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQ4(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${q4 ? 'bg-[#155A8A] text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => setQ4(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${!q4 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  Waiting
                </button>
              </div>
            </div>

            {/* Q5 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <span className="font-medium text-gray-800 pr-2">5. Am I free of severe internal resistance or dread?</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQ5(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${q5 ? 'bg-[#155A8A] text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setQ5(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${!q5 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  Feeling Dread
                </button>
              </div>
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Readiness Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Questionnaire guide printed, 3 calls confirmed..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155A8A]"
            />
          </div>

          {/* Provisional Diagnostic Output Card */}
          <div className={`p-4 rounded-xl border ${
            isReady
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isReady ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">
                    Provisional Assessment:
                  </span>
                  <span className="text-sm font-bold">{output}</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 italic">Provisional guidance only</span>
            </div>

            <p className="text-xs mt-2 text-gray-700 leading-relaxed">
              {isReady && 'All baseline conditions are satisfied. You are ready to start and maintain focus on this Action.'}
              {output === 'Needs Clarification' && 'The action description is ambiguous. Break it down into one concrete physical verb before executing.'}
              {output === 'Capability Concern' && 'You feel unsure about how to do this. A targeted 15-minute guide or template can bridge the gap.'}
              {output === 'Resource Concern' && 'You are missing an essential tool or resource. Create a brief acquisition step first.'}
              {output === 'Dependency Concern' && 'You appear to be waiting on someone else. Address the prerequisite or follow up.'}
              {output === 'Internal Resistance' && 'You are experiencing dread or overwhelm. Creating a Minimum Meaningful Action (MMA) can help start safely.'}
            </p>
          </div>

          {/* Modal Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-gray-100">
            {!isReady ? (
              <>
                <button
                  type="button"
                  onClick={handleReviewConcern}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>Explore Concern in Barrier Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReady}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  Continue Anyway
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConfirmReady}
                className="w-full sm:w-auto bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Confirm &amp; Start Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
