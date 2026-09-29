import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface RegisterKeyDto {
  keyId: string;
  algorithm: string;
  wrappedKeyData: string;
  salt: string;
  iterations: number;
}

@Injectable()
export class PrivacyService {
  private memoryKeyMetadata = new Map<string, RegisterKeyDto>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async registerKeyMetadata(userId: string, dto: RegisterKeyDto) {
    if (this.prisma.isConnected) {
      await this.prisma.encryptionKeyMetadata.create({
        data: {
          userId,
          keyId: dto.keyId,
          algorithm: dto.algorithm || 'AES-256-GCM',
          wrappedKeyData: dto.wrappedKeyData,
          salt: dto.salt,
          iterations: dto.iterations || 600000,
        },
      });
    } else {
      this.memoryKeyMetadata.set(userId, dto);
    }

    await this.auditService.log({
      actorId: userId,
      action: 'CLIENT_ENCRYPTION_KEY_REGISTERED',
      details: { keyId: dto.keyId, algorithm: dto.algorithm },
    });

    return { success: true, keyId: dto.keyId };
  }

  async getKeyMetadata(userId: string) {
    if (this.prisma.isConnected) {
      const record = await this.prisma.encryptionKeyMetadata.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return record;
    }
    return this.memoryKeyMetadata.get(userId) || null;
  }
}
