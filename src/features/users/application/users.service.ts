import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { Users, UsersDocument, UsersModelType } from '../domain/users.entity';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import {
  AllUsersOutputModel,
  UserInfoAboutHimselfModel,
  UsersOutputModel,
} from '../api/models/output/user-output.model';
import { SortingQueryParamsForUsers } from '../api/models/query/query-for-sorting';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { emailsManager } from '../../../infrastucture/managers/emails-manager';
import { BadRequestError } from 'passport-headerapikey';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @InjectModel(Users.name) private usersModel: UsersModelType,
  ) {}

  async createSuperadminUser(
    userCreateModel: UserCreateModel,
  ): Promise<UsersDocument> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const emailConfirmationAndInfo = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 3,
        minutes: 3,
      }),
      isConfirmed: false,
      createdAt,
      passwordSalt,
      passwordHash,
    };
    const user = this.usersModel.createUser(
      userCreateModel,
      emailConfirmationAndInfo,
    );
    return await this.usersRepository.createSuperadminUser(user);
  }

  async createUser(
    userCreateModel: UserCreateModel,
  ): Promise<UsersDocument | null> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const emailConfirmationAndInfo = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 3,
        minutes: 3,
      }),
      isConfirmed: false,
      createdAt,
      passwordSalt,
      passwordHash,
    };

    const isLoginExists = await this.usersRepository.findUserByLogin(
      userCreateModel.login,
    );

    console.log(isLoginExists);
    if (isLoginExists) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'login exists',
            field: 'login',
          },
        ],
      });
    }
    const isEmailExists = await this.usersRepository.findUserByLogin(
      userCreateModel.email,
    );
    if (isEmailExists) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'email exists',
            field: 'email',
          },
        ],
      });
    }

    const user = this.usersModel.createUser(
      userCreateModel,
      emailConfirmationAndInfo,
    );

    await emailsManager.sendEmailConfirmationMessage(user);
    return await this.usersRepository.createSuperadminUser(user);
  }

  async getAllUsers(
    sortingQueryParams: SortingQueryParamsForUsers,
  ): Promise<AllUsersOutputModel> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = '',
      searchEmailTerm = '',
    } = sortingQueryParams;

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.usersRepository.countDocuments(
      searchLoginTerm,
      searchEmailTerm,
    );
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const users = await this.usersRepository.getAllUsers(
      sortBy,
      sortDirection,
      pageSize,
      skip,
      searchLoginTerm,
      searchEmailTerm,
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
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UsersDocument | null> {
    return await this.usersRepository.findUserByLogin(loginOrEmail);
  }
  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async findUserById(
    currentUserId: string,
  ): Promise<UserInfoAboutHimselfModel | null> {
    return await this.usersRepository.findUserById(currentUserId);
  }
}
