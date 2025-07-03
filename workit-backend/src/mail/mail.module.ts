import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService], // Register MailService
  exports: [MailService], // Export MailService for other modules
})
export class MailModule {}
