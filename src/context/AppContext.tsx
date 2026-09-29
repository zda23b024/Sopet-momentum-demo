import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Goal,
  Milestone,
  ActionItem,
  AcifCategory,
  AcifCategoryCode,
  InterventionDefinition,
  LessonRecord,
  RestartRecord,
  WeeklyReviewRecord,
  BarrierRecord,
  MomentumKpiSet,
  PilotParticipant,
  NotificationSettings,
  AnalyticsEvent,
  KnowledgeBaseEntry,
  AiPromptTemplate,
  ReadinessOutput,
  RestartStrategy,
  ActionStatus,
  GoalStatus
} from '../types';
import {
  INITIAL_USER,
  INITIAL_GOALS,
  INITIAL_MILESTONES,
  INITIAL_ACTIONS,
  ACIF_CATEGORIES,
  APPROVED_INTERVENTIONS,
  INITIAL_LESSONS,
  INITIAL_BARRIERS,
  INITIAL_WEEKLY_REVIEWS,
  KNOWLEDGE_BASE_ENTRIES,
  INITIAL_PROMPT_TEMPLATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANALYTICS_EVENTS
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface AppContextType {
  // Navigation & Role
  activeView: 'today' | 'goals' | 'progress' | 'review' | 'settings' | 'admin';
  setActiveView: (view: 'today' | 'goals' | 'progress' | 'review' | 'settings' | 'admin') => void;
  demoRole: 'user' | 'admin';
  setDemoRole: (role: 'user' | 'admin') => void;
  activeRole: 'user' | 'admin';
  setActiveRole: (role: 'user' | 'admin') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  user: typeof INITIAL_USER | null;

  // Domain Entities
  goals: Goal[];
  milestones: Milestone[];
  actions: ActionItem[];
  acifCategories: AcifCategory[];
  interventions: InterventionDefinition[];
  lessons: LessonRecord[];
  restarts: RestartRecord[];
  barriers: BarrierRecord[];
  weeklyReviews: WeeklyReviewRecord[];
  kpis: MomentumKpiSet;
  pilotParticipants: PilotParticipant[];
  notifications: NotificationSettings;
  analyticsEvents: AnalyticsEvent[];
  knowledgeBase: KnowledgeBaseEntry[];
  promptTemplates: AiPromptTemplate[];

  // Primary selections
  primaryGoal: Goal | undefined;
  activeNma: ActionItem | undefined;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;

  // Modals & Flow States
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot';
  openAuthModal: (mode: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;

  isCreateGoalOpen: boolean;
  setIsCreateGoalOpen: (open: boolean) => void;

  isReadinessModalOpen: boolean;
  readinessTargetActionId: string | null;
  openReadinessCheck: (actionId: string) => void;
  closeReadinessCheck: () => void;
  submitReadinessCheck: (
    actionId: string,
    answers: {
      q1Understand: boolean;
      q2KnowHow: boolean;
      q3HaveResources: boolean;
      q4PrerequisitesDone: boolean;
      q5NoResistance: boolean;
    },
    output: ReadinessOutput,
    notes?: string
  ) => void;

  isBarrierReviewOpen: boolean;
  barrierTargetActionId: string | null;
  openBarrierReview: (actionId: string) => void;
  closeBarrierReview: () => void;
  submitBarrierReview: (
    actionId: string,
    userExplanation: string,
    confirmedCategory: AcifCategoryCode,
    aiStatus: 'accepted' | 'edited' | 'rejected',
    secondaryCategory?: AcifCategoryCode
  ) => void;

  isMmaModalOpen: boolean;
  mmaTargetActionId: string | null;
  openMmaModal: (parentActionId: string) => void;
  closeMmaModal: () => void;
  createMMA: (parentActionId: string, mmaTitle: string, whyThisHelps: string) => void;
  startMMA: (parentActionId: string) => void;
  completeMMA: (parentActionId: string) => void;

  isRestartModalOpen: boolean;
  openRestartModal: (interruptedActionId?: string) => void;
  closeRestartModal: () => void;
  submitRestartReview: (data: {
    isGoalStillMeaningful: boolean;
    whatChanged: string;
    interruptionCause: 'Planned' | 'External' | 'Barrier-Driven' | 'Priority-Driven' | 'Meaning-Driven';
    isPlanStillRealistic: boolean;
    restartStrategy: RestartStrategy;
    restartActionTitle: string;
    restartTargetDate: string;
  }) => void;

  isWeeklyReviewModalOpen: boolean;
  openWeeklyReviewModal: () => void;
  closeWeeklyReviewModal: () => void;
  isWeeklyReviewOpen: boolean;
  openWeeklyReview: () => void;
  closeWeeklyReview: () => void;
  submitWeeklyReview: (data: {
    meaningfulProgress: string;
    actionsThatMattered: string;
    whatGotInTheWay: string;
    interventionsThatHelped: string;
    interventionsThatDidNotHelp: string;
    interruptionExperienced: boolean;
    restartDetails?: string;
    aiSummaryDraft: string;
    aiSummaryConfirmed: boolean;
    lessonText: string;
    adjustmentText: string;
    nextNmaTitle: string;
  }) => void;

  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;

  // Actions on entities
  createGoal: (newGoal: Omit<Goal, 'id' | 'createdAt' | 'statusHistory' | 'isPrimary'>) => void;
  updateGoalStatus: (goalId: string, newStatus: GoalStatus, note?: string) => void;
  setPrimaryGoal: (goalId: string) => void;
  createMilestone: (goalId: string, title: string, targetDate: string) => void;
  toggleMilestone: (milestoneId: string) => void;
  createActionItem: (newAction: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  setAsNma: (actionId: string) => void;
  startAction: (actionId: string) => void;
  completeAction: (actionId: string) => void;
  rescheduleAction: (actionId: string, newDate: string) => void;
  applyIntervention: (actionId: string, interventionId: string) => void;
  toggleAcifCategory: (code: AcifCategoryCode) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;

  // Toasts & Demo Reset
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => void;
  logEvent: (eventType: AnalyticsEvent['eventType'], details?: Record<string, any>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [activeView, setActiveView] = useState<'today' | 'goals' | 'progress' | 'review'>('today');
  const [demoRole, setDemoRole] = useState<'user' | 'admin'>('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<typeof INITIAL_USER | null>(INITIAL_USER);

  // Entities loaded from localStorage or defaults
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [actions, setActions] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [acifCategories, setAcifCategories] = useState<AcifCategory[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_acif');
    return saved ? JSON.parse(saved) : ACIF_CATEGORIES;
  });

  const [interventions] = useState<InterventionDefinition[]>(APPROVED_INTERVENTIONS);

  const [lessons, setLessons] = useState<LessonRecord[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [restarts, setRestarts] = useState<RestartRecord[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_restarts');
    return saved ? JSON.parse(saved) : [];
  });

  const [barriers, setBarriers] = useState<BarrierRecord[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_barriers');
    return saved ? JSON.parse(saved) : INITIAL_BARRIERS;
  });

  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReviewRecord[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_reviews');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('sopet_momentum_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('sopet_momentum_analytics');
    return saved ? JSON.parse(saved) : INITIAL_ANALYTICS_EVENTS;
  });

  const [knowledgeBase] = useState<KnowledgeBaseEntry[]>(KNOWLEDGE_BASE_ENTRIES);
  const [promptTemplates] = useState<AiPromptTemplate[]>(INITIAL_PROMPT_TEMPLATES);

  // Modals state
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState<boolean>(false);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState<boolean>(false);
  const [readinessTargetActionId, setReadinessTargetActionId] = useState<string | null>(null);
  const [isBarrierReviewOpen, setIsBarrierReviewOpen] = useState<boolean>(false);
  const [barrierTargetActionId, setBarrierTargetActionId] = useState<string | null>(null);
  const [isMmaModalOpen, setIsMmaModalOpen] = useState<boolean>(false);
  const [mmaTargetActionId, setMmaTargetActionId] = useState<string | null>(null);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState<boolean>(false);
  const [restartTargetActionId, setRestartTargetActionId] = useState<string | null>(null);
  const [isWeeklyReviewModalOpen, setIsWeeklyReviewModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sopet_momentum_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_restarts', JSON.stringify(restarts));
  }, [restarts]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_reviews', JSON.stringify(weeklyReviews));
  }, [weeklyReviews]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_barriers', JSON.stringify(barriers));
  }, [barriers]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sopet_momentum_analytics', JSON.stringify(analyticsEvents));
  }, [analyticsEvents]);

  // Derived state
  const primaryGoal = goals.find(g => g.isPrimary) || goals[0];
  const activeNma = actions.find(a => a.isNMA && a.status !== 'Completed') || actions.find(a => a.isNMA);

  // Dynamic Momentum KPI Calculations
  const kpis: MomentumKpiSet = {
    actionCompletionRate: actions.length > 0
      ? Math.round((actions.filter(a => a.status === 'Completed').length / actions.length) * 100)
      : 75,
    continuityWeeks: Math.max(4, weeklyReviews.length + 2),
    momentumContinuityWeeks: Math.max(4, weeklyReviews.length + 2),
    restartSpeedDays: restarts.length > 0 ? 1.8 : 2.1,
    barrierResolutionRate: barriers.length > 0
      ? Math.round((barriers.filter(b => b.resolved).length / barriers.length) * 100)
      : 80,
    goalMilestoneProgress: milestones.length > 0
      ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
      : 33,
    milestoneProgressPercent: milestones.length > 0
      ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
      : 33,
    selfEfficacyScore: 4.2,
    selfEfficacyTrend: 'Increasing',
    totalActions: actions.length,
    completedActions: actions.filter(a => a.status === 'Completed').length,
    inProgressActions: actions.filter(a => a.status === 'In Progress').length,
    blockedActions: actions.filter(a => a.status === 'Blocked').length,
    totalBarriersDiagnosed: barriers.length,
    barriersResolved: barriers.filter(b => b.resolved).length,
    totalMilestones: milestones.length,
    completedMilestones: milestones.filter(m => m.completed).length,
  };

  // Pilot Cohort Participants for Admin / Analytics
  const pilotParticipants: PilotParticipant[] = [
    {
      id: 'part-1',
      name: 'Amina (Active User)',
      goalTitle: 'Start a catering business',
      status: 'Active',
      completedActionsCount: 12,
      weeksContinuity: 4,
      lastActiveDate: '2026-09-09',
    },
    {
      id: 'part-2',
      name: 'Marcus K.',
      goalTitle: 'Launch independent design studio',
      status: 'Active',
      completedActionsCount: 9,
      weeksContinuity: 3,
      lastActiveDate: '2026-09-08',
    },
    {
      id: 'part-3',
      name: 'Elena R.',
      goalTitle: 'Renewable energy micro-grid research',
      status: 'Active',
      completedActionsCount: 15,
      weeksContinuity: 5,
      lastActiveDate: '2026-09-09',
    },
    {
      id: 'part-4',
      name: 'Tariq M.',
      goalTitle: 'Community health outreach program',
      status: 'Paused',
      completedActionsCount: 6,
      weeksContinuity: 2,
      lastActiveDate: '2026-09-05',
    },
    {
      id: 'part-5',
      name: 'Sarah L.',
      goalTitle: 'Publish educational workbook',
      status: 'Active',
      completedActionsCount: 11,
      weeksContinuity: 4,
      lastActiveDate: '2026-09-08',
    },
  ];

  // Helper Toast
  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logEvent = (eventType: AnalyticsEvent['eventType'], details?: Record<string, any>) => {
    const newEvent: AnalyticsEvent = {
      id: 'evt-' + Date.now(),
      eventType,
      timestamp: new Date().toISOString(),
      details,
    };
    setAnalyticsEvents(prev => [newEvent, ...prev]);
  };

  // Auth Modal handlers
  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Onboarding handlers
  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);

  // Readiness handlers
  const openReadinessCheck = (actionId: string) => {
    setReadinessTargetActionId(actionId);
    setIsReadinessModalOpen(true);
  };
  const closeReadinessCheck = () => {
    setIsReadinessModalOpen(false);
    setReadinessTargetActionId(null);
  };
  const submitReadinessCheck = (
    actionId: string,
    answers: {
      q1Understand: boolean;
      q2KnowHow: boolean;
      q3HaveResources: boolean;
      q4PrerequisitesDone: boolean;
      q5NoResistance: boolean;
    },
    output: ReadinessOutput,
    notes?: string
  ) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            readinessCheck: {
              completedAt: new Date().toISOString(),
              ...answers,
              output,
              notes,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    closeReadinessCheck();
    showToast(`Action readiness checked: ${output}`, 'info');
  };

  // Barrier review handlers
  const openBarrierReview = (actionId: string) => {
    setBarrierTargetActionId(actionId);
    setIsBarrierReviewOpen(true);
  };
  const closeBarrierReview = () => {
    setIsBarrierReviewOpen(false);
    setBarrierTargetActionId(null);
  };
  const submitBarrierReview = (
    actionId: string,
    userExplanation: string,
    confirmedCategory: AcifCategoryCode,
    aiStatus: 'accepted' | 'edited' | 'rejected',
    secondaryCategory?: AcifCategoryCode
  ) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            status: 'Blocked' as ActionStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    const newBarrier: BarrierRecord = {
      id: 'barr-' + Date.now(),
      actionId,
      goalId: primaryGoal?.id || '',
      userExplanation,
      confirmedCategory,
      aiStatus,
      secondaryCategory,
      interventionApplied: 'Minimum Meaningful Action (MMA)',
      recordedAt: new Date().toISOString(),
      resolved: false,
    };
    setBarriers(prev => [newBarrier, ...prev]);

    logEvent('ACTION_BLOCKED', { actionId });
    logEvent('BARRIER_CONFIRMED', { category: confirmedCategory });
    if (aiStatus === 'accepted') logEvent('AI_SUGGESTION_CONFIRMED');
    if (aiStatus === 'rejected') logEvent('AI_SUGGESTION_REJECTED');
    if (aiStatus === 'edited') logEvent('AI_SUGGESTION_EDITED');

    showToast('Barrier recorded non-judgmentally. Next: Review recommended intervention.', 'info');
  };

  // MMA handlers
  const openMmaModal = (parentActionId: string) => {
    setMmaTargetActionId(parentActionId);
    setIsMmaModalOpen(true);
  };
  const closeMmaModal = () => {
    setIsMmaModalOpen(false);
    setMmaTargetActionId(null);
  };

  const createMMA = (parentActionId: string, mmaTitle: string, whyThisHelps: string) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === parentActionId) {
          return {
            ...a,
            mma: {
              id: 'mma-' + Date.now(),
              parentActionId,
              title: mmaTitle,
              whyThisHelps,
              completed: false,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    logEvent('MMA_CREATED', { parentActionId, mmaTitle });
    closeMmaModal();
    showToast('Minimum Meaningful Action (MMA) created and linked to parent action.', 'success');
  };

  const startMMA = (parentActionId: string) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === parentActionId && a.mma) {
          return {
            ...a,
            mma: {
              ...a.mma,
              startedAt: new Date().toISOString(),
            },
          };
        }
        return a;
      })
    );
    showToast('Minimum Meaningful Action started. Focus on this micro-step.', 'info');
  };

  const completeMMA = (parentActionId: string) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === parentActionId && a.mma) {
          return {
            ...a,
            mma: {
              ...a.mma,
              completed: true,
              completedAt: new Date().toISOString(),
            },
            // Note: Per methodology, completing MMA preserves progress but does NOT falsely complete Parent Action
            status: 'In Progress' as ActionStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    setBarriers(prev =>
      prev.map(b => (b.actionId === parentActionId ? { ...b, resolved: true } : b))
    );
    logEvent('MMA_COMPLETED', { parentActionId });
    showToast('MMA Completed! Meaningful momentum restored. Return to Parent Action.', 'success');
  };

  // Restart Handlers
  const openRestartModal = (interruptedActionId?: string) => {
    setRestartTargetActionId(interruptedActionId || null);
    setIsRestartModalOpen(true);
  };
  const closeRestartModal = () => {
    setIsRestartModalOpen(false);
    setRestartTargetActionId(null);
  };
  const submitRestartReview = (data: {
    isGoalStillMeaningful: boolean;
    whatChanged: string;
    interruptionCause: 'Planned' | 'External' | 'Barrier-Driven' | 'Priority-Driven' | 'Meaning-Driven';
    isPlanStillRealistic: boolean;
    restartStrategy: RestartStrategy;
    restartActionTitle: string;
    restartTargetDate: string;
  }) => {
    if (!primaryGoal) return;
    const newRestart: RestartRecord = {
      id: 'rst-' + Date.now(),
      goalId: primaryGoal.id,
      interruptedActionId: restartTargetActionId || undefined,
      declaredAt: new Date().toISOString(),
      ...data,
    };
    setRestarts(prev => [newRestart, ...prev]);

    // Handle strategy effects
    if (data.restartStrategy === 'Pause Goal') {
      updateGoalStatus(primaryGoal.id, 'Paused', 'Paused following Intelligent Restart Review');
    } else {
      // Create new Restart Action as NMA
      const newAction: ActionItem = {
        id: 'act-' + Date.now(),
        goalId: primaryGoal.id,
        title: data.restartActionTitle,
        description: `Restart action established following ${data.interruptionCause.toLowerCase()} interruption review.`,
        isNMA: true,
        status: 'Not Started',
        dueDate: data.restartTargetDate,
        rhythm: 'Daily',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Unset previous NMAs
      setActions(prev => [
        newAction,
        ...prev.map(a => (a.goalId === primaryGoal.id ? { ...a, isNMA: false } : a)),
      ]);

      logEvent('GOAL_RESTARTED', { strategy: data.restartStrategy, action: data.restartActionTitle });
    }

    closeRestartModal();
    setActiveView('today');
    showToast(`Intelligent Restart recorded (${data.restartStrategy}). Returned to Today's Focus.`, 'success');
  };

  // Weekly Review Handlers
  const openWeeklyReviewModal = () => setIsWeeklyReviewModalOpen(true);
  const closeWeeklyReviewModal = () => setIsWeeklyReviewModalOpen(false);
  const submitWeeklyReview = (data: {
    meaningfulProgress: string;
    actionsThatMattered: string;
    whatGotInTheWay: string;
    interventionsThatHelped: string;
    interventionsThatDidNotHelp: string;
    interruptionExperienced: boolean;
    restartDetails?: string;
    aiSummaryDraft: string;
    aiSummaryConfirmed: boolean;
    lessonText: string;
    adjustmentText: string;
    nextNmaTitle: string;
  }) => {
    const reviewRecord: WeeklyReviewRecord = {
      id: 'rev-' + Date.now(),
      weekEndingDate: new Date().toISOString().split('T')[0],
      ...data,
      createdAt: new Date().toISOString(),
    };
    setWeeklyReviews(prev => [reviewRecord, ...prev]);

    // Create Lesson if provided
    if (data.lessonText && primaryGoal) {
      const newLesson: LessonRecord = {
        id: 'les-' + Date.now(),
        goalId: primaryGoal.id,
        goalTitle: primaryGoal.title,
        date: new Date().toISOString().split('T')[0],
        lesson: data.lessonText,
        adjustmentMade: data.adjustmentText,
      };
      setLessons(prev => [newLesson, ...prev]);
      logEvent('LESSON_CREATED', { goalId: primaryGoal.id });
    }

    // Set Next NMA if specified
    if (data.nextNmaTitle && primaryGoal) {
      const newAction: ActionItem = {
        id: 'act-' + Date.now(),
        goalId: primaryGoal.id,
        title: data.nextNmaTitle,
        isNMA: true,
        status: 'Not Started',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        rhythm: 'Three times weekly',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActions(prev => [
        newAction,
        ...prev.map(a => (a.goalId === primaryGoal.id ? { ...a, isNMA: false } : a)),
      ]);
    }

    logEvent('REVIEW_COMPLETED');
    closeWeeklyReviewModal();
    showToast('Weekly Review completed. Personal Lesson and next NMA recorded.', 'success');
  };

  // Entity operations
  const createGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'statusHistory' | 'isPrimary'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: 'goal-' + Date.now(),
      isPrimary: goals.length === 0,
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: newGoalData.status,
          timestamp: new Date().toISOString(),
          note: 'Goal created',
        },
      ],
    };
    setGoals(prev => [...prev, newGoal]);
    setSelectedGoalId(newGoal.id);
    logEvent('GOAL_CREATED', { title: newGoal.title, category: newGoal.category });
    setIsCreateGoalOpen(false);
    showToast(`Meaningful Goal "${newGoal.title}" created.`, 'success');
  };

  const updateGoalStatus = (goalId: string, newStatus: GoalStatus, note?: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            status: newStatus,
            statusHistory: [
              ...g.statusHistory,
              { status: newStatus, timestamp: new Date().toISOString(), note },
            ],
          };
        }
        return g;
      })
    );
    showToast(`Goal status updated to ${newStatus}.`, 'info');
  };

  const setPrimaryGoal = (goalId: string) => {
    setGoals(prev =>
      prev.map(g => ({
        ...g,
        isPrimary: g.id === goalId,
      }))
    );
    showToast('Primary focus Goal updated.', 'info');
  };

  const createMilestone = (goalId: string, title: string, targetDate: string) => {
    const count = milestones.filter(m => m.goalId === goalId).length;
    const newMilestone: Milestone = {
      id: 'mile-' + Date.now(),
      goalId,
      title,
      targetDate,
      completed: false,
      order: count + 1,
    };
    setMilestones(prev => [...prev, newMilestone]);
    logEvent('MILESTONE_CREATED', { goalId, title });
    showToast(`Milestone "${title}" added.`, 'success');
  };

  const toggleMilestone = (milestoneId: string) => {
    setMilestones(prev =>
      prev.map(m => (m.id === milestoneId ? { ...m, completed: !m.completed } : m))
    );
  };

  const createActionItem = (newActionData: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: ActionItem = {
      ...newActionData,
      id: 'act-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newAction.isNMA) {
      // Unset previous NMAs for this goal
      setActions(prev => [
        newAction,
        ...prev.map(a => (a.goalId === newAction.goalId ? { ...a, isNMA: false } : a)),
      ]);
    } else {
      setActions(prev => [newAction, ...prev]);
    }

    logEvent('ACTION_CREATED', { isNMA: newAction.isNMA, title: newAction.title });
    showToast(`Action "${newAction.title}" created.`, 'success');
  };

  const setAsNma = (actionId: string) => {
    const target = actions.find(a => a.id === actionId);
    if (!target) return;
    setActions(prev =>
      prev.map(a => {
        if (a.goalId === target.goalId) {
          return {
            ...a,
            isNMA: a.id === actionId,
          };
        }
        return a;
      })
    );
    showToast(`"${target.title}" is now the active Next Meaningful Action (NMA).`, 'info');
  };

  const startAction = (actionId: string) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            status: 'In Progress' as ActionStatus,
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    logEvent('ACTION_STARTED', { actionId });
    showToast('Action started! Focus on completing this single step.', 'info');
  };

  const completeAction = (actionId: string) => {
    const target = actions.find(a => a.id === actionId);
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            status: 'Completed' as ActionStatus,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    // If goal has KPI, advance it
    if (target && target.goalId) {
      setGoals(prev =>
        prev.map(g => {
          if (g.id === target.goalId && g.kpi) {
            return {
              ...g,
              kpi: {
                ...g.kpi,
                currentValue: Math.min(g.kpi.targetValue, g.kpi.currentValue + 1),
              },
            };
          }
          return g;
        })
      );
      logEvent('KPI_UPDATED', { goalId: target.goalId });
    }

    setBarriers(prev =>
      prev.map(b => (b.actionId === actionId ? { ...b, resolved: true } : b))
    );

    logEvent('ACTION_COMPLETED', { actionId });
    showToast('Meaningful Action Completed! Ready to choose the next NMA.', 'success');
  };

  const rescheduleAction = (actionId: string, newDate: string) => {
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            dueDate: newDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    showToast('Action date rescheduled.', 'info');
  };

  const applyIntervention = (actionId: string, interventionId: string) => {
    const targetIntervention = interventions.find(i => i.id === interventionId);
    if (!targetIntervention) return;

    if (targetIntervention.suggestedActionType === 'mma') {
      openMmaModal(actionId);
    } else {
      showToast(`Applied intervention: ${targetIntervention.title}`, 'success');
    }
    logEvent('INTERVENTION_SELECTED', { actionId, interventionId });
  };

  const toggleAcifCategory = (code: AcifCategoryCode) => {
    setAcifCategories(prev =>
      prev.map(c => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showToast('ACIF taxonomy status updated in prototype.', 'info');
  };

  const updateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...settings }));
    showToast('Notification preferences updated.', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem('sopet_momentum_goals');
    localStorage.removeItem('sopet_momentum_milestones');
    localStorage.removeItem('sopet_momentum_actions');
    localStorage.removeItem('sopet_momentum_acif');
    localStorage.removeItem('sopet_momentum_lessons');
    localStorage.removeItem('sopet_momentum_restarts');
    localStorage.removeItem('sopet_momentum_barriers');
    localStorage.removeItem('sopet_momentum_reviews');
    localStorage.removeItem('sopet_momentum_notifications');
    localStorage.removeItem('sopet_momentum_analytics');

    setGoals(INITIAL_GOALS);
    setMilestones(INITIAL_MILESTONES);
    setActions(INITIAL_ACTIONS);
    setAcifCategories(ACIF_CATEGORIES);
    setLessons(INITIAL_LESSONS);
    setRestarts([]);
    setBarriers(INITIAL_BARRIERS);
    setWeeklyReviews(INITIAL_WEEKLY_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnalyticsEvents(INITIAL_ANALYTICS_EVENTS);
    setSelectedGoalId(null);
    setActiveView('today');
    showToast('Demo data reset to initial pilot state (Amina).', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        demoRole,
        setDemoRole,
        activeRole: demoRole,
        setActiveRole: setDemoRole,
        isAuthenticated,
        setIsAuthenticated,
        user,

        goals,
        milestones,
        actions,
        acifCategories,
        interventions,
        lessons,
        restarts,
        barriers,
        weeklyReviews,
        kpis,
        pilotParticipants,
        notifications,
        analyticsEvents,
        knowledgeBase,
        promptTemplates,

        primaryGoal,
        activeNma,
        selectedGoalId,
        setSelectedGoalId,

        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,

        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,

        isCreateGoalOpen,
        setIsCreateGoalOpen,

        isReadinessModalOpen,
        readinessTargetActionId,
        openReadinessCheck,
        closeReadinessCheck,
        submitReadinessCheck,

        isBarrierReviewOpen,
        barrierTargetActionId,
        openBarrierReview,
        closeBarrierReview,
        submitBarrierReview,

        isMmaModalOpen,
        mmaTargetActionId,
        openMmaModal,
        closeMmaModal,
        createMMA,
        startMMA,
        completeMMA,

        isRestartModalOpen,
        openRestartModal,
        closeRestartModal,
        submitRestartReview,

        isWeeklyReviewModalOpen,
        openWeeklyReviewModal,
        closeWeeklyReviewModal,
        isWeeklyReviewOpen: isWeeklyReviewModalOpen,
        openWeeklyReview: openWeeklyReviewModal,
        closeWeeklyReview: closeWeeklyReviewModal,
        submitWeeklyReview,

        isSettingsModalOpen,
        setIsSettingsModalOpen,

        createGoal,
        updateGoalStatus,
        setPrimaryGoal,
        createMilestone,
        toggleMilestone,
        createActionItem,
        setAsNma,
        startAction,
        completeAction,
        rescheduleAction,
        applyIntervention,
        toggleAcifCategory,
        updateNotifications,

        toasts,
        showToast,
        dismissToast,
        resetDemoData,
        logEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
