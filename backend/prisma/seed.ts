import { PrismaClient, UserRoleType, BarrierCategoryCode, KnowledgeEntryType, PrivacyMode } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export async function runSeed(client: PrismaClient = prisma) {
  console.log('Seeding SOPET Momentum database...');

  // 1. Seed Permissions
  const permissionsList = [
    { code: 'goal.read_own', description: 'Read own goals' },
    { code: 'goal.create', description: 'Create goals' },
    { code: 'goal.update_own', description: 'Update own goals' },
    { code: 'goal.delete_own', description: 'Delete own goals' },
    { code: 'action.read_own', description: 'Read own actions' },
    { code: 'action.create', description: 'Create actions' },
    { code: 'action.update_own', description: 'Update own actions' },
    { code: 'barrier.read_own', description: 'Read own barriers' },
    { code: 'barrier.confirm_own', description: 'Confirm or modify barrier diagnosis' },
    { code: 'review.read_own', description: 'Read own weekly reviews' },
    { code: 'review.create_own', description: 'Create weekly reviews' },
    { code: 'security.sessions.view', description: 'View own active security sessions' },
    { code: 'security.sessions.revoke', description: 'Revoke active sessions' },
    { code: 'security.events.view', description: 'View security events' },
    { code: 'account.metadata.view', description: 'View account operational metadata' },
    { code: 'account.suspend', description: 'Suspend or deactivate accounts' },
    { code: 'knowledge.view', description: 'View knowledge base' },
    { code: 'knowledge.edit', description: 'Edit knowledge base entries' },
    { code: 'knowledge.publish', description: 'Publish knowledge base versions' },
    { code: 'taxonomy.view', description: 'View ACIF taxonomy' },
    { code: 'taxonomy.edit', description: 'Edit ACIF taxonomy' },
    { code: 'intervention.view', description: 'View approved interventions' },
    { code: 'intervention.edit', description: 'Edit intervention definitions' },
    { code: 'intervention.publish', description: 'Publish intervention definitions' },
    { code: 'analytics.view', description: 'View privacy-preserving analytics' },
    { code: 'prompt.view', description: 'View AI prompt templates' },
    { code: 'prompt.manage', description: 'Manage AI prompt versions' },
    { code: 'admin.roles.manage', description: 'Manage user roles and permissions' },
    { code: 'admin.metrics.view', description: 'View administrative metrics' },
  ];

  for (const perm of permissionsList) {
    await client.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description },
      create: perm,
    });
  }

  // 2. Seed Roles
  const roles = [
    {
      name: UserRoleType.USER,
      description: 'Standard SOPET Participant. Can manage own developmental progress.',
      permissionCodes: [
        'goal.read_own', 'goal.create', 'goal.update_own', 'goal.delete_own',
        'action.read_own', 'action.create', 'action.update_own',
        'barrier.read_own', 'barrier.confirm_own',
        'review.read_own', 'review.create_own',
        'security.sessions.view', 'security.sessions.revoke',
        'knowledge.view', 'taxonomy.view', 'intervention.view'
      ],
    },
    {
      name: UserRoleType.SUPPORT_ADMIN,
      description: 'Technical Support Specialist. Can see operational metadata, cannot see private text.',
      permissionCodes: ['account.metadata.view', 'security.sessions.view', 'knowledge.view', 'admin.metrics.view'],
    },
    {
      name: UserRoleType.SECURITY_ADMIN,
      description: 'Security & Compliance Administrator. Manages sessions, security events, audit logs.',
      permissionCodes: [
        'security.sessions.view', 'security.sessions.revoke', 'security.events.view',
        'account.metadata.view', 'account.suspend', 'admin.metrics.view'
      ],
    },
    {
      name: UserRoleType.KNOWLEDGE_ADMIN,
      description: 'Methodology & Knowledge Base Curator. Manages ACIF taxonomy and interventions.',
      permissionCodes: [
        'knowledge.view', 'knowledge.edit', 'knowledge.publish',
        'taxonomy.view', 'taxonomy.edit',
        'intervention.view', 'intervention.edit', 'intervention.publish',
        'admin.metrics.view'
      ],
    },
    {
      name: UserRoleType.ANALYTICS_ADMIN,
      description: 'Cohort Progress & Statistical Analyst. Reads anonymized metrics.',
      permissionCodes: ['analytics.view', 'admin.metrics.view'],
    },
    {
      name: UserRoleType.PRODUCT_ADMIN,
      description: 'Product Lead. Oversees prompt versions and operational readiness.',
      permissionCodes: [
        'prompt.view', 'prompt.manage', 'analytics.view', 'knowledge.view',
        'taxonomy.view', 'intervention.view', 'admin.metrics.view'
      ],
    },
    {
      name: UserRoleType.SYSTEM_OWNER,
      description: 'Break-glass owner. Heavily audited system administrator.',
      permissionCodes: permissionsList.map(p => p.code),
    },
  ];

  for (const roleData of roles) {
    const role = await client.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description },
      create: {
        name: roleData.name,
        description: roleData.description,
      },
    });

    for (const code of roleData.permissionCodes) {
      const perm = await client.permission.findUnique({ where: { code } });
      if (perm) {
        await client.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: perm.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }
    }
  }

  // 3. Seed ACIF Barrier Taxonomy
  const barrierDefinitions = [
    {
      code: BarrierCategoryCode.UNCLEAR_NEXT_STEP,
      name: 'Unclear Next Step',
      description: 'The physical, observable boundary of what to do next has not been specified.',
      discriminatingQuestion: 'Do I know the exact physical action I need to take right now?',
    },
    {
      code: BarrierCategoryCode.CAPABILITY_GAP,
      name: 'Capability Gap',
      description: 'Missing specific skill, knowledge, or technique required to perform the action.',
      discriminatingQuestion: 'Do I have the necessary operational know-how to complete this task?',
    },
    {
      code: BarrierCategoryCode.RESOURCE_GAP,
      name: 'Resource Gap',
      description: 'Lacking concrete tools, software, budget, access, or physical equipment.',
      discriminatingQuestion: 'Do I possess the necessary material instruments or access permissions?',
    },
    {
      code: BarrierCategoryCode.DEPENDENCY,
      name: 'Dependency',
      description: 'Progress is contingent on an external deliverable, person, or prior approval.',
      discriminatingQuestion: 'Am I waiting on someone else or a prior milestone before this can move?',
    },
    {
      code: BarrierCategoryCode.OVERWHELM,
      name: 'Overwhelm',
      description: 'The scope or cognitive load of the action feels vast or cognitively flooding.',
      discriminatingQuestion: 'Does the action feel too large, complex, or diffuse to begin right now?',
    },
    {
      code: BarrierCategoryCode.SELF_DOUBT,
      name: 'Self-Doubt',
      description: 'Internal questioning of competence, legitimacy, or ability to produce quality work.',
      discriminatingQuestion: 'Am I hesitating due to feelings of inadequacy or impostor feelings?',
    },
    {
      code: BarrierCategoryCode.FEAR_RESISTANCE,
      name: 'Fear / Emotional Resistance',
      description: 'Anticipation of negative outcomes, judgment, rejection, or vulnerability.',
      discriminatingQuestion: 'Am I avoiding this action because of anticipated discomfort or rejection?',
    },
    {
      code: BarrierCategoryCode.PERFECTIONISM,
      name: 'Perfectionism',
      description: 'Demanding flawless execution or all prerequisites met before initiating.',
      discriminatingQuestion: 'Am I delaying because conditions are not yet 100% ideal or polished?',
    },
    {
      code: BarrierCategoryCode.LOW_MOTIVATION,
      name: 'Low Motivation',
      description: 'Low somatic energy, mental fatigue, or weak immediate emotional drive.',
      discriminatingQuestion: 'Is my energy tank empty or do I feel flat without acute panic?',
    },
    {
      code: BarrierCategoryCode.PRIORITY_CONFLICT,
      name: 'Priority Conflict',
      description: 'Competing demands, urgent fires, or conflicting goals competing for attention.',
      discriminatingQuestion: 'Is another task or responsibility legitimately displacing this right now?',
    },
    {
      code: BarrierCategoryCode.ENVIRONMENTAL_BARRIER,
      name: 'Environmental Barrier',
      description: 'Physical friction, workspace noise, domestic disruption, or sensory chaos.',
      discriminatingQuestion: 'Is the physical or immediate environment preventing focus?',
    },
    {
      code: BarrierCategoryCode.MEANING_DIRECTION_CONCERN,
      name: 'Meaning / Direction Concern',
      description: 'Doubt about whether the goal itself still aligns with core values or value.',
      discriminatingQuestion: 'Do I still genuinely care about the outcome of this primary goal?',
    },
    {
      code: BarrierCategoryCode.OTHER_UNSURE,
      name: 'Other / Unsure',
      description: 'Diffuse resistance not yet mapped to a specific diagnostic category.',
      discriminatingQuestion: 'Is there a friction that does not neatly fit the standard categories?',
    },
  ];

  for (const b of barrierDefinitions) {
    await client.barrierDefinition.upsert({
      where: { code: b.code },
      update: {
        name: b.name,
        description: b.description,
        discriminatingQuestion: b.discriminatingQuestion,
      },
      create: {
        code: b.code,
        name: b.name,
        description: b.description,
        discriminatingQuestion: b.discriminatingQuestion,
        language: 'en',
        version: 1,
        isPublished: true,
      },
    });
  }

  // 4. Seed Approved Interventions
  const interventions = [
    {
      code: 'INT_CLARIFY',
      name: 'Clarify Action Boundary',
      targetBarrierCode: BarrierCategoryCode.UNCLEAR_NEXT_STEP,
      summary: 'Define the physical, observable starting point and completion criteria.',
      instructions: 'Write down: Where will you sit/stand? What tool will you open? What is the very first button or stroke?',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_LEARNING_STEP',
      name: 'Micro-Learning Query',
      targetBarrierCode: BarrierCategoryCode.CAPABILITY_GAP,
      summary: 'Find a single targeted reference, tutorial, or subject matter expert question.',
      instructions: 'Scope a 15-minute search or draft a single specific question to ask a mentor.',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_RESOURCE_ACQUIRE',
      name: 'Resource Acquisition Action',
      targetBarrierCode: BarrierCategoryCode.RESOURCE_GAP,
      summary: 'Create a dedicated action to secure the missing asset, tool, or credential.',
      instructions: 'Designate acquiring the tool or subscription as its own standalone meaningful action.',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_DEPENDENCY_PING',
      name: 'Prerequisite Clarification / Follow-up',
      targetBarrierCode: BarrierCategoryCode.DEPENDENCY,
      summary: 'Send a clean follow-up or identify a non-blocked parallel action branch.',
      instructions: 'Draft a concise 2-sentence status inquiry or pivot to a parallel preparation task.',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_MMA_OVERWHELM',
      name: 'Minimum Meaningful Action (MMA)',
      targetBarrierCode: BarrierCategoryCode.OVERWHELM,
      summary: 'Reduce the action to a 10–15 minute micro-step that creates forward momentum.',
      instructions: 'Define the smallest practical physical action. Completing it restores momentum without completing the whole parent action.',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_EVIDENCE_LOG',
      name: 'Evidence Review & Risk Reduction',
      targetBarrierCode: BarrierCategoryCode.SELF_DOUBT,
      summary: 'Document 2 prior instances of competence and lower the public exposure of step 1.',
      instructions: 'Frame the action as a private draft or diagnostic experiment rather than a final verdict on your skill.',
      safetyLevel: 'GENTLE',
    },
    {
      code: 'INT_REPRIORITIZE',
      name: 'Protected Calendar Boundary',
      targetBarrierCode: BarrierCategoryCode.PRIORITY_CONFLICT,
      summary: 'Explicitly trade off or schedule a dedicated 45-minute window for this NMA.',
      instructions: 'Declare what will NOT be done during this block to protect execution focus.',
      safetyLevel: 'STANDARD',
    },
    {
      code: 'INT_ENVIRONMENT_RESET',
      name: 'Environmental Friction Reduction',
      targetBarrierCode: BarrierCategoryCode.ENVIRONMENTAL_BARRIER,
      summary: 'Clear physical workspace, put phone in another room, or use focused headphones.',
      instructions: 'Spend 5 minutes removing visual clutter and establishing a clean perimeter.',
      safetyLevel: 'STANDARD',
    },
  ];

  for (const item of interventions) {
    await client.intervention.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        targetBarrierCode: item.targetBarrierCode,
        summary: item.summary,
        instructions: item.instructions,
      },
      create: {
        code: item.code,
        name: item.name,
        targetBarrierCode: item.targetBarrierCode,
        summary: item.summary,
        instructions: item.instructions,
        safetyLevel: item.safetyLevel,
        evidenceStatus: 'SOPET_PROTOCOL_VALIDATED',
        version: 1,
        isPublished: true,
      },
    });
  }

  // 5. Seed Knowledge Base Entries
  const kbEntries = [
    {
      code: 'KB_ACIF_FOUNDATION',
      type: KnowledgeEntryType.BARRIER_DEFINITION,
      domain: 'ACIF',
      title: 'Action-Centric Identification Framework (ACIF) Core Protocol',
      content: 'ACIF is a non-judgmental diagnostic tool. Never label the person; diagnose the action friction.',
    },
    {
      code: 'KB_MMA_PRINCIPLE',
      type: KnowledgeEntryType.MMA_EXAMPLE,
      domain: 'MOMENTUM',
      title: 'The MMA Principle: Momentum Over Completion',
      content: 'Completing an MMA generates self-efficacy and dopamine. It specifically DOES NOT mark the parent action as completed.',
    },
    {
      code: 'KB_RESTART_PROTOCOL',
      type: KnowledgeEntryType.INTERVENTION,
      domain: 'RESTART',
      title: '5-Step Interruption Restart Protocol',
      content: 'Interruptions are natural. Fast recovery without shame is the hallmark of sustainable momentum.',
    },
  ];

  for (const entry of kbEntries) {
    await client.knowledgeBaseEntry.upsert({
      where: { code: entry.code },
      update: {
        title: entry.title,
        content: entry.content,
      },
      create: {
        code: entry.code,
        type: entry.type,
        domain: entry.domain,
        title: entry.title,
        content: entry.content,
        language: 'en',
        status: 'PUBLISHED',
        version: 1,
      },
    });
  }

  // 6. Seed Demo Users with Argon2id Hashed Passwords
  const defaultPassword = 'SopetPilot2026!';
  const hashedPassword = await argon2.hash(defaultPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  const demoUsers = [
    {
      email: 'amina@example.com',
      fullName: 'Amina (Pilot Participant)',
      role: UserRoleType.USER,
      privacyMode: PrivacyMode.STANDARD_PRIVATE,
    },
    {
      email: 'support@sopet.local',
      fullName: 'SOPET Support Specialist',
      role: UserRoleType.SUPPORT_ADMIN,
      privacyMode: PrivacyMode.STANDARD_PRIVATE,
    },
    {
      email: 'security@sopet.local',
      fullName: 'SOPET Security Lead',
      role: UserRoleType.SECURITY_ADMIN,
      privacyMode: PrivacyMode.STANDARD_PRIVATE,
    },
    {
      email: 'owner@sopet.local',
      fullName: 'SOPET System Owner',
      role: UserRoleType.SYSTEM_OWNER,
      privacyMode: PrivacyMode.STANDARD_PRIVATE,
    },
  ];

  for (const u of demoUsers) {
    const user = await client.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        privacyMode: u.privacyMode,
      },
      create: {
        email: u.email,
        passwordHash: hashedPassword,
        fullName: u.fullName,
        isActive: true,
        isEmailVerified: true,
        privacyMode: u.privacyMode,
      },
    });

    await client.userProfile.upsert({
      where: { userId: user.id },
      update: { displayName: u.fullName },
      create: {
        userId: user.id,
        displayName: u.fullName,
        timezone: 'UTC',
        locale: 'en',
      },
    });

    const role = await client.role.findUnique({ where: { name: u.role } });
    if (role) {
      await client.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }

    await client.notificationPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        emailWeeklyReview: true,
        emailRestartReminders: true,
        inAppNmaPrompts: true,
        inAppBarrierCheckins: true,
      },
    });

    // If user is Amina, seed primary goal and initial actions for immediate testing
    if (u.email === 'amina@example.com') {
      const goal = await client.goal.upsert({
        where: { id: 'goal-amina-primary' },
        update: {},
        create: {
          id: 'goal-amina-primary',
          userId: user.id,
          title: 'Start a catering business',
          description: 'Launch an artisan lunch catering service for local offices within 6 months.',
          whyItMatters: 'Achieve financial independence and express culinary passion.',
          isPrimary: true,
        },
      });

      const m1 = await client.milestone.upsert({
        where: { id: 'm-amina-1' },
        update: {},
        create: {
          id: 'm-amina-1',
          goalId: goal.id,
          title: 'Validate Customer Demand & Pricing',
          orderIndex: 1,
          isCompleted: false,
        },
      });

      await client.action.upsert({
        where: { id: 'act-amina-1' },
        update: {},
        create: {
          id: 'act-amina-1',
          userId: user.id,
          goalId: goal.id,
          milestoneId: m1.id,
          title: 'Interview three catering clients about seasonal lunch preferences',
          description: 'Conduct phone discovery with 3 local office managers.',
          status: 'PENDING',
          isNMA: true,
        },
      });
    }
  }

  console.log('SOPET Momentum seeding completed successfully.');
}

if (process.env.NODE_ENV !== 'test') {
  runSeed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
