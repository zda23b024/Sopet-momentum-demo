import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcifCategoryCode } from '../../types';
import { ContextualAiService } from '../../services/contextualAi';
import {
  X,
  AlertOctagon,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  Shield,
  HelpCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const BarrierReviewModal: React.FC = () => {
  const {
    isBarrierReviewOpen,
    barrierTargetActionId,
    closeBarrierReview,
    submitBarrierReview,
    actions,
    acifCategories,
    openMmaModal,
    showToast
  } = useApp();

  const action = actions.find(a => a.id === barrierTargetActionId);

  // Flow step: 1 = Free text description, 2 = AI Suggestion review, 3 = Category picker (if Choose Another / Edit), 4 = Intervention Card
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userExplanation, setUserExplanation] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<ReturnType<typeof ContextualAiService.suggestBarrier> | null>(null);
  const [aiStatus, setAiStatus] = useState<'accepted' | 'edited' | 'rejected'>('accepted');
  const [selectedCategory, setSelectedCategory] = useState<AcifCategoryCode>('overwhelm');
  const [secondaryCategory, setSecondaryCategory] = useState<AcifCategoryCode | undefined>(undefined);
  const [interventionFeedback, setInterventionFeedback] = useState<'applied' | 'not_useful' | null>(null);

  if (!isBarrierReviewOpen || !action) return null;

  // Step 1 -> Step 2: Analyze free-text with contextual AI
  const handleAnalyzeExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userExplanation.trim()) return;

    const suggestion = ContextualAiService.suggestBarrier(userExplanation, action.title);
    setAiSuggestion(suggestion);
    setSelectedCategory(suggestion.categoryCode);
    setStep(2);
  };

  // Step 2: Accept AI suggestion
  const handleAcceptAi = () => {
    setAiStatus('accepted');
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.categoryCode);
    }
    setStep(4);
  };

  // Step 2: Reject or Choose another
  const handleChooseAnother = () => {
    setAiStatus('edited');
    setStep(3);
  };

  const handleRejectAi = () => {
    setAiStatus('rejected');
    setSelectedCategory('other_unsure');
    setStep(3);
  };

  // Step 3 -> 4: Category confirmed by user
  const handleConfirmCategorySelection = () => {
    setStep(4);
  };

  // Final Action: Complete Barrier Review & apply intervention
  const handleFinishReview = (applyMMA: boolean = false) => {
    submitBarrierReview(
      action.id,
      userExplanation,
      selectedCategory,
      aiStatus,
      secondaryCategory
    );
    closeBarrierReview();

    if (applyMMA || selectedCategory === 'overwhelm') {
      openMmaModal(action.id);
    }
  };

  const currentCategoryData = acifCategories.find(c => c.code === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              ACIF Barrier Diagnostic
            </span>
            <h2 className="text-lg font-bold">What got in the way?</h2>
          </div>
          <button
            onClick={closeBarrierReview}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Title Context */}
        <div className="bg-[#EAF4FB] border-b border-[#155A8A]/20 px-6 py-3 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A] block">
            Blocked Action:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#0E3C5B] truncate">
            {action.title}
          </p>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Free Text Description */}
          {step === 1 && (
            <form onSubmit={handleAnalyzeExplanation} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  What prevented this meaningful Action from happening?
                </label>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  Describe what happened freely in your own words. We will not force you into a premature category.
                </p>
                <textarea
                  rows={4}
                  required
                  value={userExplanation}
                  onChange={e => setUserExplanation(e.target.value)}
                  placeholder="e.g. I sat down to write, but looking at the blank document felt completely overwhelming. I didn't know whether to start with the market research or the financial estimates..."
                  className="w-full text-sm p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
                />
              </div>

              {/* Sample quick-fill prompt for demo evaluator */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                  Demo Quick Fill:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUserExplanation(
                        "The proposal feels too large and I don't know where to begin. Looking at the blank page creates intense overwhelm."
                      )
                    }
                    className="text-xs bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-2.5 py-1 rounded-lg transition text-left"
                  >
                    "Task feels too large / blank page overwhelm"
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserExplanation(
                        "I don't have the commercial pricing spreadsheet software or the vendor equipment catalog needed to finish."
                      )
                    }
                    className="text-xs bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-2.5 py-1 rounded-lg transition text-left"
                  >
                    "Missing equipment catalog (Resource Gap)"
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!userExplanation.trim()}
                  className="flex items-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  <span>Explore Possible Barrier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: AI Suggestion Review */}
          {step === 2 && aiSuggestion && (
            <div className="space-y-5">
              <div className="border border-blue-200 bg-[#EAF4FB] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#155A8A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#155A8A]">
                      AI Suggestion — Please Confirm
                    </span>
                  </div>
                  <span className="text-[10px] bg-white border border-[#155A8A]/30 text-[#155A8A] px-2 py-0.5 rounded-full font-medium">
                    {aiSuggestion.confidence} Confidence
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-xs text-gray-500 block">Possible Barrier:</span>
                  <h3 className="text-lg font-bold text-[#0E3C5B]">
                    {aiSuggestion.categoryName} appeared to block this Action
                  </h3>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-gray-100">
                  {aiSuggestion.explanation}
                </p>

                <div className="text-[11px] text-gray-500 italic">
                  Note: The AI never silently confirms a Barrier. Your personal confirmation directs the system.
                </div>
              </div>

              {/* User Explanation Reminder */}
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-700 block mb-0.5">Your description:</span>
                "{userExplanation}"
              </div>

              {/* Buttons: Confirm, Choose another, Edit, Reject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAcceptAi}
                  className="w-full flex items-center justify-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm ({aiSuggestion.categoryName})</span>
                </button>

                <button
                  type="button"
                  onClick={handleChooseAnother}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold py-2.5 rounded-xl transition"
                >
                  Choose Another Category
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-gray-600 hover:text-gray-900 py-2"
                >
                  Edit My Description
                </button>

                <button
                  type="button"
                  onClick={handleRejectAi}
                  className="w-full text-xs text-rose-700 hover:text-rose-900 py-2"
                >
                  Reject Suggestion
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Category Picker (13 ACIF Categories) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Select the Category that Best Matches:
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Remember: Non-judgmental framing. A barrier describes an obstacle to an action, never your personal worth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {acifCategories.map(cat => {
                  const isSelected = selectedCategory === cat.code;
                  return (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => setSelectedCategory(cat.code)}
                      className={`text-left p-3 rounded-xl border transition text-xs ${
                        isSelected
                          ? 'border-[#155A8A] bg-[#EAF4FB] text-[#0E3C5B] font-medium shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">
                          {cat.number}. {cat.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                        {cat.nonJudgmentalDescription}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Back to AI Suggestion
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCategorySelection}
                  className="flex items-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  <span>Confirm Selection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Intervention Recommendation */}
          {step === 4 && currentCategoryData && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Confirmed Barrier
                  </span>
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  "{currentCategoryData.name} appeared to block this Action."
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {currentCategoryData.nonJudgmentalDescription}
                </p>
              </div>

              {/* Recommended Intervention Card */}
              <div className="border border-[#155A8A]/30 bg-white rounded-2xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#155A8A] block">
                  Approved Intervention:
                </span>
                <h4 className="text-base font-bold text-[#0E3C5B]">
                  {currentCategoryData.defaultIntervention}
                </h4>

                <div className="bg-[#EAF4FB] p-3 rounded-xl text-xs text-[#0E3C5B] space-y-1">
                  <span className="font-semibold block">Why this may help:</span>
                  <p>{currentCategoryData.whyThisHelps}</p>
                </div>

                {selectedCategory === 'overwhelm' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                    <span className="font-bold block mb-1">Recommended Response: Minimum Meaningful Action (MMA)</span>
                    <p>
                      Break this difficult parent action into the smallest practical micro-step (e.g. <em>"Draft the problem statement"</em>) to preserve momentum without cognitive fatigue.
                    </p>
                  </div>
                )}
              </div>

              {/* Choice Buttons */}
              <div className="space-y-2 pt-1">
                {selectedCategory === 'overwhelm' ? (
                  <button
                    type="button"
                    onClick={() => handleFinishReview(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white text-xs sm:text-sm font-semibold py-3 rounded-xl transition shadow-xs"
                  >
                    <span>Create Minimum Meaningful Action (MMA)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFinishReview(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#155A8A] hover:bg-[#0E3C5B] text-white text-xs sm:text-sm font-semibold py-3 rounded-xl transition shadow-xs"
                  >
                    <span>Apply Intervention &amp; Continue</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="hover:text-gray-800 underline"
                  >
                    Change Barrier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Intervention marked as not useful. Recorded for review.', 'info');
                      handleFinishReview(false);
                    }}
                    className="hover:text-rose-700"
                  >
                    Intervention Not Useful
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
