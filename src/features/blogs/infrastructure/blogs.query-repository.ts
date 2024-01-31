import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model, ObjectId, Types } from 'mongoose';
import {
  BlogsOutputMapper,
  BlogsOutputModel,
} from '../api/models/output/blog.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private blogsModel: Model<Blogs>) {}
  public async getBlogById(blogId: Types.ObjectId): Promise<BlogsOutputModel> {
    const blog = await this.blogsModel.findById(blogId, {
      _v: false,
    });
    return BlogsOutputMapper(blog);
  }
}
