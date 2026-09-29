import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InterventionsService } from './interventions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Interventions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Get('interventions')
  @ApiOperation({ summary: 'Get list of published, protocol-approved interventions' })
  async getInterventions() {
    return await this.interventionsService.getInterventions();
  }

  @Post('actions/:id/interventions')
  @ApiOperation({ summary: 'Apply an approved intervention to a blocked or resistant action' })
  async linkIntervention(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') actionId: string,
    @Body() body: { interventionCode: string; barrierId?: string; outcomeNotes?: string },
  ) {
    return await this.interventionsService.linkInterventionToAction(
      user.id,
      actionId,
      body.interventionCode,
      body.barrierId,
      body.outcomeNotes,
    );
  }
}
