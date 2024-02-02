import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';
import { Posts } from '../posts/domain/posts.entity';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.postsModel.deleteMany({});
    await this.blogsModel.deleteMany({});
  }
}
