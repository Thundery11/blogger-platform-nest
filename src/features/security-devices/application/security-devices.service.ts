import { Injectable } from '@nestjs/common';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';

@Injectable()
export class SecurityDevicesService {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {}

  async addDevice(device: SecurityDevices): Promise<SecurityDevicesDocument> {
    return await this.securityDevicesRepository.addDevice(device);
  }
}
