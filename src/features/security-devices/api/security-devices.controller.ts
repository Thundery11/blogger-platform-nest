import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetDevicesCommand } from '../application/use-cases/get-devices-use-case';
import { SecurityDevicesOutputModel } from './models/output/security-devices-output-model';
import { DeleteAllSessionsExceptCurentCommand } from '../application/use-cases/delete-all-sessions-except-current-use-case';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDevices(@Req() req): Promise<SecurityDevicesOutputModel[] | null> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const devices = await this.commandBus.execute(
      new GetDevicesCommand(refreshToken),
    );
    if (!devices) {
      throw new NotFoundException();
    }
    return devices;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessionsExceptCurrent(@Req() req): Promise<boolean> {
    const refreshToken = req.cookies.refreshToken;
    const result = await this.commandBus.execute(
      new DeleteAllSessionsExceptCurentCommand(refreshToken),
    );
    return result;
  }
}
