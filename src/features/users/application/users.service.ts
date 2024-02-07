import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { Users, UsersDocument } from '../domain/users.entity';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import {
  AllUsersOutputModel,
  UsersOutputModel,
} from '../api/models/output/user-output.model';
import { SortingQueryParams } from '../../blogs/api/models/query/query-for-sorting';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createSuperadminUser(
    userCreateModel: UserCreateModel,
  ): Promise<UsersDocument> {
    const createdAt = new Date().toISOString();
    const id = new Types.ObjectId().toString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const user = new Users();
    user.createdAt = createdAt;
    user.email = userCreateModel.email;
    user.id = id;
    user.login = userCreateModel.login;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;
    return await this.usersRepository.createSuperadminUser(user);
  }

  async getAllUsers(
    sortingQueryParams: SortingQueryParams,
  ): Promise<AllUsersOutputModel> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParams;

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.usersRepository.countDocuments();
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const users = await this.usersRepository.getAllUsers(
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationalUsers = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: users,
    };
    return presentationalUsers;
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}