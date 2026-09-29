import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';
import { Public } from '../common/decorators/roles.decorator';

@ApiTags('Health & Status')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: this.prisma.isConnected ? 'connected' : 'disconnected_or_memory_mode',
      uptimeSeconds: process.uptime(),
      version: '1.0.0',
    };
  }
}
