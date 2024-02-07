import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';
import { Posts } from '../posts/domain/posts.entity';
import { Users } from '../users/domain/users.entity';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.postsModel.deleteMany({});
    await this.blogsModel.deleteMany({});
    await this.usersModel.deleteMany({});
  }
}
