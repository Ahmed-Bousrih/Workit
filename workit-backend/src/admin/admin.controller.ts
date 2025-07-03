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
  @Roles('admin')
  searchCandidates(
    @Query('skill') skill?: string,
    @Query('jobTitle') jobTitle?: string,
  ) {
    return this.profilesService.searchCandidates(skill, jobTitle);
  }

  @Get('candidates/:id')
  @Roles('admin')
  getCandidateById(@Param('id') id: string) {
    return this.profilesService.getProfile(id);
  }

  @Post('candidates')
  @Roles('admin')
  createCandidate(
    @Body()
    body: {
      userId: string;
      firstName: string;
      lastName: string;
      skills: string[];
      jobTitle?: string;
    },
  ) {
    return this.profilesService.createProfile(body);
  }

  @Put('candidates/:id')
  @Roles('admin')
  updateCandidate(@Param('id') id: string, @Body() body: any) {
    return this.profilesService.updateProfile(id, body);
  }

  @Delete('candidates/:id')
  @Roles('admin')
  deleteCandidate(@Param('id') id: string) {
    return this.profilesService.deleteProfile(id);
  }

  @Post('users')
  @Roles('super_admin')
  createAdmin(@Body() body: CreateUserDto) {
    const { email, password, role } = body;
    return this.usersService.createAdmin(email, password, role);
  }

  @Get('users')
  @Roles('super_admin')
  getAllAdmins() {
    return this.usersService.findAdmins();
  }

  @Delete('users/:id')
  @Roles('super_admin')
  deleteAdmin(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
