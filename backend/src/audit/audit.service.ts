import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoUtil } from '../common/utils/crypto.util';

export interface CreateAuditLogParams {
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  result?: 'SUCCESS' | 'FAILURE';
  reason?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditService');
  private readonly memoryAuditLogs: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams) {
    const sanitizedDetails = params.details ? CryptoUtil.sanitizeForLogs(params.details) : undefined;
    const detailsJson = sanitizedDetails ? JSON.stringify(sanitizedDetails) : undefined;

    const logEntry = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actorId: params.actorId,
      actorEmail: params.actorEmail,
      action: params.action,
      targetId: params.targetId,
      targetType: params.targetType,
      detailsJson,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      result: params.result || 'SUCCESS',
      reason: params.reason,
      createdAt: new Date(),
    };

    this.logger.log(`AUDIT [${logEntry.action}] by ${logEntry.actorEmail || logEntry.actorId || 'SYSTEM'} - Result: ${logEntry.result}`);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.auditLog.create({ data: logEntry });
        return;
      } catch (e: any) {
        this.logger.warn(`Failed to persist audit log to DB: ${e.message}`);
      }
    }
    this.memoryAuditLogs.unshift(logEntry);
  }

  async getRecentLogs(limit = 50) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.auditLog.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // fallback
      }
    }
    return this.memoryAuditLogs.slice(0, limit);
  }
}
