import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalCategory } from '../../types';
import { ContextualAiService } from '../../services/contextualAi';
import { X, Target, Sparkles, Check, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';

export const CreateGoalModal: React.FC = () => {
  const { isCreateGoalOpen, setIsCreateGoalOpen, createGoal, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Business & Entrepreneurship');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Standard'>('High');
  const [whyThisMatters, setWhyThisMatters] = useState('');

  // AI Clarification State
  const [aiClarification, setAiClarification] = useState<{
    refinedTitle: string;
    refinedWhyThisMatters: string;
    suggestions: string[];
  } | null>(null);

  if (!isCreateGoalOpen) return null;

  const handlePreFillExample = () => {
    setTitle('Start a catering business');
    setDescription(
      'Launch a boutique event catering service focusing on regional fusion corporate lunches and social celebrations.'
    );
    setCategory('Business & Entrepreneurship');
    setPriority('High');
    setWhyThisMatters(
      'Building financial autonomy for my family and utilizing my culinary expertise to serve corporate clients and community gatherings.'
    );
    showToast('Loaded protocol reference example.', 'info');
  };

  const handleAiClarify = () => {
    if (!title.trim()) {
      showToast('Please provide a working title first.', 'warning');
      return;
    }
    const result = ContextualAiService.clarifyGoal(title, whyThisMatters);
    setAiClarification(result);
  };

  const handleAcceptAi = () => {
    if (aiClarification) {
      setTitle(aiClarification.refinedTitle);
      setWhyThisMatters(aiClarification.refinedWhyThisMatters);
      setAiClarification(null);
      showToast('AI suggestion applied to Goal definition.', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whyThisMatters.trim()) return;

    createGoal({
      title,
      description,
      category,
      targetDate,
      priority,
      whyThisMatters,
      status: 'Active',
      nextReviewDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      kpi: {
        name: 'Milestone Actions Completed',
        currentValue: 0,
        targetValue: 5,
        unit: 'actions',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0E3C5B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4B9C91]">
              Momentum Foundation
            </span>
            <h2 className="text-lg font-bold">Create Meaningful Goal</h2>
          </div>
          <button
            onClick={() => setIsCreateGoalOpen(false)}
            className="text-gray-300 hover:text-white p-1 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Quick Example Button */}
          <div className="flex items-center justify-between bg-[#EAF4FB] p-3 rounded-xl border border-[#155A8A]/20">
            <span className="text-gray-700 font-medium text-[11px]">
              Use the Pilot Protocol Case:
            </span>
            <button
              type="button"
              onClick={handlePreFillExample}
              className="bg-[#155A8A] text-white px-2.5 py-1 rounded-lg font-semibold text-[11px] hover:bg-[#0E3C5B] transition"
            >
              Pre-fill "Start a catering business"
            </button>
          </div>

          {/* Goal Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-900 block">Goal Title *</label>
              <button
                type="button"
                onClick={handleAiClarify}
                className="text-[#155A8A] hover:text-[#0E3C5B] font-semibold flex items-center gap-1 text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-[#C5A034]" />
                <span>AI Coach: Clarify Goal</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Start a catering business"
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* AI Clarification Suggestion Box */}
          {aiClarification && (
            <div className="bg-[#EAF4FB] border border-[#155A8A]/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#155A8A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A034]" />
                  AI Suggested Clarification — Please Confirm
                </span>
                <span className="text-[10px] text-gray-500 italic">User control preserved</span>
              </div>
              <p className="text-gray-800">
                <strong>Refined Title:</strong> {aiClarification.refinedTitle}
              </p>
              <p className="text-gray-800">
                <strong>Refined Why:</strong> {aiClarification.refinedWhyThisMatters}
              </p>
              <ul className="list-disc pl-4 text-gray-600 text-[11px] space-y-0.5">
                {aiClarification.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAiClarification(null)}
                  className="px-2.5 py-1 text-gray-600 hover:text-gray-900"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAi}
                  className="bg-[#155A8A] text-white px-3 py-1 rounded-lg font-semibold"
                >
                  Accept Suggestion
                </button>
              </div>
            </div>
          )}

          {/* Goal Description */}
          <div>
            <label className="font-semibold text-gray-800 block mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of the scope and core objectives..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* WHY THIS MATTERS (Core Protocol Concept) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
            <div>
              <label className="font-bold text-gray-900 block text-xs">
                Why This Matters *
              </label>
              <span className="text-[11px] text-gray-600 leading-relaxed block">
                Explain the meaningful connection behind this Goal (e.g. personal meaning, family responsibility, financial independence, or professional contribution).
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={whyThisMatters}
              onChange={e => setWhyThisMatters(e.target.value)}
              placeholder="e.g. Building financial autonomy for my family and utilizing my professional culinary expertise..."
              className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#155A8A]"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-800 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as GoalCategory)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none"
              >
                <option value="Business & Entrepreneurship">Business &amp; Entrepreneurship</option>
                <option value="Professional Development">Professional Development</option>
                <option value="Academic & Learning">Academic &amp; Learning</option>
                <option value="Creative & Writing">Creative &amp; Writing</option>
                <option value="Health & Well-being">Health &amp; Well-being</option>
                <option value="Personal Life">Personal Life</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-800 block mb-1">Target Horizon</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none"
              >
              </input>
            </div>
          </div>

          {/* Goal Quality Prompts Check */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
            <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wider">
              Goal Quality Check:
            </span>
            <ul className="space-y-1 text-[11px] text-gray-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4B9C91]" />
                <span>What exactly are you trying to achieve?</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4B9C91]" />
                <span>Why does this matter? (Deep personal/financial purpose)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4B9C91]" />
                <span>Is the Goal currently relevant to your immediate life?</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4B9C91]" />
                <span>Is observable progress possible within 6–12 weeks?</span>
              </li>
            </ul>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateGoalOpen(false)}
              className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0E3C5B] hover:bg-[#155A8A] text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              <span>Save Goal &amp; Activate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
