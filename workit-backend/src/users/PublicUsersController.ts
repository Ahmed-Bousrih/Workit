import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('public/users')
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('count')
  countCandidates(@Query('role') role?: string) {
    return this.usersService.countUsers(role);
  }
}
