import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // Public: Get all skills (for dropdowns, search, etc.)
  @Get('skills')
  getAll() {
    return this.skillsService.getAllSkills();
  }

  // Private: Update skills of logged-in user
  @Patch('profile/skills')
  updateMySkills(@Request() req: any, @Body() body: { skillIds: string[] }) {
    return this.skillsService.updateUserSkills(req.user.userId, body.skillIds);
  }
}
