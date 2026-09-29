import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Administration & Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles('SYSTEM_OWNER', 'SUPPORT_ADMIN', 'SECURITY_ADMIN')
  @ApiOperation({ summary: 'View high-level anonymous system metrics' })
  async getMetrics() {
    return await this.adminService.getSystemMetrics();
  }

  @Get('audit-logs')
  @Roles('SYSTEM_OWNER', 'SECURITY_ADMIN')
  @ApiOperation({ summary: 'View recent tamper-evident audit logs (Security & Owner only)' })
  @ApiQuery({ name: 'limit', required: false })
  async getAuditLogs(@Query('limit') limit?: number) {
    return await this.adminService.getRecentAuditLogs(limit ? Number(limit) : 50);
  }

  @Get('security-events')
  @Roles('SYSTEM_OWNER', 'SECURITY_ADMIN')
  @ApiOperation({ summary: 'View security events (brute force flags, session revokes)' })
  @ApiQuery({ name: 'limit', required: false })
  async getSecurityEvents(@Query('limit') limit?: number) {
    return await this.adminService.getRecentSecurityEvents(limit ? Number(limit) : 50);
  }
}
