import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EducationService } from './education.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Education')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.educationService.create(parseInt(req.user.userId, 10), body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.educationService.findAllByUser(parseInt(req.user.userId, 10));
  }
}
