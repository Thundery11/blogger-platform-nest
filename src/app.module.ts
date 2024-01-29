import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './users/cats.schema';
import { CatsService } from './users/cats.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      dbName: 'nest-cats',
    }),
    MongooseModule.forFeature([
      {
        name: Cat.name,
        schema: CatSchema,
      },
    ]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UserService, UsersRepository, CatsService],
})
export class AppModule {}
