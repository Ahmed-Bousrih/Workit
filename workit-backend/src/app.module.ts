import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ApplicationsModule } from './applications/applications.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { EducationModule } from './education/education.module';
import { WorkExperienceModule } from './workexperience/workexperience.module';
import { SkillsModule } from './skills/skills.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          synchronize: false,
          autoLoadEntities: true,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    ApplicationsModule,
    JobsModule,
    ProfilesModule,
    EducationModule,
    WorkExperienceModule,
    SkillsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
