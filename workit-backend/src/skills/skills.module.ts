import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill]),
    forwardRef(() => UsersModule), // ✅ wrap UsersModule
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService, TypeOrmModule],
})
export class SkillsModule {}
