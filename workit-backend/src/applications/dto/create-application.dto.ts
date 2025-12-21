import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiPropertyOptional({ description: 'Cover letter', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, {
    message: 'La lettre de motivation ne peut pas dépasser 5000 caractères',
  })
  coverletter?: string;

  @ApiPropertyOptional({
    description: 'Is this a spontaneous application',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSpontaneous?: boolean;
}
