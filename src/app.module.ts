import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Blogs, BlogsSchema } from './features/blogs/domain/blogs.entity';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { TestingAllDataController } from './features/testingAllData/testingAllData';
import { Posts, PostsSchema } from './features/posts/domain/posts.entity';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsController } from './features/posts/api/posts.controller';
import { Users, UsersSchema } from './features/users/domain/users.entity';
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users-query.repository';
import { AuthModule } from './features/auth/module/auth.module';
import { UsersModule } from './features/users/module/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    //как правильно импортировать МОДЕЛИ? можно ли их импортировать в разные модули
    MongooseModule.forFeature([
      {
        name: Blogs.name,
        schema: BlogsSchema,
      },
      { name: Posts.name, schema: PostsSchema },
      //если убираю модель юзеров, падает приложение, почему???
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'blogger-platform-nest',
    }),
  ],
  controllers: [
    TestingAllDataController,
    AppController,
    BlogsController,
    PostsController,
  ],

  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    PostsService,
  ],
})
export class AppModule {}
