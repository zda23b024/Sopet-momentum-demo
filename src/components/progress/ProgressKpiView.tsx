import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  Award,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
  AlertOctagon
} from 'lucide-react';

export const ProgressKpiView: React.FC = () => {
  const {
    kpis,
    weeklyReviews,
    openWeeklyReviewModal,
    openWeeklyReview,
    setActiveView,
    primaryGoal,
    barriers
  } = useApp();

  const handleOpenReview = openWeeklyReviewModal || openWeeklyReview;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Launch Review */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0E3C5B]">Progress &amp; KPI Dashboard</h1>
          <p className="text-xs text-gray-600 mt-1">
            Measuring developmental momentum, execution continuity, and barrier resolution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('review')}
            className="flex items-center gap-1.5 border border-[#155A8A] text-[#155A8A] hover:bg-[#EAF4FB] text-xs font-semibold px-3.5 py-2.5 rounded-xl transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Hub</span>
          </button>
          <button
            onClick={handleOpenReview}
            className="flex items-center gap-1.5 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Launch Weekly Review</span>
          </button>
        </div>
      </div>

      {/* 6 Key Momentum KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* KPI 1: Action Completion Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Action Completion Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0E3C5B]">
              {kpis.actionCompletionRate}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {kpis.completedActions}/{kpis.totalActions} done
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#155A8A] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, kpis.actionCompletionRate))}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 block">Actions completed as planned</span>
        </div>

        {/* KPI 2: Momentum Continuity */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Momentum Continuity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4B9C91]">
              {kpis.continuityWeeks}
            </span>
            <span className="text-xs font-semibold text-gray-600">consecutive wks</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#4B9C91] h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
          <span className="text-[10px] text-gray-500 block">≥ 1 Meaningful Action weekly</span>
        </div>

        {/* KPI 3: Restart Speed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Restart Speed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C5A034]">
              {kpis.restartSpeedDays}
            </span>
            <span className="text-xs font-semibold text-gray-600">days avg</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#C5A034] h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
          <span className="text-[10px] text-gray-500 block">From interruption to restart action</span>
        </div>

        {/* KPI 4: Barrier Resolution Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Barrier Resolution Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0E3C5B]">
              {kpis.barrierResolutionRate}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {kpis.barriersResolved}/{kpis.totalBarriersDiagnosed} unblocked
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0E3C5B] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, kpis.barrierResolutionRate))}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 block">Barriers transformed via ACIF</span>
        </div>

        {/* KPI 5: Goal Milestone Progress */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Goal Milestone Progress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#155A8A]">
              {kpis.goalMilestoneProgress}%
            </span>
            <span className="text-[11px] font-semibold text-gray-600">
              {kpis.completedMilestones}/{kpis.totalMilestones} waypoints
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#155A8A] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, kpis.goalMilestoneProgress))}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 block">Key developmental waypoints</span>
        </div>

        {/* KPI 6: Self-Efficacy Trend */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
            Self-Efficacy Trend
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4B9C91]">
              {kpis.selfEfficacyScore}
            </span>
            <span className="text-xs font-semibold text-gray-500">/ 5.0</span>
          </div>
          <div className="flex gap-1 pt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <div
                key={star}
                className={`h-2 flex-1 rounded-full ${
                  star <= Math.round(kpis.selfEfficacyScore) ? 'bg-[#4B9C91]' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <span className="text-[10px] text-gray-500 block">
            Trend: <strong>{kpis.selfEfficacyTrend}</strong>
          </span>
        </div>
      </div>

      {/* Qualitative Insights & ACIF Diagnostics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qualitative Insights */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0E3C5B] uppercase tracking-wider">
            Qualitative Insights &amp; Growth Observations
          </h2>
          <div className="space-y-3 text-xs text-gray-700">
            <div className="bg-[#EAF4FB] p-3 rounded-xl border border-[#155A8A]/20">
              <strong className="text-[#0E3C5B] block mb-1">Most Effective Intervention:</strong>
              Minimum Meaningful Action (MMA) reduces task overwhelm by 80%, consistently unlocking subsequent deep work.
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block mb-1">Consistent Execution Rhythm:</strong>
              Three times weekly customer touchpoints generate high motivation without cognitive fatigue.
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <strong className="text-gray-800 block mb-1">Interruption Resilience:</strong>
              Intelligent restart protocols prevented shame-based withdrawal after week 3 family schedule disruptions.
            </div>
          </div>
        </div>

        {/* Diagnosed Barriers History */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0E3C5B] uppercase tracking-wider">
              Encountered ACIF Barriers (Recent)
            </h2>
            <span className="text-[11px] text-gray-500">{barriers.length} logged</span>
          </div>

          <div className="space-y-2.5">
            {barriers.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No barriers diagnosed yet.</p>
            ) : (
              barriers.slice(0, 3).map(b => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 uppercase text-[11px]">
                      {b.confirmedCategory.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        b.resolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.resolved ? 'Resolved' : 'Active Intervention'}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-1 italic">"{b.userExplanation}"</p>
                  {b.interventionApplied && (
                    <div className="text-[11px] text-[#155A8A]">
                      Intervention: <strong>{b.interventionApplied}</strong>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Historical Weekly Reviews */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0E3C5B]">Weekly Review History</h2>
            <p className="text-xs text-gray-500">
              Completed reflection cycles and resulting Next Meaningful Actions (NMAs).
            </p>
          </div>
          <button
            onClick={() => setActiveView('review')}
            className="text-xs text-[#155A8A] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {weeklyReviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">No weekly reviews recorded yet.</p>
          ) : (
            weeklyReviews.map(rev => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0E3C5B] text-sm">
                    Cycle Ending: {rev.weekEndingDate}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    Completed Review
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 pt-1">
                  <div>
                    <span className="font-semibold text-emerald-800 block text-[11px]">
                      Meaningful Progress:
                    </span>
                    <p className="line-clamp-2">{rev.meaningfulProgress}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#155A8A] block text-[11px]">
                      Extracted Lesson:
                    </span>
                    <p className="line-clamp-2">{rev.lessonText}</p>
                  </div>
                </div>

                <div className="text-[11px] bg-white p-2.5 rounded-lg border border-gray-200 text-gray-800 flex items-center justify-between">
                  <div>
                    <strong className="text-[#0E3C5B]">Next NMA Established:</strong>{' '}
                    <span>{rev.nextNmaTitle}</span>
                  </div>
                  <Target className="w-3.5 h-3.5 text-[#C5A034] shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
