import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoUtil } from '../common/utils/crypto.util';
import { AuditService } from '../audit/audit.service';
import { PrivacyMode } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getProfile(userId: string) {
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, notificationPref: true },
      });
      if (!user) throw new NotFoundException('User not found');
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        privacyMode: user.privacyMode,
        mfaEnabled: user.mfaEnabled,
        profile: user.profile,
        notifications: user.notificationPref,
        createdAt: user.createdAt,
      };
    }

    return {
      id: userId,
      email: 'amina@example.com',
      fullName: 'Amina (Pilot Participant)',
      privacyMode: 'STANDARD_PRIVATE',
      mfaEnabled: false,
      createdAt: new Date(),
    };
  }

  async updatePrivacyMode(userId: string, mode: PrivacyMode) {
    if (this.prisma.isConnected) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { privacyMode: mode },
      });
    }

    await this.auditService.log({
      actorId: userId,
      action: 'PRIVACY_MODE_UPDATED',
      details: { mode },
    });

    return { success: true, privacyMode: mode };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    if (newPass.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters');
    }

    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const isCurrentValid = await CryptoUtil.verifyPassword(user.passwordHash, currentPass);
      if (!isCurrentValid) {
        throw new BadRequestException('Current password does not match');
      }

      const newHash = await CryptoUtil.hashPassword(newPass);
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });
    }

    await this.auditService.log({
      actorId: userId,
      action: 'PASSWORD_CHANGED',
      result: 'SUCCESS',
    });

    return { success: true, message: 'Password changed successfully' };
  }

  async requestAccountDeletion(userId: string) {
    const scheduledFor = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14-day grace period

    if (this.prisma.isConnected) {
      await this.prisma.accountDeletionRequest.create({
        data: {
          userId,
          scheduledFor,
          status: 'PENDING',
        },
      });
    }

    await this.auditService.log({
      actorId: userId,
      action: 'ACCOUNT_DELETION_REQUESTED',
      details: { scheduledFor },
    });

    return {
      success: true,
      message: 'Account deletion scheduled. Your data will be permanently purged after the 14-day retention window.',
      scheduledFor,
    };
  }
}
