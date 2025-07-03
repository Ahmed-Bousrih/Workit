import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users.service';

@Injectable()
export class UsersScheduler {
  constructor(private readonly usersService: UsersService) {}

  // Runs every day at 2am
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanInactiveUsers() {
    const { deleted } = await this.usersService.removeInactiveUsers();
    console.log(`🧹 ${deleted} inactive users deleted`);
  }

  // Runs every Monday at 9am
  @Cron('0 9 * * 1') // → At 09:00 every Monday
  async sendWarnings() {
    const { notified } = await this.usersService.warnInactiveUsers();
    console.log(`📩 ${notified} warning emails sent`);
  }
}
