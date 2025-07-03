import { IsString, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  descriptionGeneral?: string;

  @IsOptional()
  @IsString()
  missions?: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsString()
  advantages?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
