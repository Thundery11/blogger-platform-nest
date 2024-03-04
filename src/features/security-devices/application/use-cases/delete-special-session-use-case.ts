import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
export class DeleteSpecialSessionCommand {
  constructor(
    public refreshToken: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSpecialSessionCommand)
export class DeleteSpecialSessionUseCase
  implements ICommandHandler<DeleteSpecialSessionCommand>
{
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(command: DeleteSpecialSessionCommand): Promise<boolean> {
    const { refreshToken, deviceId } = command;
    const payload = await this.authService.verifyRefreshToken(refreshToken);
    console.log({ payload: payload });
    if (!payload) {
      throw new UnauthorizedException();
    }
    const userId = payload.sub;

    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    const deviceSession =
      await this.securityDevicesRepo.getCurrentSession(deviceId);
    if (!deviceSession) {
      throw new NotFoundException();
    }
    console.log({ currentSession: deviceSession });
    if (userId !== deviceSession.userId) {
      throw new ForbiddenException();
    }
    await this.securityDevicesRepo.updateLastActiveDate(
      deviceId,
      lastActiveDate,
    );
    return await this.securityDevicesRepo.deleteCurrentSession(deviceId);
  }
}