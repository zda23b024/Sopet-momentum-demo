import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

// Global & Core Infrastructure
import { PrismaModule } from './database/prisma.module';
import { AuditModule } from './audit/audit.module';
import { SecurityModule } from './security/security.module';

// Functional Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { PrivacyModule } from './privacy/privacy.module';
import { GoalsModule } from './goals/goals.module';
import { ActionsModule } from './actions/actions.module';
import { ReadinessModule } from './readiness/readiness.module';
import { BarriersModule } from './barriers/barriers.module';
import { InterventionsModule } from './interventions/interventions.module';
import { MmaModule } from './mma/mma.module';
import { RestartModule } from './restart/restart.module';
import { KpiModule } from './kpi/kpi.module';
import { ReviewsModule } from './reviews/reviews.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuditModule,
    SecurityModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    PrivacyModule,
    GoalsModule,
    ActionsModule,
    ReadinessModule,
    BarriersModule,
    InterventionsModule,
    MmaModule,
    RestartModule,
    KpiModule,
    ReviewsModule,
    KnowledgeBaseModule,
    AiModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
