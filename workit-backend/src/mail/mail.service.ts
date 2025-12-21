import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: any;

  constructor() {
    // Initialize SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.logger.log('SendGrid mail service initialized');
    }
    // Initialize Nodemailer as fallback if SMTP config is provided
    else if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('SMTP mail service initialized');
    } else {
      this.logger.warn(
        'No mail service configured. Set SENDGRID_API_KEY or SMTP credentials in environment variables.',
      );
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const fromEmail =
      process.env.SENDGRID_FROM ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER ||
      'noreply@workit.com';

    // Use SendGrid if configured
    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to,
        from: fromEmail,
        subject,
        text,
        html: html || text,
      };

      this.logger.log(`📬 Sending email via SendGrid to: ${to}`);
      this.logger.debug(`Subject: ${subject}`);

      try {
        await sgMail.send(msg);
        this.logger.log(`✅ Email sent successfully to ${to}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`❌ SendGrid error: ${errorMessage}`);
        throw error;
      }
    }
    // Use SMTP if configured
    else if (this.transporter) {
      const mailOptions = {
        from: fromEmail,
        to,
        subject,
        text,
        html: html || text,
      };

      this.logger.log(`📬 Sending email via SMTP to: ${to}`);
      this.logger.debug(`Subject: ${subject}`);

      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`✅ Email sent successfully to ${to}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`❌ SMTP error: ${errorMessage}`);
        throw error;
      }
    } else {
      // Log email in development mode if no mail service is configured
      this.logger.warn(
        `⚠️  Mail service not configured. Would send email to ${to}`,
      );
      this.logger.debug(`Subject: ${subject}`);
      this.logger.debug(`Content: ${text}`);
      // Don't throw error in development, just log
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Mail service not configured');
      }
    }
  }
}
