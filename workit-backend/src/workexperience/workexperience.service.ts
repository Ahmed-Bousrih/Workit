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

  async create(userId: number, data: Partial<WorkExperience>) {
    const experience = this.workRepo.create({ ...data, user: { id: userId } });
    return this.workRepo.save(experience);
  }

  async findAllByUser(userId: number) {
    return this.workRepo.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }
}
