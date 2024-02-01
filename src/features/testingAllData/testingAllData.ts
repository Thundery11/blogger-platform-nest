import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    return await this.blogsModel.deleteMany({});
  }
}
