import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActionsService } from '../actions/actions.service';
import { AuditService } from '../audit/audit.service';
import { CreateMmaDto } from './dto/mma.dto';
import { ActionStatus } from '@prisma/client';

@Injectable()
export class MmaService {
  private memoryMmas = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly actionsService: ActionsService,
    private readonly auditService: AuditService,
  ) {}

  async createMma(userId: string, parentActionId: string, dto: CreateMmaDto) {
    // Validate parent action ownership
    const parentAction = await this.actionsService.getActionById(userId, parentActionId);

    const mmaId = 'mma-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    if (this.prisma.isConnected) {
      const created = await this.prisma.mMA.create({
        data: {
          id: mmaId,
          parentActionId,
          title: dto.title,
          timeframeMinutes: dto.timeframeMinutes || 15,
          status: ActionStatus.PENDING,
        },
      });

      await this.auditService.log({
        actorId: userId,
        action: 'MMA_CREATED',
        targetId: mmaId,
        targetType: 'MMA',
        details: { parentActionId, title: dto.title },
      });

      return created;
    }

    const mma = {
      id: mmaId,
      parentActionId,
      title: dto.title,
      timeframeMinutes: dto.timeframeMinutes || 15,
      status: 'PENDING',
      resumedParentAction: false,
      createdAt: new Date(),
    };
    this.memoryMmas.set(mmaId, mma);
    return mma;
  }

  /**
   * Completes the MMA micro-action.
   * ABSOLUTE BUSINESS RULE: Completing an MMA MUST NOT automatically complete its Parent Action!
   * It restores momentum and allows the user to transition back to the Parent Action with reduced friction.
   */
  async completeMma(userId: string, mmaId: string) {
    let parentActionId: string;

    if (this.prisma.isConnected) {
      const mma = await this.prisma.mMA.findUnique({
        where: { id: mmaId },
        include: { parentAction: true },
      });
      if (!mma) throw new NotFoundException('MMA not found');
      if (mma.parentAction.userId !== userId) {
        throw new ForbiddenException('Access denied: You do not own this action');
      }

      parentActionId = mma.parentActionId;

      const completed = await this.prisma.$transaction(async (tx) => {
        // Complete MMA
        const updatedMma = await tx.mMA.update({
          where: { id: mmaId },
          data: {
            status: ActionStatus.COMPLETED,
            completedAt: new Date(),
            resumedParentAction: true,
          },
        });

        // Mark associated barriers on parent action as resolved
        await tx.barrier.updateMany({
          where: { actionId: parentActionId, resolved: false },
          data: { resolved: true, resolvedAt: new Date() },
        });

        // Transition Parent Action from BLOCKED back to IN_PROGRESS (NOT completed!)
        if (mma.parentAction.status === ActionStatus.BLOCKED) {
          await tx.action.update({
            where: { id: parentActionId },
            data: { status: ActionStatus.IN_PROGRESS },
          });
        }

        return updatedMma;
      });

      await this.auditService.log({
        actorId: userId,
        action: 'MMA_COMPLETED',
        targetId: mmaId,
        targetType: 'MMA',
        details: { parentActionId, parentActionRemainsActive: true },
      });

      return completed;
    }

    const mma = this.memoryMmas.get(mmaId);
    if (!mma) throw new NotFoundException('MMA not found');
    mma.status = 'COMPLETED';
    mma.completedAt = new Date();
    mma.resumedParentAction = true;
    this.memoryMmas.set(mmaId, mma);
    return mma;
  }

  async getMmasForAction(userId: string, parentActionId: string) {
    await this.actionsService.getActionById(userId, parentActionId);

    if (this.prisma.isConnected) {
      return await this.prisma.mMA.findMany({
        where: { parentActionId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return Array.from(this.memoryMmas.values()).filter((m) => m.parentActionId === parentActionId);
  }
}
