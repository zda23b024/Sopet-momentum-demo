import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoUtil } from '../common/utils/crypto.util';

export interface RecordAiAuditParams {
  userId?: string;
  useCase: string; // BARRIER_DIAGNOSIS, MMA_GENERATION, RESTART_GUIDANCE, NMA_SHARPENING
  modelName: string;
  promptVersion: string;
  inputPrompt: string;
  responsePayload: any;
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
  privacyMode?: string;
}

@Injectable()
export class AiInteractionAuditService {
  private readonly logger = new Logger('AiAudit');

  constructor(private readonly prisma: PrismaService) {}

  async recordInteraction(params: RecordAiAuditParams) {
    const isEncryptedMode =
      params.privacyMode === 'ENCRYPTED_PRIVATE' || params.privacyMode === 'HIGHLY_CONFIDENTIAL';

    // In high privacy mode: DO NOT store raw text. Store SHA-256 hash or redact
    const inputLogged = isEncryptedMode
      ? `[HASHED_${CryptoUtil.hashToken(params.inputPrompt).substring(0, 16)}]`
      : JSON.stringify(CryptoUtil.sanitizeForLogs({ prompt: params.inputPrompt }));

    const outputLogged = isEncryptedMode
      ? `[HASHED_${CryptoUtil.hashToken(JSON.stringify(params.responsePayload)).substring(0, 16)}]`
      : JSON.stringify(CryptoUtil.sanitizeForLogs(params.responsePayload));

    this.logger.log(
      `AI_AUDIT [${params.useCase}] User: ${params.userId || 'anon'} Model: ${params.modelName} Latency: ${params.latencyMs || 0}ms Privacy: ${params.privacyMode || 'STANDARD'}`,
    );

    if (this.prisma.isConnected) {
      try {
        await this.prisma.aIInteractionMetadata.create({
          data: {
            interactionType: params.useCase,
            provider: 'gemini',
            modelName: params.modelName,
            promptVersion: params.promptVersion,
            sanitizedTokens: (params.promptTokens || 0) + (params.completionTokens || 0),
            latencyMs: params.latencyMs || 0,
            userConsentGiven: true,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to persist AI audit record: ${err?.message}`);
      }
    }
  }
}
