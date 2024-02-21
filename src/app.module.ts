//add below two lines before all other imports to correct parsing of process.env in all modules
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
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
import { AuthModule } from './features/auth/module/auth.module';
import { UsersModule } from './features/users/module/users.module';
import { CreateBlogUseCase } from './features/blogs/application/use-cases/create-blog-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { FindAllBlogsUseCase } from './features/blogs/application/use-cases/find-all-blogs-use-case';
import { UpdateBlogUseCase } from './features/blogs/application/use-cases/update-blog-use-case';
import { DeleteBlogUseCase } from './features/blogs/application/use-cases/delete-blog-use-case';
import { CreatePostForSpecificBlogUseCase } from './features/blogs/application/use-cases/create-post-for-specific-blog-use-case';
import { FindAllPostsForCurrentBlogUseCase } from './features/posts/application/use-cases/find-all-posts-for-current-blog-use-case';
import { FindAllPostsUseCase } from './features/posts/application/use-cases/find-all-posts-use-case';
import { CreatePostUseCase } from './features/posts/application/use-cases/create-post-use-case';
import { UpdatePostUseCase } from './features/posts/application/use-cases/update-post-use-case';
import { DeletePostUseCase } from './features/posts/application/delete-post-use-case';
import {
  LikesDbModel,
  LikesDbSchema,
} from './features/likes/domain/likes.entity';
import {
  Comments,
  CommentsSchema,
} from './features/comments/domain/comments.entity';
import { CreateCommentForSpecificPostUseCase } from './features/comments/application/use-cases/create-comment-for-specific-post-use-case';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query.repository';

const useCases = [
  CreateBlogUseCase,
  FindAllBlogsUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostForSpecificBlogUseCase,
  FindAllPostsForCurrentBlogUseCase,
  FindAllPostsUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateCommentForSpecificPostUseCase,
];
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CqrsModule,

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
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
      {
        name: LikesDbModel.name,
        schema: LikesDbSchema,
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
    CommentsRepository,
    CommentsQueryRepository,
    ...useCases,
  ],
})
export class AppModule {}
