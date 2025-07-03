import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationStatus } from './entities/application.entity';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  @Post('/jobs/:jobId/apply')
  @UseGuards(JwtAuthGuard)
  async applyToJob(
    @Param('jobId') jobId: string,
    @Body('coverletter') coverletter: string,
    @Request() req: any,
  ) {
    return this.appService.applyToJob(
      req.user.userId,
      jobId,
      coverletter || null,
    );
  }

  @Post('/spontaneous')
  @UseGuards(JwtAuthGuard)
  async applySpontaneously(
    @Body('coverletter') coverletter: string,
    @Request() req: any,
  ) {
    return this.appService.applySpontaneously(
      req.user.userId,
      coverletter || null,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkIfApplied(@Query('jobId') jobId: string, @Request() req: any) {
    return this.appService.checkIfUserApplied(req.user.userId, jobId);
  }

  // Count applications for the current user
  @Get('count-mine')
  @UseGuards(JwtAuthGuard)
  countMine(@Req() req) {
    return this.appService.countForUser(req.user.userId);
  }

  // Get recent applications for current user
  @Get('recent-mine')
  @UseGuards(JwtAuthGuard)
  recentMine(@Req() req, @Query('limit') limit: string) {
    const parsedLimit = parseInt(limit, 10) || 3;
    return this.appService.recentForUser(req.user.userId, parsedLimit);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMine(@Req() req: any) {
    return this.appService.findMine(req.user.userId);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  countAll() {
    return this.appService.count();
  }

  @Get('count-spontaneous')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  countSpontaneous() {
    return this.appService.count(true);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  findRecent() {
    return this.appService.getRecent();
  }

  @Get('spontaneous')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  getSpontaneousApps() {
    return this.appService.findSpontaneous();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.appService.findOne(id);
  // }
  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  getByJob(@Param('jobId') jobId: string) {
    return this.appService.getByJobId(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Body('customMessage') customMessage?: string,
  ) {
    return this.appService.updateStatus(id, status, customMessage);
  }
}
