export type GoalStatus = 'Active' | 'Paused' | 'Completed' | 'Draft';

export type GoalCategory = 
  | 'Business & Entrepreneurship'
  | 'Professional Development'
  | 'Academic & Learning'
  | 'Creative & Writing'
  | 'Health & Well-being'
  | 'Personal Life';

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetDate: string;
  completed: boolean;
  order: number;
}

export type ActionStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Blocked'
  | 'Missed'
  | 'Interrupted'
  | 'Restarted';

export type ActionRhythm = 'Daily' | 'Three times weekly' | 'Weekly' | 'Milestone-based';

export interface MMA {
  id: string;
  parentActionId: string;
  title: string;
  whyThisHelps: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface ActionItem {
  id: string;
  goalId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  isNMA: boolean;
  status: ActionStatus;
  dueDate: string;
  rhythm: ActionRhythm;
  readinessCheck?: ReadinessCheckResult;
  mma?: MMA;
  barrierId?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface StatusHistoryEntry {
  status: GoalStatus | ActionStatus;
  timestamp: string;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Standard';
  whyThisMatters: string;
  status: GoalStatus;
  statusHistory: StatusHistoryEntry[];
  isPrimary: boolean;
  kpi?: {
    name: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  };
  createdAt: string;
  nextReviewDate: string;
}

export type ReadinessOutput = 
  | 'Ready'
  | 'Needs Clarification'
  | 'Capability Concern'
  | 'Resource Concern'
  | 'Dependency Concern'
  | 'Internal Resistance';

export interface ReadinessCheckResult {
  completedAt: string;
  q1Understand: boolean;
  q2KnowHow: boolean;
  q3HaveResources: boolean;
  q4PrerequisitesDone: boolean;
  q5NoResistance: boolean;
  output: ReadinessOutput;
  notes?: string;
}

export type AcifCategoryCode = 
  | 'unclear_next_step'
  | 'capability_gap'
  | 'resource_gap'
  | 'dependency'
  | 'overwhelm'
  | 'self_doubt'
  | 'fear_resistance'
  | 'perfectionism'
  | 'low_motivation'
  | 'priority_conflict'
  | 'environmental_barrier'
  | 'meaning_direction'
  | 'other_unsure';

export interface AcifCategory {
  code: AcifCategoryCode;
  number: number;
  name: string;
  nonJudgmentalDescription: string;
  defaultIntervention: string;
  whyThisHelps: string;
  active: boolean;
  version: string;
}

export interface BarrierRecord {
  id: string;
  actionId: string;
  goalId: string;
  userExplanation: string;
  aiSuggestedCategory?: AcifCategoryCode;
  aiExplanation?: string;
  aiStatus?: 'accepted' | 'edited' | 'rejected' | 'pending';
  confirmedCategory: AcifCategoryCode;
  secondaryCategory?: AcifCategoryCode;
  interventionApplied?: string;
  mmaCreated?: boolean;
  recordedAt: string;
  resolved: boolean;
}

export interface InterventionDefinition {
  id: string;
  barrierCode: AcifCategoryCode;
  title: string;
  summary: string;
  suggestedActionType: 'clarification' | 'learning' | 'resource' | 'prerequisite' | 'mma' | 'evidence_review' | 'reprioritize';
  safetyLevel: 'Standard' | 'Elevated' | 'Guidance';
  language: string;
  version: string;
  status: 'Approved' | 'Review' | 'Draft';
  exampleMMA?: string;
}

export type RestartStrategy = 
  | 'Resume'
  | 'Adjust'
  | 'Reduce Action'
  | 'Change NMA'
  | 'Pause Goal'
  | 'Strategically Discontinue';

export interface RestartRecord {
  id: string;
  goalId: string;
  interruptedActionId?: string;
  declaredAt: string;
  isGoalStillMeaningful: boolean;
  whatChanged: string;
  interruptionCause: 'Planned' | 'External' | 'Barrier-Driven' | 'Priority-Driven' | 'Meaning-Driven';
  isPlanStillRealistic: boolean;
  restartStrategy: RestartStrategy;
  restartActionTitle: string;
  restartTargetDate: string;
}

export interface MomentumKpiSet {
  actionCompletionRate: number;
  continuityWeeks: number;
  momentumContinuityWeeks: number;
  restartSpeedDays: number;
  barrierResolutionRate: number;
  goalMilestoneProgress: number;
  milestoneProgressPercent: number;
  selfEfficacyScore: number;
  selfEfficacyTrend: 'Increasing' | 'Stable' | 'Recovering';
  totalActions: number;
  completedActions: number;
  inProgressActions: number;
  blockedActions: number;
  totalBarriersDiagnosed: number;
  barriersResolved: number;
  totalMilestones: number;
  completedMilestones: number;
}

export interface PilotParticipant {
  id: string;
  name: string;
  goalTitle: string;
  status: 'Active' | 'Paused' | 'Completed';
  completedActionsCount: number;
  weeksContinuity: number;
  lastActiveDate: string;
}

export interface WeeklyReviewRecord {
  id: string;
  weekEndingDate: string;
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
  createdAt: string;
}

export interface LessonRecord {
  id: string;
  goalId: string;
  goalTitle: string;
  date: string;
  lesson: string;
  adjustmentMade: string;
  relatedBarrierCode?: AcifCategoryCode;
}

export interface NotificationSettings {
  currentNmaReminders: boolean;
  nmaFrequency: 'Daily' | 'Action Days Only' | 'Gentle (2x/week)';
  dueActionReminders: boolean;
  dueActionFrequency: 'Same Day' | '1 Day Before';
  weeklyReviewReminders: boolean;
  weeklyReviewDay: 'Friday' | 'Sunday' | 'Monday';
  restartReminders: boolean;
  restartIntervalDays: number;
  notificationFatigueControl: boolean;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 
    | 'USER_REGISTERED'
    | 'GOAL_CREATED'
    | 'GOAL_ACTIVATED'
    | 'MILESTONE_CREATED'
    | 'ACTION_CREATED'
    | 'ACTION_STARTED'
    | 'ACTION_COMPLETED'
    | 'ACTION_BLOCKED'
    | 'BARRIER_SELECTED'
    | 'BARRIER_CONFIRMED'
    | 'INTERVENTION_SELECTED'
    | 'MMA_CREATED'
    | 'MMA_COMPLETED'
    | 'INTERRUPTION_DETECTED'
    | 'ACTION_RESTARTED'
    | 'GOAL_RESTARTED'
    | 'KPI_UPDATED'
    | 'REVIEW_COMPLETED'
    | 'LESSON_CREATED'
    | 'AI_SUGGESTION_CONFIRMED'
    | 'AI_SUGGESTION_REJECTED'
    | 'AI_SUGGESTION_EDITED';
  timestamp: string;
  details?: Record<string, any>;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  barrierCode: AcifCategoryCode;
  definition: string;
  discriminatingQuestions: string[];
  approvedInterventions: string[];
  nmaExamples: string[];
  mmaExamples: string[];
  warnings: string;
  safetyLevel: 'Standard' | 'Elevated';
  version: string;
  lastReviewed: string;
}

export interface AiPromptTemplate {
  id: string;
  context: 'Goal Clarification' | 'Barrier Suggestion' | 'MMA Recommendation' | 'Restart Planning' | 'Weekly Review Summary';
  version: string;
  status: 'Active' | 'Staged';
  systemInstructions: string;
  lastUpdated: string;
}
