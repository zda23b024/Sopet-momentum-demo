import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SecurityService } from '../security/security.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly securityService: SecurityService,
  ) {}

  async getSystemMetrics() {
    if (this.prisma.isConnected) {
      const [userCount, goalCount, actionCount, completedActions, barrierCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.goal.count(),
        this.prisma.action.count(),
        this.prisma.action.count({ where: { status: 'COMPLETED' } }),
        this.prisma.barrier.count(),
      ]);

      return {
        totalUsers: userCount,
        totalGoals: goalCount,
        totalActions: actionCount,
        completedActions,
        totalBarriers: barrierCount,
        activeRatePercent: actionCount > 0 ? Math.round((completedActions / actionCount) * 100) : 0,
        serverTime: new Date().toISOString(),
      };
    }

    return {
      totalUsers: 4,
      totalGoals: 6,
      totalActions: 24,
      completedActions: 18,
      totalBarriers: 8,
      activeRatePercent: 75,
      serverTime: new Date().toISOString(),
    };
  }

  async getRecentAuditLogs(limit = 50) {
    return await this.auditService.getRecentLogs(limit);
  }

  async getRecentSecurityEvents(limit = 50) {
    return await this.securityService.getRecentEvents(limit);
  }
}
