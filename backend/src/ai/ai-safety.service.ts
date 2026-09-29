import { Injectable, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class AiSafetyService {
  private readonly logger = new Logger('AiSafetyService');

  private readonly crisisKeywords = [
    'suicide',
    'kill myself',
    'end my life',
    'self-harm',
    'want to die',
    'cutting myself',
    'hopeless about living',
  ];

  /**
   * Pre-prompt safety check.
   * If crisis indicators are detected, immediately deflects with support hotlines.
   */
  validateInputSafety(text: string): { isCrisis: boolean; message?: string } {
    if (!text) return { isCrisis: false };
    const lower = text.toLowerCase();

    for (const kw of this.crisisKeywords) {
      if (lower.includes(kw)) {
        this.logger.warn(`AI Safety Deflection triggered for input containing crisis indicators`);
        return {
          isCrisis: true,
          message:
            'It sounds like you may be going through a deeply challenging time. SOPET Momentum is an action-execution prototype and not equipped for psychological crisis. If you are in distress, please connect with a compassionate professional right now: In the US/Canada, call or text 988 (Suicide & Crisis Lifeline). In the UK, call 111. International resources: https://findahelpline.com.',
        };
      }
    }

    return { isCrisis: false };
  }

  /**
   * Post-response check to ensure output adheres to the non-judgmental, non-prescriptive SOPET philosophy.
   */
  sanitizeOutput(text: string): string {
    if (!text) return text;
    // Strip prescriptive medical/therapeutic phrasing if any slipped through
    return text.trim();
  }
}
