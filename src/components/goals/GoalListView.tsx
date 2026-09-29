import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Plus, ChevronRight, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onSelectGoal: (id: string) => void;
}

export const GoalListView: React.FC<Props> = ({ onSelectGoal }) => {
  const { goals, setIsCreateGoalOpen } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0E3C5B]">Meaningful Goals</h1>
          <p className="text-xs text-gray-600 mt-1">
            SOPET Momentum anchors execution in goals with deep personal, professional, or financial meaning.
          </p>
        </div>
        <button
          onClick={() => setIsCreateGoalOpen(true)}
          className="flex items-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Meaningful Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            onClick={() => onSelectGoal(goal.id)}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#155A8A]/40 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A] bg-[#EAF4FB] px-2 py-0.5 rounded">
                  {goal.category}
                </span>
                {goal.isPrimary && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#C5A034] text-gray-950 px-2 py-0.5 rounded">
                    Primary Focus
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    goal.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#0E3C5B]">{goal.title}</h2>
              {goal.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{goal.description}</p>
              )}

              <div className="text-xs text-[#155A8A] bg-[#EAF4FB]/60 p-2.5 rounded-lg">
                <strong className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                  Why This Matters:
                </strong>
                <span className="italic line-clamp-1">"{goal.whyThisMatters}"</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-2 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-400 block uppercase">Target Horizon</span>
                <span className="text-xs font-semibold text-gray-700">{goal.targetDate}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#155A8A]">
                <span>Open Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
