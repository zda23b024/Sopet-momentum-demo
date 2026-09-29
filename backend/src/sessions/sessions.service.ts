import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getUserSessions(userId: string) {
    if (this.prisma.isConnected) {
      return await this.prisma.session.findMany({
        where: {
          userId,
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
        select: {
          id: true,
          userAgent: true,
          ipAddress: true,
          createdAt: true,
          lastActiveAt: true,
          expiresAt: true,
        },
        orderBy: { lastActiveAt: 'desc' },
      });
    }

    // Memory demo fallback
    return [
      {
        id: 'sess-current-active',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SOPET Client',
        ipAddress: '127.0.0.1',
        createdAt: new Date(),
        lastActiveAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  async revokeSession(userId: string, sessionId: string) {
    if (this.prisma.isConnected) {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
      });
      if (!session) {
        throw new NotFoundException('Session not found');
      }
      if (session.userId !== userId) {
        throw new ForbiddenException('Cannot revoke another user session');
      }
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { isRevoked: true },
      });
    }

    await this.auditService.log({
      actorId: userId,
      action: 'SESSION_REVOKED',
      targetId: sessionId,
      targetType: 'SESSION',
      result: 'SUCCESS',
    });

    return { success: true, message: 'Session successfully revoked' };
  }

  async revokeAllOtherSessions(userId: string, currentSessionId?: string) {
    if (this.prisma.isConnected) {
      await this.prisma.session.updateMany({
        where: {
          userId,
          id: currentSessionId ? { not: currentSessionId } : undefined,
          isRevoked: false,
        },
        data: { isRevoked: true },
      });
    }

    await this.auditService.log({
      actorId: userId,
      action: 'ALL_OTHER_SESSIONS_REVOKED',
      targetId: userId,
      targetType: 'USER',
      result: 'SUCCESS',
    });

    return { success: true, message: 'All other sessions successfully revoked' };
  }
}
