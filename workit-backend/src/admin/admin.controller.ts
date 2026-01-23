import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/role.guard';
import { ProfilesService } from '../profiles/profiles.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('candidates')
  @Roles('hr')
  searchCandidates(
    @Query('skill') skill?: string,
    @Query('jobTitle') jobTitle?: string,
  ) {
    return this.profilesService.searchCandidates(skill, jobTitle);
  }

  @Get('candidates/:id')
  @Roles('hr')
  getCandidateById(@Param('id') id: string) {
    return this.profilesService.getProfile(parseInt(id, 10));
  }

  @Post('candidates')
  @Roles('hr')
  createCandidate(
    @Body()
    body: {
      userId: string | number;
      firstName: string;
      lastName: string;
      skills: string[];
      jobTitle?: string;
    },
  ) {
    const profileData = {
      ...body,
      userId:
        typeof body.userId === 'string'
          ? parseInt(body.userId, 10)
          : body.userId,
    };
    return this.profilesService.createProfile(profileData);
  }

  @Put('candidates/:id')
  @Roles('hr')
  updateCandidate(@Param('id') id: string, @Body() body: any) {
    return this.profilesService.updateProfile(parseInt(id, 10), body);
  }

  @Delete('candidates/:id')
  @Roles('hr')
  deleteCandidate(@Param('id') id: string) {
    return this.profilesService.deleteProfile(parseInt(id, 10));
  }

  @Post('users')
  @Roles('super_admin')
  createHr(@Body() body: CreateUserDto) {
    const { email, password, role } = body;
    return this.usersService.createHr(email, password, role);
  }

  @Get('users')
  @Roles('super_admin')
  getAllHrs() {
    return this.usersService.findHrsSafe();
  }

  @Delete('users/:id')
  @Roles('super_admin')
  deleteHr(@Param('id') id: string) {
    return this.usersService.deleteUser(parseInt(id, 10));
  }
}
