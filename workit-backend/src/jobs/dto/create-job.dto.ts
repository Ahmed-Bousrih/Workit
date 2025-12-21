import { IsString, IsOptional, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum JobCategory {
  IT = 'it',
  MARKETING = 'marketing',
  SALES = 'sales',
  HR = 'hr',
  FINANCE = 'finance',
  DESIGN = 'design',
  ENGINEERING = 'engineering',
  OTHER = 'other',
}

export class CreateJobDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Développeur Full Stack',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(3, { message: 'Le titre doit contenir au moins 3 caractères' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 100 caractères' })
  title: string;

  @ApiPropertyOptional({ description: 'General job description', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'La description ne peut pas dépasser 2000 caractères' })
  descriptionGeneral?: string;

  @ApiPropertyOptional({ description: 'Job missions and responsibilities', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Les missions ne peuvent pas dépasser 2000 caractères' })
  missions?: string;

  @ApiPropertyOptional({ description: 'Required profile and qualifications', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Le profil ne peut pas dépasser 2000 caractères' })
  profile?: string;

  @ApiPropertyOptional({ description: 'Job advantages and benefits', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Les avantages ne peuvent pas dépasser 1000 caractères' })
  advantages?: string;

  @ApiPropertyOptional({ description: 'Job location', example: 'Paris, France', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'La localisation ne peut pas dépasser 200 caractères' })
  location?: string;

  @ApiPropertyOptional({ description: 'Job category', enum: JobCategory, example: JobCategory.IT })
  @IsOptional()
  @IsEnum(JobCategory, { message: 'Catégorie invalide' })
  category?: JobCategory;

  @ApiPropertyOptional({ description: 'Job type', enum: JobType, example: JobType.FULL_TIME })
  @IsOptional()
  @IsEnum(JobType, { message: 'Type de contrat invalide' })
  jobType?: JobType;
}
