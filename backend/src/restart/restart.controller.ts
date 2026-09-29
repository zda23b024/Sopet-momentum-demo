import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestartService } from './restart.service';
import { RestartProtocolDto } from './dto/restart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Interruption & Restart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class RestartController {
  constructor(private readonly restartService: RestartService) {}

  @Get(':id/restarts')
  @ApiOperation({ summary: 'Get interruption and restart history for a goal' })
  async getRestarts(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') goalId: string,
  ) {
    return await this.restartService.getGoalRestarts(user.id, goalId);
  }

  @Post(':id/restart')
  @ApiOperation({ summary: 'Execute 5-Question Restart Protocol after an interruption' })
  async executeRestart(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') goalId: string,
    @Body() dto: RestartProtocolDto,
  ) {
    return await this.restartService.executeRestart(user.id, goalId, dto);
  }
}
