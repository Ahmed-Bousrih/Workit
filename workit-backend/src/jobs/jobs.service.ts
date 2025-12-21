import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, postedBy?: number) {
    const job = this.jobRepo.create({
      ...createJobDto,
      postedById: postedBy,
      postedBy: postedBy ? ({ id: postedBy } as any) : undefined,
    });
    return this.jobRepo.save(job);
  }

  findAll() {
    return this.jobRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['applications'],
    });
  }

  async findLastFive() {
    return this.jobRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['applications'], // So we get application count
    });
  }

  async findOne(id: number) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Offre non trouvée');
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return this.jobRepo.save(job);
  }

  async remove(id: number) {
    const job = await this.findOne(id);
    return this.jobRepo.remove(job);
  }

  async countAll() {
    const total = await this.jobRepo.count();
    return { total };
  }
}
