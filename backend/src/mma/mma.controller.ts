import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MmaService } from './mma.service';
import { CreateMmaDto } from './dto/mma.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Minimum Meaningful Action (MMA)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MmaController {
  constructor(private readonly mmaService: MmaService) {}

  @Get('actions/:id/mma')
  @ApiOperation({ summary: 'List MMAs linked to a parent action' })
  async getMmas(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') parentActionId: string,
  ) {
    return await this.mmaService.getMmasForAction(user.id, parentActionId);
  }

  @Post('actions/:id/mma')
  @ApiOperation({ summary: 'Create a Minimum Meaningful Action (MMA) linked to parent action' })
  async createMma(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') parentActionId: string,
    @Body() dto: CreateMmaDto,
  ) {
    return await this.mmaService.createMma(user.id, parentActionId, dto);
  }

  @Patch('mma/:id/complete')
  @ApiOperation({ summary: 'Complete MMA (Restores momentum without completing parent action!)' })
  async completeMma(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') mmaId: string,
  ) {
    return await this.mmaService.completeMma(user.id, mmaId);
  }
}
