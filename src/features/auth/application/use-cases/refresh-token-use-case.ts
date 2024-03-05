import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesService } from '../../../security-devices/application/security-devices.service';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class RefreshTokenCommand {
  constructor(public refreshToken: string) {}
}
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private authServise: AuthService,
    private securityDevicesServise: SecurityDevicesService,
    private usersRepository: UsersRepository,
  ) {}
  async execute(command: RefreshTokenCommand): Promise<object> {
    const payload = await this.authServise.verifyRefreshToken(
      command.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersRepository.findUserByIdForRefreshTokens(
      payload.sub,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const isOkLastactiveDate = new Date(payload.iat * 1000).toISOString();
    const isValidRefreshToken =
      await this.securityDevicesServise.isValidRefreshToken(isOkLastactiveDate);
    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }
    console.log({ isValidRefreshToken: isValidRefreshToken });
    const accessToken = await this.authServise.login(user);
    const newRefreshToken = await this.authServise.createRefreshToken(
      user,
      payload.deviceId,
    );
    const result = await this.authServise.verifyRefreshToken(newRefreshToken);
    const lastActiveDate = new Date(result.iat * 1000).toISOString();
    const deviceId = result.deviceId;
    await this.securityDevicesServise.updateLastActiveDate(
      deviceId,
      lastActiveDate,
    );
    console.log('newRefreshToken:', newRefreshToken);
    const tokens = { accessToken, newRefreshToken };
    return tokens;
  }
}
