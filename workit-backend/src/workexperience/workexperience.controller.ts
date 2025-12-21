import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkExperienceService } from './workexperience.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Work Experience')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workexperience')
export class WorkExperienceController {
  constructor(private readonly workService: WorkExperienceService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.workService.create(parseInt(req.user.userId, 10), body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.workService.findAllByUser(parseInt(req.user.userId, 10));
  }
}
