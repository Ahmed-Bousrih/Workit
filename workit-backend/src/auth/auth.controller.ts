import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';
import { Roles } from './roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signup route: Create a new user
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.signup(body.email, body.password);
  }

  // Login route: Authenticate user and generate JWT
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(
        'Adresse email ou mot de passe incorrect.',
      );
    }

    return this.authService.login(user);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // General protected route: Accessible by all authenticated users
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData(@Request() req: any) {
    return {
      message: 'This is general protected data.',
      user: req.user,
    };
  }

  // Admin-only protected route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-protected')
  getAdminProtectedData(@Request() req: any) {
    return {
      message: 'This is protected data for admins only.',
      user: req.user,
    };
  }

  // Candidate-only protected route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  @Get('candidate-protected')
  getCandidateProtectedData(@Request() req: any) {
    return {
      message: 'This is protected data for candidates only.',
      user: req.user,
    };
  }

  @Post('request-password-reset')
  async requestReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteAccount(@Request() req: any) {
    return this.authService.deleteAccount(req.user.userId);
  }
}
