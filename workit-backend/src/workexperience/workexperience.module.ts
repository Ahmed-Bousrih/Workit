import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceController } from './workexperience.controller';
import { WorkExperienceService } from './workexperience.service';
import { WorkExperience } from './entities/workexperience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience])],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
})
export class WorkExperienceModule {}
