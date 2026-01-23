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
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  async create(createJobDto: CreateJobDto, postedBy?: number) {
    const job = this.jobRepo.create({
      ...createJobDto,
      postedById: postedBy,
      postedBy: postedBy ? ({ id: postedBy } as any) : undefined,
    });
    return this.jobRepo.save(job);
  }

  findAll(includeDeleted: boolean = false) {
    const where: any = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return this.jobRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['applications', 'postedBy'],
    });
  }

  // Find jobs posted by a specific user (for HR)
  async findByPostedBy(userId: number, includeDeleted: boolean = false) {
    const where: any = { postedById: userId };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return this.jobRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['applications', 'postedBy'],
    });
  }

  // Find all jobs (for super admin) - can include deleted
  async findAllForAdmin(includeDeleted: boolean = false) {
    const where: any = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return this.jobRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['applications', 'postedBy', 'postedBy.profile'],
    });
  }

  async findLastFive(includeDeleted: boolean = false) {
    const where: any = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return this.jobRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['applications'], // So we get application count
    });
  }

  // Find last five jobs for a specific user
  async findLastFiveByPostedBy(
    userId: number,
    includeDeleted: boolean = false,
  ) {
    const where: any = { postedById: userId };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return this.jobRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['applications'],
    });
  }

  async findOne(id: number, includeDeleted: boolean = false) {
    const where: any = { id };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const job = await this.jobRepo.findOne({
      where,
      relations: ['postedBy', 'postedBy.profile'],
    });
    if (!job) throw new NotFoundException('Offre non trouvée');
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto, userId?: number) {
    const job = await this.findOne(id, false); // Don't allow updating deleted jobs

    // If userId is provided, check if user owns the job (for HR)
    if (userId && job.postedById !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres offres',
      );
    }

    Object.assign(job, updateJobDto);
    return this.jobRepo.save(job);
  }

  async remove(id: number, userId?: number, hardDelete: boolean = false) {
    const job = await this.findOne(id, hardDelete); // Allow finding deleted jobs for hard delete

    // If userId is provided, check if user owns the job (for HR)
    if (userId && job.postedById !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres offres',
      );
    }

    if (hardDelete) {
      // Hard delete - only for super admin
      // Hard delete all applications for this job first
      const applications = await this.appRepo.find({
        where: { job: { id } },
      });
      if (applications.length > 0) {
        await this.appRepo.remove(applications);
      }
      // Then hard delete the job
      return this.jobRepo.remove(job);
    } else {
      // Soft delete
      job.isDeleted = true;
      job.deletedAt = new Date();
      // Also soft delete all applications for this job
      await this.appRepo.update(
        { job: { id }, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
      );
      return this.jobRepo.save(job);
    }
  }

  async restore(id: number) {
    const job = await this.jobRepo.findOne({
      where: { id, isDeleted: true },
    });

    if (!job) {
      throw new NotFoundException('Offre supprimée introuvable');
    }

    job.isDeleted = false;
    job.deletedAt = null;
    // Also restore all applications for this job
    await this.appRepo.update(
      { job: { id }, isDeleted: true },
      { isDeleted: false, deletedAt: null },
    );
    return this.jobRepo.save(job);
  }

  async countAll(includeDeleted: boolean = false) {
    const where: any = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const total = await this.jobRepo.count({ where });
    return { total };
  }
}
