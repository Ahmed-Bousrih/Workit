import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UserProfile } from './entities/userprofile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    UsersModule, // to access User entity if needed
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService], // optional, for use in other modules
})
export class ProfilesModule {}
