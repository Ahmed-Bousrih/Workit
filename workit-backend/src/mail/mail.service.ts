import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false, // Brevo uses STARTTLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      this.logger.log('📨 Brevo SMTP mail service initialized');
    } else {
      this.logger.warn('⚠️ SMTP not configured. Emails will be logged only.');
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const from = process.env.SMTP_FROM || 'WorkIt <noreply@workit.dev>';

    if (!this.transporter) {
      this.logger.warn(`📭 Mail not sent (no SMTP). To: ${to}`);
      this.logger.debug(`Subject: ${subject}`);
      this.logger.debug(`Content: ${text}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html || text,
      });

      this.logger.log(`✅ Email sent to ${to}`);
    } catch (error) {
      this.logger.error('❌ SMTP send failed', error);
      throw error;
    }
  }
}
