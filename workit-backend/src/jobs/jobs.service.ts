import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
      relations: ['applications', 'postedBy'],
    });
  }

  // Find jobs posted by a specific user (for HR)
  async findByPostedBy(userId: number) {
    return this.jobRepo.find({
      where: { postedById: userId },
      order: { createdAt: 'DESC' },
      relations: ['applications', 'postedBy'],
    });
  }

  // Find all jobs (for super admin)
  async findAllForAdmin() {
    return this.jobRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['applications', 'postedBy', 'postedBy.profile'],
    });
  }

  async findLastFive() {
    return this.jobRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['applications'], // So we get application count
    });
  }

  // Find last five jobs for a specific user
  async findLastFiveByPostedBy(userId: number) {
    return this.jobRepo.find({
      where: { postedById: userId },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['applications'],
    });
  }

  async findOne(id: number) {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['postedBy', 'postedBy.profile'],
    });
    if (!job) throw new NotFoundException('Offre non trouvée');
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto, userId?: number) {
    const job = await this.findOne(id);

    // If userId is provided, check if user owns the job (for HR)
    if (userId && job.postedById !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres offres',
      );
    }

    Object.assign(job, updateJobDto);
    return this.jobRepo.save(job);
  }

  async remove(id: number, userId?: number) {
    const job = await this.findOne(id);

    // If userId is provided, check if user owns the job (for HR)
    if (userId && job.postedById !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres offres',
      );
    }

    return this.jobRepo.remove(job);
  }

  async countAll() {
    const total = await this.jobRepo.count();
    return { total };
  }
}
