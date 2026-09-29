import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getEntries(type?: string, domain?: string) {
    if (this.prisma.isConnected) {
      return await this.prisma.knowledgeBaseEntry.findMany({
        where: {
          status: 'PUBLISHED',
          type: (type as any) || undefined,
          domain: domain || undefined,
        },
        orderBy: { code: 'asc' },
      });
    }

    return [
      {
        code: 'KB_ACIF_FOUNDATION',
        type: 'BARRIER_DEFINITION',
        domain: 'ACIF',
        title: 'Action-Centric Identification Framework (ACIF) Core Protocol',
        content: 'ACIF is a non-judgmental diagnostic tool. Never label the person; diagnose the action friction.',
        status: 'PUBLISHED',
        version: 1,
      },
      {
        code: 'KB_MMA_PRINCIPLE',
        type: 'MMA_EXAMPLE',
        domain: 'MOMENTUM',
        title: 'The MMA Principle: Momentum Over Completion',
        content: 'Completing an MMA restores momentum and self-efficacy. It explicitly DOES NOT mark the parent action as completed.',
        status: 'PUBLISHED',
        version: 1,
      },
      {
        code: 'KB_RESTART_PROTOCOL',
        type: 'INTERVENTION',
        domain: 'RESTART',
        title: '5-Step Interruption Restart Protocol',
        content: 'Interruptions are natural. Fast recovery without shame is the hallmark of sustainable momentum.',
        status: 'PUBLISHED',
        version: 1,
      },
    ];
  }

  async getEntryByCode(code: string) {
    if (this.prisma.isConnected) {
      const entry = await this.prisma.knowledgeBaseEntry.findUnique({
        where: { code },
      });
      if (!entry) throw new NotFoundException('Knowledge entry not found');
      return entry;
    }
    const entries = await this.getEntries();
    const found = entries.find((e) => e.code === code);
    if (!found) throw new NotFoundException('Knowledge entry not found');
    return found;
  }
}
