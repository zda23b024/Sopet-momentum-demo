import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import {
  BarrierDiagnosisRequest,
  MmaGenerationRequest,
  RestartGuidanceRequest,
  SharpenNmaRequest,
} from './ai.interface';

@ApiTags('AI Methodology Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('diagnose-barrier')
  @ApiOperation({
    summary: 'Propose ACIF barrier diagnosis and approved intervention based on user explanation',
  })
  async diagnoseBarrier(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: BarrierDiagnosisRequest,
  ) {
    return await this.aiService.diagnoseBarrier(body, user.id, user.privacyMode);
  }

  @Post('suggest-mma')
  @ApiOperation({
    summary: 'Generate a 10-15 minute Minimum Meaningful Action (MMA) to restore momentum',
  })
  async suggestMma(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: MmaGenerationRequest,
  ) {
    return await this.aiService.suggestMma(body, user.id, user.privacyMode);
  }

  @Post('suggest-restart')
  @ApiOperation({
    summary: 'Recommend restart decision (RESUME, ADJUST, REDUCE) and immediate restart action',
  })
  async suggestRestart(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RestartGuidanceRequest,
  ) {
    return await this.aiService.suggestRestart(body, user.id, user.privacyMode);
  }

  @Post('sharpen-nma')
  @ApiOperation({
    summary: 'Refine a vague intention into an observable Next Meaningful Action (NMA)',
  })
  async sharpenNma(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: SharpenNmaRequest,
  ) {
    return await this.aiService.sharpenNma(body, user.id, user.privacyMode);
  }
}
