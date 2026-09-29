import {
  Goal,
  Milestone,
  ActionItem,
  AcifCategory,
  InterventionDefinition,
  KnowledgeBaseEntry,
  AiPromptTemplate,
  LessonRecord,
  NotificationSettings,
  AnalyticsEvent,
  BarrierRecord,
  WeeklyReviewRecord
} from '../types';

export const INITIAL_USER = {
  name: 'Amina',
  email: 'amina.pilot@acosedutech.org',
  role: 'Pilot Participant',
  organization: 'ACoS EduTech and Consultancy',
  program: 'SOPET Momentum Manual Pilot — Version 1.0',
  cohort: 'Founder & Entrepreneur Cohort',
  joinedDate: '2026-08-15',
};

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-catering-1',
    title: 'Start a catering business',
    description: 'Launch a boutique event catering service focusing on regional fusion corporate lunches and social celebrations.',
    category: 'Business & Entrepreneurship',
    targetDate: '2026-11-30',
    priority: 'High',
    whyThisMatters: 'Building financial autonomy for my family and utilizing my professional culinary expertise to serve corporate clients and community gatherings.',
    status: 'Active',
    isPrimary: true,
    statusHistory: [
      { status: 'Draft', timestamp: '2026-08-15T09:00:00Z', note: 'Created during lightweight onboarding' },
      { status: 'Active', timestamp: '2026-08-15T09:15:00Z', note: 'Activated as primary focus Goal' }
    ],
    kpi: {
      name: 'Customer Discovery Interviews',
      currentValue: 2,
      targetValue: 5,
      unit: 'interviews completed'
    },
    createdAt: '2026-08-15T09:00:00Z',
    nextReviewDate: '2026-09-14',
  },
  {
    id: 'goal-proposal-2',
    title: 'Complete community culinary grant proposal',
    description: 'Submit an application for the regional artisanal food initiative funding to secure initial commercial kitchen space.',
    category: 'Business & Entrepreneurship',
    targetDate: '2026-10-15',
    priority: 'Medium',
    whyThisMatters: 'Securing seed capital without taking on high-interest commercial debt.',
    status: 'Active',
    isPrimary: false,
    statusHistory: [
      { status: 'Active', timestamp: '2026-08-20T11:00:00Z', note: 'Added as secondary milestone project' }
    ],
    createdAt: '2026-08-20T11:00:00Z',
    nextReviewDate: '2026-09-18',
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'mile-1',
    goalId: 'goal-catering-1',
    title: 'Validate customer demand',
    targetDate: '2026-09-25',
    completed: false,
    order: 1,
  },
  {
    id: 'mile-2',
    goalId: 'goal-catering-1',
    title: 'Finalize initial core menu & pricing structure',
    targetDate: '2026-10-10',
    completed: false,
    order: 2,
  },
  {
    id: 'mile-3',
    goalId: 'goal-catering-1',
    title: 'Acquire health certification & mobile catering permit',
    targetDate: '2026-11-05',
    completed: false,
    order: 3,
  }
];

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: 'act-nma-1',
    goalId: 'goal-catering-1',
    milestoneId: 'mile-1',
    title: 'Interview five potential customers about preferred products and pricing',
    description: 'Conduct structured 15-minute phone or in-person discovery chats with corporate event planners and small office coordinators.',
    isNMA: true,
    status: 'In Progress',
    dueDate: '2026-09-12',
    rhythm: 'Three times weekly',
    readinessCheck: {
      completedAt: '2026-09-08T10:00:00Z',
      q1Understand: true,
      q2KnowHow: true,
      q3HaveResources: true,
      q4PrerequisitesDone: true,
      q5NoResistance: true,
      output: 'Ready',
      notes: 'Questionnaire guide is printed and 3 contacts have agreed to brief calls.'
    },
    createdAt: '2026-08-16T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
    startedAt: '2026-09-08T10:05:00Z',
  },
  {
    id: 'act-parent-proposal',
    goalId: 'goal-proposal-2',
    title: 'Write full business proposal',
    description: 'Complete all 6 sections of the regional grant application including budget, target demographic, and culinary sustainability.',
    isNMA: false,
    status: 'Blocked',
    dueDate: '2026-09-16',
    rhythm: 'Weekly',
    mma: {
      id: 'mma-1',
      parentActionId: 'act-parent-proposal',
      title: 'Draft the problem statement',
      whyThisHelps: 'Writing just the 2-paragraph problem statement breaks the initial blank-page overwhelm without taking on the entire 15-page document.',
      completed: false,
      startedAt: '2026-09-09T14:30:00Z',
    },
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-09-09T14:30:00Z',
  },
  {
    id: 'act-pricing-sheet',
    goalId: 'goal-catering-1',
    milestoneId: 'mile-2',
    title: 'Calculate initial ingredient and equipment cost estimate',
    description: 'Compile local supplier prices for bulk grains, organic vegetables, and specialized serving containers.',
    isNMA: false,
    status: 'Not Started',
    dueDate: '2026-09-20',
    rhythm: 'Weekly',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
  }
];

