import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteAllSessionsExceptCurentCommand {
  constructor(public refreshToken: string) {}
}
@CommandHandler(DeleteAllSessionsExceptCurentCommand)
export class DeleteAllSessionsExceptCurentUseCase
  implements ICommandHandler<DeleteAllSessionsExceptCurentCommand>
{
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(
    command: DeleteAllSessionsExceptCurentCommand,
  ): Promise<boolean> {
    const payload = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    const deviceId = payload.deviceId;
    console.log('deviceId: ', deviceId);
    const deletedDevices =
      await this.securityDevicesRepo.terminateOtherSessions(deviceId);
    return deletedDevices;
  }
}
