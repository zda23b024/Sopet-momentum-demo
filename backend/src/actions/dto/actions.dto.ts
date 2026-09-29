import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionStatus } from '@prisma/client';

export class CreateActionDto {
  @ApiProperty({ example: 'goal-amina-primary' })
  @IsString()
  goalId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  milestoneId?: string;

  @ApiProperty({ example: 'Interview three catering clients about seasonal lunch preferences' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Reach out to local office managers via phone or email.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isNMA?: boolean;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;

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

export class UpdateActionStatusDto {
  @ApiProperty({ enum: ActionStatus })
  @IsEnum(ActionStatus)
  status: ActionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class DesignateNmaDto {
  @ApiPropertyOptional({ example: 'Highest immediate strategic leverage for milestone 1' })
  @IsOptional()
  @IsString()
  rationale?: string;
}
