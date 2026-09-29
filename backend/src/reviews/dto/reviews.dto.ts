import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWeeklyReviewDto {
  @ApiProperty({ example: 'goal-amina-primary' })
  @IsString()
  goalId: string;

  @ApiPropertyOptional({ example: '2026-09-20' })
  @IsOptional()
  @IsDateString()
  weekEndingDate?: string;

  @ApiProperty({ description: '1. What meaningful progress was made toward the primary goal?' })
  @IsString()
  meaningfulProgress: string;

  @ApiProperty({ description: '2. Which actions actually mattered vs avoidant busywork?' })
  @IsString()
  actionsThatMattered: string;

  @ApiProperty({ description: '3. What got in the way (internal friction, external conditions)?' })
  @IsString()
  whatGotInTheWay: string;

  @ApiPropertyOptional({ description: '4a. Which interventions or MMA techniques helped?' })
  @IsOptional()
  @IsString()
  interventionsThatHelped?: string;

  @ApiPropertyOptional({ description: '4b. What did NOT help?' })
  @IsOptional()
  @IsString()
  interventionsThatDidNotHelp?: string;

  @ApiPropertyOptional({ description: '5a. Did an interruption occur?' })
  @IsOptional()
  @IsBoolean()
  interruptionExperienced?: boolean;

  @ApiPropertyOptional({ description: '5b. How quickly was momentum resumed?' })
  @IsOptional()
  @IsString()
  restartDetails?: string;

  @ApiProperty({ description: 'What is the Next Meaningful Action (NMA) anchored for next week?' })
  @IsString()
  nextNmaTitle: string;

  @ApiPropertyOptional({ description: 'Personal lesson extracted from this week’s execution rhythm' })
  @IsOptional()
  @IsString()
  extractedLesson?: string;

  @ApiPropertyOptional({ description: 'Concrete adjustment for next cycle' })
  @IsOptional()
  @IsString()
  concreteAdjustment?: string;

  // Privacy / Encryption
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
