import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { PasswordResetRequest } from './entities/password-reset-request.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    if (!user.isEmailVerified) {
      throw new UnauthorizedException("Votre adresse email n'est pas encore vérifiée.");
    }

    return user;
  }

  async login(user: any) {
    await this.usersService.updateLastSeen(user.id);
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(
    email: string,
    password: string,
    role: 'super_admin' | 'hr' | 'candidate' = 'candidate',
  ) {
    // ✅ Step 1: Check for existing email
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        message: 'Adresse email déjà utilisée, Avez-vous un compte?',
      });
    }
    // ✅ Step 2: Proceed only if email is not taken
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique token
    const emailVerificationToken = randomBytes(32).toString('hex');

    // Create user in DB
    const user = await this.usersService.createUser({
      email,
      passwordHash: hashedPassword,
      role,
      isEmailVerified: false,
      emailVerificationToken,
    });

    // Build confirmation URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const confirmationUrl = `${frontendUrl}/verify-email/${emailVerificationToken}`;

    // Email content
    const subject = 'Confirmez votre adresse email - WorkIt';
    const text = `Bonjour,
  
  Merci de vous être inscrit sur WorkIt. Veuillez confirmer votre adresse email en cliquant sur le lien suivant :
  ${confirmationUrl}`;

    const html = `
      <p>Bonjour,</p>
      <p>Merci de vous être inscrit sur <strong>WorkIt</strong>.</p>
      <p>Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
      <p><a href="${confirmationUrl}" style="color: #0ea5e9;">Confirmer mon adresse</a></p>
      <p>Si vous n'avez pas créé de compte, ignorez ce message.</p>
    `;

    try {
      await this.mailService.sendMail(email, subject, text, html);
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to send email to ${email}: ${errorMessage}`);
    }

    return user;
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    console.log('Fetched user:', user);

    if (!user) {
      throw new NotFoundException('Lien de vérification invalide ou expiré.');
    }

    await this.usersService.markEmailVerified(user.id);

    return { message: 'Email confirmé avec succès ✅' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Aucun utilisateur avec cet email.');
    }

    const token = randomBytes(32).toString('hex');

    await this.usersService.markPasswordResetToken(user.id, token);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    const subject = 'Réinitialisation de votre mot de passe';
    const text = `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`;
    const html = `
      <p>Bonjour,</p>
      <p>Vous avez demandé une réinitialisation de mot de passe.</p>
      <p><a href="${resetUrl}" style="color: #0ea5e9;">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `;

    await this.mailService.sendMail(user.email, subject, text, html);

    return { message: 'Lien envoyé par email.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      throw new BadRequestException('Lien invalide ou expiré.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    user.passwordResetToken = null as any;
    user.passwordResetExpiresAt = null as any;

    await this.usersService.updatePassword(user.id, hashed);

    return { message: 'Mot de passe réinitialisé avec succès ✅' };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    if (currentPassword === newPassword) {
      throw new ConflictException("Le nouveau mot de passe ne peut pas être identique à l'ancien");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashed);

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async deleteAccount(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    await this.usersService.deleteCascade(userId);

    return { message: 'Compte supprimé avec succès' };
  }
}
