import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Target,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const WeeklyReviewView: React.FC = () => {
  const {
    weeklyReviews,
    lessons,
    primaryGoal,
    openWeeklyReviewModal,
    submitWeeklyReview,
    actions,
    kpis,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'lessons'>('current');

  // Form states for inline review
  const [step, setStep] = useState<number>(1);
  const [meaningfulProgress, setMeaningfulProgress] = useState(
    'Conducted 2 customer discovery phone interviews with corporate event planners and validated core lunch package interest.'
  );
  const [actionsThatMattered, setActionsThatMattered] = useState(
    'Direct outreach phone calls created real traction. Spending 3 hours reformatting spreadsheet colors was an avoidant distractor.'
  );
  const [whatGotInTheWay, setWhatGotInTheWay] = useState(
    'Cognitive overwhelm when looking at commercial kitchen lease requirements and licensing paperwork.'
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
    'Interview three catering clients about seasonal holiday corporate lunch preferences'
  );

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meaningfulProgress || !nextNmaTitle) {
      showToast('Please complete progress and next NMA.', 'warning');
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

    setStep(1);
    setActiveTab('history');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0E3C5B] text-white p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C5A034]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#4B9C91]">
              Momentum Reflection Cycle
            </span>
          </div>
          <span className="text-[11px] bg-[#155A8A] px-2.5 py-0.5 rounded-full font-medium">
            Weekly Protocol — Non-Judgmental
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Weekly Momentum Review</h1>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed mt-1">
            The Weekly Review closes the loop between intention and execution. In SOPET, we evaluate what happened without guilt, extract personal lessons, and set next week's Next Meaningful Action (NMA).
          </p>
        </div>

        {/* Quick Review Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-t border-[#155A8A]/50">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-semibold">Reviews Completed</span>
            <span className="text-lg font-bold text-white">{weeklyReviews.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-semibold">Continuity</span>
            <span className="text-lg font-bold text-[#4B9C91]">{kpis.continuityWeeks} Weeks</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-semibold">Lessons Extracted</span>
            <span className="text-lg font-bold text-[#C5A034]">{lessons.length} Insights</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-4 text-xs font-semibold">
        {[
          { id: 'current', label: 'Conduct Weekly Review', icon: Calendar },
          { id: 'history', label: `Review History (${weeklyReviews.length})`, icon: TrendingUp },
          { id: 'lessons', label: `Lessons & Adjustments (${lessons.length})`, icon: Lightbulb },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-[#155A8A] text-[#155A8A] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONDUCT WEEKLY REVIEW */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Quick Launch Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A]">
                Guided Review Experience
              </span>
              <h2 className="text-base font-bold text-[#0E3C5B]">
                5-Question Guided Reflection Flow
              </h2>
              <p className="text-xs text-gray-600 max-w-xl">
                You can complete your review using the focused pop-up modal or walk through the 5 structured steps below.
              </p>
            </div>
            <button
              onClick={openWeeklyReviewModal}
              className="bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs shrink-0 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Open Guided Review Modal</span>
            </button>
          </div>

          {/* Inline Step-by-Step Review Container */}
          <form onSubmit={handleInlineSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6 text-xs">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-[#0E3C5B]">
                  Weekly Review Diagnostic (Week Ending {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                </h3>
                <span className="text-[11px] font-bold text-[#155A8A] bg-[#EAF4FB] px-2.5 py-1 rounded-full">
                  Step {step} of 3
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                Reflect on your actual actions over the past 7 days. Be factual and developmental.
              </p>
            </div>

            {/* STEP 1: Progress & Significance */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. What meaningful progress was made this week?</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={meaningfulProgress}
                    onChange={e => setMeaningfulProgress(e.target.value)}
                    placeholder="Focus on observable output, customer touchpoints, or concrete steps completed..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <Target className="w-4 h-4 text-[#155A8A]" />
                    <span>2. Which actions really mattered, and which did not?</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={actionsThatMattered}
                    onChange={e => setActionsThatMattered(e.target.value)}
                    placeholder="Distinguish high-impact actions from avoidant 'busywork' or distractions..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#155A8A] hover:bg-[#0E3C5B] text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Next: Barriers &amp; Interventions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Barriers & Interventions */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <AlertOctagon className="w-4 h-4 text-amber-600" />
                    <span>3. What got in the way (internal resistance, external obstacles)?</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={whatGotInTheWay}
                    onChange={e => setWhatGotInTheWay(e.target.value)}
                    placeholder="Describe specific friction without self-criticism..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-[#4B9C91]" />
                    <span>4. What intervention helped, and what did not help?</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-800 block mb-1">What helped:</span>
                      <textarea
                        rows={2}
                        value={interventionsThatHelped}
                        onChange={e => setInterventionsThatHelped(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-rose-800 block mb-1">What did not help:</span>
                      <textarea
                        rows={2}
                        value={interventionsThatDidNotHelp}
                        onChange={e => setInterventionsThatDidNotHelp(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                    <RotateCcw className="w-4 h-4 text-[#C5A034]" />
                    <span>5. Was there an interruption, and how quickly did you restart?</span>
                  </label>
                  <div className="flex items-center gap-4 py-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!interruptionExperienced}
                        onChange={() => setInterruptionExperienced(false)}
                        className="text-[#155A8A]"
                      />
                      <span>No major disruption</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={interruptionExperienced}
                        onChange={() => setInterruptionExperienced(true)}
                        className="text-[#155A8A]"
                      />
                      <span>Yes, experienced an interruption</span>
                    </label>
                  </div>
                  {interruptionExperienced && (
                    <input
                      type="text"
                      value={restartDetails}
                      onChange={e => setRestartDetails(e.target.value)}
                      placeholder="How did you recover rhythm? (e.g. Restarted within 2 days via MMA)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#155A8A] hover:bg-[#0E3C5B] text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Next: Personal Lesson &amp; Next NMA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Lesson, Adjustment & Next NMA */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#EAF4FB] p-4 rounded-xl border border-[#155A8A]/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#C5A034]" />
                    <span className="font-bold text-[#0E3C5B]">Continuous Learning Synthesis</span>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Personal Lesson (what you discovered about your work rhythm):
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={lessonText}
                      onChange={e => setLessonText(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Concrete Adjustment (what you will change next week):
                    </label>
                    <input
                      type="text"
                      required
                      value={adjustmentText}
                      onChange={e => setAdjustmentText(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <label className="font-bold text-[#0E3C5B] flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#C5A034]" />
                    <span>Establish Next Meaningful Action (NMA) for Next Week</span>
                  </label>
                  <p className="text-[11px] text-gray-600">
                    A single concrete, physical, observable action that will serve as your primary focus.
                  </p>
                  <input
                    type="text"
                    required
                    value={nextNmaTitle}
                    onChange={e => setNextNmaTitle(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-medium text-gray-900 focus:ring-2 focus:ring-[#155A8A] focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-[#155A8A] hover:bg-[#0E3C5B] text-white font-bold px-6 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Weekly Review &amp; Set NMA</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 2: REVIEW HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0E3C5B]">
              Weekly Review Archive ({weeklyReviews.length} Records)
            </h2>
            <button
              onClick={() => {
                setActiveTab('current');
                setStep(1);
              }}
              className="text-xs text-[#155A8A] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Review</span>
            </button>
          </div>

          {weeklyReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-700">No Weekly Reviews Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Complete your first Weekly Momentum Review to log accomplishments, extract insights, and anchor next week's NMA.
              </p>
              <button
                onClick={() => {
                  setActiveTab('current');
                  setStep(1);
                }}
                className="bg-[#155A8A] text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Start Review Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {weeklyReviews.map((rev, index) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#155A8A] text-white font-bold flex items-center justify-center text-[10px]">
                        #{weeklyReviews.length - index}
                      </span>
                      <h3 className="font-bold text-sm text-[#0E3C5B]">
                        Cycle Ending: {rev.weekEndingDate}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      Completed Cycle
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Meaningful Progress:</span>
                      </span>
                      <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {rev.meaningfulProgress}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-amber-800 flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>What Got in the Way:</span>
                      </span>
                      <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {rev.whatGotInTheWay || 'No major blockers recorded.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#EAF4FB] p-3 rounded-xl border border-[#155A8A]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#155A8A] font-bold">
                      <Lightbulb className="w-4 h-4 text-[#C5A034]" />
                      <span>Extracted Personal Lesson:</span>
                    </div>
                    <p className="text-gray-800 font-medium">"{rev.lessonText}"</p>
                    {rev.adjustmentText && (
                      <div className="text-[11px] text-gray-600">
                        <strong>Adjustment:</strong> {rev.adjustmentText}
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-gray-800 flex items-center justify-between">
                    <div>
                      <strong className="text-[#0E3C5B] text-[11px] block">Next NMA Established:</strong>
                      <span className="font-medium text-xs text-gray-900">{rev.nextNmaTitle}</span>
                    </div>
                    <Target className="w-4 h-4 text-[#C5A034] shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LESSONS & ADJUSTMENTS */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0E3C5B]">
                Continuous Learning Ledger
              </h2>
              <p className="text-xs text-gray-500">
                Extracted operational lessons and behavioral adjustments from completed action cycles.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {lessons.map(item => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#155A8A] text-[11px]">
                    {item.date} — {item.goalTitle}
                  </span>
                  {item.relatedBarrierCode && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-semibold">
                      {item.relatedBarrierCode.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 space-y-1">
                  <span className="font-bold text-[#0E3C5B] block">Personal Lesson:</span>
                  <p className="text-gray-800 font-medium">"{item.lesson}"</p>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/60 space-y-1">
                  <span className="font-bold text-emerald-900 block">Concrete Adjustment Made:</span>
                  <p className="text-gray-800">{item.adjustmentMade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
