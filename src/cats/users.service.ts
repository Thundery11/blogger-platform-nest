import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(protected usersRepository: UsersRepository) {}
  findUser(term: string) {
    return this.usersRepository.findUser(term);
  }
}
