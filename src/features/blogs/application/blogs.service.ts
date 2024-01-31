import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Types } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(blogsCreateModel: BlogsCreateModel): Promise<BlogsDocument> {
    const createdAt = new Date();
    const id = new Types.ObjectId().toString();
    // const id = Math.floor(Math.random() * 10000).toString();
    const newBlog = {
      id: id,
      name: blogsCreateModel.name,
      description: blogsCreateModel.description,
      websiteUrl: blogsCreateModel.websiteUrl,
      createdAt: createdAt.toISOString(),
      isMembership: false,
    };
    return await this.blogsRepository.createBlog(newBlog);
  }
}
