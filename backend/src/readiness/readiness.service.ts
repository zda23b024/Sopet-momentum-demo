import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActionsService } from '../actions/actions.service';
import { CreateReadinessDto } from './dto/readiness.dto';
import { ReadinessVerdict, ActionStatus } from '@prisma/client';

@Injectable()
export class ReadinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionsService: ActionsService,
  ) {}

  calculateProvisionalVerdict(dto: CreateReadinessDto): ReadinessVerdict {
    if (!dto.clearlyUnderstood) return ReadinessVerdict.NEEDS_CLARIFICATION;
    if (!dto.knowsHowToDo) return ReadinessVerdict.CAPABILITY_CONCERN;
    if (!dto.hasResources) return ReadinessVerdict.RESOURCE_CONCERN;
    if (!dto.prerequisitesMet) return ReadinessVerdict.DEPENDENCY_CONCERN;
    if (!dto.internalResistanceLow) return ReadinessVerdict.INTERNAL_RESISTANCE;
    return ReadinessVerdict.READY;
  }

  async assessActionReadiness(userId: string, actionId: string, dto: CreateReadinessDto) {
    const action = await this.actionsService.getActionById(userId, actionId);
    const verdict = this.calculateProvisionalVerdict(dto);

    if (this.prisma.isConnected) {
      const assessment = await this.prisma.readinessAssessment.create({
        data: {
          actionId,
          clearlyUnderstood: dto.clearlyUnderstood,
          knowsHowToDo: dto.knowsHowToDo,
          hasResources: dto.hasResources,
          prerequisitesMet: dto.prerequisitesMet,
          internalResistanceLow: dto.internalResistanceLow,
          provisionalVerdict: verdict,
          notes: dto.notes,
        },
      });

      // If provisional verdict is READY and action is PENDING, advance status to READY
      if (verdict === ReadinessVerdict.READY && action.status === ActionStatus.PENDING) {
        await this.prisma.action.update({
          where: { id: actionId },
          data: { status: ActionStatus.READY },
        });
      }

      return assessment;
    }

    return {
      id: 'readiness-' + Date.now(),
      actionId,
      provisionalVerdict: verdict,
      assessedAt: new Date(),
    };
  }
}
