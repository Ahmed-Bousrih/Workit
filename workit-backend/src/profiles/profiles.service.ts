import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/userprofile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    let profile = await this.profileRepo.findOne({ where: { userId } });

    if (!profile) {
      profile = this.profileRepo.create({ userId, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    return this.profileRepo.save(profile);
  }

  async createProfile(body: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    resumeUrl?: string;
    aboutMe?: string;
  }) {
    const existing = await this.profileRepo.findOne({
      where: { userId: body.userId },
    });
    if (existing) {
      throw new BadRequestException('Profile already exists for this user');
    }

    const profile = this.profileRepo.create(body);
    return this.profileRepo.save(profile);
  }

  async deleteProfile(userId: string) {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.profileRepo.remove(profile);
  }

  async searchCandidates(skill?: string, jobTitle?: string) {
    const query = this.profileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('user.skills', 'skills');

    if (skill) {
      query.andWhere('LOWER(skills.name) LIKE LOWER(:skill)', {
        skill: `%${skill}%`,
      });
    }

    if (jobTitle) {
      query.andWhere('LOWER(profile.aboutMe) LIKE LOWER(:jobTitle)', {
        jobTitle: `%${jobTitle}%`,
      });
    }

    return query.getMany();
  }
}
