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

  @Get('last-five')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  findLastFive() {
    return this.jobsService.findLastFive();
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
  @Roles('hr')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(parseInt(id, 10), updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(parseInt(id, 10));
  }
}
