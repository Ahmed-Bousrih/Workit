import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set SendGrid API Key
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const msg = {
      to, // Recipient email
      from: process.env.SENDGRID_FROM, // Verified sender email
      subject, // Email subject
      text, // Plain text version of email
      html, // HTML version (optional)
    };
    console.log('📬 Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Text Preview:', text);

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email:`, error.message);
      throw error;
    }
  }
}
