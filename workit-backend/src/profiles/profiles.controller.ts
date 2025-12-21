import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  getProfile(@Request() req: any) {
    return this.profilesService.getProfile(req.user.userId);
  }

  @Patch()
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.profilesService.updateProfile(req.user.userId, body);
  }
}
