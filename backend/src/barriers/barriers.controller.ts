import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BarriersService } from './barriers.service';
import { BlockActionDto, ConfirmBarrierDto } from './dto/barriers.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Barriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class BarriersController {
  constructor(private readonly barriersService: BarriersService) {}

  @Get('barriers/taxonomy')
  @ApiOperation({ summary: 'Get published ACIF barrier taxonomy and discriminating questions' })
  async getTaxonomy() {
    return await this.barriersService.getTaxonomy();
  }

  @Get('barriers')
  @ApiOperation({ summary: 'List all diagnosed barriers for current user' })
  async getUserBarriers(@CurrentUser() user: AuthenticatedUser) {
    return await this.barriersService.getBarriersForUser(user.id);
  }

  @Post('actions/:id/block')
  @ApiOperation({ summary: 'Record action as BLOCKED and capture user explanation' })
  async blockAction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') actionId: string,
    @Body() dto: BlockActionDto,
  ) {
    return await this.barriersService.blockActionAndRecordExplanation(user.id, actionId, dto);
  }

  @Post('actions/:id/barriers/confirm')
  @ApiOperation({ summary: 'Confirm or modify diagnosed barrier category (AI suggests, User confirms)' })
  async confirmBarrier(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') actionId: string,
    @Body() dto: ConfirmBarrierDto,
  ) {
    return await this.barriersService.confirmBarrier(user.id, actionId, dto);
  }
}
