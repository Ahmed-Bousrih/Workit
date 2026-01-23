import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from 'src/profiles/entities/userprofile.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Skill } from '../skills/entities/skill.entity';
import { Education } from 'src/education/entities/education.entity';
import { WorkExperience } from 'src/workexperience/entities/workexperience.entity';
import { Application } from 'src/applications/entities/application.entity';
import { MailService } from '../mail/mail.service';
import { EmailTemplatesService } from '../mail/email-templates.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,

    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,

    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,

    @InjectRepository(WorkExperience)
    private readonly experienceRepo: Repository<WorkExperience>,

    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    private readonly mailService: MailService,
    private readonly emailTemplates: EmailTemplatesService,
  ) {}

  // Internal method - returns User entities
  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['profile'],
      order: { createdAt: 'DESC' },
    });
  }

  // Public method - returns sanitized DTOs
  async findAllSafe(): Promise<UserResponseDto[]> {
    const users = await this.findAll();
    // Exclude sensitive fields
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: false,
    });
  }

  async updateRole(id: number, role: 'super_admin' | 'hr' | 'candidate') {
    await this.userRepo.update({ id }, { role });
    return { message: 'Rôle mis à jour ✅' };
  }

  async remove(id: number) {
    return this.userRepo.delete({ id });
  }

  // Internal method - returns User entity (for database operations)
  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profile', 'skills', 'educations', 'workExperiences'], // 👈 include all
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Public method - returns sanitized DTO (for API responses)
  async findByIdSafe(id: number): Promise<UserResponseDto> {
    const user = await this.findById(id);
    // Exclude sensitive fields
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'isEmailVerified'],
    });
  }
  async createUser(data: {
    email: string;
    passwordHash: string;
    role: 'super_admin' | 'hr' | 'candidate';
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new BadRequestException('Email already exists');
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async updateLastSeen(id: number) {
    await this.userRepo.update(id, { lastSeenAt: new Date() });
  }

  async findByVerificationToken(token: string) {
    return this.userRepo.findOne({ where: { emailVerificationToken: token } });
  }
  async save(user: User): Promise<User> {
    const entity = this.userRepo.create(user);
    return await this.userRepo.save(entity); // no spread, no partial object
  }

  async markEmailVerified(userId: number) {
    await this.userRepo.update(
      { id: userId },
      {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    );
  }

  async markPasswordResetToken(userId: number, token: string) {
    await this.userRepo.update(
      { id: userId },
      {
        passwordResetToken: token,
        passwordResetExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    );
  }

  findByResetToken(token: string) {
    return this.userRepo.findOne({
      where: { passwordResetToken: token },
    });
  }

  async updatePassword(userId: number, hashed: string) {
    return this.userRepo.update(
      { id: userId },
      {
        passwordHash: hashed,
        passwordResetToken: null as any,
        passwordResetExpiresAt: null as any,
      },
    );
  }

  async deleteUser(id: number) {
    const user = await this.findById(id);
    return this.userRepo.remove(user);
  }

  async updateUser(userId: number, updates: any) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['skills'],
    });

    if (!user) throw new NotFoundException('User not found');

    // --- Update or create UserProfile ---
    const profile = await this.profileRepo.findOne({ where: { userId } });
    const profileData = {
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
      address: updates.address,
      aboutMe: updates.aboutMe,
    };

    if (profile) {
      Object.assign(profile, profileData);
      await this.profileRepo.save(profile);
    } else {
      await this.profileRepo.save(
        this.profileRepo.create({ userId, ...profileData }),
      );
    }

    // --- Update skills ---
    if (Array.isArray(updates.skills)) {
      const skillNames = updates.skills.map((s: any) =>
        s.name.trim().toLowerCase(),
      );

      const existingSkills = await this.skillRepo.find({
        where: skillNames.map((name: string) => ({ name })),
      });

      const existingNames = existingSkills.map((s) => s.name.toLowerCase());

      const newSkills = skillNames
        .filter((name: string) => !existingNames.includes(name))
        .map((name: string) => this.skillRepo.create({ name }));

      const savedNewSkills = await this.skillRepo.save(newSkills);
      user.skills = [...existingSkills, ...savedNewSkills];
    }

    // --- Normalize helper ---
    const normalizeDate = (date?: string, ongoing?: boolean) =>
      ongoing || !date ? null : date.length === 7 ? `${date}-01` : date;

    // --- Update education ---
    if (Array.isArray(updates.education)) {
      await this.educationRepo.delete({ user: { id: userId } });

      const newEducation = updates.education.map((edu: any) =>
        this.educationRepo.create({
          ...edu,
          user: { id: userId },
        }),
      );

      await this.educationRepo.save(newEducation);
    }

    // --- Update work experience ---
    if (Array.isArray(updates.experience)) {
      await this.experienceRepo.delete({ user: { id: userId } });

      const newExperience = updates.experience.map((exp: any) =>
        this.experienceRepo.create({
          ...exp,
          startDate: normalizeDate(exp.startDate),
          endDate: normalizeDate(exp.endDate, exp.isOngoing),
          user: { id: userId },
        }),
      );

      await this.experienceRepo.save(newExperience);
    }

    // --- Save updated user (skills relation) ---
    await this.userRepo.save(user);

    // Return user entity (caller can transform if needed)
    return this.findById(userId);
  }

  // Public method - returns sanitized DTO after update
  async updateUserSafe(userId: number, updates: any): Promise<UserResponseDto> {
    await this.updateUser(userId, updates);
    return this.findByIdSafe(userId);
  }

  // Internal method - returns User entities
  async findHrs(): Promise<User[]> {
    return this.userRepo.find({ where: { role: 'hr' } });
  }

  // Public method - returns sanitized DTOs
  async findHrsSafe(): Promise<UserResponseDto[]> {
    const hrs = await this.findHrs();
    // Exclude sensitive fields
    return plainToInstance(UserResponseDto, hrs, {
      excludeExtraneousValues: false,
    });
  }

  async createHr(
    email: string,
    password: string,
    role: 'super_admin' | 'hr' | 'candidate' = 'hr',
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    const hr = this.userRepo.create({ email, passwordHash, role });
    return this.userRepo.save(hr);
  }

  async countUsers(role?: 'super_admin' | 'hr' | 'candidate') {
    const where = role ? { role } : {};
    const total = await this.userRepo.count({ where });
    return { total };
  }

  async updateProfilePhoto(userId: number, photoUrl: string) {
    await this.profileRepo.update(userId, { photoUrl });
    const updatedProfile = await this.profileRepo.findOne({
      where: { userId },
    });

    return {
      message: 'Photo de profil mise à jour.',
      photoUrl,
      profile: updatedProfile,
    };
  }

  async updateResumeUrl(userId: number, resumeUrl: string) {
    await this.profileRepo.update({ userId }, { resumeUrl }); // ✅ update the UserProfile table
    return { message: 'CV mis à jour.', resumeUrl };
  }

  async deleteResume(userId: number): Promise<{ message: string }> {
    const userProfile = await this.profileRepo.findOne({ where: { userId } });

    if (!userProfile || !userProfile.resumeUrl) {
      return { message: 'Aucun CV à supprimer.' };
    }

    // Resolve absolute path from resumeUrl
    // resumeUrl format: /uploads/resumes/filename.pdf
    // __dirname in dist: workit-backend/dist/users
    // We need to go: dist/users -> dist -> workit-backend -> uploads/resumes/filename.pdf
    const projectRoot = path.join(__dirname, '../..');
    const filePath = path.join(projectRoot, userProfile.resumeUrl);

    // Try deleting the file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn(
        `Erreur lors de la suppression du fichier: ${filePath}`,
        err,
      );
    }

    // Update DB
    await this.profileRepo.update({ userId }, { resumeUrl: null as any });

    return { message: 'CV supprimé avec succès.' };
  }

  async deleteCascade(userId: number) {
    // Clear skills many-to-many
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['skills'],
    });

    if (user) {
      user.skills = [];
      await this.userRepo.save(user);
    }

    await this.appRepo.delete({ user: { id: userId } });
    await this.educationRepo.delete({ userId });
    await this.experienceRepo.delete({ userId });
    await this.profileRepo.delete({ userId });
    await this.userRepo.delete({ id: userId });
  }

  async warnInactiveUsers() {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 150);

    const users = await this.userRepo.find({
      where: {
        role: 'candidate',
        lastSeenAt: LessThan(threshold),
        isEmailVerified: true,
      },
    });

    for (const user of users) {
      const userProfile = await this.profileRepo.findOne({
        where: { userId: user.id },
      });
      const text = `Bonjour ${userProfile?.firstName || ''},

Cela fait longtemps que vous n'avez pas utilisé WorkIt. Votre compte est inactif depuis plus de 5 mois.

Votre compte sera supprimé dans 30 jours si aucune activité n'est détectée. Pour conserver votre compte, connectez-vous simplement sur WorkIt dans les 30 prochains jours.

Cordialement,
L'équipe WorkIt`;

      const html = this.emailTemplates.getInactiveUserWarningTemplate(
        userProfile?.firstName,
      );

      await this.mailService.sendMail(
        user.email,
        '⏳ Votre compte WorkIt est inactif',
        text,
        html,
      );
    }

    return { notified: users.length };
  }

  async removeInactiveUsers(thresholdDays: number = 180) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - thresholdDays);
    const result = await this.userRepo.delete({
      lastSeenAt: LessThan(threshold),
    });

    return { deleted: result.affected };
  }
}
