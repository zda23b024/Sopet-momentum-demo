-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('USER', 'SUPPORT_ADMIN', 'SECURITY_ADMIN', 'KNOWLEDGE_ADMIN', 'ANALYTICS_ADMIN', 'PRODUCT_ADMIN', 'SYSTEM_OWNER');

-- CreateEnum
CREATE TYPE "PrivacyMode" AS ENUM ('STANDARD_PRIVATE', 'ENCRYPTED_PRIVATE', 'HIGHLY_CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'READY', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReadinessVerdict" AS ENUM ('READY', 'NEEDS_CLARIFICATION', 'CAPABILITY_CONCERN', 'RESOURCE_CONCERN', 'DEPENDENCY_CONCERN', 'INTERNAL_RESISTANCE');

-- CreateEnum
CREATE TYPE "BarrierCategoryCode" AS ENUM ('UNCLEAR_NEXT_STEP', 'CAPABILITY_GAP', 'RESOURCE_GAP', 'DEPENDENCY', 'OVERWHELM', 'SELF_DOUBT', 'FEAR_RESISTANCE', 'PERFECTIONISM', 'LOW_MOTIVATION', 'PRIORITY_CONFLICT', 'ENVIRONMENTAL_BARRIER', 'MEANING_DIRECTION_CONCERN', 'OTHER_UNSURE');

-- CreateEnum
CREATE TYPE "InterruptionType" AS ENUM ('PLANNED', 'EXTERNAL', 'BARRIER_DRIVEN', 'PRIORITY_DRIVEN', 'MEANING_DRIVEN');

-- CreateEnum
CREATE TYPE "RestartDecision" AS ENUM ('RESUME', 'ADJUST', 'REDUCE_ACTION', 'CHANGE_NMA', 'PAUSE_GOAL', 'STRATEGICALLY_DISCONTINUE');

-- CreateEnum
CREATE TYPE "KnowledgeEntryType" AS ENUM ('BARRIER_DEFINITION', 'DISCRIMINATING_QUESTION', 'INTERVENTION', 'SCENARIO', 'NMA_EXAMPLE', 'MMA_EXAMPLE', 'WARNING', 'ESCALATION', 'FAQ', 'LOCALIZATION_NOTE', 'EVIDENCE_NOTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "mfaRecoveryCodes" TEXT[],
    "privacyMode" "PrivacyMode" NOT NULL DEFAULT 'STANDARD_PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "UserRoleType" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "detailsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "whyItMatters" TEXT,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "targetDate" TIMESTAMP(3),
    "isClientEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "ciphertextPayload" TEXT,
    "encryptionMetadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalStatusHistory" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "oldStatus" "GoalStatus" NOT NULL,
    "newStatus" "GoalStatus" NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "targetDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "isNMA" BOOLEAN NOT NULL DEFAULT false,
    "scheduledDate" TIMESTAMP(3),
    "estimatedMinutes" INTEGER,
    "isClientEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "ciphertextPayload" TEXT,
    "encryptionMetadata" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionStatusHistory" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "oldStatus" "ActionStatus" NOT NULL,
    "newStatus" "ActionStatus" NOT NULL,
    "notes" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NMARecord" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "designatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),
    "rationale" TEXT,

    CONSTRAINT "NMARecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessAssessment" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "clearlyUnderstood" BOOLEAN NOT NULL,
    "knowsHowToDo" BOOLEAN NOT NULL,
    "hasResources" BOOLEAN NOT NULL,
    "prerequisitesMet" BOOLEAN NOT NULL,
    "internalResistanceLow" BOOLEAN NOT NULL,
    "provisionalVerdict" "ReadinessVerdict" NOT NULL,
    "notes" TEXT,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadinessAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarrierDefinition" (
    "id" TEXT NOT NULL,
    "code" "BarrierCategoryCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discriminatingQuestion" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarrierDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barrier" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "categoryCode" "BarrierCategoryCode" NOT NULL,
    "userExplanation" TEXT NOT NULL,
    "isClientEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "ciphertextExplanation" TEXT,
    "encryptionMetadata" TEXT,
    "aiSuggestedCategory" "BarrierCategoryCode",
    "userConfirmationState" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "targetBarrierCode" "BarrierCategoryCode" NOT NULL,
    "summary" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "safetyLevel" TEXT NOT NULL DEFAULT 'STANDARD',
    "evidenceStatus" TEXT NOT NULL DEFAULT 'SOPET_PROTOCOL_VALIDATED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionIntervention" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "barrierId" TEXT,
    "interventionId" TEXT NOT NULL,
    "outcomeNotes" TEXT,
    "isHelpful" BOOLEAN,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MMA" (
    "id" TEXT NOT NULL,
    "parentActionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timeframeMinutes" INTEGER NOT NULL DEFAULT 15,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "resumedParentAction" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MMA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interruption" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "interruptionType" "InterruptionType" NOT NULL,
    "causeDescription" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interruption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restart" (
    "id" TEXT NOT NULL,
    "interruptionId" TEXT NOT NULL,
    "isStillMeaningful" BOOLEAN NOT NULL,
    "whatChanged" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "isPlanRealistic" BOOLEAN NOT NULL,
    "restartDecision" "RestartDecision" NOT NULL,
    "restartActionTitle" TEXT NOT NULL,
    "restartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysElapsed" DOUBLE PRECISION,

    CONSTRAINT "Restart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPIValue" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "KPIValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "weekEndingDate" TIMESTAMP(3) NOT NULL,
    "meaningfulProgress" TEXT NOT NULL,
    "actionsThatMattered" TEXT NOT NULL,
    "whatGotInTheWay" TEXT NOT NULL,
    "interventionsThatHelped" TEXT,
    "interventionsThatDidNotHelp" TEXT,
    "interruptionExperienced" BOOLEAN NOT NULL DEFAULT false,
    "restartDetails" TEXT,
    "nextNmaTitle" TEXT NOT NULL,
    "aiSummaryDraft" TEXT,
    "aiSummaryConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isClientEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "ciphertextPayload" TEXT,
    "encryptionMetadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "weeklyReviewId" TEXT,
    "lessonText" TEXT NOT NULL,
    "adjustmentText" TEXT NOT NULL,
    "relatedBarrierCode" "BarrierCategoryCode",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjustment" (
    "id" TEXT NOT NULL,
    "weeklyReviewId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implemented" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeBaseEntry" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "KnowledgeEntryType" NOT NULL,
    "domain" TEXT NOT NULL,
    "barrierCode" "BarrierCategoryCode",
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "evidenceStatus" TEXT NOT NULL DEFAULT 'SOPET_PROTOCOL_VALIDATED',
    "owner" TEXT NOT NULL DEFAULT 'SOPET_METHODOLOGY_LEAD',
    "version" INTEGER NOT NULL DEFAULT 1,
    "safetyLevel" TEXT NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBaseEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInteractionMetadata" (
    "id" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'gemini',
    "modelName" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "userConsentGiven" BOOLEAN NOT NULL DEFAULT true,
    "sanitizedTokens" INTEGER,
    "latencyMs" INTEGER,
    "wasAccepted" BOOLEAN,
    "wasEdited" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInteractionMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "detailsJson" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "result" TEXT NOT NULL DEFAULT 'SUCCESS',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailWeeklyReview" BOOLEAN NOT NULL DEFAULT true,
    "emailRestartReminders" BOOLEAN NOT NULL DEFAULT true,
    "inAppNmaPrompts" BOOLEAN NOT NULL DEFAULT true,
    "inAppBarrierCheckins" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncryptionKeyMetadata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'AES-256-GCM',
    "wrappedKeyData" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "iterations" INTEGER NOT NULL DEFAULT 600000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncryptionKeyMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountDeletionRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "AccountDeletionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "SecurityEvent_eventType_idx" ON "SecurityEvent"("eventType");

-- CreateIndex
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_idx" ON "SecurityEvent"("userId");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Goal_status_idx" ON "Goal"("status");

-- CreateIndex
CREATE INDEX "GoalStatusHistory_goalId_idx" ON "GoalStatusHistory"("goalId");

-- CreateIndex
CREATE INDEX "Milestone_goalId_idx" ON "Milestone"("goalId");

-- CreateIndex
CREATE INDEX "Action_userId_idx" ON "Action"("userId");

-- CreateIndex
CREATE INDEX "Action_goalId_idx" ON "Action"("goalId");

-- CreateIndex
CREATE INDEX "Action_status_idx" ON "Action"("status");

-- CreateIndex
CREATE INDEX "Action_isNMA_idx" ON "Action"("isNMA");

-- CreateIndex
CREATE INDEX "ActionStatusHistory_actionId_idx" ON "ActionStatusHistory"("actionId");

-- CreateIndex
CREATE INDEX "NMARecord_actionId_idx" ON "NMARecord"("actionId");

-- CreateIndex
CREATE INDEX "ReadinessAssessment_actionId_idx" ON "ReadinessAssessment"("actionId");

-- CreateIndex
CREATE UNIQUE INDEX "BarrierDefinition_code_key" ON "BarrierDefinition"("code");

-- CreateIndex
CREATE INDEX "Barrier_actionId_idx" ON "Barrier"("actionId");

-- CreateIndex
CREATE INDEX "Barrier_categoryCode_idx" ON "Barrier"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Intervention_code_key" ON "Intervention"("code");

-- CreateIndex
CREATE INDEX "ActionIntervention_actionId_idx" ON "ActionIntervention"("actionId");

-- CreateIndex
CREATE INDEX "ActionIntervention_interventionId_idx" ON "ActionIntervention"("interventionId");

-- CreateIndex
CREATE INDEX "MMA_parentActionId_idx" ON "MMA"("parentActionId");

-- CreateIndex
CREATE INDEX "Interruption_goalId_idx" ON "Interruption"("goalId");

-- CreateIndex
CREATE INDEX "Restart_interruptionId_idx" ON "Restart"("interruptionId");

-- CreateIndex
CREATE INDEX "KPI_goalId_idx" ON "KPI"("goalId");

-- CreateIndex
CREATE INDEX "KPIValue_kpiId_idx" ON "KPIValue"("kpiId");

-- CreateIndex
CREATE INDEX "KPIValue_recordedAt_idx" ON "KPIValue"("recordedAt");

-- CreateIndex
CREATE INDEX "WeeklyReview_userId_idx" ON "WeeklyReview"("userId");

-- CreateIndex
CREATE INDEX "WeeklyReview_goalId_idx" ON "WeeklyReview"("goalId");

-- CreateIndex
CREATE INDEX "WeeklyReview_weekEndingDate_idx" ON "WeeklyReview"("weekEndingDate");

-- CreateIndex
CREATE INDEX "Lesson_userId_idx" ON "Lesson"("userId");

-- CreateIndex
CREATE INDEX "Lesson_goalId_idx" ON "Lesson"("goalId");

-- CreateIndex
CREATE INDEX "Adjustment_weeklyReviewId_idx" ON "Adjustment"("weeklyReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeBaseEntry_code_key" ON "KnowledgeBaseEntry"("code");

-- CreateIndex
CREATE INDEX "KnowledgeBaseEntry_type_idx" ON "KnowledgeBaseEntry"("type");

-- CreateIndex
CREATE INDEX "KnowledgeBaseEntry_barrierCode_idx" ON "KnowledgeBaseEntry"("barrierCode");

-- CreateIndex
CREATE INDEX "AIInteractionMetadata_interactionType_idx" ON "AIInteractionMetadata"("interactionType");

-- CreateIndex
CREATE INDEX "AIInteractionMetadata_createdAt_idx" ON "AIInteractionMetadata"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "EncryptionKeyMetadata_userId_idx" ON "EncryptionKeyMetadata"("userId");

-- CreateIndex
CREATE INDEX "AccountDeletionRequest_userId_idx" ON "AccountDeletionRequest"("userId");

-- CreateIndex
CREATE INDEX "AccountDeletionRequest_status_idx" ON "AccountDeletionRequest"("status");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalStatusHistory" ADD CONSTRAINT "GoalStatusHistory_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStatusHistory" ADD CONSTRAINT "ActionStatusHistory_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NMARecord" ADD CONSTRAINT "NMARecord_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessAssessment" ADD CONSTRAINT "ReadinessAssessment_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barrier" ADD CONSTRAINT "Barrier_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barrier" ADD CONSTRAINT "Barrier_categoryCode_fkey" FOREIGN KEY ("categoryCode") REFERENCES "BarrierDefinition"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_targetBarrierCode_fkey" FOREIGN KEY ("targetBarrierCode") REFERENCES "BarrierDefinition"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionIntervention" ADD CONSTRAINT "ActionIntervention_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionIntervention" ADD CONSTRAINT "ActionIntervention_barrierId_fkey" FOREIGN KEY ("barrierId") REFERENCES "Barrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionIntervention" ADD CONSTRAINT "ActionIntervention_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MMA" ADD CONSTRAINT "MMA_parentActionId_fkey" FOREIGN KEY ("parentActionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interruption" ADD CONSTRAINT "Interruption_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restart" ADD CONSTRAINT "Restart_interruptionId_fkey" FOREIGN KEY ("interruptionId") REFERENCES "Interruption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPI" ADD CONSTRAINT "KPI_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPIValue" ADD CONSTRAINT "KPIValue_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReview" ADD CONSTRAINT "WeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReview" ADD CONSTRAINT "WeeklyReview_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_weeklyReviewId_fkey" FOREIGN KEY ("weeklyReviewId") REFERENCES "WeeklyReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjustment" ADD CONSTRAINT "Adjustment_weeklyReviewId_fkey" FOREIGN KEY ("weeklyReviewId") REFERENCES "WeeklyReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncryptionKeyMetadata" ADD CONSTRAINT "EncryptionKeyMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountDeletionRequest" ADD CONSTRAINT "AccountDeletionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

