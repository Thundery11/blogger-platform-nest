import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { v4 } from 'uuid';

export class LoginUserCommand {
  constructor(
    public user: any,
    public ip: any,
  ) {}
}
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(private authService: AuthService) {}
  async execute(command: LoginUserCommand): Promise<any> {
    const { user, ip } = command;
    const deviceId = v4();
    const refreshToken = await this.authService.createRefreshToken(
      user,
      deviceId,
    );
    const accessToken = await this.authService.login(user);
    const result = await this.authService.verifyRefreshToken(refreshToken);
    const lastActiveDate = new Date(result.iat * 1000).toISOString();
    console.log('refresh token : ', refreshToken);
    const accesAndRefreshTokens = { refreshToken, accessToken };
    return accesAndRefreshTokens;
  }
}