export const ACIF_CATEGORIES: AcifCategory[] = [
  {
    code: 'unclear_next_step',
    number: 1,
    name: 'Unclear Next Step',
    nonJudgmentalDescription: 'The exact concrete physical or procedural step is ambiguous or not yet decomposed.',
    defaultIntervention: 'Clarify the Action into a single, concrete, observable behavior.',
    whyThisHelps: 'Ambiguity triggers cognitive postponement. A concrete first micro-step restores clarity.',
    active: true,
    version: '1.2'
  },
  {
    code: 'capability_gap',
    number: 2,
    name: 'Capability Gap',
    nonJudgmentalDescription: 'The required skill, knowledge, or technical execution method is unfamiliar or missing.',
    defaultIntervention: 'Identify targeted learning, consultation, or assistance before attempting execution.',
    whyThisHelps: 'Prevents frustrating trial-and-error by acquiring the specific knowledge module needed.',
    active: true,
    version: '1.2'
  },
  {
    code: 'resource_gap',
    number: 3,
    name: 'Resource Gap',
    nonJudgmentalDescription: 'A necessary tool, material, funding, equipment, or credential is not currently accessible.',
    defaultIntervention: 'Create a resource-acquisition step or identify an alternative available tool.',
    whyThisHelps: 'Isolates the physical blocker instead of perceiving the execution as personal failure.',
    active: true,
    version: '1.2'
  },
  {
    code: 'dependency',
    number: 4,
    name: 'Dependency',
    nonJudgmentalDescription: 'Progress depends on an external response, approval, or delivery that has not arrived.',
    defaultIntervention: 'Address the prerequisite: follow up with stakeholder, reassign, or work on a parallel track.',
    whyThisHelps: 'Distinguishes internal agency from external bottlenecks and prevents passive waiting.',
    active: true,
    version: '1.2'
  },
  {
    code: 'overwhelm',
    number: 5,
    name: 'Overwhelm',
    nonJudgmentalDescription: 'The scale, volume, or perceived complexity of the task feels too vast to begin directly.',
    defaultIntervention: 'Create a Minimum Meaningful Action (MMA) to preserve momentum without cognitive fatigue.',
    whyThisHelps: 'Shrinks activation energy to a tiny, non-threatening step while staying connected to the goal.',
    active: true,
    version: '1.2'
  },
  {
    code: 'self_doubt',
    number: 6,
    name: 'Self-Doubt',
    nonJudgmentalDescription: 'Uncertainty regarding personal ability, imposter feelings, or anticipating criticism.',
    defaultIntervention: 'Review objective past evidence and reduce first-step exposure/risk.',
    whyThisHelps: 'Lowers psychological stakes and replaces speculative self-assessment with low-risk testing.',
    active: true,
    version: '1.2'
  },
  {
    code: 'fear_resistance',
    number: 7,
    name: 'Fear / Emotional Resistance',
    nonJudgmentalDescription: 'Visceral discomfort, fear of rejection, awkwardness, or anxiety associated with the action.',
    defaultIntervention: 'Acknowledge the emotional response non-judgmentally and conduct a low-exposure trial.',
    whyThisHelps: 'Normalizes apprehension as an expected part of growth rather than a signal to quit.',
    active: true,
    version: '1.2'
  },
  {
    code: 'perfectionism',
    number: 8,
    name: 'Perfectionism',
    nonJudgmentalDescription: 'Unrealistic internal standards requiring flawless execution before anything can be shared or finished.',
    defaultIntervention: 'Define a "good enough for this stage" threshold (e.g., rough draft or provisional sketch).',
    whyThisHelps: 'Shifts focus from perfection to iteration and learning through rapid feedback.',
    active: true,
    version: '1.2'
  },
  {
    code: 'low_motivation',
    number: 9,
    name: 'Low Motivation',
    nonJudgmentalDescription: 'Low emotional energy, fatigue, or disconnection from the immediate purpose.',
    defaultIntervention: 'Revisit "Why This Matters" or pair action with a favorable environmental cue.',
    whyThisHelps: 'Restores personal relevance or lowers friction without relying on willpower alone.',
    active: true,
    version: '1.2'
  },
  {
    code: 'priority_conflict',
    number: 10,
    name: 'Priority Conflict',
    nonJudgmentalDescription: 'Competing urgent responsibilities, family demands, or unexpected tasks crowded out this action.',
    defaultIntervention: 'Reprioritize intentionally and schedule a protected execution window.',
    whyThisHelps: 'Replaces guilty avoidance with conscious time allocation and realistic boundary setting.',
    active: true,
    version: '1.2'
  },
  {
    code: 'environmental_barrier',
    number: 11,
    name: 'Environmental Barrier',
    nonJudgmentalDescription: 'Noise, physical disruption, poor workspace, connectivity loss, or chaotic surroundings.',
    defaultIntervention: 'Adjust physical location, eliminate immediate distractors, or alter time of execution.',
    whyThisHelps: 'Removes structural friction in the immediate setting.',
    active: true,
    version: '1.2'
  },
  {
    code: 'meaning_direction',
    number: 12,
    name: 'Meaning / Direction Concern',
    nonJudgmentalDescription: 'Doubt about whether this Goal or Action is truly the right path or still meaningful.',
    defaultIntervention: 'Conduct an Intelligent Restart Review to check Goal relevance before forcing action.',
    whyThisHelps: 'Protects the user from grinding on obsolete or misaligned intentions.',
    active: true,
    version: '1.2'
  },
  {
    code: 'other_unsure',
    number: 13,
    name: 'Other / Unsure',
    nonJudgmentalDescription: 'The blockage is unclear, multi-factorial, or does not clearly match known categories.',
    defaultIntervention: 'Explore through open reflection with the facilitator or contextual coach.',
    whyThisHelps: 'Allows unhurried diagnostic clarity without forcing a premature label.',
    active: true,
    version: '1.2'
  }
];

