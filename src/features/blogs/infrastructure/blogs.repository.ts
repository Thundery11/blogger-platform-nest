import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private blogsModel: Model<Blogs>) {}
  public async createBlog(newBlog: Blogs): Promise<BlogsDocument> {
    const createdBlog = new this.blogsModel(newBlog);
    return createdBlog.save();
  }
}
