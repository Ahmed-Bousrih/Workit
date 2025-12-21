import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
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
  updateMySkills(@Request() req: any, @Body() body: { skillIds: number[] | string[] }) {
    const userId = parseInt(req.user.userId, 10);
    const skillIds = body.skillIds.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id));
    return this.skillsService.updateUserSkills(userId, skillIds);
  }
}
