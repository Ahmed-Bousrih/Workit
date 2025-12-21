import {
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from './create-profile.dto';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'First name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Phone number', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20, {
    message: 'Le numéro de téléphone ne peut pas dépasser 20 caractères',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Address', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "L'adresse ne peut pas dépasser 500 caractères" })
  address?: string;

  @ApiPropertyOptional({ description: 'About me section', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'La description ne peut pas dépasser 2000 caractères',
  })
  aboutMe?: string;

  @ApiPropertyOptional({ description: 'Skills array' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Birth date', example: '1990-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'Date de naissance invalide' })
  birthDate?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: Gender })
  @IsOptional()
  @IsEnum(Gender, { message: 'Genre invalide' })
  gender?: Gender;
}
