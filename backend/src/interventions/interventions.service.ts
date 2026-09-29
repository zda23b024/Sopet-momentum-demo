import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActionsService } from '../actions/actions.service';

@Injectable()
export class InterventionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionsService: ActionsService,
  ) {}

  async getInterventions() {
    if (this.prisma.isConnected) {
      return await this.prisma.intervention.findMany({
        where: { isPublished: true },
        include: { barrierDef: true },
        orderBy: { code: 'asc' },
      });
    }

    return [
      {
        code: 'INT_CLARIFY',
        name: 'Clarify Action Boundary',
        targetBarrierCode: 'UNCLEAR_NEXT_STEP',
        summary: 'Define physical boundary of the action.',
      },
      {
        code: 'INT_MMA_OVERWHELM',
        name: 'Minimum Meaningful Action (MMA)',
        targetBarrierCode: 'OVERWHELM',
        summary: 'Reduce action to a 10-15 minute micro-step.',
      },
      {
        code: 'INT_RESOURCE_ACQUIRE',
        name: 'Resource Acquisition Action',
        targetBarrierCode: 'RESOURCE_GAP',
        summary: 'Designate getting the tool/resource as its own action.',
      },
    ];
  }

  async linkInterventionToAction(
    userId: string,
    actionId: string,
    interventionCode: string,
    barrierId?: string,
    outcomeNotes?: string,
  ) {
    await this.actionsService.getActionById(userId, actionId);

    if (this.prisma.isConnected) {
      const intv = await this.prisma.intervention.findUnique({
        where: { code: interventionCode },
      });
      if (!intv) throw new NotFoundException('Intervention not found');

      return await this.prisma.actionIntervention.create({
        data: {
          actionId,
          barrierId,
          interventionId: intv.id,
          outcomeNotes,
        },
        include: { intervention: true },
      });
    }

    return {
      id: 'ai-' + Date.now(),
      actionId,
      interventionCode,
      outcomeNotes,
      appliedAt: new Date(),
    };
  }
}
