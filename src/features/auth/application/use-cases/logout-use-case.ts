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
    console.log({ payloadWhenLogout: payload });
    if (!payload) {
      throw new UnauthorizedException();
    }

    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    return await this.securityDevicesRepo.deleteRefreshTokenWhenLogout(
      lastActiveDate,
    );
  }
}
