import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiProvider } from './gemini.provider';
import { PromptVersionService } from './prompt-version.service';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { AiSafetyService } from './ai-safety.service';
import { AiInteractionAuditService } from './ai-interaction-audit.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    GeminiProvider,
    PromptVersionService,
    KnowledgeRetrievalService,
    AiSafetyService,
    AiInteractionAuditService,
  ],
  exports: [AiService],
})
export class AiModule {}
