import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UsersService } from '../application/users.service';
import {
  AllUsersOutputModel,
  UsersOutputModel,
} from './models/output/user-output.model';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { AllPostsOutputModel } from '../../posts/api/models/output/post-output.model';
import { SortingQueryParamsForUsers } from './models/query/query-for-sorting';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createSuperadminUser(
    @Body() userCreateModel: UserCreateModel,
  ): Promise<UsersOutputModel> {
    const result =
      await this.usersService.createSuperadminUser(userCreateModel);
    if (!result) {
      throw new NotFoundException();
    }
    return await this.usersQueryRepository.getUserById(result._id);
  }

  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query() sortingQueryParams: SortingQueryParamsForUsers,
  ): Promise<AllUsersOutputModel> {
    return await this.usersService.getAllUsers(sortingQueryParams);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    return await this.usersService.deleteUser(userId);
  }
}
