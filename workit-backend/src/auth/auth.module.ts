import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetRequest } from './entities/password-reset-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    UsersModule,
    PassportModule,
    MailModule,
    TypeOrmModule.forFeature([PasswordResetRequest]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
