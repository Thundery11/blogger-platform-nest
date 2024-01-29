import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserService } from './users/users.service';
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppService, UserService, UsersRepository],
})
export class AppModule {}
