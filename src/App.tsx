/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/layout/LandingPage';
import { TodayFocusView } from './components/today/TodayFocusView';
import { GoalListView } from './components/goals/GoalListView';
import { GoalDetailView } from './components/goals/GoalDetailView';
import { ProgressKpiView } from './components/progress/ProgressKpiView';
import { WeeklyReviewView } from './components/review/WeeklyReviewView';
import { SettingsPrivacyView } from './components/settings/SettingsPrivacyView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AuthModal } from './components/auth/AuthModal';
import { LightweightOnboarding } from './components/onboarding/LightweightOnboarding';
import { CreateGoalModal } from './components/goals/CreateGoalModal';
import { ActionReadinessModal } from './components/readiness/ActionReadinessModal';
import { BarrierReviewModal } from './components/barrier/BarrierReviewModal';
import { MmaModal } from './components/mma/MmaModal';
import { IntelligentRestartModal } from './components/restart/IntelligentRestartModal';
import { WeeklyReviewModal } from './components/review/WeeklyReviewModal';
import { Toast } from './components/common/Toast';

const MainContent: React.FC = () => {
  const {
    isAuthenticated,
    activeView,
    activeRole,
    selectedGoalId,
    setSelectedGoalId,
  } = useApp();

  // If not signed in to the prototype, show the public Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If Admin role is toggled in the header, render Admin Dashboard
  if (activeRole === 'admin') {
    return (
      <div className="min-h-screen bg-[#EAF4FB] text-[#1E293B] flex flex-col">
        <Header />
        <main className="flex-1 pb-12">
          <AdminDashboardView />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF4FB] text-[#1E293B] flex flex-col">
      <Header />
      <main className="flex-1 pb-12">
        {activeView === 'today' && <TodayFocusView />}

        {activeView === 'goals' && (
          <>
            {selectedGoalId ? (
              <GoalDetailView
                goalId={selectedGoalId}
                onBack={() => setSelectedGoalId(null)}
              />
            ) : (
              <GoalListView onSelectGoal={id => setSelectedGoalId(id)} />
            )}
          </>
        )}

        {activeView === 'progress' && <ProgressKpiView />}
        {activeView === 'review' && <WeeklyReviewView />}
        {activeView === 'settings' && <SettingsPrivacyView />}
        {activeView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Global Modals */}
      <CreateGoalModal />
      <ActionReadinessModal />
      <BarrierReviewModal />
      <MmaModal />
      <IntelligentRestartModal />
      <WeeklyReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
      {/* Auth & Onboarding are rendered at top level so they can trigger from landing page */}
      <AuthModal />
      <LightweightOnboarding />
      <Toast />
    </AppProvider>
  );
}
