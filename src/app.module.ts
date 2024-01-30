import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './cats/users.controller';
import { UserService } from './cats/users.service';
import { UsersRepository } from './cats/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './cats/cats.schema';
import { CatsService } from './cats/cats.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
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
