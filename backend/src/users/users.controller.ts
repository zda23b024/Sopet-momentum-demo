import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { PrivacyMode } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile and privacy configuration' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return await this.usersService.getProfile(user.id);
  }

  @Patch('privacy-mode')
  @ApiOperation({ summary: 'Update user privacy mode (STANDARD_PRIVATE, ENCRYPTED_PRIVATE, HIGHLY_CONFIDENTIAL)' })
  async updatePrivacyMode(
    @CurrentUser() user: AuthenticatedUser,
    @Body('mode') mode: PrivacyMode,
  ) {
    return await this.usersService.updatePrivacyMode(user.id, mode);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password with current password verification (Argon2id)' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { currentPass: string; newPass: string },
  ) {
    return await this.usersService.changePassword(user.id, body.currentPass, body.newPass);
  }

  @Post('delete-account')
  @ApiOperation({ summary: 'Initiate account deletion workflow with grace period' })
  async requestDeletion(@CurrentUser() user: AuthenticatedUser) {
    return await this.usersService.requestAccountDeletion(user.id);
  }
}
