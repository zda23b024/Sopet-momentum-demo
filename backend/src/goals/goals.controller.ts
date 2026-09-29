import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalStatusDto } from './dto/goals.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @ApiOperation({ summary: 'List all goals belonging to authenticated user' })
  async getGoals(@CurrentUser() user: AuthenticatedUser) {
    return await this.goalsService.getGoals(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific goal by ID with strict ownership validation' })
  async getGoalById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return await this.goalsService.getGoalById(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new meaningful goal' })
  async createGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateGoalDto,
  ) {
    return await this.goalsService.createGoal(user.id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update goal status with historical record (ACTIVE, PAUSED, COMPLETED)' })
  async updateGoalStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateGoalStatusDto,
  ) {
    return await this.goalsService.updateGoalStatus(user.id, id, dto);
  }
}
