import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PublicUsersController } from './PublicUsersController';
import { UserProfile } from 'src/profiles/entities/userprofile.entity';
import { Skill } from '../skills/entities/skill.entity';
import { SkillsModule } from '../skills/skills.module';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../workexperience/entities/workexperience.entity';
import { Application } from 'src/applications/entities/application.entity';
import { UsersScheduler } from './users.scheduler';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Skill, Education, WorkExperience, Application]),
    MailModule,
    forwardRef(() => SkillsModule), // ✅ wrap SkillsModule
  ],
  providers: [UsersService, UsersScheduler],
  controllers: [UsersController, PublicUsersController],
  exports: [UsersService], // 👈 Export UsersService too
})
export class UsersModule {}
