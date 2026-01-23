import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    return this.jobsService.create(createJobDto, parseInt(req.user.userId, 10));
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  findMyJobs(@Request() req: any) {
    return this.jobsService.findByPostedBy(parseInt(req.user.userId, 10));
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  findAllForAdmin(@Query('includeDeleted') includeDeleted?: string) {
    return this.jobsService.findAllForAdmin(includeDeleted === 'true');
  }

  @Get('last-five')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  findLastFive(@Request() req: any) {
    return this.jobsService.findLastFiveByPostedBy(
      parseInt(req.user.userId, 10),
    );
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Get('count')
  countAllJobs() {
    return this.jobsService.countAll(); // Returns { total: number }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(parseInt(id, 10));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr', 'super_admin')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    // Super admin can update any job, HR can only update their own
    const userId =
      req.user.role === 'super_admin'
        ? undefined
        : parseInt(req.user.userId, 10);
    return this.jobsService.update(parseInt(id, 10), updateJobDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr', 'super_admin')
  remove(@Param('id') id: string, @Request() req: any) {
    // Super admin can delete any job, HR can only delete their own
    // By default, soft delete
    const userId =
      req.user.role === 'super_admin'
        ? undefined
        : parseInt(req.user.userId, 10);
    return this.jobsService.remove(parseInt(id, 10), userId, false);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  restore(@Param('id') id: string) {
    return this.jobsService.restore(parseInt(id, 10));
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  hardDelete(@Param('id') id: string) {
    return this.jobsService.remove(parseInt(id, 10), undefined, true);
  }
}
