import { Injectable } from '@nestjs/common';
import { Users, UsersDocument } from '../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserInfoAboutHimselfModel,
  UsersOutputModel,
  allUsersOutputMapper,
  userInfoAboutHimselfMapper,
  usersOutputMapper,
} from '../api/models/output/user-output.model';

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
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<UsersOutputModel[]> {
    const users = await this.usersModel
      .find(
        {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        { __v: false, passwordHash: false, passwordSalt: false },
      )
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));

    return allUsersOutputMapper(users);
  }

  public async countDocuments(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    return await this.usersModel.countDocuments({
      $or: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
  }
  public async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount ? true : false;
  }
  async findUserByLogin(loginOrEmail: string): Promise<UsersDocument | null> {
    const user = await this.usersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!user) {
      return null;
    }
    return user;
  }
  async findUserById(
    currentUserId: string,
  ): Promise<UserInfoAboutHimselfModel | null> {
    const user = await this.usersModel.findById(
      new Types.ObjectId(currentUserId),
      {
        _v: false,
      },
    );
    if (!user) {
      return null;
    }
    return userInfoAboutHimselfMapper(user);
  }
}
