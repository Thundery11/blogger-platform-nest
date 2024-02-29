import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';
import { Model } from 'mongoose';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: Model<SecurityDevices>,
  ) {}

  async addDevice(device: SecurityDevices): Promise<SecurityDevicesDocument> {
    const addedDevice = new this.securityDevicesModel(device);
    addedDevice.save();
    return addedDevice;
  }
}
