import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Knowledge Base')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Get()
  @ApiOperation({ summary: 'List published methodology knowledge entries' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'domain', required: false })
  async getEntries(@Query('type') type?: string, @Query('domain') domain?: string) {
    return await this.kbService.getEntries(type, domain);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get specific knowledge entry by unique code' })
  async getEntryByCode(@Param('code') code: string) {
    return await this.kbService.getEntryByCode(code);
  }
}
