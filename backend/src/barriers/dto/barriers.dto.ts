import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BarrierCategoryCode } from '@prisma/client';

export class BlockActionDto {
  @ApiProperty({ example: 'I feel completely overwhelmed looking at all 20 catering inquiries at once.' })
  @IsString()
  userExplanation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isClientEncrypted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ciphertextExplanation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  encryptionMetadata?: string;
}

export class ConfirmBarrierDto {
  @ApiProperty({ enum: BarrierCategoryCode, example: BarrierCategoryCode.OVERWHELM })
  @IsEnum(BarrierCategoryCode)
  confirmedCategory: BarrierCategoryCode;

  @ApiPropertyOptional({ enum: ['CONFIRMED', 'MODIFIED', 'REJECTED'], default: 'CONFIRMED' })
  @IsOptional()
  @IsString()
  userConfirmationState?: string;

  @ApiPropertyOptional({ enum: BarrierCategoryCode })
  @IsOptional()
  @IsEnum(BarrierCategoryCode)
  aiSuggestedCategory?: BarrierCategoryCode;

  @ApiPropertyOptional({ example: 'INT_MMA_OVERWHELM' })
  @IsOptional()
  @IsString()
  selectedInterventionCode?: string;
}