export const APPROVED_INTERVENTIONS: InterventionDefinition[] = [
  {
    id: 'int-overwhelm-mma',
    barrierCode: 'overwhelm',
    title: 'Create a Minimum Meaningful Action (MMA)',
    summary: 'Identify the smallest practical micro-step that preserves forward momentum while relieving cognitive strain.',
    suggestedActionType: 'mma',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.3',
    status: 'Approved',
    exampleMMA: 'Draft the problem statement (for proposal) or outline 3 bullet questions (for interview).'
  },
  {
    id: 'int-clarity-step',
    barrierCode: 'unclear_next_step',
    title: 'Clarify the Physical Action',
    summary: 'Translate the general intention into an observable physical verb (e.g. "Open document and type 3 lines" rather than "Work on proposal").',
    suggestedActionType: 'clarification',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.2',
    status: 'Approved'
  },
  {
    id: 'int-capability-learn',
    barrierCode: 'capability_gap',
    title: 'Targeted Assistance or Micro-Skill Acquisition',
    summary: 'Identify one 15-minute tutorial, ask a peer or mentor for a template, or delegate the specialized step.',
    suggestedActionType: 'learning',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.1',
    status: 'Approved'
  },
  {
    id: 'int-resource-acquire',
    barrierCode: 'resource_gap',
    title: 'Resource Sourcing Step',
    summary: 'Convert the missing item into an explicit prerequisite action (e.g., "Request access permit" or "Borrow audio recorder").',
    suggestedActionType: 'resource',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.1',
    status: 'Approved'
  },
  {
    id: 'int-dependency-unblock',
    barrierCode: 'dependency',
    title: 'Address External Prerequisite',
    summary: 'Follow up on the pending stakeholder deliverable or pivot to an unblocked parallel action.',
    suggestedActionType: 'prerequisite',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.1',
    status: 'Approved'
  },
  {
    id: 'int-self-doubt-evidence',
    barrierCode: 'self_doubt',
    title: 'Evidence Review & Low-Risk Exposure',
    summary: 'Review past completed milestones and test the action in a confidential, safe low-stakes environment.',
    suggestedActionType: 'evidence_review',
    safetyLevel: 'Guidance',
    language: 'en',
    version: '1.2',
    status: 'Approved'
  },
  {
    id: 'int-priority-rebalance',
    barrierCode: 'priority_conflict',
    title: 'Conscious Calendar Protected Slot',
    summary: 'Acknowledge competing priorities and explicitly schedule a non-negotiable 30-minute appointment with yourself.',
    suggestedActionType: 'reprioritize',
    safetyLevel: 'Standard',
    language: 'en',
    version: '1.1',
    status: 'Approved'
  }
];

