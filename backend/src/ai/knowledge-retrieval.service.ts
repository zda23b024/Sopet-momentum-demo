import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class KnowledgeRetrievalService {
  constructor(private readonly prisma: PrismaService) {}

  async getAcifContext(): Promise<string> {
    if (this.prisma.isConnected) {
      try {
        const definitions = await this.prisma.barrierDefinition.findMany({
          where: { isPublished: true },
          include: { interventions: { where: { isPublished: true } } },
        });

        if (definitions.length > 0) {
          return definitions
            .map(
              (d) =>
                `[CATEGORY: ${d.code}] ${d.name}: ${d.description}. Discriminating question: "${d.discriminatingQuestion}". Approved Interventions: ${d.interventions.map((i) => `${i.code} (${i.name})`).join(', ')}`,
            )
            .join('\n');
        }
      } catch {
        // fallback
      }
    }

    return `
[CATEGORY: UNCLEAR_NEXT_STEP] Unclear Next Step: Action boundary not clearly defined. Question: Do I know exactly what physical motion comes first?
[CATEGORY: CAPABILITY_GAP] Capability Gap: Missing specific knowledge, script, or procedural skill.
[CATEGORY: RESOURCE_GAP] Resource Gap: Lacking tools, materials, access, or credentials.
[CATEGORY: DEPENDENCY] Dependency: Blocked awaiting external review, response, or deliverable.
[CATEGORY: OVERWHELM] Overwhelm: Scope or cognitive load feels too vast to enter.
[CATEGORY: SELF_DOUBT] Self-Doubt: Questioning personal competence despite having technical capacity.
[CATEGORY: FEAR_RESISTANCE] Fear / Resistance: Anticipating judgment, failure, rejection, or vulnerability.
[CATEGORY: PERFECTIONISM] Perfectionism: Delaying execution until flawless conditions exist.
[CATEGORY: LOW_MOTIVATION] Low Motivation: Temporary depletion of cognitive drive or energy.
[CATEGORY: PRIORITY_CONFLICT] Priority Conflict: Immediate competing fires stealing cognitive bandwidth.
[CATEGORY: ENVIRONMENTAL_BARRIER] Environmental Barrier: Physical workspace friction, digital noise, or chaos.
[CATEGORY: MEANING_DIRECTION_CONCERN] Meaning Concern: Losing conviction in why this goal matters.
[CATEGORY: OTHER_UNSURE] Other / Unsure: Unclassified resistance.
`;
  }
}
