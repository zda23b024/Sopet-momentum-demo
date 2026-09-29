import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  BarChart3,
  BookOpen,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Filter,
  Search,
  CheckCircle2,
  AlertOctagon,
  Download
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { acifCategories, pilotParticipants, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'taxonomy' | 'participants' | 'interventions'>('analytics');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('overwhelm');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Admin Banner */}
      <div className="bg-[#0E3C5B] text-white p-6 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A034]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#4B9C91]">
              Administrator &amp; Research Console
            </span>
          </div>
          <span className="text-[11px] bg-[#155A8A] px-2.5 py-0.5 rounded-full font-medium">
            ACoS EduTech Pilot Protocol
          </span>
        </div>
        <h1 className="text-2xl font-extrabold">SOPET Momentum Pilot Governance</h1>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
          Aggregated cohort analytics, ACIF barrier taxonomy distribution, intervention effectiveness evaluation, and ethical compliance monitoring for the initial cohort.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-4 text-xs font-semibold">
        {[
          { id: 'analytics', label: 'Cohort Analytics', icon: BarChart3 },
          { id: 'taxonomy', label: 'ACIF Taxonomy (13 Categories)', icon: Layers },
          { id: 'interventions', label: 'Intervention Effectiveness', icon: TrendingUp },
          { id: 'participants', label: 'Participant Registry', icon: Users },
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

      {/* TAB 1: COHORT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top High-level KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                Active Participants
              </span>
              <span className="text-2xl font-extrabold text-[#0E3C5B]">48</span>
              <span className="text-[10px] text-emerald-600 block mt-1">94% Retention rate</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                Avg Continuity
              </span>
              <span className="text-2xl font-extrabold text-[#4B9C91]">4.2</span>
              <span className="text-[10px] text-gray-500 block mt-1">Weeks with ≥1 action</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                Avg Restart Speed
              </span>
              <span className="text-2xl font-extrabold text-[#C5A034]">2.1</span>
              <span className="text-[10px] text-gray-500 block mt-1">Days to recover rhythm</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                Barrier Resolution
              </span>
              <span className="text-2xl font-extrabold text-[#155A8A]">81%</span>
              <span className="text-[10px] text-emerald-600 block mt-1">Via targeted response</span>
            </div>
          </div>

          {/* Barrier Frequency Chart / Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0E3C5B] uppercase tracking-wider">
                  ACIF Barrier Distribution Across Pilot Cohort
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Percentage of diagnosed obstacles during weekly reviews and action blockages (N=142 reports).
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { name: 'Overwhelm', count: 38, pct: 27, color: 'bg-rose-500' },
                { name: 'Unclear Next Step', count: 28, pct: 20, color: 'bg-amber-500' },
                { name: 'Resource Gap', count: 22, pct: 15, color: 'bg-blue-500' },
                { name: 'Self-Doubt', count: 18, pct: 13, color: 'bg-purple-500' },
                { name: 'Priority Conflict', count: 16, pct: 11, color: 'bg-indigo-500' },
                { name: 'Perfectionism', count: 12, pct: 8, color: 'bg-teal-500' },
                { name: 'Other / Dependencies', count: 8, pct: 6, color: 'bg-gray-400' },
              ].map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{item.name}</span>
                    <span>{item.count} occurrences ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full`}
                      style={{ width: `${item.pct * 3}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACIF TAXONOMY VIEWER */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0E3C5B]">
              Action-Centric Intervention Framework (ACIF) — 13 Barrier Categories
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every category enforces non-judgmental language. It diagnoses what obstructed the Action without pathologizing the person.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {acifCategories.map(cat => (
                <div
                  key={cat.code}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#155A8A]/40 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0E3C5B] text-sm">
                      {cat.number}. {cat.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                      {cat.code}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">"{cat.nonJudgmentalDescription}"</p>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-gray-600 text-[11px] space-y-1">
                    <strong className="text-[#155A8A] block">Standard Intervention:</strong>
                    <span>{cat.defaultIntervention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERVENTION EFFECTIVENESS */}
      {activeTab === 'interventions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0E3C5B]">
              Intervention Resolution Benchmarks
            </h2>
            <p className="text-xs text-gray-600">
              Comparative efficacy of standardized interventions across pilot participants.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {[
                {
                  title: 'Minimum Meaningful Action (MMA)',
                  barrier: 'Overwhelm & Blank Page Dread',
                  successRate: 88,
                  sample: 42,
                },
                {
                  title: 'Action Clarification Protocol',
                  barrier: 'Unclear Next Step',
                  successRate: 84,
                  sample: 31,
                },
                {
                  title: 'Prerequisite Acquisition Sprint',
                  barrier: 'Resource Gap',
                  successRate: 79,
                  sample: 24,
                },
                {
                  title: 'Risk Reduction & Evidence Review',
                  barrier: 'Self-Doubt & Fear',
                  successRate: 72,
                  sample: 18,
                },
                {
                  title: 'Strategic Horizon Reprioritization',
                  barrier: 'Priority Conflict',
                  successRate: 69,
                  sample: 16,
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-gray-200 bg-white space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#0E3C5B]">{item.title}</h3>
                      <span className="text-[11px] text-gray-500">Targeted Barrier: {item.barrier}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-700">
                        {item.successRate}%
                      </span>
                      <span className="text-[10px] text-gray-400 block">N={item.sample} interventions</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${item.successRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARTICIPANTS REGISTRY */}
      {activeTab === 'participants' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0E3C5B]">Pilot Participant Registry</h2>
              <p className="text-xs text-gray-500">
                Active pilot cohort participants and current engagement status.
              </p>
            </div>
            <span className="text-xs bg-[#EAF4FB] text-[#155A8A] font-semibold px-2.5 py-1 rounded-lg">
              {pilotParticipants.length} Cohort Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Goal Focus</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions Completed</th>
                  <th className="p-3">Continuity</th>
                  <th className="p-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pilotParticipants.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                    <td className="p-3 text-[#0E3C5B] max-w-xs truncate font-medium">{p.goalTitle}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-700">{p.completedActionsCount}</td>
                    <td className="p-3 text-[#4B9C91] font-bold">{p.weeksContinuity} wks</td>
                    <td className="p-3 text-gray-500">{p.lastActiveDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
