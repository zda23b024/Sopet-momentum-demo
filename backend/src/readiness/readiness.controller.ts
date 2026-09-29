import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReadinessService } from './readiness.service';
import { CreateReadinessDto } from './dto/readiness.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Action Readiness')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ReadinessController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Post(':id/readiness')
  @ApiOperation({ summary: 'Submit 5-question Action Readiness Assessment (clarity, capability, resource, dependency, resistance)' })
  async assessReadiness(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') actionId: string,
    @Body() dto: CreateReadinessDto,
  ) {
    return await this.readinessService.assessActionReadiness(user.id, actionId, dto);
  }
}
