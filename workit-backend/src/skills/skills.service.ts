import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
    private readonly usersService: UsersService,
  ) {}

  async getAllSkills() {
    return this.skillRepo.find({ order: { name: 'ASC' } });
  }

  async updateUserSkills(userId: number, skillIds: number[]) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const skills = await this.skillRepo.find({
      where: skillIds.map((id) => ({ id })),
    });
    user.skills = skills;

    return this.usersService.save(user); // make sure UsersService exposes save()
  }
}
