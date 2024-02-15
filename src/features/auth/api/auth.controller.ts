import {
  BadRequestException,
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
import { RegistrationInputModel } from './models/input/registration-input.model';
import { BadRequestError } from 'passport-headerapikey';

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

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationInputModel: RegistrationInputModel) {
    const user = await this.usersService.createUser(registrationInputModel);
    // if (!user) {
    //   throw new BadRequestException();
    // }
  }
}
