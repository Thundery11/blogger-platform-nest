import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  Res,
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
import { EmailResendingInputModel } from './models/input/email-resending.model';
import { ConfirmationCodeInputModel } from './models/input/confirmation-code-input.model';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Res() response: Response) {
    const refreshToken = await this.authService.createRefreshToken(req.user);
    const accessToken = await this.authService.login(req.user);
    console.log('refresh token : ', refreshToken);
    return response
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(accessToken);
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
    await this.usersService.createUser(registrationInputModel);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(
    @Body() emailResendingInputModel: EmailResendingInputModel,
  ) {
    const user = await this.usersService.resendEmailConfirmationCode(
      emailResendingInputModel,
    );
    if (!user) {
      throw new BadRequestException({
        message: [
          {
            message: 'something wrong with email resending',
            field: 'email',
          },
        ],
      });
    }
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailConfirmation(
    @Body() confirmationCode: ConfirmationCodeInputModel,
  ): Promise<boolean> {
    const result = await this.authService.confirmEmail(confirmationCode.code);
    if (!result) {
      throw new BadRequestException({
        message: [
          {
            message: 'something wrong with email confirmation',
            field: 'code',
          },
        ],
      });
    }
    return true;
  }
}
