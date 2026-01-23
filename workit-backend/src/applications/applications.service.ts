import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { MailService } from '../mail/mail.service';
import { EmailTemplatesService } from '../mail/email-templates.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly mailService: MailService,
    private readonly emailTemplates: EmailTemplatesService,
  ) {}

  async updateStatus(
    id: number,
    status: ApplicationStatus,
    customMessage?: string,
  ) {
    const app = await this.appRepo.findOne({
      where: { id, isDeleted: false }, // Don't allow updating deleted applications
      relations: ['user', 'user.profile', 'job'],
    });

    if (!app) throw new NotFoundException('Candidature introuvable');

    app.status = status;
    await this.appRepo.save(app);

    const userName = app.user.profile?.firstName || '';

    // 💬 Fallback to standard message if no customMessage provided
    const text =
      customMessage?.trim() ||
      this.buildStandardMessage(
        status,
        app.job?.title,
        app.isSpontaneous,
        userName,
      );

    const subject = app.isSpontaneous
      ? status === 'rejected'
        ? 'Réponse à votre candidature spontanée - WorkIt'
        : status === 'accepted'
          ? 'Félicitations ! Votre candidature spontanée a été acceptée - WorkIt'
          : 'Votre candidature spontanée avance - WorkIt'
      : status === 'rejected'
        ? `Réponse à votre candidature - ${app.job?.title} - WorkIt`
        : status === 'accepted'
          ? `Félicitations ! Votre candidature - ${app.job?.title} - WorkIt`
          : `Votre candidature avance - ${app.job?.title} - WorkIt`;

    const html = this.emailTemplates.getApplicationStatusTemplate(
      status,
      text,
      app.job?.title,
      app.isSpontaneous,
      userName,
    );

    await this.mailService.sendMail(app.user.email, subject, text, html);

    return { message: 'Statut mis à jour et email envoyé avec succès' };
  }

  private buildStandardMessage(
    status: ApplicationStatus,
    jobTitle?: string,
    isSpontaneous?: boolean,
    userName: string = '',
  ): string {
    if (isSpontaneous) {
      if (status === 'rejected') {
        return `Bonjour ${userName},

Nous vous remercions pour votre candidature spontanée. Après examen, nous regrettons de vous informer qu'elle n'a pas été retenue.`;
      } else if (status === 'accepted') {
        return `Bonjour ${userName},

Félicitations ! Votre candidature spontanée a été acceptée. Nous vous contacterons prochainement pour discuter des prochaines étapes.`;
      } else {
        return `Bonjour ${userName},

Bonne nouvelle ! Votre candidature spontanée a été retenue pour l'étape suivante. Nous reviendrons vers vous prochainement.`;
      }
    }

    if (status === 'rejected') {
      return `Bonjour ${userName},

Nous vous remercions pour votre candidature au poste "${jobTitle}". Après examen, nous regrettons de vous informer qu'elle n'a pas été retenue.`;
    } else if (status === 'accepted') {
      return `Bonjour ${userName},

Félicitations ! Votre candidature au poste "${jobTitle}" a été acceptée. Nous vous contacterons prochainement pour discuter des prochaines étapes.`;
    } else {
      return `Bonjour ${userName},

Bonne nouvelle ! Votre candidature au poste "${jobTitle}" a été retenue pour l'étape suivante. Nous reviendrons vers vous prochainement.`;
    }
  }

  async findAll(status?: ApplicationStatus, includeDeleted: boolean = false) {
    const where: any = status ? { status } : {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      relations: ['user', 'user.profile', 'job'],
      order: { appliedAt: 'DESC' },
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async findSpontaneous(includeDeleted: boolean = false) {
    const where: any = {
      isSpontaneous: true,
      status: Not('rejected'),
    };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      relations: ['user', 'user.profile', 'job'],
      order: { appliedAt: 'DESC' },
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async findOne(id: number, includeDeleted: boolean = false) {
    const where: any = { id };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const application = await this.appRepo.findOne({
      where,
      relations: ['user', 'user.profile', 'job'],
    });
    if (!application) return null;
    // Sanitize user data
    return {
      ...application,
      user: application.user
        ? plainToInstance(UserResponseDto, application.user, {
            excludeExtraneousValues: false,
          })
        : application.user,
    };
  }

  async remove(id: number, hardDelete: boolean = false) {
    const application = await this.appRepo.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Candidature introuvable');
    }

    if (hardDelete) {
      // Hard delete - only for super admin
      return this.appRepo.remove(application);
    } else {
      // Soft delete
      application.isDeleted = true;
      application.deletedAt = new Date();
      return this.appRepo.save(application);
    }
  }

  async restore(id: number) {
    const application = await this.appRepo.findOne({
      where: { id, isDeleted: true },
    });

    if (!application) {
      throw new NotFoundException('Candidature supprimée introuvable');
    }

    application.isDeleted = false;
    application.deletedAt = null;
    return this.appRepo.save(application);
  }

  async getRecent(includeDeleted: boolean = false) {
    const where: any = { status: Not('rejected') };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      relations: ['user', 'user.profile', 'job'],
      order: { appliedAt: 'DESC' },
      take: 5,
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async getByJobId(jobId: number, includeDeleted: boolean = false) {
    const where: any = {
      job: { id: jobId },
      status: Not('rejected'), // optional, to exclude rejected
    };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      relations: ['user', 'user.profile', 'job'],
      order: { appliedAt: 'DESC' },
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async count(spontaneous?: boolean, includeDeleted: boolean = false) {
    const where: any = {
      status: Not('rejected'),
    };
    if (spontaneous !== undefined) {
      where.isSpontaneous = spontaneous;
    }
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const total = await this.appRepo.count({ where });
    return { total };
  }

  async countForUser(userId: number, includeDeleted: boolean = false) {
    const where: any = { user: { id: userId } };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const total = await this.appRepo.count({ where });
    return { total };
  }

  async recentForUser(
    userId: number,
    limit: number,
    includeDeleted: boolean = false,
  ) {
    const where: any = { user: { id: userId } };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      order: { appliedAt: 'DESC' },
      take: limit,
      relations: ['job', 'user', 'user.profile'],
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async findMine(userId: number, includeDeleted: boolean = false) {
    const where: any = { user: { id: userId } };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    const applications = await this.appRepo.find({
      where,
      relations: ['job', 'user', 'user.profile'],
      order: { appliedAt: 'DESC' },
    });
    // Sanitize user data in applications
    return applications.map((app) => ({
      ...app,
      user: app.user
        ? plainToInstance(UserResponseDto, app.user, {
            excludeExtraneousValues: false,
          })
        : app.user,
    }));
  }

  async applyToJob(userId: number, jobId: number, coverletter: string | null) {
    // Check if job exists and is not deleted
    const job = await this.jobRepo.findOne({
      where: { id: jobId, isDeleted: false },
    });

    if (!job) {
      throw new NotFoundException('Offre introuvable ou supprimée');
    }

    const cleanCover = cleanCoverletter(coverletter);

    const application = this.appRepo.create({
      user: { id: userId },
      job: { id: jobId },
      coverletter: cleanCover,
      isSpontaneous: false,
    });

    const saved = await this.appRepo.save(application);

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (user?.email && job?.title) {
      const subject = `📩 Candidature reçue pour le poste : ${job.title} - WorkIt`;
      const text = `Bonjour ${user.profile?.firstName || ''},

Nous avons bien reçu votre candidature pour le poste de "${job.title}" via WorkIt.

Notre équipe de recrutement l'examinera prochainement. Vous recevrez une réponse une fois qu'elle aura été examinée.

Cordialement,
L'équipe WorkIt`;

      const html = this.emailTemplates.getApplicationReceivedTemplate(
        job.title,
        user.profile?.firstName,
      );

      await this.mailService.sendMail(user.email, subject, text, html);
    }

    return saved;
  }

  async applySpontaneously(userId: number, coverletter: string | null) {
    const cleanCover = cleanCoverletter(coverletter);
    const application = this.appRepo.create({
      user: { id: userId },
      job: null,
      coverletter: cleanCover,
      isSpontaneous: true,
    });

    const saved = await this.appRepo.save(application);

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (user?.email) {
      const subject =
        '📩 Votre candidature spontanée a bien été reçue - WorkIt';
      const text = `Bonjour ${user.profile?.firstName || ''},

Nous avons bien reçu votre candidature spontanée sur WorkIt.

Elle sera examinée par notre équipe dès que possible. Nous vous contacterons si un poste correspond à votre profil.

Cordialement,
L'équipe WorkIt`;

      const html =
        this.emailTemplates.getSpontaneousApplicationReceivedTemplate(
          user.profile?.firstName,
        );

      await this.mailService.sendMail(user.email, subject, text, html);
    }

    return saved;
  }
  async checkIfUserApplied(userId: number, jobId: number) {
    const existing = await this.appRepo.findOne({
      where: {
        user: { id: userId },
        job: { id: jobId },
        isDeleted: false, // Only check non-deleted applications
      },
    });

    return { applied: !!existing };
  }
}

function cleanCoverletter(text: string | null): string | null {
  if (!text) return null;

  return text
    .replace(/\r\n/g, '\n') // normalize Windows line breaks
    .replace(/\r/g, '\n') // normalize Mac line breaks
    .replace(/\n{3,}/g, '\n\n') // limit multiple blank lines
    .trim();
}
