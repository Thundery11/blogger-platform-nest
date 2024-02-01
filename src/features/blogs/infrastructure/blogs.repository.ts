import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogsOutputModel } from '../api/models/output/blog.output.model';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private blogsModel: Model<Blogs>) {}
  public async createBlog(newBlog: Blogs): Promise<BlogsDocument> {
    const createdBlog = new this.blogsModel(newBlog);
    return createdBlog.save();
  }
  public async countDocuments(query: object): Promise<number> {
    return await this.blogsModel.countDocuments(query);
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
