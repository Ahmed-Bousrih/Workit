import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, User, Job]),
    MailModule, // ✅ Add this line
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
