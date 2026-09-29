import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalStatus } from '@prisma/client';

export class CreateGoalDto {
  @ApiProperty({ example: 'Start a catering business' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Launch an artisan lunch catering service for local offices within 6 months.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Achieve financial independence and express culinary passion.' })
  @IsOptional()
  @IsString()
  whyItMatters?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isClientEncrypted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ciphertextPayload?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  encryptionMetadata?: string;
}

export class UpdateGoalStatusDto {
  @ApiProperty({ enum: GoalStatus })
  @IsEnum(GoalStatus)
  status: GoalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
