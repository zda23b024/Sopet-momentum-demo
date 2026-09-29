import { Injectable, BadRequestException } from '@nestjs/common';
import { GeminiProvider } from './gemini.provider';
import { PromptVersionService } from './prompt-version.service';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { AiSafetyService } from './ai-safety.service';
import { AiInteractionAuditService } from './ai-interaction-audit.service';
import {
  BarrierDiagnosisRequest,
  MmaGenerationRequest,
  RestartGuidanceRequest,
  SharpenNmaRequest,
} from './ai.interface';

@Injectable()
export class AiService {
  constructor(
    private readonly provider: GeminiProvider,
    private readonly promptService: PromptVersionService,
    private readonly retrievalService: KnowledgeRetrievalService,
    private readonly safetyService: AiSafetyService,
    private readonly auditService: AiInteractionAuditService,
  ) {}

  async diagnoseBarrier(req: BarrierDiagnosisRequest, userId?: string, privacyMode?: string) {
    // 1. Safety Check
    const safetyCheck = this.safetyService.validateInputSafety(req.userExplanation);
    if (safetyCheck.isCrisis) {
      throw new BadRequestException({
        code: 'SAFETY_DEFLECTION',
        message: safetyCheck.message,
      });
    }

    const start = Date.now();
    const systemPrompt = this.promptService.getBarrierDiagnosisSystemPrompt('1.0');
    const context = await this.retrievalService.getAcifContext();

    const response = await this.provider.diagnoseBarrier(systemPrompt, context, req);
    const latencyMs = Date.now() - start;

    // 2. Audit (respecting user's privacy mode)
    await this.auditService.recordInteraction({
      userId,
      useCase: 'BARRIER_DIAGNOSIS',
      modelName: 'gemini-2.5-flash',
      promptVersion: '1.0',
      inputPrompt: `${req.actionTitle} | ${req.userExplanation}`,
      responsePayload: response,
      latencyMs,
      privacyMode,
    });

    return {
      success: true,
      proposalType: 'BARRIER_DIAGNOSIS_PROPOSAL',
      ruleNotice: 'AI suggests, User confirms, App writes. You may accept, modify, or reject this category.',
      data: response,
    };
  }

  async suggestMma(req: MmaGenerationRequest, userId?: string, privacyMode?: string) {
    const start = Date.now();
    const systemPrompt = this.promptService.getMmaGenerationSystemPrompt('1.0');
    const context = await this.retrievalService.getAcifContext();

    const response = await this.provider.generateMma(systemPrompt, context, req);
    const latencyMs = Date.now() - start;

    await this.auditService.recordInteraction({
      userId,
      useCase: 'MMA_GENERATION',
      modelName: 'gemini-2.5-flash',
      promptVersion: '1.0',
      inputPrompt: `${req.actionTitle} | ${req.barrierCategoryCode}`,
      responsePayload: response,
      latencyMs,
      privacyMode,
    });

    return {
      success: true,
      proposalType: 'MMA_PROPOSAL',
      ruleNotice: 'Completing an MMA restores momentum; your parent action will remain active.',
      data: response,
    };
  }

  async suggestRestart(req: RestartGuidanceRequest, userId?: string, privacyMode?: string) {
    const start = Date.now();
    const systemPrompt = this.promptService.getRestartSystemPrompt('1.0');
    const context = await this.retrievalService.getAcifContext();

    const response = await this.provider.suggestRestart(systemPrompt, context, req);
    const latencyMs = Date.now() - start;

    await this.auditService.recordInteraction({
      userId,
      useCase: 'RESTART_GUIDANCE',
      modelName: 'gemini-2.5-flash',
      promptVersion: '1.0',
      inputPrompt: `${req.goalTitle} | ${req.interruptionType}`,
      responsePayload: response,
      latencyMs,
      privacyMode,
    });

    return {
      success: true,
      proposalType: 'RESTART_PROPOSAL',
      data: response,
    };
  }

  async sharpenNma(req: SharpenNmaRequest, userId?: string, privacyMode?: string) {
    const start = Date.now();
    const systemPrompt = this.promptService.getNmaSharpeningSystemPrompt('1.0');
    const context = await this.retrievalService.getAcifContext();

    const response = await this.provider.sharpenNma(systemPrompt, context, req);
    const latencyMs = Date.now() - start;

    await this.auditService.recordInteraction({
      userId,
      useCase: 'NMA_SHARPENING',
      modelName: 'gemini-2.5-flash',
      promptVersion: '1.0',
      inputPrompt: `${req.draftTitle} | ${req.goalTitle}`,
      responsePayload: response,
      latencyMs,
      privacyMode,
    });

    return {
      success: true,
      proposalType: 'NMA_SHARPENING_PROPOSAL',
      data: response,
    };
  }
}
