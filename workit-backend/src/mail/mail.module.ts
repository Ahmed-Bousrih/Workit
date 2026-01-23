import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailTemplatesService } from './email-templates.service';

@Module({
  providers: [MailService, EmailTemplatesService], // Register MailService and EmailTemplatesService
  exports: [MailService, EmailTemplatesService], // Export both for other modules
})
export class MailModule {}
