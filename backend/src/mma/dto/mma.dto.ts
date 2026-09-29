import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMmaDto {
  @ApiProperty({ example: 'Open catering inquiry spreadsheet and read just the first row' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 10, default: 15 })
  @IsOptional()
  @IsInt()
  timeframeMinutes?: number;
}
