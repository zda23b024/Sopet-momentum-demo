import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KpiService, RecordKpiValueDto } from './kpi.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('KPIs & Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kpis')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('momentum')
  @ApiOperation({ summary: 'Calculate the 6 core SOPET Momentum KPIs for authenticated user' })
  async getMomentumKpis(@CurrentUser() user: AuthenticatedUser) {
    return await this.kpiService.calculateUserMomentumKpis(user.id);
  }

  @Post(':id/values')
  @ApiOperation({ summary: 'Record a new KPI value entry (preserves historical timeline)' })
  async recordValue(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') kpiId: string,
    @Body() dto: RecordKpiValueDto,
  ) {
    return await this.kpiService.recordKpiValue(user.id, kpiId, dto);
  }
}
