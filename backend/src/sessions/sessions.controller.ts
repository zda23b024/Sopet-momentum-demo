import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active sessions and devices for authenticated user' })
  async getSessions(@CurrentUser() user: AuthenticatedUser) {
    return await this.sessionsService.getUserSessions(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke a specific active session' })
  async revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') sessionId: string,
  ) {
    return await this.sessionsService.revokeSession(user.id, sessionId);
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke all other active sessions except current' })
  async revokeAllOtherSessions(@CurrentUser() user: AuthenticatedUser) {
    return await this.sessionsService.revokeAllOtherSessions(user.id, user.sessionId);
  }
}
