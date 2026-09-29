import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Goal, ActionRhythm } from '../../types';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Link,
  ChevronLeft,
  Sparkles,
  Play,
  RotateCcw,
  Shield,
  HelpCircle,
  Check
} from 'lucide-react';

interface Props {
  goalId: string;
  onBack: () => void;
}

export const GoalDetailView: React.FC<Props> = ({ goalId, onBack }) => {
  const {
    goals,
    milestones,
    actions,
    updateGoalStatus,
    setPrimaryGoal,
    createMilestone,
    toggleMilestone,
    createActionItem,
    setAsNma,
    startAction,
    openBarrierReview,
    openReadinessCheck,
    openMmaModal,
    setActiveView,
    showToast
  } = useApp();

  const goal = goals.find(g => g.id === goalId);

  // Local creation states
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );

  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [newActionRhythm, setNewActionRhythm] = useState<ActionRhythm>('Three times weekly');
  const [newActionIsNma, setNewActionIsNma] = useState(false);

  if (!goal) return <div>Goal not found.</div>;

  const goalMilestones = milestones.filter(m => m.goalId === goal.id);
  const goalActions = actions.filter(a => a.goalId === goal.id);
  const currentNma = goalActions.find(a => a.isNMA);

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    createMilestone(goal.id, newMilestoneTitle, newMilestoneDate);
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    createActionItem({
      goalId: goal.id,
      title: newActionTitle,
      description: newActionDescription,
      dueDate: newActionDueDate,
      rhythm: newActionRhythm,
      isNMA: newActionIsNma,
      status: 'Not Started',
    });
    setNewActionTitle('');
    setNewActionDescription('');
    setIsAddingAction(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back to list & Actions bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#155A8A] hover:text-[#0E3C5B] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Goals</span>
        </button>

        <div className="flex items-center gap-2">
          {!goal.isPrimary && (
            <button
              onClick={() => setPrimaryGoal(goal.id)}
              className="text-xs bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Set as Primary Focus
            </button>
          )}

          {goal.status === 'Active' ? (
            <button
              onClick={() => updateGoalStatus(goal.id, 'Paused', 'User paused')}
              className="text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Pause Goal
            </button>
          ) : (
            <button
              onClick={() => updateGoalStatus(goal.id, 'Active', 'User activated')}
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Activate Goal
            </button>
          )}
        </div>
      </div>

      {/* Primary Goal Details Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A] bg-[#EAF4FB] px-2 py-0.5 rounded">
                {goal.category}
              </span>
              {goal.isPrimary && (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#C5A034] text-gray-950 px-2 py-0.5 rounded">
                  Primary Focus Goal
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-[#0E3C5B]">{goal.title}</h1>
          </div>

          <div className="text-right self-start sm:self-auto">
            <span
              className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${
                goal.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              {goal.status}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              Target: {goal.targetDate}
            </span>
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-gray-700 leading-relaxed">{goal.description}</p>
        )}

        {/* WHY THIS MATTERS (Crucial Developmental Connection) */}
        <div className="bg-[#EAF4FB] border border-[#155A8A]/20 rounded-xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A] block">
            Why This Matters:
          </span>
          <p className="text-xs sm:text-sm text-[#0E3C5B] leading-relaxed font-medium">
            "{goal.whyThisMatters}"
          </p>
        </div>

        {/* Goal KPI Progress bar */}
        {goal.kpi && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Tracked Measure
              </span>
              <span className="font-bold text-xs text-[#0E3C5B]">{goal.kpi.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#155A8A]">
                {goal.kpi.currentValue} / {goal.kpi.targetValue} {goal.kpi.unit}
              </span>
              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4B9C91] h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (goal.kpi.currentValue / goal.kpi.targetValue) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Preserved Status History */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
            Status History (Preserved Development Trail):
          </span>
          <div className="space-y-1">
            {goal.statusHistory.map((hist, idx) => (
              <div key={idx} className="text-[11px] text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="font-medium text-gray-700">{hist.status}</span>
                <span>—</span>
                <span>{new Date(hist.timestamp).toLocaleDateString()}</span>
                {hist.note && <span className="italic text-gray-400">({hist.note})</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0E3C5B]">Milestones</h2>
            <p className="text-xs text-gray-500">
              Significant developmental waypoints for this goal.
            </p>
          </div>
          <button
            onClick={() => setIsAddingMilestone(!isAddingMilestone)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#155A8A] hover:text-[#0E3C5B]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>

        {/* Add milestone drawer */}
        {isAddingMilestone && (
          <form onSubmit={handleSaveMilestone} className="p-4 bg-gray-50 rounded-xl border space-y-3">
            <input
              type="text"
              required
              value={newMilestoneTitle}
              onChange={e => setNewMilestoneTitle(e.target.value)}
              placeholder="e.g. Validate customer demand"
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white"
            />
            <div className="flex items-center justify-between">
              <input
                type="date"
                required
                value={newMilestoneDate}
                onChange={e => setNewMilestoneDate(e.target.value)}
                className="text-xs p-2 border border-gray-300 rounded-lg bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMilestone(false)}
                  className="text-xs text-gray-600 px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs bg-[#155A8A] text-white px-3.5 py-1.5 rounded-lg font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {goalMilestones.map(m => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition text-xs"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMilestone(m.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                    m.completed
                      ? 'bg-[#4B9C91] border-[#4B9C91] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className={`font-medium ${m.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {m.title}
                </span>
              </div>
              <span className="text-[11px] text-gray-500">Target: {m.targetDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions & NMA Assignment */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0E3C5B]">Actions &amp; NMA Selection</h2>
            <p className="text-xs text-gray-500">
              Only one action is designated as the active Next Meaningful Action (NMA).
            </p>
          </div>
          <button
            onClick={() => setIsAddingAction(!isAddingAction)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#155A8A] hover:text-[#0E3C5B]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Action</span>
          </button>
        </div>

        {/* Add action form */}
        {isAddingAction && (
          <form onSubmit={handleSaveAction} className="p-4 bg-gray-50 rounded-xl border space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Action Title *</label>
              <input
                type="text"
                required
                value={newActionTitle}
                onChange={e => setNewActionTitle(e.target.value)}
                placeholder="e.g. Interview five potential customers about preferred products and pricing"
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                rows={2}
                value={newActionDescription}
                onChange={e => setNewActionDescription(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newActionDueDate}
                  onChange={e => setNewActionDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Rhythm</label>
                <select
                  value={newActionRhythm}
                  onChange={e => setNewActionRhythm(e.target.value as ActionRhythm)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Daily">Daily</option>
                  <option value="Three times weekly">Three times weekly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Milestone-based">Milestone-based</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isNmaCheck"
                checked={newActionIsNma}
                onChange={e => setNewActionIsNma(e.target.checked)}
                className="rounded text-[#155A8A]"
              />
              <label htmlFor="isNmaCheck" className="font-semibold text-gray-800">
                Designate immediately as active Next Meaningful Action (NMA)
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAction(false)}
                className="text-gray-600 px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#155A8A] text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Create Action
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {goalActions.map(act => (
            <div
              key={act.id}
              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                act.isNMA
                  ? 'border-2 border-[#C5A034] bg-amber-50/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {act.isNMA && (
                    <span className="bg-[#C5A034] text-gray-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                      Active NMA
                    </span>
                  )}
                  <span className="font-bold text-sm text-[#0E3C5B]">{act.title}</span>
                </div>
                {act.description && (
                  <p className="text-xs text-gray-600 line-clamp-1">{act.description}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span>Status: <strong className="text-gray-700">{act.status}</strong></span>
                  <span>·</span>
                  <span>Due: {act.dueDate}</span>
                  <span>·</span>
                  <span>Rhythm: {act.rhythm}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!act.isNMA && act.status !== 'Completed' && (
                  <button
                    onClick={() => setAsNma(act.id)}
                    className="text-xs font-semibold text-[#155A8A] hover:bg-[#EAF4FB] border border-[#155A8A]/30 px-3 py-1.5 rounded-lg transition"
                  >
                    Set as NMA
                  </button>
                )}
                {act.status !== 'Completed' && (
                  <button
                    onClick={() => openReadinessCheck(act.id)}
                    className="text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-lg transition"
                  >
                    Readiness
                  </button>
                )}
                {act.status === 'Blocked' && (
                  <button
                    onClick={() => openBarrierReview(act.id)}
                    className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition"
                  >
                    Barrier
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
