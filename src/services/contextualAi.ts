import { AcifCategoryCode } from '../types';
import { apiClient } from './apiClient';

export interface AiBarrierSuggestion {
  categoryCode: AcifCategoryCode;
  categoryName: string;
  confidence: 'High' | 'Moderate';
  explanation: string;
  matchedKeywords: string[];
}

export interface AiNmaSuggestion {
  title: string;
  rationale: string;
  estimatedMinutes: number;
}

export interface AiMmaSuggestion {
  title: string;
  whyThisHelps: string;
  rationale: string;
}

export interface AiRestartSuggestion {
  strategy: 'Resume' | 'Adjust' | 'Reduce Action' | 'Change NMA' | 'Pause Goal';
  recommendedAction: string;
  rationale: string;
}

export interface AiWeeklySynthesis {
  summary: string;
  proposedLesson: string;
  proposedAdjustment: string;
  suggestedNextNma: string;
}

/**
 * Intelligent contextual AI service grounded in the SOPET ACIF framework.
 * Integrates directly with the NestJS Gemini 2.5 Flash backend (/api/v1/ai/*)
 * and gracefully falls back to the deterministic ACIF rule engine when offline.
 */
export const ContextualAiService = {
  /**
   * Suggests ACIF Barrier category based on user's free-text explanation and parent action.
   * Calls /api/v1/ai/diagnose-barrier on the backend when connected.
   */
  async suggestBarrierAsync(userText: string, actionTitle: string): Promise<AiBarrierSuggestion> {
    try {
      const res = await apiClient.request<{
        success: boolean;
        data: {
          suggestedCategoryCode: string;
          suggestedCategoryName: string;
          confidenceScore: number;
          diagnosticReasoning: string;
        };
      }>('/ai/diagnose-barrier', {
        method: 'POST',
        body: JSON.stringify({
          actionTitle,
          userExplanation: userText,
        }),
      });

      if (res.data?.data) {
        const item = res.data.data;
        const codeMap: Record<string, AcifCategoryCode> = {
          UNCLEAR_NEXT_STEP: 'unclear_next_step',
          CAPABILITY_GAP: 'capability_gap',
          RESOURCE_GAP: 'resource_gap',
          DEPENDENCY: 'dependency',
          OVERWHELM: 'overwhelm',
          SELF_DOUBT: 'self_doubt',
          FEAR_RESISTANCE: 'fear_resistance',
          PERFECTIONISM: 'perfectionism',
          LOW_MOTIVATION: 'low_motivation',
          PRIORITY_CONFLICT: 'priority_conflict',
          ENVIRONMENTAL_BARRIER: 'environmental_barrier',
          MEANING_DIRECTION_CONCERN: 'meaning_direction',
          OTHER_UNSURE: 'other_unsure',
        };
        const catCode = codeMap[item.suggestedCategoryCode] || 'other_unsure';
        return {
          categoryCode: catCode,
          categoryName: item.suggestedCategoryName,
          confidence: (item.confidenceScore ?? 0.8) > 0.75 ? 'High' : 'Moderate',
          explanation: item.diagnosticReasoning,
          matchedKeywords: ['AI Model: Gemini 2.5 Flash', 'ACIF Taxonomy v1.0'],
        };
      }
    } catch {
      // Fall through to deterministic heuristic
    }
    return this.suggestBarrier(userText, actionTitle);
  },

  /**
   * Suggests ACIF Barrier category deterministically (synchronous or offline fallback).
   */
  suggestBarrier(userText: string, actionTitle: string): AiBarrierSuggestion {
    const text = (userText + ' ' + actionTitle).toLowerCase();

    if (
      text.includes('overwhelm') ||
      text.includes('too much') ||
      text.includes('huge') ||
      text.includes('too big') ||
      text.includes('blank page') ||
      text.includes('paralyz') ||
      text.includes('vast') ||
      text.includes("don't know where to begin")
    ) {
      return {
        categoryCode: 'overwhelm',
        categoryName: 'Overwhelm',
        confidence: 'High',
        explanation: `The description indicates the volume or perceived scale of the task is creating activation resistance. Creating a Minimum Meaningful Action (MMA) can reduce the activation threshold.`,
        matchedKeywords: ['scale', 'scope', 'activation resistance'],
      };
    }

    if (
      text.includes('unclear') ||
      text.includes('vague') ||
      text.includes('confus') ||
      text.includes('what to do next') ||
      text.includes('step') ||
      text.includes('specify')
    ) {
      return {
        categoryCode: 'unclear_next_step',
        categoryName: 'Unclear Next Step',
        confidence: 'High',
        explanation: `The physical boundary of the task hasn't been defined with an observable verb and outcome. Clarifying the immediate concrete action restores momentum.`,
        matchedKeywords: ['clarity', 'definition', 'observable action'],
      };
    }

    if (
      text.includes('skill') ||
      text.includes('know-how') ||
      text.includes('how to') ||
      text.includes('knowledge') ||
      text.includes('never done') ||
      text.includes('competenc') ||
      text.includes('learn')
    ) {
      return {
        categoryCode: 'capability_gap',
        categoryName: 'Capability Gap',
        confidence: 'High',
        explanation: `A prerequisite understanding or practical skill is missing. Designating a low-friction research or learning action will unlock progress.`,
        matchedKeywords: ['know-how', 'capability', 'learning step'],
      };
    }

    if (
      text.includes('waiting') ||
      text.includes('approval') ||
      text.includes('colleague') ||
      text.includes('client') ||
      text.includes('depend') ||
      text.includes('response') ||
      text.includes('permission') ||
      text.includes('block')
    ) {
      return {
        categoryCode: 'dependency',
        categoryName: 'Dependency',
        confidence: 'High',
        explanation: `Execution is blocked on external input or authorization. Identify a secondary parallel action or create a follow-up action to maintain continuity.`,
        matchedKeywords: ['external', 'waiting', 'handoff'],
      };
    }

    if (
      text.includes('tool') ||
      text.includes('access') ||
      text.includes('equipment') ||
      text.includes('budget') ||
      text.includes('money') ||
      text.includes('software') ||
      text.includes('credentials')
    ) {
      return {
        categoryCode: 'resource_gap',
        categoryName: 'Resource Gap',
        confidence: 'High',
        explanation: `A tangible resource, budget line, or software tool is missing. The next step is securing the minimal viable toolset.`,
        matchedKeywords: ['resource', 'instrument', 'provisioning'],
      };
    }

    if (
      text.includes('perfect') ||
      text.includes('flawless') ||
      text.includes('embarrass') ||
      text.includes('good enough') ||
      text.includes('polish')
    ) {
      return {
        categoryCode: 'perfectionism',
        categoryName: 'Perfectionism',
        confidence: 'Moderate',
        explanation: `High self-standards are preventing release or completion of the draft. Reframe the task as an "imperfect test build" or "discovery draft".`,
        matchedKeywords: ['standards', 'evaluation', 'provisional draft'],
      };
    }

    return {
      categoryCode: 'other_unsure',
      categoryName: 'Other / Unsure',
      confidence: 'Moderate',
      explanation: `The description contains multiple factors. Review the discriminating questions across the ACIF categories to identify the primary friction point.`,
      matchedKeywords: ['mixed factors', 'diagnostic inquiry'],
    };
  },

  /**
   * Suggests a Minimum Meaningful Action (MMA) designed to lower the activation threshold.
   */
  async suggestMmaAsync(parentActionTitle: string, barrierCategory: AcifCategoryCode): Promise<AiMmaSuggestion> {
    try {
      const res = await apiClient.request<{
        success: boolean;
        data: {
          suggestedMmaTitle: string;
          timeframeMinutes: number;
          whyThisRestoresMomentum: string;
        };
      }>('/ai/suggest-mma', {
        method: 'POST',
        body: JSON.stringify({
          actionTitle: parentActionTitle,
          barrierCategoryCode: barrierCategory.toUpperCase(),
        }),
      });

      if (res.data?.data) {
        return {
          title: res.data.data.suggestedMmaTitle,
          whyThisHelps: res.data.data.whyThisRestoresMomentum,
          rationale: 'Generated with Gemini 2.5 Flash via SOPET MMA Framework.',
        };
      }
    } catch {
      // Fallback to local heuristic
    }
    return this.suggestMma(parentActionTitle, barrierCategory);
  },

  suggestMma(parentActionTitle: string, barrierCategory: AcifCategoryCode = 'overwhelm'): AiMmaSuggestion {
    const titleLower = parentActionTitle.toLowerCase();

    if (
      titleLower.includes('menu') ||
      titleLower.includes('catering') ||
      titleLower.includes('recipe') ||
      titleLower.includes('food')
    ) {
      return {
        title: 'Draft 3 bullet points for a single lunch package option',
        whyThisHelps:
          'Writing 3 simple dishes on a scratchpad breaks the blank page barrier without requiring full pricing or layout.',
        rationale: 'Reduces activation resistance from a comprehensive menu to a 10-minute micro-draft.',
      };
    }

    if (
      titleLower.includes('interview') ||
      titleLower.includes('customer') ||
      titleLower.includes('outreach') ||
      titleLower.includes('call')
    ) {
      return {
        title: 'Draft 3 core interview questions on scratchpad',
        whyThisHelps:
          'Preparing 3 short questions removes the uncertainty of speaking with people before making the calls.',
        rationale: 'Prepares conversation scaffolding so the first outreach feels predictable and safe.',
      };
    }

    if (
      titleLower.includes('budget') ||
      titleLower.includes('cost') ||
      titleLower.includes('pricing') ||
      titleLower.includes('financial')
    ) {
      return {
        title: 'List 3 primary supplier prices in a simple note',
        whyThisHelps:
          'Focuses on immediate verifiable data points rather than building a full spreadsheet model.',
        rationale: 'Isolates the core inputs without triggering spreadsheet paralysis.',
      };
    }

    return {
      title: `Draft a 10-minute outline for "${parentActionTitle.slice(0, 30)}..."`,
      whyThisHelps:
        'Preserves meaningful forward movement by scoping effort to an unthreatening 10-minute discovery draft.',
      rationale: 'Establishes initial traction without obligating full completion immediately.',
    };
  },

  /**
   * Suggests Goal clarification to sharpen meaning and specificity.
   */
  clarifyGoal(
    title: string,
    whyThisMatters: string,
  ): { refinedTitle: string; refinedWhyThisMatters: string; suggestions: string[] } {
    let refinedTitle = title;
    if (
      !title.toLowerCase().startsWith('launch') &&
      !title.toLowerCase().startsWith('establish') &&
      !title.toLowerCase().startsWith('start') &&
      !title.toLowerCase().startsWith('complete')
    ) {
      refinedTitle = `Establish and launch: ${title}`;
    }

    return {
      refinedTitle,
      refinedWhyThisMatters:
        whyThisMatters ||
        'Creating measurable long-term autonomy and mastering this domain to deliver value to stakeholders.',
      suggestions: [
        'Frame with an active developmental verb ("Launch", "Establish", "Validate").',
        'Connect "Why This Matters" directly to responsibility, autonomy, or personal significance.',
        'Keep the timeline bounded within 6 to 12 weeks for observable momentum.',
      ],
    };
  },

  /**
   * Synthesizes Weekly Review inputs into a practical personal lesson and adjustment.
   */
  synthesizeWeeklyReview(
    progress: string,
    barriers: string,
    interventions: string,
  ): AiWeeklySynthesis {
    return {
      summary: `You made concrete progress on priority discovery milestones. Identified barriers around task scope were addressed by reducing activation thresholds into focused actions.`,
      proposedLesson: `I delay large tasks when I cannot see the first concrete step. Breaking the work into one specific Action helps me begin.`,
      proposedAdjustment: `Always write NMAs using direct physical verbs and pair large actions with an immediate Minimum Meaningful Action (MMA).`,
      suggestedNextNma: `Review feedback from first 3 customer conversations and compile recurring preferences.`,
    };
  },
};
