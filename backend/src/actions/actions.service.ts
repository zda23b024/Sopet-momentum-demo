import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateActionDto, UpdateActionStatusDto, DesignateNmaDto } from './dto/actions.dto';
import { ActionStatus } from '@prisma/client';

@Injectable()
export class ActionsService {
  private memoryActions = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    this.initDemoActions();
  }

  private initDemoActions() {
    this.memoryActions.set('act-amina-1', {
      id: 'act-amina-1',
      userId: 'usr-amina-demo',
      goalId: 'goal-amina-primary',
      title: 'Interview three catering clients about seasonal lunch preferences',
      description: 'Conduct phone discovery with 3 local office managers.',
      status: 'PENDING',
      isNMA: true,
      estimatedMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
      barriers: [],
      mmaChildActions: [],
    });
  }

  async getActions(userId: string, goalId?: string) {
    if (this.prisma.isConnected) {
      return await this.prisma.action.findMany({
        where: {
          userId,
          goalId: goalId || undefined,
        },
        include: {
          mmaChildActions: true,
          barriers: { include: { definition: true, interventions: { include: { intervention: true } } } },
          readinessAssessments: { orderBy: { assessedAt: 'desc' }, take: 1 },
        },
        orderBy: [{ isNMA: 'desc' }, { createdAt: 'desc' }],
      });
    }

    return Array.from(this.memoryActions.values()).filter(
      (a) => a.userId === userId && (!goalId || a.goalId === goalId),
    );
  }

  async getActionById(userId: string, actionId: string) {
    let action: any;
    if (this.prisma.isConnected) {
      action = await this.prisma.action.findUnique({
        where: { id: actionId },
        include: {
          mmaChildActions: true,
          barriers: { include: { definition: true, interventions: { include: { intervention: true } } } },
          statusHistory: { orderBy: { changedAt: 'desc' } },
          readinessAssessments: { orderBy: { assessedAt: 'desc' } },
        },
      });
    } else {
      action = this.memoryActions.get(actionId);
    }

    if (!action) {
      throw new NotFoundException('Action not found');
    }

    if (action.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this action');
    }

    return action;
  }

  async createAction(userId: string, dto: CreateActionDto) {
    const actionId = 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    if (this.prisma.isConnected) {
      // Verify goal ownership
      const goal = await this.prisma.goal.findUnique({ where: { id: dto.goalId } });
      if (!goal || goal.userId !== userId) {
        throw new ForbiddenException('Goal not found or does not belong to user');
      }

      // If marked as NMA, supersede previous NMA for this goal
      if (dto.isNMA) {
        await this.prisma.action.updateMany({
          where: { goalId: dto.goalId, isNMA: true },
          data: { isNMA: false },
        });
      }

      const created = await this.prisma.action.create({
        data: {
          id: actionId,
          userId,
          goalId: dto.goalId,
          milestoneId: dto.milestoneId,
          title: dto.title,
          description: dto.description,
          isNMA: dto.isNMA ?? false,
          estimatedMinutes: dto.estimatedMinutes,
          status: ActionStatus.PENDING,
          isClientEncrypted: dto.isClientEncrypted ?? false,
          ciphertextPayload: dto.ciphertextPayload,
          encryptionMetadata: dto.encryptionMetadata,
          statusHistory: {
            create: {
              oldStatus: ActionStatus.PENDING,
              newStatus: ActionStatus.PENDING,
              notes: 'Action created',
            },
          },
          nmaRecords: dto.isNMA
            ? {
                create: {
                  rationale: 'Designated upon action creation',
                },
              }
            : undefined,
        },
      });

      await this.auditService.log({
        actorId: userId,
        action: 'ACTION_CREATED',
        targetId: actionId,
        targetType: 'ACTION',
        details: { goalId: dto.goalId, isNMA: dto.isNMA },
      });

      return created;
    }

    const newAction = {
      id: actionId,
      userId,
      goalId: dto.goalId,
      milestoneId: dto.milestoneId,
      title: dto.title,
      description: dto.description,
      isNMA: dto.isNMA ?? false,
      estimatedMinutes: dto.estimatedMinutes,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      barriers: [],
      mmaChildActions: [],
    };
    if (dto.isNMA) {
      for (const a of this.memoryActions.values()) {
        if (a.goalId === dto.goalId) a.isNMA = false;
      }
    }
    this.memoryActions.set(actionId, newAction);
    return newAction;
  }

  async updateActionStatus(userId: string, actionId: string, dto: UpdateActionStatusDto) {
    const action = await this.getActionById(userId, actionId);

    const now = new Date();
    const startedAt = dto.status === ActionStatus.IN_PROGRESS && !action.startedAt ? now : action.startedAt;
    const completedAt = dto.status === ActionStatus.COMPLETED ? now : action.completedAt;

    if (this.prisma.isConnected) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.actionStatusHistory.create({
          data: {
            actionId,
            oldStatus: action.status,
            newStatus: dto.status,
            notes: dto.notes,
          },
        });

        return await tx.action.update({
          where: { id: actionId },
          data: {
            status: dto.status,
            startedAt,
            completedAt,
          },
        });
      });

      await this.auditService.log({
        actorId: userId,
        action: `ACTION_STATUS_${dto.status}`,
        targetId: actionId,
        targetType: 'ACTION',
        details: { oldStatus: action.status, newStatus: dto.status },
      });

      return updated;
    }

    action.status = dto.status;
    action.startedAt = startedAt;
    action.completedAt = completedAt;
    action.updatedAt = now;
    this.memoryActions.set(actionId, action);
    return action;
  }

  async designateNMA(userId: string, actionId: string, dto?: DesignateNmaDto) {
    const action = await this.getActionById(userId, actionId);

    if (this.prisma.isConnected) {
      return await this.prisma.$transaction(async (tx) => {
        // Demote existing NMAs for the same goal
        await tx.action.updateMany({
          where: { goalId: action.goalId, isNMA: true },
          data: { isNMA: false },
        });

        // Record NMA history
        await tx.nMARecord.create({
          data: {
            actionId,
            rationale: dto?.rationale || 'Designated as primary active NMA',
          },
        });

        // Set action as active NMA
        return await tx.action.update({
          where: { id: actionId },
          data: { isNMA: true },
        });
      });
    }

    for (const a of this.memoryActions.values()) {
      if (a.goalId === action.goalId) a.isNMA = false;
    }
    action.isNMA = true;
    this.memoryActions.set(actionId, action);
    return action;
  }
}
