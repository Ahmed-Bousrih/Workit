import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperience } from './entities/workexperience.entity';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workRepo: Repository<WorkExperience>,
  ) {}

  async create(userId: string, data: Partial<WorkExperience>) {
    const experience = this.workRepo.create({ ...data, user: { id: userId } });
    return this.workRepo.save(experience);
  }

  async findAllByUser(userId: string) {
    return this.workRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }
}
