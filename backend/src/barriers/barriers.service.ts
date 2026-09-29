import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActionsService } from '../actions/actions.service';
import { AuditService } from '../audit/audit.service';
import { BlockActionDto, ConfirmBarrierDto } from './dto/barriers.dto';
import { ActionStatus, BarrierCategoryCode } from '@prisma/client';

@Injectable()
export class BarriersService {
  private memoryBarriers = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly actionsService: ActionsService,
    private readonly auditService: AuditService,
  ) {}

  async blockActionAndRecordExplanation(userId: string, actionId: string, dto: BlockActionDto) {
    const action = await this.actionsService.getActionById(userId, actionId);

    // Update action status to BLOCKED
    await this.actionsService.updateActionStatus(userId, actionId, {
      status: ActionStatus.BLOCKED,
      notes: 'Action became blocked by user diagnosis',
    });

    const barrierId = 'barr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    if (this.prisma.isConnected) {
      const created = await this.prisma.barrier.create({
        data: {
          id: barrierId,
          actionId,
          categoryCode: BarrierCategoryCode.OTHER_UNSURE, // provisional until confirmed
          userExplanation: dto.userExplanation,
          isClientEncrypted: dto.isClientEncrypted ?? false,
          ciphertextExplanation: dto.ciphertextExplanation,
          encryptionMetadata: dto.encryptionMetadata,
          userConfirmationState: 'PENDING',
        },
      });

      await this.auditService.log({
        actorId: userId,
        action: 'ACTION_BLOCKED',
        targetId: actionId,
        targetType: 'ACTION',
      });

      return created;
    }

    const barrier = {
      id: barrierId,
      actionId,
      userExplanation: dto.userExplanation,
      categoryCode: 'OTHER_UNSURE',
      userConfirmationState: 'PENDING',
      resolved: false,
      createdAt: new Date(),
    };
    this.memoryBarriers.set(barrierId, barrier);
    return barrier;
  }

  async confirmBarrier(userId: string, actionId: string, dto: ConfirmBarrierDto) {
    await this.actionsService.getActionById(userId, actionId);

    const barrierId = 'barr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    if (this.prisma.isConnected) {
      return await this.prisma.$transaction(async (tx) => {
        const barrier = await tx.barrier.create({
          data: {
            id: barrierId,
            actionId,
            categoryCode: dto.confirmedCategory,
            aiSuggestedCategory: dto.aiSuggestedCategory,
            userConfirmationState: dto.userConfirmationState || 'CONFIRMED',
            userExplanation: 'Barrier confirmed through ACIF protocol',
          },
          include: { definition: true },
        });

        // If intervention selected, link it
        if (dto.selectedInterventionCode) {
          const intv = await tx.intervention.findUnique({
            where: { code: dto.selectedInterventionCode },
          });
          if (intv) {
            await tx.actionIntervention.create({
              data: {
                actionId,
                barrierId: barrier.id,
                interventionId: intv.id,
              },
            });
          }
        }

        return barrier;
      });
    }

    const barrier = {
      id: barrierId,
      actionId,
      categoryCode: dto.confirmedCategory,
      aiSuggestedCategory: dto.aiSuggestedCategory,
      userConfirmationState: dto.userConfirmationState || 'CONFIRMED',
      userExplanation: 'Barrier confirmed through ACIF protocol',
      resolved: false,
      createdAt: new Date(),
    };
    this.memoryBarriers.set(barrierId, barrier);
    return barrier;
  }

  async getBarriersForUser(userId: string) {
    if (this.prisma.isConnected) {
      return await this.prisma.barrier.findMany({
        where: { action: { userId } },
        include: {
          definition: true,
          action: { select: { id: true, title: true, goalId: true } },
          interventions: { include: { intervention: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return Array.from(this.memoryBarriers.values());
  }

  async getTaxonomy() {
    if (this.prisma.isConnected) {
      return await this.prisma.barrierDefinition.findMany({
        where: { isPublished: true },
        include: { interventions: { where: { isPublished: true } } },
        orderBy: { code: 'asc' },
      });
    }

    // Default taxonomy fallback
    return [
      { code: 'UNCLEAR_NEXT_STEP', name: 'Unclear Next Step', description: 'Action boundary not clearly defined' },
      { code: 'CAPABILITY_GAP', name: 'Capability Gap', description: 'Missing required knowledge or skill' },
      { code: 'RESOURCE_GAP', name: 'Resource Gap', description: 'Lacking concrete materials or access' },
      { code: 'DEPENDENCY', name: 'Dependency', description: 'Waiting on external deliverable or approval' },
      { code: 'OVERWHELM', name: 'Overwhelm', description: 'Scope or cognitive load feels too high' },
      { code: 'SELF_DOUBT', name: 'Self-Doubt', description: 'Internal questioning of ability or competence' },
      { code: 'FEAR_RESISTANCE', name: 'Fear / Resistance', description: 'Anticipation of negative outcome or rejection' },
      { code: 'PERFECTIONISM', name: 'Perfectionism', description: 'Demanding flawless conditions before starting' },
      { code: 'LOW_MOTIVATION', name: 'Low Motivation', description: 'Mental exhaustion or lack of immediate drive' },
      { code: 'PRIORITY_CONFLICT', name: 'Priority Conflict', description: 'Competing demands or urgent fires' },
      { code: 'ENVIRONMENTAL_BARRIER', name: 'Environmental Barrier', description: 'Physical workspace friction or distraction' },
      { code: 'MEANING_DIRECTION_CONCERN', name: 'Meaning Concern', description: 'Questioning relevance of the primary goal' },
      { code: 'OTHER_UNSURE', name: 'Other / Unsure', description: 'Friction not yet categorized' },
    ];
  }
}
