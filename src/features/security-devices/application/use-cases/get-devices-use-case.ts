import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class GetDevicesCommand {
  constructor(public refreshToken: string) {}
}
@CommandHandler(GetDevicesCommand)
export class GetDevicesUseCase implements ICommandHandler<GetDevicesCommand> {
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(command: GetDevicesCommand): Promise<any> {
    const payload = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    const userId = payload.sub;
    const devices = await this.securityDevicesRepo.getDevices(userId);
    return devices;
  }
}
