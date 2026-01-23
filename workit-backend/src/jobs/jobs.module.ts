import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [TypeOrmModule], // Allow other modules to use Job
})
export class JobsModule {}
