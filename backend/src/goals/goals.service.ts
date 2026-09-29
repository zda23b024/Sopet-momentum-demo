import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateGoalDto, UpdateGoalStatusDto } from './dto/goals.dto';
import { GoalStatus } from '@prisma/client';

@Injectable()
export class GoalsService {
  private memoryGoals = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    this.initDemoGoals();
  }

  private initDemoGoals() {
    this.memoryGoals.set('goal-amina-primary', {
      id: 'goal-amina-primary',
      userId: 'usr-amina-demo',
      title: 'Start a catering business',
      description: 'Launch an artisan lunch catering service for local offices within 6 months.',
      whyItMatters: 'Achieve financial independence and express culinary passion.',
      status: 'ACTIVE',
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getGoals(userId: string) {
    if (this.prisma.isConnected) {
      return await this.prisma.goal.findMany({
        where: { userId },
        include: {
          milestones: { orderBy: { orderIndex: 'asc' } },
          actions: { include: { mmaChildActions: true, barriers: true } },
          kpis: { include: { values: { orderBy: { recordedAt: 'desc' }, take: 10 } } },
        },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
      });
    }

    return Array.from(this.memoryGoals.values()).filter((g) => g.userId === userId);
  }

  async getGoalById(userId: string, goalId: string) {
    let goal: any;
    if (this.prisma.isConnected) {
      goal = await this.prisma.goal.findUnique({
        where: { id: goalId },
        include: {
          milestones: { orderBy: { orderIndex: 'asc' } },
          actions: { include: { mmaChildActions: true, barriers: true } },
          kpis: { include: { values: { orderBy: { recordedAt: 'desc' } } } },
          statusHistory: { orderBy: { changedAt: 'desc' } },
        },
      });
    } else {
      goal = this.memoryGoals.get(goalId);
    }

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    // Strict ownership verification: Prevent IDOR / BOLA!
    if (goal.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this goal');
    }

    return goal;
  }

  async createGoal(userId: string, dto: CreateGoalDto) {
    const goalId = 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    if (this.prisma.isConnected) {
      // If setting this goal as primary, demote other goals
      if (dto.isPrimary) {
        await this.prisma.goal.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      const created = await this.prisma.goal.create({
        data: {
          id: goalId,
          userId,
          title: dto.title,
          description: dto.description,
          whyItMatters: dto.whyItMatters,
          isPrimary: dto.isPrimary ?? false,
          targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
          isClientEncrypted: dto.isClientEncrypted ?? false,
          ciphertextPayload: dto.ciphertextPayload,
          encryptionMetadata: dto.encryptionMetadata,
          statusHistory: {
            create: {
              oldStatus: GoalStatus.NOT_STARTED,
              newStatus: GoalStatus.ACTIVE,
              reason: 'Initial goal creation',
            },
          },
        },
      });

      await this.auditService.log({
        actorId: userId,
        action: 'GOAL_CREATED',
        targetId: goalId,
        targetType: 'GOAL',
        details: { isPrimary: dto.isPrimary },
      });

      return created;
    }

    const newGoal = {
      id: goalId,
      userId,
      title: dto.title,
      description: dto.description,
      whyItMatters: dto.whyItMatters,
      status: 'ACTIVE',
      isPrimary: dto.isPrimary ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryGoals.set(goalId, newGoal);
    return newGoal;
  }

  async updateGoalStatus(userId: string, goalId: string, dto: UpdateGoalStatusDto) {
    const goal = await this.getGoalById(userId, goalId);

    if (this.prisma.isConnected) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.goalStatusHistory.create({
          data: {
            goalId,
            oldStatus: goal.status,
            newStatus: dto.status,
            reason: dto.reason,
          },
        });

        return await tx.goal.update({
          where: { id: goalId },
          data: { status: dto.status },
        });
      });

      await this.auditService.log({
        actorId: userId,
        action: 'GOAL_STATUS_UPDATED',
        targetId: goalId,
        targetType: 'GOAL',
        details: { oldStatus: goal.status, newStatus: dto.status },
      });

      return updated;
    }

    goal.status = dto.status;
    this.memoryGoals.set(goalId, goal);
    return goal;
  }
}
