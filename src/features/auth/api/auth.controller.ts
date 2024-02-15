import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id-param.decorator';
import { UsersService } from '../../users/application/users.service';
import { SignInModel } from './models/input/login-input.model';
import { UserInfoAboutHimselfModel } from '../../users/api/models/output/user-output.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @CurrentUserId() currentUserId: string,
  ): Promise<UserInfoAboutHimselfModel | null> {
    const user = await this.usersService.findUserById(currentUserId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
