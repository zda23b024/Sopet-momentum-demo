import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  AlertOctagon,
  Lightbulb,
  ArrowRight,
  Target,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const WeeklyReviewModal: React.FC = () => {
  const {
    isWeeklyReviewModalOpen,
    isWeeklyReviewOpen,
    closeWeeklyReviewModal,
    closeWeeklyReview,
    submitWeeklyReview,
    primaryGoal,
    actions,
    showToast
  } = useApp();

  const isOpen = isWeeklyReviewModalOpen ?? isWeeklyReviewOpen;
  const handleClose = closeWeeklyReviewModal || closeWeeklyReview;

  const completedActions = actions.filter(a => a.status === 'Completed');
  const incompleteActions = actions.filter(a => a.status !== 'Completed');

  const [meaningfulProgress, setMeaningfulProgress] = useState(
    completedActions.map(a => a.title).join('; ') ||
      'Conducted 2 customer discovery phone interviews with corporate event planners; validated core lunch package interest.'
  );

  const [actionsThatMattered, setActionsThatMattered] = useState(
    'Direct outreach calls generated concrete responses, while researching competitor menus online was an avoidant distractor.'
  );

  const [whatGotInTheWay, setWhatGotInTheWay] = useState(
    'Mid-week overwhelm when reviewing commercial kitchen lease options and licensing prerequisites.'
  );

  const [interventionsThatHelped, setInterventionsThatHelped] = useState(
    'Minimum Meaningful Action (MMA): Drafting just 5 interview questions on an index card broke the avoidance cycle.'
  );

  const [interventionsThatDidNotHelp, setInterventionsThatDidNotHelp] = useState(
    'Generic to-do lists without a scheduled start time.'
  );

  const [interruptionExperienced, setInterruptionExperienced] = useState(false);
  const [restartDetails, setRestartDetails] = useState('');

  const [lessonText, setLessonText] = useState(
    'When administrative tasks feel vast, starting with a 15-minute Minimum Meaningful Action restores momentum immediately.'
  );

  const [adjustmentText, setAdjustmentText] = useState(
    'Schedule discovery interviews in protected morning slots (Tue/Thu) rather than late afternoon.'
  );

  const [nextNmaTitle, setNextNmaTitle] = useState(
    'Schedule five 20-minute customer interviews for next Tuesday'
  );

  if (!isOpen || !primaryGoal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meaningfulProgress || !nextNmaTitle) {
      showToast('Please provide your meaningful progress and next NMA.', 'warning');
      return;
    }

    submitWeeklyReview({
      meaningfulProgress,
      actionsThatMattered,
      whatGotInTheWay,
      interventionsThatHelped,
      interventionsThatDidNotHelp,
      interruptionExperienced,
      restartDetails: interruptionExperienced ? restartDetails : undefined,
      aiSummaryDraft: 'Validated key customer pricing hypothesis; overcame administrative overwhelm via micro-action scoping.',
      aiSummaryConfirmed: true,
      lessonText,
      adjustmentText,
      nextNmaTitle,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4B9C91]">
              Momentum Reflection
            </span>
            <h2 className="text-lg font-bold">Weekly Momentum Review</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Banner */}
        <div className="bg-[#EAF4FB] px-6 py-2.5 border-b border-[#155A8A]/20 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A]">
            Reviewing Goal:
          </span>
          <p className="text-xs font-semibold text-[#0E3C5B] truncate">{primaryGoal.title}</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-gray-600 leading-relaxed">
            The Weekly Review closes the loop between intention and actual execution. Reflect without self-judgment.
          </div>

          {/* Q1: Meaningful progress */}
          <div>
            <label className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. What meaningful progress was made this week?</span>
            </label>
            <textarea
              rows={2}
              required
              value={meaningfulProgress}
              onChange={e => setMeaningfulProgress(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Q2: Actions that mattered */}
          <div>
            <label className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-[#155A8A]" />
              <span>2. Which actions really mattered, and which did not?</span>
            </label>
            <textarea
              rows={2}
              required
              value={actionsThatMattered}
              onChange={e => setActionsThatMattered(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Q3: What got in the way */}
          <div>
            <label className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>3. What got in the way (internal resistance, external obstacles)?</span>
            </label>
            <textarea
              rows={2}
              required
              value={whatGotInTheWay}
              onChange={e => setWhatGotInTheWay(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Q4: Interventions evaluated */}
          <div>
            <label className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#4B9C91]" />
              <span>4. What intervention helped, and what did not help?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={interventionsThatHelped}
                onChange={e => setInterventionsThatHelped(e.target.value)}
                placeholder="What helped (e.g. MMA)"
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
              />
              <input
                type="text"
                value={interventionsThatDidNotHelp}
                onChange={e => setInterventionsThatDidNotHelp(e.target.value)}
                placeholder="What did not help"
                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
              />
            </div>
          </div>

          {/* Q5: Interruption */}
          <div>
            <label className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <RotateCcw className="w-4 h-4 text-[#C5A034]" />
              <span>5. Was there an interruption, and how quickly did you restart?</span>
            </label>
            <div className="flex items-center gap-4 py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!interruptionExperienced}
                  onChange={() => setInterruptionExperienced(false)}
                />
                <span>No disruption</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={interruptionExperienced}
                  onChange={() => setInterruptionExperienced(true)}
                />
                <span>Yes, experienced interruption</span>
              </label>
            </div>
            {interruptionExperienced && (
              <input
                type="text"
                value={restartDetails}
                onChange={e => setRestartDetails(e.target.value)}
                placeholder="How did you recover rhythm?"
                className="w-full text-xs p-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
              />
            )}
          </div>

          {/* Personal Lesson & Adjustment */}
          <div className="bg-[#EAF4FB] p-3.5 rounded-xl border border-[#155A8A]/30 space-y-2">
            <label className="font-bold text-[#0E3C5B] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#C5A034]" />
              <span>Personal Lesson &amp; Concrete Adjustment</span>
            </label>
            <textarea
              rows={2}
              required
              value={lessonText}
              onChange={e => setLessonText(e.target.value)}
              placeholder="What did you learn about your rhythm?"
              className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
            <input
              type="text"
              required
              value={adjustmentText}
              onChange={e => setAdjustmentText(e.target.value)}
              placeholder="Concrete adjustment for next week"
              className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Next NMA */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-1.5">
            <label className="font-bold text-[#0E3C5B] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#C5A034]" />
              <span>Next Meaningful Action (NMA) for Upcoming Week</span>
            </label>
            <input
              type="text"
              required
              value={nextNmaTitle}
              onChange={e => setNextNmaTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-white font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              <span>Save Review &amp; Anchor Next NMA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
