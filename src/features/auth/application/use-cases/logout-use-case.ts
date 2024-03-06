import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { SecurityDevicesRepository } from '../../../security-devices/infrastructure/security-devices.repository';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    const payload = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    console.log({ refreshtokenWhenLOGOUT: command.refreshToken });
    if (!payload) {
      throw new UnauthorizedException();
    }

    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    const isValidRefreshToken =
      await this.securityDevicesRepo.isValidRefreshToken(lastActiveDate);
    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }
    const deviceId = payload.deviceId;
    const deletedToken =
      await this.securityDevicesRepo.deleteRefreshTokenWhenLogout(deviceId);
    if (!deletedToken) {
      throw new UnauthorizedException();
    }
    console.log({ deletedToken: deletedToken });
    return deletedToken;
  }
}
