import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Play,
  CheckCircle2,
  AlertOctagon,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Plus,
  HelpCircle,
  Link,
  ChevronRight
} from 'lucide-react';

export const TodayFocusView: React.FC = () => {
  const {
    primaryGoal,
    activeNma,
    actions,
    startAction,
    completeAction,
    rescheduleAction,
    openBarrierReview,
    openReadinessCheck,
    openMmaModal,
    openRestartModal,
    setActiveView,
    setIsCreateGoalOpen,
    setSelectedGoalId
  } = useApp();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');

  if (!primaryGoal) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF4FB] text-[#155A8A] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#0E3C5B]">No Active Meaningful Goal</h2>
          <p className="text-xs text-gray-600">
            SOPET Momentum requires one clear, personally meaningful Goal to establish your Next Meaningful Action.
          </p>
          <button
            onClick={() => setIsCreateGoalOpen(true)}
            className="w-full bg-[#155A8A] hover:bg-[#0E3C5B] text-white py-2.5 rounded-xl text-xs font-semibold transition"
          >
            Create Your First Goal
          </button>
        </div>
      </div>
    );
  }

  // Other due actions excluding the current active NMA
  const dueActions = actions.filter(a => a.id !== activeNma?.id && a.status !== 'Completed');

  const handleStartReschedule = () => {
    if (activeNma) {
      setNewDueDate(activeNma.dueDate);
      setIsRescheduling(true);
    }
  };

  const handleSaveReschedule = () => {
    if (activeNma && newDueDate) {
      rescheduleAction(activeNma.id, newDueDate);
      setIsRescheduling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Breadcrumb & Interruption Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-gray-200">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#155A8A] block">
            Primary Focus Goal
          </span>
          <button
            onClick={() => {
              setSelectedGoalId(primaryGoal.id);
              setActiveView('goals');
            }}
            className="text-base sm:text-lg font-bold text-[#0E3C5B] hover:underline flex items-center gap-1.5 text-left"
          >
            <span>{primaryGoal.title}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => openRestartModal(activeNma?.id)}
            className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition font-medium"
            title="Declare an interruption to re-evaluate without guilt"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A034]" />
            <span>I've Lost Momentum</span>
          </button>
        </div>
      </div>

      {/* CORE HERO: THE NEXT MEANINGFUL ACTION (NMA) CARD */}
      <section className="bg-white rounded-2xl border-2 border-[#C5A034] shadow-md overflow-hidden relative">
        {/* Distinctive Subtle Gold Header Accent */}
        <div className="bg-gradient-to-r from-[#0E3C5B] to-[#155A8A] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#C5A034] text-gray-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Current NMA
            </span>
            <span className="text-xs text-gray-200 font-medium hidden sm:inline">
              Next Meaningful Action
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-200">
            <Clock className="w-3.5 h-3.5 text-[#C5A034]" />
            <span>Due {activeNma?.dueDate || 'Today'}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {activeNma ? (
            <>
              {/* NMA Title & Definition */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E3C5B] leading-tight">
                    {activeNma.title}
                  </h1>
                  <span
                    className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      activeNma.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : activeNma.status === 'Blocked'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : activeNma.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {activeNma.status}
                  </span>
                </div>

                {activeNma.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activeNma.description}
                  </p>
                )}
              </div>

              {/* Linked MMA Banner if present on this action */}
              {activeNma.mma && (
                <div className="bg-[#EAF4FB] border border-[#155A8A]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#155A8A] flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      Linked Minimum Meaningful Action (MMA)
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#0E3C5B]">{activeNma.mma.title}</p>
                    <p className="text-[11px] text-gray-600">{activeNma.mma.whyThisHelps}</p>
                  </div>
                  <button
                    onClick={() => openMmaModal(activeNma.id)}
                    className="shrink-0 bg-[#4B9C91] hover:bg-[#3d8278] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    {activeNma.mma.completed ? 'MMA Completed' : 'Manage MMA'}
                  </button>
                </div>
              )}

              {/* Four NMA Quality Validation Questions */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/80">
                <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500 block mb-2">
                  NMA Quality Validation Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4B9C91]" />
                    <span><strong>Specific:</strong> Concrete observable behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4B9C91]" />
                    <span><strong>Feasible:</strong> Can actually be executed now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4B9C91]" />
                    <span><strong>Meaningful:</strong> Advances the Goal directly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4B9C91]" />
                    <span><strong>Sequential:</strong> Prerequisite to future actions</span>
                  </div>
                </div>
              </div>

              {/* Reschedule inline drawer */}
              {isRescheduling && (
                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl space-y-2 text-xs">
                  <label className="font-semibold text-gray-800 block">Select new target date:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={handleSaveReschedule}
                      className="bg-[#155A8A] text-white px-3 py-2 rounded-lg font-semibold"
                    >
                      Save Date
                    </button>
                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="text-gray-600 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* PRIMARY ACTION CONTROLS */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 sm:gap-3">
                {activeNma.status !== 'In Progress' && activeNma.status !== 'Completed' && (
                  <button
                    onClick={() => startAction(activeNma.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Action</span>
                  </button>
                )}

                {activeNma.status !== 'Completed' && (
                  <button
                    onClick={() => completeAction(activeNma.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#4B9C91] hover:bg-[#3d8278] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete</span>
                  </button>
                )}

                {activeNma.status !== 'Completed' && (
                  <button
                    onClick={() => openBarrierReview(activeNma.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span>Blocked</span>
                  </button>
                )}

                <button
                  onClick={() => openReadinessCheck(activeNma.id)}
                  className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold px-4 py-3 rounded-xl transition"
                >
                  Check Readiness
                </button>

                <button
                  onClick={handleStartReschedule}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2.5 py-3"
                >
                  Reschedule
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">Current NMA is Completed!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Excellent developmental progress. Select your next practical action from the goal list below.
              </p>
              <button
                onClick={() => {
                  setSelectedGoalId(primaryGoal.id);
                  setActiveView('goals');
                }}
                className="bg-[#155A8A] text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Choose Next NMA in Goal Details
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECONDARY SECTION: Due Actions & Rhythm */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#0E3C5B] uppercase tracking-wider">
              Upcoming Actions &amp; Rhythm
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Actions in pipeline. Note: Momentum prioritizes the NMA above to prevent cognitive diffusion.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedGoalId(primaryGoal.id);
              setActiveView('goals');
            }}
            className="text-xs font-semibold text-[#155A8A] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dueActions.length > 0 ? (
          <div className="space-y-3">
            {dueActions.map(act => (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{act.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        act.status === 'Blocked'
                          ? 'bg-rose-100 text-rose-800'
                          : act.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  {act.mma && (
                    <div className="text-[11px] text-[#155A8A] font-medium flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      <span>Linked MMA: {act.mma.title}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                    <span>Rhythm: {act.rhythm}</span>
                    <span>·</span>
                    <span>Due: {act.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {act.mma && !act.mma.completed && (
                    <button
                      onClick={() => openMmaModal(act.id)}
                      className="bg-[#4B9C91] text-white px-3 py-1.5 rounded-lg font-semibold text-[11px]"
                    >
                      Open MMA
                    </button>
                  )}
                  {act.status === 'Blocked' && !act.mma && (
                    <button
                      onClick={() => openBarrierReview(act.id)}
                      className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-semibold text-[11px]"
                    >
                      Review Barrier
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-3 text-center">
            No other pending actions for today. Full focus remains on your active NMA!
          </p>
        )}
      </section>

      {/* Goal KPI Mini Indicator */}
      {primaryGoal.kpi && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
              Primary Goal Metric:
            </span>
            <span className="font-bold text-sm text-[#0E3C5B]">{primaryGoal.kpi.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-base font-extrabold text-[#155A8A]">
                {primaryGoal.kpi.currentValue} / {primaryGoal.kpi.targetValue}
              </span>
              <span className="text-[11px] text-gray-500 block">{primaryGoal.kpi.unit}</span>
            </div>
            <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4B9C91] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (primaryGoal.kpi.currentValue / primaryGoal.kpi.targetValue) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
