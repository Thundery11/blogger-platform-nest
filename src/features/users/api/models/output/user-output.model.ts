import { UsersDocument } from '../../../domain/users.entity';

export class UsersOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class AllUsersOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersOutputModel[];
}

export const usersOutputMapper = (user: UsersDocument): UsersOutputModel => {
  const outputModel = new UsersOutputModel();
  outputModel.id = user.id;
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = user.createdAt;
  return outputModel;
};
