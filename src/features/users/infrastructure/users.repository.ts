import { Injectable } from '@nestjs/common';
import { Users, UsersDocument } from '../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersOutputModel } from '../api/models/output/user-output.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async createSuperadminUser(user: Users): Promise<UsersDocument> {
    const createdUser = new this.usersModel(user);
    return createdUser.save();
  }
  public async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<UsersOutputModel[]> {
    const users = await this.usersModel
      .find(
        {},
        { __v: false, _id: false, passwordHash: false, passwordSalt: false },
      )
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();
    return users;
  }

  public async countDocuments(): Promise<number> {
    return await this.usersModel.countDocuments({});
  }
  public async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({ id });
    return result.deletedCount ? true : false;
  }
}
