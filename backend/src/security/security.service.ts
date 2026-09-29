import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface SecurityEventParams {
  userId?: string;
  eventType: string; // FAILED_LOGIN, REFRESH_REUSE, SUSPICIOUS_SESSION, BRUTE_FORCE_ATTEMPT, RATE_LIMIT_EXCEEDED
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

@Injectable()
export class SecurityService {
  private readonly logger = new Logger('SecurityService');
  private readonly memoryEvents: any[] = [];
  private readonly failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

  constructor(private readonly prisma: PrismaService) {}

  async recordSecurityEvent(params: SecurityEventParams) {
    const detailsJson = params.details ? JSON.stringify(params.details) : undefined;
    const event = {
      id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: params.userId,
      eventType: params.eventType,
      severity: params.severity,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      detailsJson,
      createdAt: new Date(),
    };

    this.logger.warn(`SECURITY EVENT [${params.severity}] ${params.eventType} (IP: ${params.ipAddress || 'unknown'})`);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.securityEvent.create({ data: event });
        return;
      } catch (e: any) {
        this.logger.warn(`Failed to persist security event to DB: ${e.message}`);
      }
    }
    this.memoryEvents.unshift(event);
  }

  recordFailedLogin(identifier: string): number {
    const record = this.failedAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };
    const now = Date.now();
    // reset after 15 minutes of inactivity
    if (now - record.lastAttempt > 15 * 60 * 1000) {
      record.count = 1;
    } else {
      record.count += 1;
    }
    record.lastAttempt = now;
    this.failedAttempts.set(identifier, record);
    return record.count;
  }

  clearFailedLogins(identifier: string) {
    this.failedAttempts.delete(identifier);
  }

  isRateLimited(key: string, limit = 5, windowMs = 60000): boolean {
    const record = this.failedAttempts.get(key);
    if (!record) return false;
    const now = Date.now();
    if (now - record.lastAttempt > windowMs) {
      this.failedAttempts.delete(key);
      return false;
    }
    return record.count >= limit;
  }

  async getRecentEvents(limit = 50) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.securityEvent.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // fallback
      }
    }
    return this.memoryEvents.slice(0, limit);
  }
}
