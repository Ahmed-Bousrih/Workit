import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/role.guard';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('count') // <-- MUST come first!
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  countUsers(@Query('role') role?: string) {
    return this.usersService.countUsers(role);
  }

  @Get('me')
  getCurrentUser(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard) // No RolesGuard needed here
  updateOwnProfile(@Req() req, @Body() body: any) {
    return this.usersService.updateUser(req.user.userId, body);
  }

  @Get(':id') // <-- Comes after
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('super_admin')
  async createUser(
    @Body() body: { email: string; password: string; role: string },
  ) {
    const { email, password, role } = body;
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password
    return this.usersService.createUser({ email, passwordHash, role });
  }

  @Put(':id')
  @Roles('admin', 'super_admin')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(id, body);
  }

  // DELETE /users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // PATCH /users/:id/role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @Patch(':id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Patch('me/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const uniqueName = `user-${req.user.userId}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png'];
        const ext = extname(file.originalname).toLowerCase();

        if (allowed.includes(ext)) {
          cb(null, true);
        } else {
          cb(
            new Error('Seuls les fichiers JPG, JPEG et PNG sont autorisés.'),
            false,
          );
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadOwnPhoto(@Req() req, @UploadedFile() file: any) {
    const photoUrl = `/uploads/photos/${file.filename}`;
    return this.usersService.updateProfilePhoto(req.user.userId, photoUrl);
  }

  @Patch('me/resume')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const uniqueName = `resume-${req.user.userId}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const isPdf = extname(file.originalname).toLowerCase() === '.pdf';

        if (isPdf) {
          cb(null, true);
        } else {
          cb(
            new Error('Seuls les fichiers PDF sont autorisés pour le CV.'),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadOwnResume(@Req() req, @UploadedFile() file: any) {
    const resumeUrl = `/uploads/resumes/${file.filename}`;
    return this.usersService.updateResumeUrl(req.user.userId, resumeUrl);
  }
}
