import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetDevicesCommand } from '../application/use-cases/get-devices-use-case';
import { SecurityDevicesOutputModel } from './models/output/security-devices-output-model';
import { CurrentUserId } from '../../auth/decorators/current-user-id-param.decorator';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDevices(@Req() req): Promise<SecurityDevicesOutputModel[]> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const devices = await this.commandBus.execute(
      new GetDevicesCommand(refreshToken),
    );
    return devices;
  }
}
