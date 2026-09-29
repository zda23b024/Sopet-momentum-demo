import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrivacyService, RegisterKeyDto } from './privacy.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Privacy & Encryption')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Post('keys')
  @ApiOperation({ summary: 'Register client-wrapped encryption key metadata (never transmits raw private keys)' })
  async registerKey(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterKeyDto,
  ) {
    return await this.privacyService.registerKeyMetadata(user.id, dto);
  }

  @Get('keys/metadata')
  @ApiOperation({ summary: 'Retrieve client key wrapping metadata for client-side decryption' })
  async getKeyMetadata(@CurrentUser() user: AuthenticatedUser) {
    return await this.privacyService.getKeyMetadata(user.id);
  }
}
