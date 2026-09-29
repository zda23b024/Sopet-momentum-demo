import { AcifCategoryCode, Goal, ActionItem } from '../types';

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
 * Deterministic & intelligent contextual AI simulator grounded in the SOPET ACIF framework.
 * Ensures fast, explainable, safe suggestions without latency or external key dependencies.
 */
export const ContextualAiService = {
  /**
   * Suggests ACIF Barrier category based on user's free-text explanation and parent action.
   */
  suggestBarrier(userText: string, actionTitle: string): AiBarrierSuggestion {
    const text = (userText + ' ' + actionTitle).toLowerCase();

    if (text.includes('overwhelm') || text.includes('too much') || text.includes('huge') || text.includes('too big') || text.includes('blank page') || text.includes('paralyz') || text.includes('vast') || text.includes('don\'t know where to begin')) {
      return {
        categoryCode: 'overwhelm',
        categoryName: 'Overwhelm',
        confidence: 'High',
        explanation: `The description indicates the volume or perceived scale of the task is creating activation resistance. Creating a Minimum Meaningful Action (MMA) can reduce the activation threshold.`,
        matchedKeywords: ['scale', 'scope', 'activation resistance']
      };
    }

    if (text.includes('unclear') || text.includes('vague') || text.includes('confus') || text.includes('what to do next') || text.includes('step') || text.includes('specify')) {
      return {
        categoryCode: 'unclear_next_step',
        categoryName: 'Unclear Next Step',
        confidence: 'High',
        explanation: `The action may lack a concrete, physically observable first step. Clarifying into a specific physical verb will eliminate ambiguity.`,
        matchedKeywords: ['ambiguity', 'unspecified step']
      };
    }

    if (text.includes('know how') || text.includes('skill') || text.includes('never done') || text.includes('unfamiliar') || text.includes('learn') || text.includes('expert')) {
      return {
        categoryCode: 'capability_gap',
        categoryName: 'Capability Gap',
        confidence: 'High',
        explanation: `The execution requires a specific technique or knowledge not currently at hand. Sourcing brief instruction or assistance will unblock progress.`,
        matchedKeywords: ['skill requirement', 'familiarity']
      };
    }

    if (text.includes('time') || text.includes('busy') || text.includes('urgent') || text.includes('family') || text.includes('work emergency') || text.includes('conflict') || text.includes('distract')) {
      return {
        categoryCode: 'priority_conflict',
        categoryName: 'Priority Conflict',
        confidence: 'High',
        explanation: `Competing urgent demands crowded out the scheduled execution time. A protected calendar appointment or conscious reprioritization is needed.`,
        matchedKeywords: ['time demands', 'competing priorities']
      };
    }

    if (text.includes('money') || text.includes('equipment') || text.includes('tool') || text.includes('software') || text.includes('access') || text.includes('material') || text.includes('laptop') || text.includes('phone')) {
      return {
        categoryCode: 'resource_gap',
        categoryName: 'Resource Gap',
        confidence: 'High',
        explanation: `A physical or logistical prerequisite is missing. Creating a targeted resource-acquisition step addresses this directly.`,
        matchedKeywords: ['missing tool', 'logistics']
      };
    }

    if (text.includes('waiting') || text.includes('replied') || text.includes('approval') || text.includes('response') || text.includes('boss') || text.includes('permission') || text.includes('partner')) {
      return {
        categoryCode: 'dependency',
        categoryName: 'Dependency',
        confidence: 'High',
        explanation: `Progress is currently paused on an external stakeholder deliverable. A dedicated follow-up or parallel unblocked action is recommended.`,
        matchedKeywords: ['stakeholder', 'external blocker']
      };
    }

    if (text.includes('good enough') || text.includes('perfect') || text.includes('rewrite') || text.includes('flaw') || text.includes('embarrass') || text.includes('not ready to show')) {
      return {
        categoryCode: 'perfectionism',
        categoryName: 'Perfectionism',
        confidence: 'High',
        explanation: `High internal standards may be demanding finished quality before allowing a rough first draft to exist. Adopting a "provisional sketch" standard will allow forward movement.`,
        matchedKeywords: ['standards', 'premature polishing']
      };
    }

    if (text.includes('doubt') || text.includes('imposter') || text.includes('fail') || text.includes('who am i') || text.includes('afraid') || text.includes('fear') || text.includes('reject')) {
      return {
        categoryCode: 'self_doubt',
        categoryName: 'Self-Doubt',
        confidence: 'High',
        explanation: `Apprehension about outcome or evaluation is creating hesitation. Grounding in past validated evidence and lowering test exposure helps restore safety.`,
        matchedKeywords: ['evaluation anxiety', 'outcome concern']
      };
    }

    // Default fallback
    return {
      categoryCode: 'overwhelm',
      categoryName: 'Overwhelm',
      confidence: 'Moderate',
      explanation: `Based on your note, the immediate next action appears to present substantial cognitive or logistical resistance.`,
      matchedKeywords: ['task resistance']
    };
  },

  /**
   * Suggests an MMA (Minimum Meaningful Action) linked to a parent action.
   */
  suggestMma(parentActionTitle: string): AiMmaSuggestion {
    const titleLower = parentActionTitle.toLowerCase();

    if (titleLower.includes('proposal') || titleLower.includes('write') || titleLower.includes('draft') || titleLower.includes('document')) {
      return {
        title: 'Draft the problem statement',
        whyThisHelps: 'Writing just the 2-paragraph problem statement breaks the initial blank-page friction without taking on the whole document.',
        rationale: 'Shrinks activation energy to a 15-minute concrete micro-step while establishing the thesis of the parent document.'
      };
    }

    if (titleLower.includes('interview') || titleLower.includes('customer') || titleLower.includes('outreach') || titleLower.includes('call')) {
      return {
        title: 'Draft 3 core interview questions on scratchpad',
        whyThisHelps: 'Preparing 3 short questions removes the uncertainty of speaking with people before making the calls.',
        rationale: 'Prepares conversation scaffolding so the first outreach feels predictable and safe.'
      };
    }

    if (titleLower.includes('budget') || titleLower.includes('cost') || titleLower.includes('pricing') || titleLower.includes('financial')) {
      return {
        title: 'List 3 primary supplier prices in a simple note',
        whyThisHelps: 'Focuses on immediate verifiable data points rather than building a full spreadsheet model.',
        rationale: 'Isolates the core inputs without triggering spreadsheet paralysis.'
      };
    }

    return {
      title: `Draft a 10-minute outline for "${parentActionTitle.slice(0, 30)}..."`,
      whyThisHelps: 'Preserves meaningful forward movement by scoping effort to an unthreatening 10-minute discovery draft.',
      rationale: 'Establishes initial traction without obligating full completion immediately.'
    };
  },

  /**
   * Suggests Goal clarification to sharpen meaning and specificity.
   */
  clarifyGoal(title: string, whyThisMatters: string): { refinedTitle: string; refinedWhyThisMatters: string; suggestions: string[] } {
    let refinedTitle = title;
    if (!title.toLowerCase().startsWith('launch') && !title.toLowerCase().startsWith('establish') && !title.toLowerCase().startsWith('start') && !title.toLowerCase().startsWith('complete')) {
      refinedTitle = `Establish and launch: ${title}`;
    }

    return {
      refinedTitle,
      refinedWhyThisMatters: whyThisMatters || 'Creating measurable long-term autonomy and mastering this domain to deliver value to stakeholders.',
      suggestions: [
        'Frame with an active developmental verb ("Launch", "Establish", "Validate").',
        'Connect "Why This Matters" directly to responsibility, autonomy, or personal significance.',
        'Keep the timeline bounded within 6 to 12 weeks for observable momentum.'
      ]
    };
  },

  /**
   * Synthesizes Weekly Review inputs into a practical personal lesson and adjustment.
   */
  synthesizeWeeklyReview(progress: string, barriers: string, interventions: string): AiWeeklySynthesis {
    return {
      summary: `You made concrete progress on priority discovery milestones. Identified barriers around task scope were addressed by reducing activation thresholds into focused actions.`,
      proposedLesson: `I delay large tasks when I cannot see the first concrete step. Breaking the work into one specific Action helps me begin.`,
      proposedAdjustment: `Always write NMAs using direct physical verbs and pair large actions with an immediate Minimum Meaningful Action (MMA).`,
      suggestedNextNma: `Review feedback from first 3 customer conversations and compile recurring preferences.`
    };
  }
};