export const INITIAL_LESSONS: LessonRecord[] = [
  {
    id: 'les-1',
    goalId: 'goal-catering-1',
    goalTitle: 'Start a catering business',
    date: '2026-08-30',
    lesson: 'I delay large tasks when I cannot see the first concrete step. Breaking the work into one specific Action helps me begin.',
    adjustmentMade: 'Always write NMAs using direct physical verbs (e.g. "Draft 5 questionnaire bullets") rather than project titles.',
    relatedBarrierCode: 'unclear_next_step'
  },
  {
    id: 'les-2',
    goalId: 'goal-catering-1',
    goalTitle: 'Start a catering business',
    date: '2026-09-06',
    lesson: 'Attempting 5 interviews in a single afternoon felt overwhelming. Spacing them as 1 or 2 per day preserved focus and quality.',
    adjustmentMade: 'Switched Action rhythm from single-day blitz to Three times weekly.',
    relatedBarrierCode: 'overwhelm'
  }
];

export const KNOWLEDGE_BASE_ENTRIES: KnowledgeBaseEntry[] = [
  {
    id: 'kb-overwhelm',
    title: 'Overwhelm in Developmental Progress',
    barrierCode: 'overwhelm',
    definition: 'A state where the scope or cognitive load of an action exceeds the user\'s immediate activation capacity, creating paralysis.',
    discriminatingQuestions: [
      'Does the task involve multiple unsequenced sub-steps?',
      'Does the thought of starting induce physical tension or a desire to escape to trivial tasks?',
      'Is the action description longer than a single observable behavior?'
    ],
    approvedInterventions: [
      'Minimum Meaningful Action (MMA)',
      'Timeboxed 10-minute discovery draft',
      'Step-sequencing worksheet'
    ],
    nmaExamples: [
      'Draft the problem statement (Parent: Write full grant proposal)',
      'List 3 contact names on scratchpad (Parent: Outreach campaign)'
    ],
    mmaExamples: [
      'Write the first 2 sentences of the executive summary.',
      'Open the kitchen rental portal and note the contact phone number.'
    ],
    warnings: 'MMA must not become an endless stream of trivial tasks that avoids genuine progress. Once started, prompt return to parent action.',
    safetyLevel: 'Standard',
    version: '1.2',
    lastReviewed: '2026-08-28'
  },
  {
    id: 'kb-self-doubt',
    title: 'Self-Doubt & Developmental Hesitation',
    barrierCode: 'self_doubt',
    definition: 'Internal apprehension questioning capability or legitimacy despite possessing foundational skills.',
    discriminatingQuestions: [
      'Does the user feel qualified on paper but hesitant to expose work?',
      'Is there fear of external negative critique?'
    ],
    approvedInterventions: [
      'Review evidence from past validated accomplishments',
      'Confidential dry run with friendly peer'
    ],
    nmaExamples: [
      'Show 1 page draft to close mentor for feedback.'
    ],
    mmaExamples: [
      'Read past positive feedback note from previous client.'
    ],
    warnings: 'Do NOT provide clinical psychotherapy or clinical diagnostic assertions. Frame purely as normal execution apprehension.',
    safetyLevel: 'Elevated',
    version: '1.1',
    lastReviewed: '2026-08-20'
  }
];

