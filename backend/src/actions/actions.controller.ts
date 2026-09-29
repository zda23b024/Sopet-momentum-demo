import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { CreateActionDto, UpdateActionStatusDto, DesignateNmaDto } from './dto/actions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Actions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  @ApiOperation({ summary: 'List actions for authenticated user, optionally filtered by goalId' })
  @ApiQuery({ name: 'goalId', required: false })
  async getActions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('goalId') goalId?: string,
  ) {
    return await this.actionsService.getActions(user.id, goalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific action by ID with ownership enforcement' })
  async getActionById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return await this.actionsService.getActionById(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new action' })
  async createAction(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateActionDto,
  ) {
    return await this.actionsService.createAction(user.id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update action status (PENDING, IN_PROGRESS, COMPLETED, BLOCKED)' })
  async updateActionStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateActionStatusDto,
  ) {
    return await this.actionsService.updateActionStatus(user.id, id, dto);
  }

  @Post(':id/nma')
  @ApiOperation({ summary: 'Designate this action as the current Next Meaningful Action (NMA)' })
  async designateNMA(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto?: DesignateNmaDto,
  ) {
    return await this.actionsService.designateNMA(user.id, id, dto);
  }
}
