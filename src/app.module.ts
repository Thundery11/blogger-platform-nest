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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'blogger-platform-nest',
    }),

    MongooseModule.forFeature([
      {
        name: Blogs.name,
        schema: BlogsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Posts.name,
        schema: PostsSchema,
      },
    ]),
  ],
  controllers: [TestingAllDataController, AppController, BlogsController],
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
