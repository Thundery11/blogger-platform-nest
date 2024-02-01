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
  public async getAllBlogs(
    query: object,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<BlogsOutputModel[]> {
    const blogs = await this.blogsModel
      .find(query, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();
    return blogs;
  }
}
