import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReadinessDto {
  @ApiProperty({ description: '1. Do I clearly understand the action boundary?' })
  @IsBoolean()
  clearlyUnderstood: boolean;

  @ApiProperty({ description: '2. Do I know how to do it?' })
  @IsBoolean()
  knowsHowToDo: boolean;

  @ApiProperty({ description: '3. Do I have the necessary resources?' })
  @IsBoolean()
  hasResources: boolean;

  @ApiProperty({ description: '4. Is anything else required first?' })
  @IsBoolean()
  prerequisitesMet: boolean;

  @ApiProperty({ description: '5. Is internal/emotional resistance manageable?' })
  @IsBoolean()
  internalResistanceLow: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
