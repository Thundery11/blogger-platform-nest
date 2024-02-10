import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UsersController } from '../api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../domain/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [UsersService],
})
export class UsersModule {}
