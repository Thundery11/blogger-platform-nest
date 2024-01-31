import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './cats/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Blogs, BlogsSchema } from './features/blogs/domain/blogs.entity';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: 'blogger-platform-nest',
    }),

    MongooseModule.forFeature([
      {
        name: Blogs.name,
        schema: BlogsSchema,
      },
    ]),
  ],
  controllers: [AppController, UsersController, BlogsController],
  providers: [AppService, BlogsService, BlogsRepository],
})
export class AppModule {}
