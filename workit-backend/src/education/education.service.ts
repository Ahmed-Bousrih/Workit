import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,
  ) {}

  async create(userId: number, data: Partial<Education>) {
    const education = this.educationRepo.create({
      ...data,
      user: { id: userId },
    });
    return this.educationRepo.save(education);
  }

  async findAllByUser(userId: number) {
    return this.educationRepo.find({
      where: { user: { id: userId } },
      order: { startYear: 'DESC' },
    });
  }
}