export const INITIAL_PROMPT_TEMPLATES: AiPromptTemplate[] = [
  {
    id: 'prompt-goal-clarify',
    context: 'Goal Clarification',
    version: 'v2.1-prod',
    status: 'Active',
    systemInstructions: 'Assist the user in refining their goal into a clear, personally meaningful statement. Ensure "Why This Matters" addresses real personal or financial significance. Never use clinical terms or promise guaranteed success.',
    lastUpdated: '2026-08-15'
  },
  {
    id: 'prompt-barrier-suggest',
    context: 'Barrier Suggestion',
    version: 'v3.0-prod',
    status: 'Active',
    systemInstructions: 'Analyze user free-text describing why an action was blocked. Match to one of the 13 ACIF categories. Strictly frame as provisional guidance. Format as "AI Suggestion — please confirm". Never diagnose mental illness.',
    lastUpdated: '2026-09-01'
  },
  {
    id: 'prompt-mma-rec',
    context: 'MMA Recommendation',
    version: 'v1.4-prod',
    status: 'Active',
    systemInstructions: 'Suggest a Minimum Meaningful Action that is small enough to overcome activation resistance but meaningful enough to preserve forward progress. Keep strictly connected to parent action.',
    lastUpdated: '2026-08-24'
  },
  {
    id: 'prompt-weekly-review',
    context: 'Weekly Review Summary',
    version: 'v2.0-prod',
    status: 'Active',
    systemInstructions: 'Synthesize the user\'s weekly accomplishments, identified barriers, and interventions into a draft personal lesson and adjustment. Require explicit user confirmation before recording.',
    lastUpdated: '2026-09-02'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
  currentNmaReminders: true,
  nmaFrequency: 'Action Days Only',
  dueActionReminders: true,
  dueActionFrequency: 'Same Day',
  weeklyReviewReminders: true,
  weeklyReviewDay: 'Friday',
  restartReminders: true,
  restartIntervalDays: 4,
  notificationFatigueControl: true,
};

export const INITIAL_BARRIERS: BarrierRecord[] = [
  {
    id: 'barr-1',
    actionId: 'act-parent-proposal',
    goalId: 'goal-proposal-2',
    userExplanation: 'The full 15-page grant template felt completely overwhelming with 6 complex sections and no clear starting point.',
    aiSuggestedCategory: 'overwhelm',
    aiExplanation: 'The scale and volume of the task exceed immediate activation capacity.',
    aiStatus: 'accepted',
    confirmedCategory: 'overwhelm',
    interventionApplied: 'Create a Minimum Meaningful Action (MMA)',
    mmaCreated: true,
    recordedAt: '2026-09-09T14:26:00Z',
    resolved: false,
  },
  {
    id: 'barr-2',
    actionId: 'act-nma-1',
    goalId: 'goal-catering-1',
    userExplanation: 'Initially unclear whether to contact venues or corporate offices first.',
    aiSuggestedCategory: 'unclear_next_step',
    aiExplanation: 'Action was framed too broadly without a single physical observable step.',
    aiStatus: 'accepted',
    confirmedCategory: 'unclear_next_step',
    interventionApplied: 'Clarify the Physical Action',
    mmaCreated: false,
    recordedAt: '2026-08-28T10:15:00Z',
    resolved: true,
  }
];

export const INITIAL_WEEKLY_REVIEWS: WeeklyReviewRecord[] = [
  {
    id: 'rev-cycle-2',
    weekEndingDate: '2026-09-06',
    meaningfulProgress: 'Drafted and refined the 5 customer discovery questions with mentor feedback; secured 3 verbal interview commitments for next week.',
    actionsThatMattered: 'Directly calling 2 corporate event contacts produced immediate valuable feedback, while researching online competitor menus was an avoidant distractor.',
    whatGotInTheWay: 'Mid-week overwhelm when thinking about commercial licensing and kitchen certifications all at once.',
    interventionsThatHelped: 'The Minimum Meaningful Action protocol—focusing only on writing the 5 questions restored clarity and forward movement.',
    interventionsThatDidNotHelp: 'Vague open-ended planning without a fixed 15-minute timer.',
    interruptionExperienced: false,
    aiSummaryDraft: 'Customer discovery validation progressing; scope overwhelm countered effectively via micro-action scoping.',
    aiSummaryConfirmed: true,
    lessonText: 'Attempting 5 interviews in a single afternoon felt overwhelming. Spacing them as 1 or 2 per day preserved focus and quality.',
    adjustmentText: 'Switched Action rhythm from single-day blitz to Three times weekly.',
    nextNmaTitle: 'Interview five potential customers about preferred products and pricing',
    createdAt: '2026-09-06T17:00:00Z',
  },
  {
    id: 'rev-cycle-1',
    weekEndingDate: '2026-08-30',
    meaningfulProgress: 'Finalized the core catering concept statement and defined target customer demographics (corporate lunch & boutique celebrations).',
    actionsThatMattered: 'Defining the concrete "Why This Matters" anchor prevented hesitation during initial outreach.',
    whatGotInTheWay: 'Procrastination on drafting the questionnaire due to unclear first step.',
    interventionsThatHelped: 'Clarifying the physical action verb (type 5 questions rather than "work on business").',
    interventionsThatDidNotHelp: 'None.',
    interruptionExperienced: false,
    aiSummaryDraft: 'Foundational vision clarified. Concrete verb scoping resolved initial hesitation.',
    aiSummaryConfirmed: true,
    lessonText: 'I delay large tasks when I cannot see the first concrete step. Breaking the work into one specific Action helps me begin.',
    adjustmentText: 'Always write NMAs using direct physical verbs rather than broad project titles.',
    nextNmaTitle: 'Draft five discovery questions for corporate lunch planners',
    createdAt: '2026-08-30T16:30:00Z',
  }
];

export const INITIAL_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  { id: 'evt-1', eventType: 'USER_REGISTERED', timestamp: '2026-08-15T09:00:00Z', details: { cohort: 'Founder & Entrepreneur' } },
  { id: 'evt-2', eventType: 'GOAL_CREATED', timestamp: '2026-08-15T09:05:00Z', details: { category: 'Business & Entrepreneurship' } },
  { id: 'evt-3', eventType: 'GOAL_ACTIVATED', timestamp: '2026-08-15T09:15:00Z' },
  { id: 'evt-4', eventType: 'MILESTONE_CREATED', timestamp: '2026-08-15T09:20:00Z' },
  { id: 'evt-5', eventType: 'ACTION_CREATED', timestamp: '2026-08-16T10:00:00Z', details: { isNMA: true } },
  { id: 'evt-6', eventType: 'ACTION_STARTED', timestamp: '2026-09-08T10:05:00Z' },
  { id: 'evt-7', eventType: 'ACTION_BLOCKED', timestamp: '2026-09-09T14:20:00Z', details: { actionId: 'act-parent-proposal' } },
  { id: 'evt-8', eventType: 'BARRIER_SELECTED', timestamp: '2026-09-09T14:25:00Z', details: { category: 'overwhelm' } },
  { id: 'evt-9', eventType: 'BARRIER_CONFIRMED', timestamp: '2026-09-09T14:26:00Z', details: { category: 'overwhelm' } },
  { id: 'evt-10', eventType: 'MMA_CREATED', timestamp: '2026-09-09T14:30:00Z', details: { parentActionId: 'act-parent-proposal' } },
];
