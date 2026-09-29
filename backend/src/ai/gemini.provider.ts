import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  AiProviderAdapter,
  BarrierDiagnosisRequest,
  BarrierDiagnosisResponse,
  MmaGenerationRequest,
  MmaGenerationResponse,
  RestartGuidanceRequest,
  RestartGuidanceResponse,
  SharpenNmaRequest,
  SharpenNmaResponse,
} from './ai.interface';

@Injectable()
export class GeminiProvider implements AiProviderAdapter {
  private readonly logger = new Logger('GeminiProvider');
  private ai: GoogleGenAI | null = null;
  private readonly modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({});
        this.logger.log('Gemini AI Provider initialized using @google/genai');
      } catch (e: any) {
        this.logger.warn(`Failed to initialize GoogleGenAI: ${e?.message}`);
      }
    } else {
      this.logger.log('Gemini API key not provided or placeholder. High-fidelity heuristic engine active.');
    }
  }

  async diagnoseBarrier(
    systemPrompt: string,
    context: string,
    req: BarrierDiagnosisRequest,
  ): Promise<BarrierDiagnosisResponse> {
    if (this.ai) {
      try {
        const prompt = `
System Prompt: ${systemPrompt}
Taxonomy Reference:
${context}

User Input:
Action: "${req.actionTitle}"
Description: "${req.actionDescription || 'N/A'}"
User Stated Explanation: "${req.userExplanation}"
Readiness Diagnostic Answers: ${JSON.stringify(req.readinessAnswers || {})}

Return a JSON object conforming exactly to this structure:
{
  "suggestedCategoryCode": "ONE_OF_ACIF_CODES",
  "suggestedCategoryName": "Readable Name",
  "confidenceScore": 0.88,
  "diagnosticReasoning": "Why this category fits the action boundary friction",
  "discriminatingQuestion": "A precise question for the user to confirm",
  "recommendedIntervention": {
    "code": "INT_MMA_OVERWHELM",
    "name": "Intervention Name",
    "instructions": "Specific guidance on next steps"
  }
}
`;
        const res = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (res.text) {
          const parsed = JSON.parse(res.text);
          return parsed;
        }
      } catch (err: any) {
        this.logger.warn(`Gemini API call failed, falling back to heuristic engine: ${err?.message}`);
      }
    }

    // High-Fidelity Methodology Heuristic Engine
    return this.heuristicDiagnoseBarrier(req);
  }

  async generateMma(
    systemPrompt: string,
    context: string,
    req: MmaGenerationRequest,
  ): Promise<MmaGenerationResponse> {
    if (this.ai) {
      try {
        const prompt = `
System Prompt: ${systemPrompt}
Taxonomy Context: ${context}
Action: "${req.actionTitle}"
Diagnosed Barrier: ${req.barrierCategoryCode}
User Notes: "${req.userExplanation || 'N/A'}"

Generate a 10-15 minute Minimum Meaningful Action (MMA).
Remember: The MMA restores momentum; it does NOT complete the parent action.

Return valid JSON:
{
  "suggestedMmaTitle": "Draft first 3 bullet points...",
  "timeframeMinutes": 15,
  "whyThisRestoresMomentum": "Lowers activation threshold to initiate flow state without pressure",
  "parentActionPreservedNote": "Completing this MMA unblocks your momentum; your primary action remains in progress."
}
`;
        const res = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (res.text) {
          return JSON.parse(res.text);
        }
      } catch (err: any) {
        this.logger.warn(`Gemini generateMma failed, using heuristic: ${err?.message}`);
      }
    }

    return this.heuristicGenerateMma(req);
  }

  async suggestRestart(
    systemPrompt: string,
    context: string,
    req: RestartGuidanceRequest,
  ): Promise<RestartGuidanceResponse> {
    if (this.ai) {
      try {
        const prompt = `
System Prompt: ${systemPrompt}
Goal: "${req.goalTitle}"
Interruption Type: ${req.interruptionType}
Cause: "${req.causeDescription}"
Days Elapsed: ${req.daysElapsed || 2}

Return valid JSON:
{
  "recommendedDecision": "RESUME",
  "rationale": "Why this decision preserves momentum without guilt",
  "suggestedRestartActionTitle": "Concrete action for tomorrow morning",
  "mindsetReframing": "Normalize the interruption as a natural recalibration point"
}
`;
        const res = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (res.text) {
          return JSON.parse(res.text);
        }
      } catch (err: any) {
        this.logger.warn(`Gemini suggestRestart failed, using heuristic: ${err?.message}`);
      }
    }

    return {
      recommendedDecision: req.daysElapsed && req.daysElapsed > 14 ? 'ADJUST' : 'RESUME',
      rationale:
        'The primary goal remains fundamentally sound. A micro-session tomorrow re-establishes execution continuity without shame or backward-looking friction.',
      suggestedRestartActionTitle: `Review first 3 items for "${req.goalTitle}" for 15 minutes`,
      mindsetReframing:
        'Interruptions are an inevitable feature of life. Fast recovery is the true measure of developmental resilience, not unbroken streaks.',
    };
  }

  async sharpenNma(
    systemPrompt: string,
    context: string,
    req: SharpenNmaRequest,
  ): Promise<SharpenNmaResponse> {
    if (this.ai) {
      try {
        const prompt = `
System Prompt: ${systemPrompt}
Draft Action: "${req.draftTitle}"
Primary Goal: "${req.goalTitle}"

Sharpen this into a Next Meaningful Action with unambiguous physical boundaries.
Return valid JSON:
{
  "sharpenedNmaTitle": "Physical action verb + concrete object + stopping condition",
  "actionBoundary": "Clear start when opening X, stop when Y is recorded",
  "estimatedMinutes": 30,
  "clarityAssessment": "Transformed abstract intention into observable execution step"
}
`;
        const res = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (res.text) {
          return JSON.parse(res.text);
        }
      } catch (err: any) {
        this.logger.warn(`Gemini sharpenNma failed, using heuristic: ${err?.message}`);
      }
    }

    return {
      sharpenedNmaTitle: `${req.draftTitle.trim()} (30-min focused session)`,
      actionBoundary: 'Begins when opening the workspace; concludes once initial tangible draft is saved.',
      estimatedMinutes: 30,
      clarityAssessment: 'Physical boundary defined to avoid endless rabbit holes.',
    };
  }

  // --- ACIF Heuristic Diagnostic Helpers ---
  private heuristicDiagnoseBarrier(req: BarrierDiagnosisRequest): BarrierDiagnosisResponse {
    const text = (req.userExplanation + ' ' + req.actionTitle).toLowerCase();
    const readiness = req.readinessAnswers;

    if (readiness?.clearlyUnderstood === false || text.includes('unclear') || text.includes('know where to start') || text.includes('vague')) {
      return {
        suggestedCategoryCode: 'UNCLEAR_NEXT_STEP',
        suggestedCategoryName: 'Unclear Next Step',
        confidenceScore: 0.92,
        diagnosticReasoning: 'The start and end criteria of the action have not been concretely partitioned.',
        discriminatingQuestion: 'Do you know the exact first physical action to take when you sit down?',
        recommendedIntervention: {
          code: 'INT_CLARIFY',
          name: 'Clarify Action Boundary',
          instructions: 'Write down the single physical tool you will open and the first observable sentence or file to produce.',
        },
      };
    }

    if (readiness?.knowsHowToDo === false || text.includes('how to') || text.includes('skill') || text.includes('dont know')) {
      return {
        suggestedCategoryCode: 'CAPABILITY_GAP',
        suggestedCategoryName: 'Capability Gap',
        confidenceScore: 0.89,
        diagnosticReasoning: 'Execution is delayed due to an unaddressed procedural knowledge or technical skill gap.',
        discriminatingQuestion: 'Is there a technical step or guideline you need to look up before you can proceed?',
        recommendedIntervention: {
          code: 'INT_LEARN_STEP',
          name: 'Learning / Research Action',
          instructions: 'Schedule a bounded 20-minute learning action strictly to find the necessary procedure or tutorial.',
        },
      };
    }

    if (readiness?.prerequisitesMet === false || text.includes('waiting') || text.includes('reply') || text.includes('approval') || text.includes('client')) {
      return {
        suggestedCategoryCode: 'DEPENDENCY',
        suggestedCategoryName: 'Dependency',
        confidenceScore: 0.94,
        diagnosticReasoning: 'Progress is halted awaiting an external stakeholder deliverable or feedback.',
        discriminatingQuestion: 'Can you proceed unilaterally, or are you strictly waiting for another person?',
        recommendedIntervention: {
          code: 'INT_DEPENDENCY_TRACK',
          name: 'Dependency Action',
          instructions: 'Convert the waiting state into an active follow-up action or parallelize on an unblocked milestone.',
        },
      };
    }

    if (text.includes('too much') || text.includes('overwhelm') || text.includes('huge') || text.includes('so many') || text.includes('giant')) {
      return {
        suggestedCategoryCode: 'OVERWHELM',
        suggestedCategoryName: 'Overwhelm',
        confidenceScore: 0.95,
        diagnosticReasoning: 'The perceived cognitive scope exceeds comfortable short-term working memory capacity.',
        discriminatingQuestion: 'Does the action feel like an entire project rather than a 30-minute task?',
        recommendedIntervention: {
          code: 'INT_MMA_OVERWHELM',
          name: 'Minimum Meaningful Action (MMA)',
          instructions: 'Carve out an ultra-low friction 10-minute micro-step to establish initial entry.',
        },
      };
    }

    if (text.includes('perfect') || text.includes('not ready yet') || text.includes('flawless')) {
      return {
        suggestedCategoryCode: 'PERFECTIONISM',
        suggestedCategoryName: 'Perfectionism',
        confidenceScore: 0.87,
        diagnosticReasoning: 'Delaying deployment in search of flawless initial conditions.',
        discriminatingQuestion: 'Are you withholding an 80% good solution out of fear that it is not yet perfect?',
        recommendedIntervention: {
          code: 'INT_ROUGH_DRAFT',
          name: 'Rough Draft Protocol',
          instructions: 'Give yourself explicit permission to produce a rough "v0.1" artifact within 20 minutes.',
        },
      };
    }

    // Default: Overwhelm / Low Friction Entry
    return {
      suggestedCategoryCode: 'OVERWHELM',
      suggestedCategoryName: 'Overwhelm',
      confidenceScore: 0.85,
      diagnosticReasoning: 'The perceived emotional or operational friction is creating resistance to entry.',
      discriminatingQuestion: 'Would you be willing to work on just the first 10 minutes of this action right now?',
      recommendedIntervention: {
        code: 'INT_MMA_OVERWHELM',
        name: 'Minimum Meaningful Action (MMA)',
        instructions: 'Define an MMA that can be completed in under 15 minutes to re-establish forward momentum.',
      },
    };
  }

  private heuristicGenerateMma(req: MmaGenerationRequest): MmaGenerationResponse {
    return {
      suggestedMmaTitle: `Spend 10 minutes outlining the first section of "${req.actionTitle}"`,
      timeframeMinutes: 10,
      whyThisRestoresMomentum:
        'Shrinks the cognitive hurdle to a trivial commitment, dissolving emotional friction and triggering natural momentum.',
      parentActionPreservedNote:
        'Completing this MMA restores momentum. Your parent action remains active and unblocked for subsequent sessions.',
    };
  }
}
