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
      parseInt(req.user.userId, 10),
      parseInt(jobId, 10),
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
      parseInt(req.user.userId, 10),
      coverletter || null,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkIfApplied(@Query('jobId') jobId: string, @Request() req: any) {
    return this.appService.checkIfUserApplied(parseInt(req.user.userId, 10), parseInt(jobId, 10));
  }

  // Count applications for the current user
  @Get('count-mine')
  @UseGuards(JwtAuthGuard)
  countMine(@Req() req: any) {
    return this.appService.countForUser(parseInt((req.user as any).userId, 10));
  }

  // Get recent applications for current user
  @Get('recent-mine')
  @UseGuards(JwtAuthGuard)
  recentMine(@Req() req: any, @Query('limit') limit: string) {
    const parsedLimit = parseInt(limit, 10) || 3;
    return this.appService.recentForUser(parseInt((req.user as any).userId, 10), parsedLimit);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMine(@Req() req: any) {
    return this.appService.findMine(parseInt(req.user.userId, 10));
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @Roles('hr')
  countAll() {
    return this.appService.count();
  }

  @Get('count-spontaneous')
  @UseGuards(JwtAuthGuard)
  @Roles('hr')
  countSpontaneous() {
    return this.appService.count(true);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @Roles('hr')
  findRecent() {
    return this.appService.getRecent();
  }

  @Get('spontaneous')
  @UseGuards(JwtAuthGuard)
  @Roles('hr')
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
  @Roles('hr')
  getByJob(@Param('jobId') jobId: string) {
    return this.appService.getByJobId(parseInt(jobId, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(parseInt(id, 10));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles('hr')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Body('customMessage') customMessage?: string,
  ) {
    return this.appService.updateStatus(parseInt(id, 10), status, customMessage);
  }
}
